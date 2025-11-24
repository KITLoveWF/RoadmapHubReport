-- ============================================
-- SQL Queries for Testing Team Management
-- ============================================

-- Chạy migration để tạo bảng TeamInvitation
SOURCE migrations/create_team_invitation_table.sql;

-- hoặc
-- mysql -u root -p test < migrations/create_team_invitation_table.sql

-- ============================================
-- Kiểm tra dữ liệu sau khi test
-- ============================================

-- 1. Xem tất cả teams
SELECT * FROM Team;

-- 2. Xem tất cả team members
SELECT 
    tm.id,
    tm.accountId,
    tm.teamId,
    tm.role,
    a.email,
    a.username,
    t.name as teamName
FROM TeamMember tm
JOIN Account a ON tm.accountId = a.id
JOIN Team t ON tm.teamId = t.id
ORDER BY t.name, tm.role;

-- 3. Xem tất cả team invitations
SELECT 
    ti.id,
    ti.teamId,
    ti.inviteeEmail,
    ti.status,
    ti.role,
    t.name as teamName,
    inviter.email as inviterEmail,
    invitee.email as inviteeAccountEmail
FROM TeamInvitation ti
JOIN Team t ON ti.teamId = t.id
JOIN Account inviter ON ti.inviterId = inviter.id
LEFT JOIN Account invitee ON ti.inviteeId = invitee.id
ORDER BY ti.createAt DESC;

-- 4. Xem teams của một user cụ thể
SELECT 
    t.*,
    tm.role
FROM Team t
JOIN TeamMember tm ON t.id = tm.teamId
WHERE tm.accountId = 'YOUR_ACCOUNT_ID';

-- 5. Xem members của một team cụ thể
SELECT 
    tm.*,
    a.email,
    a.username,
    p.fullname,
    p.avatar
FROM TeamMember tm
JOIN Account a ON tm.accountId = a.id
JOIN Profile p ON a.id = p.accountId
WHERE tm.teamId = 'YOUR_TEAM_ID';

-- 6. Xem pending invitations của một user
SELECT 
    ti.*,
    t.name as teamName,
    inviter.username as inviterName
FROM TeamInvitation ti
JOIN Team t ON ti.teamId = t.id
JOIN Account inviter ON ti.inviterId = inviter.id
WHERE ti.inviteeId = 'YOUR_ACCOUNT_ID' 
  AND ti.status = 'pending';

-- 7. Kiểm tra leader của team
SELECT 
    a.email,
    a.username,
    tm.role
FROM TeamMember tm
JOIN Account a ON tm.accountId = a.id
WHERE tm.teamId = 'YOUR_TEAM_ID' 
  AND tm.role = 'leader';

-- ============================================
-- Queries để clean up test data
-- ============================================

-- Xóa tất cả invitations của một team
DELETE FROM TeamInvitation WHERE teamId = 'YOUR_TEAM_ID';

-- Xóa tất cả members của một team
DELETE FROM TeamMember WHERE teamId = 'YOUR_TEAM_ID';

-- Xóa một team cụ thể
DELETE FROM Team WHERE id = 'YOUR_TEAM_ID';

-- Reset tất cả team data (CẨNH THẬN!)
DELETE FROM TeamInvitation;
DELETE FROM TeamMember;
UPDATE Roadmap SET teamId = NULL WHERE teamId IS NOT NULL;
DELETE FROM Team;

-- ============================================
-- Queries để tạo test data thủ công
-- ============================================

-- Tạo một team mới
INSERT INTO Team (id, name) VALUES 
('test-team-id-001', 'Test Team Manual');

-- Thêm leader vào team
INSERT INTO TeamMember (id, accountId, teamId, role) VALUES
('test-member-id-001', 'YOUR_ACCOUNT_ID', 'test-team-id-001', 'leader');

-- Tạo invitation
INSERT INTO TeamInvitation (id, teamId, inviterId, inviteeId, inviteeEmail, status, role, createAt) VALUES
('test-invitation-001', 'test-team-id-001', 'INVITER_ID', 'INVITEE_ID', 'invitee@email.com', 'pending', 'edit', NOW());

-- ============================================
-- Queries để kiểm tra constraints
-- ============================================

-- Kiểm tra mỗi team có bao nhiêu leader
SELECT 
    t.id,
    t.name,
    COUNT(CASE WHEN tm.role = 'leader' THEN 1 END) as leader_count
FROM Team t
LEFT JOIN TeamMember tm ON t.id = tm.teamId
GROUP BY t.id, t.name
HAVING leader_count != 1;  -- Should return empty if all teams have exactly 1 leader

-- Kiểm tra duplicate team names cho cùng một user
SELECT 
    a.email,
    t.name,
    COUNT(*) as count
FROM Team t
JOIN TeamMember tm ON t.id = tm.teamId
JOIN Account a ON tm.accountId = a.id
GROUP BY a.email, t.name
HAVING count > 1;  -- Should return empty

-- ============================================
-- Queries hữu ích cho debugging
-- ============================================

-- Xem tất cả notifications liên quan đến team
SELECT 
    n.*,
    sender.email as senderEmail,
    receiver.email as receiverEmail
FROM Notification n
JOIN Account sender ON n.senderId = sender.id
JOIN Account receiver ON n.receiverId = receiver.id
WHERE n.content LIKE '%nhóm%'
ORDER BY n.createDate DESC;

-- Xem roadmaps của một team
SELECT 
    r.*
FROM Roadmap r
WHERE r.teamId = 'YOUR_TEAM_ID';

-- Đếm số lượng members theo role
SELECT 
    t.name as teamName,
    tm.role,
    COUNT(*) as count
FROM TeamMember tm
JOIN Team t ON tm.teamId = t.id
GROUP BY t.name, tm.role
ORDER BY t.name, tm.role;

-- Xem pending invitations theo team
SELECT 
    t.name as teamName,
    COUNT(*) as pending_invitations
FROM TeamInvitation ti
JOIN Team t ON ti.teamId = t.id
WHERE ti.status = 'pending'
GROUP BY t.name;

-- ============================================
-- Performance check queries
-- ============================================

-- Check indexes
SHOW INDEX FROM TeamInvitation;
SHOW INDEX FROM TeamMember;
SHOW INDEX FROM Team;

-- Explain query plans
EXPLAIN SELECT * FROM TeamInvitation WHERE inviteeId = 'test' AND status = 'pending';
EXPLAIN SELECT * FROM TeamMember WHERE teamId = 'test';
