export default class TeamInvitation {
    constructor(id, teamId, inviterId, inviteeId, inviteeEmail, status, role, createAt) {
        this.id = id;
        this.teamId = teamId;
        this.inviterId = inviterId;
        this.inviteeId = inviteeId;
        this.inviteeEmail = inviteeEmail;
        this.status = status; // pending, accepted, rejected
        this.role = role; // edit, view
        this.createAt = createAt;
    }
    
    static fromRow(row) {
        return new TeamInvitation(
            row.id,
            row.teamId,
            row.inviterId,
            row.inviteeId,
            row.inviteeEmail,
            row.status,
            row.role,
            row.createAt
        );
    }
}
