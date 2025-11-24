export default class TeamMember{

    constructor(id, accountId, teamId, role)
    {
        this.id = id;
        this.accountId = accountId;
        this.teamId = teamId;
        this.role = role;
    }
    static fromRow(row) {
        return new TeamMember(row.id, row.accountId, row.teamId, row.role);
    }
}
