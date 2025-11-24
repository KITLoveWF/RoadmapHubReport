import db from '../utils/db.js'
import TeamMember from '../models/TeamMember.model.js';
import genUUID from '../Helps/genUUID.js';

class TeamMemberDAO {
    async createTeamMember(teamId, userId, role) {
        const teamMember = {
            id: genUUID(),
            accountId: userId,
            teamId: teamId,
            role: role
        };
        await db('TeamMember').insert(teamMember);
        return {
            success: true,
            message: 'Team member added successfully'
        };
    }

    async deleteTeamMember(teamId, userId) {
        await db('TeamMember').where({ teamId: teamId, accountId: userId }).del();
        return {
            success: true,
            message: 'Team member removed successfully'
        };
    }

    async updateMemberRole(teamId, accountId, newRole) {
        await db('TeamMember')
            .where({ teamId: teamId, accountId: accountId })
            .update({ role: newRole });
        return {
            success: true,
            message: 'Member role updated successfully'
        };
    }

    async getMemberRole(teamId, accountId) {
        const row = await db('TeamMember')
            .where({ teamId: teamId, accountId: accountId })
            .select('role')
            .first();
        return row ? row.role : null;
    }

    async transferLeadership(teamId, currentLeaderId, newLeaderId) {
        // Update current leader to edit role
        await db('TeamMember')
            .where({ teamId: teamId, accountId: currentLeaderId })
            .update({ role: 'edit' });
        
        // Update new leader
        await db('TeamMember')
            .where({ teamId: teamId, accountId: newLeaderId })
            .update({ role: 'leader' });
        
        return {
            success: true,
            message: 'Leadership transferred successfully'
        };
    }

    async getTeamLeader(teamId) {
        const row = await db('TeamMember')
            .where({ teamId: teamId, role: 'leader' })
            .first();
        return row;
    }

    async isMemberOfTeam(teamId, accountId) {
        const row = await db('TeamMember')
            .where({ teamId: teamId, accountId: accountId })
            .first();
        return !!row;
    }
}

export default new TeamMemberDAO();