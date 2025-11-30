-- Migration: Create TeamInvitation table
-- Description: Add table to handle team member invitations

CREATE TABLE IF NOT EXISTS TeamInvitation (
  id VARCHAR(36) PRIMARY KEY,
  teamId VARCHAR(36) NOT NULL,
  inviterId VARCHAR(36) NOT NULL,
  inviteeId VARCHAR(36) NULL,
  inviteeEmail VARCHAR(255) NOT NULL,
  status VARCHAR(16) DEFAULT 'pending', -- pending, accepted, rejected
  role VARCHAR(16) NOT NULL, -- edit, view
  createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (teamId) REFERENCES Team(id) ON DELETE CASCADE,
  FOREIGN KEY (inviterId) REFERENCES Account(id) ON DELETE CASCADE,
  FOREIGN KEY (inviteeId) REFERENCES Account(id) ON DELETE CASCADE,
  
  INDEX idx_invitee_email (inviteeEmail),
  INDEX idx_invitee_id (inviteeId),
  INDEX idx_status (status),
  INDEX idx_team_id (teamId)
);

-- Add index for finding pending invitations
CREATE INDEX idx_pending_invitations ON TeamInvitation(inviteeId, status);
CREATE INDEX idx_team_pending_invitations ON TeamInvitation(teamId, inviteeEmail, status);
