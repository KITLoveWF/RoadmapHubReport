import db from '../utils/db.js'
import Team from '../models/Team.model.js';
import genUUID from '../Helps/genUUID.js';

class teamDAO{
    async getTeamByUserId(userId) {
        const rows = 
        await db('Team')
        .join('Teammember', 'Team.id', 'TeamMember.teamId')
        .join('Account', 'TeamMember.accountId', 'Account.id')
        .where('Account.id', userId)
        .distinct('Team.id')
        .select('Team.*');
        //console.log("Account ID:", userId);
        //console.log("Rows:", rows);
        const teams = rows.map(row => Team.teamList(row));
        if(teams.length > 0){
            return teams;
        }
        else{
            return null;
        }
    }

    async createTeam(name, creatorId) {
        const teamId = genUUID();
        await db('Team').insert({
            id: teamId,
            name: name
        });
        
        // Add creator as leader
        await db('TeamMember').insert({
            id: genUUID(),
            accountId: creatorId,
            teamId: teamId,
            role: 'leader'
        });
        
        return teamId;
    }

    async checkTeamNameExists(name, accountId) {
        const row = await db('Team')
            .join('TeamMember', 'Team.id', 'TeamMember.teamId')
            .where({
                'Team.name': name,
                'TeamMember.accountId': accountId
            })
            .first();
        return !!row;
    }

    async getTeamById(teamId) {
        const row = await db('Team')
            .where({ id: teamId })
            .first();
        return row ? Team.fromRow(row) : null;
    }

    async deleteTeam(teamId) {
        // Delete all team members first
        await db('TeamMember').where({ teamId }).del();
        
        // Update roadmaps to remove team reference
        await db('Roadmap').where({ teamId }).update({ teamId: null });
        
        // Delete team invitations
        await db('TeamInvitation').where({ teamId }).del();
        
        // Delete the team
        await db('Team').where({ id: teamId }).del();
        
        return {
            success: true,
            message: 'Team deleted successfully'
        };
    }

    async getTeamMembers(teamId) {
        const rows = await db('TeamMember')
            .join('Account', 'TeamMember.accountId', 'Account.id')
            .join('Profile', 'Account.id', 'Profile.accountId')
            .where('TeamMember.teamId', teamId)
            .select(
                'TeamMember.*',
                'Account.email',
                'Account.username',
                'Profile.fullname',
                'Profile.avatar'
            );
        return rows;
    }

    async getTeamsByAccountId(accountId) {
        const rows = await db('Team')
            .join('TeamMember', 'Team.id', 'TeamMember.teamId')
            .where('TeamMember.accountId', accountId)
            .select('Team.*', 'TeamMember.role');
        return rows;
    }
}

export default new teamDAO();