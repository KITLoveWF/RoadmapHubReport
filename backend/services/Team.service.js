import TeamDao from "../daos/Team.dao.js";
import TeamMemberDao from "../daos/TeamMember.dao.js";
import TeamInvitationDao from "../daos/TeamInvitation.dao.js";
import AccountDao from "../daos/Account.dao.js";
import NotificationDao from "../daos/Notification.dao.js";
import FriendDao from "../daos/Friend.dao.js";
import bcrypt from "bcrypt";
import db from "../utils/db.js";

class TeamService{
    constructor(TeamDao, TeamMemberDao, TeamInvitationDao, AccountDao, NotificationDao){
        this.teamDao = TeamDao;
        this.teamMemberDao = TeamMemberDao;
        this.teamInvitationDao = TeamInvitationDao;
        this.accountDao = AccountDao;
        this.notificationDao = NotificationDao;
    }

    async getTeamByUserId(userId){
        return this.teamDao.getTeamByUserId(userId);
    }

    async createTeam(name, creatorId) {
        // Check if team name already exists for this user
        const exists = await this.teamDao.checkTeamNameExists(name, creatorId);
        if (exists) {
            return {
                success: false,
                message: 'Tên nhóm đã tồn tại trong tài khoản của bạn'
            };
        }

        const teamId = await this.teamDao.createTeam(name, creatorId);
        return {
            success: true,
            message: 'Tạo nhóm thành công',
            teamId: teamId
        };
    }

    async deleteTeam(teamId, accountId, password) {
        // Verify user is the leader
        const role = await this.teamMemberDao.getMemberRole(teamId, accountId);
        if (role !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền xóa nhóm'
            };
        }

