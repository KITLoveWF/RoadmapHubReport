import TeamService from "../services/Team.service.js";

class TeamController {
    getTeamByUserId = async (req, res, next) => {
        const userId = req.authenticate.id;
        //console.log("Account ID:", userId);
        const teams = await TeamService.getTeamByUserId(userId);
        //console.log("Teams:", teams);
        if (teams) {
            return res.status(200).json({ status: true, teams });
        }
        return res.status(404).json({ status: false, message: "Team not found" });
    };

    createTeam = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { name } = req.body;

            if (!name || name.trim() === '') {
                return res.status(400).json({ 
                    status: false, 
                    message: "Tên nhóm không được để trống" 
                });
            }

            const result = await TeamService.createTeam(name.trim(), userId);
            
            if (result.success) {
                return res.status(201).json({ 
                    status: true, 
                    message: result.message,
                    teamId: result.teamId 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Create team error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi tạo nhóm" 
            });
        }
    };

    deleteTeam = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId } = req.params;
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Vui lòng nhập mật khẩu để xác nhận" 
                });
            }

            const result = await TeamService.deleteTeam(teamId, userId, password);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Delete team error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi xóa nhóm" 
            });
        }
    };

    getTeamMembers = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId } = req.params;

            const result = await TeamService.getTeamMembers(teamId, userId);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    members: result.members 
                });
            } else {
                return res.status(403).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Get team members error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi lấy danh sách thành viên" 
            });
        }
    };

    addMember = async (req, res, next) => {
        try {
            const leaderId = req.authenticate.id;
            const { teamId } = req.params;
            const { accountId, role } = req.body;

            if (!accountId) {
                return res.status(400).json({
                    status: false,
                    message: "Thiếu thông tin thành viên cần thêm"
                });
            }

            const result = await TeamService.addMember(teamId, leaderId, accountId, role);

            if (result.success) {
                return res.status(200).json({
                    status: true,
                    message: result.message
                });
            }

            return res.status(400).json({
                status: false,
                message: result.message
            });
        } catch (error) {
            console.error('Add member error:', error);
            return res.status(500).json({
                status: false,
                message: "Lỗi khi thêm thành viên"
            });
        }
    };

    inviteMember = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId } = req.params;
            const { email, role } = req.body;

            if (!email || !role) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Email và quyền hạn không được để trống" 
                });
            }

            if (!['edit', 'view'].includes(role)) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Quyền hạn không hợp lệ" 
                });
            }

            const result = await TeamService.inviteMember(teamId, userId, email, role);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message,
                    invitation: result.invitation 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Invite member error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi mời thành viên" 
            });
        }
    };

    acceptInvitation = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { invitationId } = req.params;

            const result = await TeamService.acceptInvitation(invitationId, userId);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Accept invitation error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi chấp nhận lời mời" 
            });
        }
    };

    rejectInvitation = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { invitationId } = req.params;

            const result = await TeamService.rejectInvitation(invitationId, userId);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Reject invitation error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi từ chối lời mời" 
            });
        }
    };

    removeMember = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId, memberId } = req.params;

            const result = await TeamService.removeMember(teamId, userId, memberId);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Remove member error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi xóa thành viên" 
            });
        }
    };

    updateMemberRole = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId, memberId } = req.params;
            const { role } = req.body;

            if (!role) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Quyền hạn không được để trống" 
                });
            }

            if (!['edit', 'view', 'leader'].includes(role)) {
                return res.status(400).json({ 
                    status: false, 
                    message: "Quyền hạn không hợp lệ" 
                });
            }

            const result = await TeamService.updateMemberRole(teamId, userId, memberId, role);
            
            if (result.success) {
                return res.status(200).json({ 
                    status: true, 
                    message: result.message 
                });
            } else {
                return res.status(400).json({ 
                    status: false, 
                    message: result.message 
                });
            }
        } catch (error) {
            console.error('Update member role error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi cập nhật quyền hạn" 
            });
        }
    };

    getPendingInvitations = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;

            const invitations = await TeamService.getPendingInvitations(userId);
            
            return res.status(200).json({ 
                status: true, 
                invitations 
            });
        } catch (error) {
            console.error('Get pending invitations error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi lấy danh sách lời mời" 
            });
        }
    };

    getTeamsByAccountId = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;

            const teams = await TeamService.getTeamsByAccountId(userId);
            
            return res.status(200).json({ 
                status: true, 
                teams 
            });
        } catch (error) {
            console.error('Get teams by account error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi lấy danh sách nhóm" 
            });
        }
    };

    getFriendsNotInTeam = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId } = req.params;

            const friends = await TeamService.getFriendsNotInTeam(teamId, userId);
            
            return res.status(200).json({ 
                status: true, 
                friends 
            });
        } catch (error) {
            console.error('Get friends not in team error:', error);
            return res.status(500).json({ 
                status: false, 
                message: "Lỗi khi lấy danh sách bạn bè" 
            });
        }
    };

    searchAccounts = async (req, res, next) => {
        try {
            const userId = req.authenticate.id;
            const { teamId } = req.params;
            const { query } = req.query;

            const result = await TeamService.searchAccountsForTeam(teamId, userId, query);

            if (result.success) {
                return res.status(200).json({
                    status: true,
                    accounts: result.results
                });
            }

            return res.status(400).json({
                status: false,
                message: result.message
            });
        } catch (error) {
            console.error('Search accounts error:', error);
            return res.status(500).json({
                status: false,
                message: "Lỗi khi tìm kiếm tài khoản"
            });
        }
    };
}

export default new TeamController();
