import db from '../utils/db.js'
import TeamInvitation from '../models/TeamInvitation.model.js';
import genUUID from '../Helps/genUUID.js';

class TeamInvitationDAO {
    async createInvitation(teamId, inviterId, inviteeEmail, inviteeId, role) {
        const invitation = {
            id: genUUID(),
            teamId: teamId,
            inviterId: inviterId,
            inviteeId: inviteeId,
            inviteeEmail: inviteeEmail,
            status: 'pending',
            role: role,
            createAt: new Date()
        };
        
        await db('TeamInvitation').insert(invitation);
        return invitation;
    }

    async acceptInvitation(invitationId) {
        await db('TeamInvitation')
            .where({ id: invitationId })
            .update({ status: 'accepted' });
        
        return {
            success: true,
            message: 'Invitation accepted'
        };
    }

    async rejectInvitation(invitationId) {
        await db('TeamInvitation')
            .where({ id: invitationId })
            .update({ status: 'rejected' });
        
        return {
            success: true,
            message: 'Invitation rejected'
        };
    }

    async getPendingInvitations(accountId) {
        const rows = await db('TeamInvitation')
            .join('Team', 'TeamInvitation.teamId', 'Team.id')
            .join('Account as inviter', 'TeamInvitation.inviterId', 'inviter.id')
            .where({
                'TeamInvitation.inviteeId': accountId,
                'TeamInvitation.status': 'pending'
            })
            .select(
                'TeamInvitation.*',
                'Team.name as teamName',
                'inviter.username as inviterName',
                'inviter.email as inviterEmail'
            );
        return rows.map(row => TeamInvitation.fromRow(row));
    }

    async getPendingInvitationsByEmail(email) {
        const rows = await db('TeamInvitation')
            .join('Team', 'TeamInvitation.teamId', 'Team.id')
            .join('Account as inviter', 'TeamInvitation.inviterId', 'inviter.id')
            .where({
                'TeamInvitation.inviteeEmail': email,
                'TeamInvitation.status': 'pending'
            })
            .select(
                'TeamInvitation.*',
                'Team.name as teamName',
                'inviter.username as inviterName',
                'inviter.email as inviterEmail'
            );
        return rows.map(row => TeamInvitation.fromRow(row));
    }

    async getInvitationById(invitationId) {
        const row = await db('TeamInvitation')
            .where({ id: invitationId })
            .first();
        return row ? TeamInvitation.fromRow(row) : null;
    }

    async checkExistingInvitation(teamId, inviteeEmail) {
        const row = await db('TeamInvitation')
            .where({
                teamId: teamId,
                inviteeEmail: inviteeEmail,
                status: 'pending'
            })
            .first();
        return !!row;
    }

    async deleteInvitation(invitationId) {
        await db('TeamInvitation')
            .where({ id: invitationId })
            .del();
        return {
            success: true,
            message: 'Invitation deleted'
        };
    }
}

export default new TeamInvitationDAO();