        // Verify password
        const account = await this.accountDao.getAccountById(accountId);
        if (!account || !account.password) {
            return {
                success: false,
                message: 'Tài khoản không hợp lệ'
            };
        }

        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Mật khẩu không chính xác'
            };
        }

        return await this.teamDao.deleteTeam(teamId);
    }

    async getTeamMembers(teamId, accountId) {
        // Check if user is member of team
        const isMember = await this.teamMemberDao.isMemberOfTeam(teamId, accountId);
        if (!isMember) {
            return {
                success: false,
                message: 'Bạn không phải thành viên của nhóm này'
            };
        }

        const members = await this.teamDao.getTeamMembers(teamId);
        return {
            success: true,
            members: members
        };
    }

    async addMember(teamId, leaderId, accountId, role = 'view') {
        const allowedRoles = ['view', 'edit'];
        const normalizedRole = allowedRoles.includes(role) ? role : 'view';

        const requesterRole = await this.teamMemberDao.getMemberRole(teamId, leaderId);
        if (requesterRole !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền thêm thành viên'
            };
        }

        const account = await this.accountDao.getAccountById(accountId);
        if (!account) {
            return {
                success: false,
                message: 'Tài khoản không tồn tại'
            };
        }

        const isMember = await this.teamMemberDao.isMemberOfTeam(teamId, accountId);
        if (isMember) {
            return {
                success: false,
                message: 'Người dùng đã là thành viên của nhóm'
            };
        }

        await this.teamMemberDao.createTeamMember(teamId, accountId, normalizedRole);

        const team = await this.teamDao.getTeamById(teamId);
        await this.notificationDao.createNotification(
            accountId,
            leaderId,
            `Bạn đã được thêm vào nhóm "${team.name}"`,
            `/team/${teamId}`
        );

        return {
            success: true,
            message: 'Thêm thành viên thành công'
        };
    }

    async inviteMember(teamId, inviterId, inviteeEmail, role) {
        // Check if inviter is leader
        const inviterRole = await this.teamMemberDao.getMemberRole(teamId, inviterId);
        if (inviterRole !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền mời thành viên'
            };
        }

        // Check if invitee exists
        const inviteeAccount = await this.accountDao.getAccountByEmail(inviteeEmail);
        
        // Check if already a member
        if (inviteeAccount) {
            const isMember = await this.teamMemberDao.isMemberOfTeam(teamId, inviteeAccount.id);
            if (isMember) {
                return {
                    success: false,
                    message: 'Người dùng đã là thành viên của nhóm'
                };
            }
        }

        // Check if invitation already exists
        const existingInvitation = await this.teamInvitationDao.checkExistingInvitation(teamId, inviteeEmail);
        if (existingInvitation) {
            return {
                success: false,
                message: 'Lời mời đã được gửi cho người dùng này'
            };
        }

        // Create invitation
        const invitation = await this.teamInvitationDao.createInvitation(
            teamId,
            inviterId,
            inviteeEmail,
            inviteeAccount ? inviteeAccount.id : null,
            role
        );

        // Send notification if user exists
        if (inviteeAccount) {
            const team = await this.teamDao.getTeamById(teamId);
            await this.notificationDao.createNotification(
                inviteeAccount.id,
                inviterId,
                `Bạn đã được mời vào nhóm "${team.name}"`,
                `/team/invitations`
            );
        }

        return {
            success: true,
            message: 'Gửi lời mời thành công',
            invitation: invitation
        };
    }

    async acceptInvitation(invitationId, accountId) {
        const invitation = await this.teamInvitationDao.getInvitationById(invitationId);
        
        if (!invitation) {
            return {
                success: false,
                message: 'Lời mời không tồn tại'
            };
        }

        if (invitation.inviteeId !== accountId) {
            return {
                success: false,
                message: 'Bạn không có quyền chấp nhận lời mời này'
            };
        }

        if (invitation.status !== 'pending') {
            return {
                success: false,
                message: 'Lời mời đã được xử lý'
            };
        }

        // Add member to team
        await this.teamMemberDao.createTeamMember(invitation.teamId, accountId, invitation.role);
        
        // Update invitation status
        await this.teamInvitationDao.acceptInvitation(invitationId);

        // Notify inviter
        const team = await this.teamDao.getTeamById(invitation.teamId);
        await this.notificationDao.createNotification(
            invitation.inviterId,
            accountId,
            `Người dùng đã chấp nhận lời mời vào nhóm "${team.name}"`,
            `/team/${invitation.teamId}/members`
        );

        return {
            success: true,
            message: 'Chấp nhận lời mời thành công'
        };
    }

    async rejectInvitation(invitationId, accountId) {
        const invitation = await this.teamInvitationDao.getInvitationById(invitationId);
        
        if (!invitation) {
            return {
                success: false,
                message: 'Lời mời không tồn tại'
            };
        }

        if (invitation.inviteeId !== accountId) {
            return {
                success: false,
                message: 'Bạn không có quyền từ chối lời mời này'
            };
        }

        if (invitation.status !== 'pending') {
            return {
                success: false,
                message: 'Lời mời đã được xử lý'
            };
        }

        await this.teamInvitationDao.rejectInvitation(invitationId);

        return {
            success: true,
            message: 'Từ chối lời mời thành công'
        };
    }

    async removeMember(teamId, leaderId, memberId) {
        // Check if requester is leader
        const role = await this.teamMemberDao.getMemberRole(teamId, leaderId);
        if (role !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền xóa thành viên'
            };
        }

        // Check if trying to remove leader
        const memberRole = await this.teamMemberDao.getMemberRole(teamId, memberId);
        if (memberRole === 'leader') {
            return {
                success: false,
                message: 'Không thể xóa leader khỏi nhóm'
            };
        }

        await this.teamMemberDao.deleteTeamMember(teamId, memberId);

        // Notify removed member
        const team = await this.teamDao.getTeamById(teamId);
        await this.notificationDao.createNotification(
            memberId,
            leaderId,
            `Bạn đã bị xóa khỏi nhóm "${team.name}"`,
            null
        );

        return {
            success: true,
            message: 'Xóa thành viên thành công'
        };
    }

    async updateMemberRole(teamId, leaderId, memberId, newRole) {
        // Check if requester is leader
        const role = await this.teamMemberDao.getMemberRole(teamId, leaderId);
        if (role !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền thay đổi quyền hạn'
            };
        }

        // If assigning leader role, transfer leadership
        if (newRole === 'leader') {
            await this.teamMemberDao.transferLeadership(teamId, leaderId, memberId);
            
            // Notify new leader
            const team = await this.teamDao.getTeamById(teamId);
            await this.notificationDao.createNotification(
                memberId,
                leaderId,
                `Bạn đã được gán làm leader của nhóm "${team.name}"`,
                `/team/${teamId}/members`
            );

            return {
                success: true,
                message: 'Chuyển quyền leader thành công'
            };
        }

        await this.teamMemberDao.updateMemberRole(teamId, memberId, newRole);

        return {
            success: true,
            message: 'Cập nhật quyền thành công'
        };
    }

    async getPendingInvitations(accountId) {
        return await this.teamInvitationDao.getPendingInvitations(accountId);
    }

    async getTeamsByAccountId(accountId) {
        return await this.teamDao.getTeamsByAccountId(accountId);
    }

    async searchAccountsForTeam(teamId, requesterId, keyword) {
        const trimmed = keyword?.trim();
        if (!trimmed || trimmed.length < 2) {
            return {
                success: false,
                message: 'Vui lòng nhập ít nhất 2 ký tự để tìm kiếm'
            };
        }

        const role = await this.teamMemberDao.getMemberRole(teamId, requesterId);
        if (role !== 'leader') {
            return {
                success: false,
                message: 'Chỉ leader mới có quyền tìm kiếm thành viên'
            };
        }

        const members = await this.teamDao.getTeamMembers(teamId);
        const memberIds = members.map((member) => member.accountId);

        const results = await this.accountDao.searchAccounts(trimmed, 10, memberIds);

        return {
            success: true,
            results
        };
    }

    async getFriendsNotInTeam(teamId, accountId) {
        // Get user's friends
        const friends = await db('Friend')
            .where(function() {
                this.where({ senderId: accountId, requestState: 'accepted' })
                    .orWhere({ receiverId: accountId, requestState: 'accepted' });
            })
            .select('*');

        // Get team members
        const teamMembers = await this.teamDao.getTeamMembers(teamId);
        const teamMemberIds = teamMembers.map(m => m.accountId);

        // Filter friends not in team
        const friendsNotInTeam = [];
        for (const friend of friends) {
            const friendId = friend.senderId === accountId ? friend.receiverId : friend.senderId;
            if (!teamMemberIds.includes(friendId)) {
                const account = await this.accountDao.getAccountById(friendId);
                if (account) {
                    friendsNotInTeam.push(account);
                }
            }
        }

        return friendsNotInTeam;
    }
}

export default new TeamService(TeamDao, TeamMemberDao, TeamInvitationDao, AccountDao, NotificationDao);