/**
 * Test Guide for Team Management API
 * 
 * Trước khi chạy test, hãy:
 * 1. Chạy migration: mysql -u root -p test < migrations/create_team_invitation_table.sql
 * 2. Start server: npm start
 * 3. Lấy token bằng cách login
 */

// ============================================
// 1. TẠO NHÓM
// ============================================

// Request:
POST http://localhost:3000/api/team/create
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body:
{
  "name": "My Test Team"
}

// Expected Response (201):
{
  "status": true,
  "message": "Tạo nhóm thành công",
  "teamId": "uuid-here"
}

// Test trùng tên:
POST http://localhost:3000/api/team/create
Body:
{
  "name": "My Test Team"  // Tên đã tồn tại
}
// Expected: status 400, message "Tên nhóm đã tồn tại trong tài khoản của bạn"

// ============================================
// 2. LẤY DANH SÁCH NHÓM
// ============================================

GET http://localhost:3000/api/team/my-teams
Headers:
  Authorization: Bearer YOUR_TOKEN

// Expected Response:
{
  "status": true,
  "teams": [
    {
      "id": "team-id",
      "name": "My Test Team",
      "role": "leader"
    }
  ]
}

// ============================================
// 3. XEM THÀNH VIÊN NHÓM
// ============================================

GET http://localhost:3000/api/team/{teamId}/members
Headers:
  Authorization: Bearer YOUR_TOKEN

// Expected Response:
{
  "status": true,
  "members": [
    {
      "id": "member-id",
      "accountId": "your-account-id",
      "teamId": "team-id",
      "role": "leader",
      "email": "your@email.com",
      "username": "your-username",
      "fullname": "Your Full Name",
      "avatar": "avatar-url"
    }
  ]
}

// ============================================
// 4. MỜI THÀNH VIÊN
// ============================================

POST http://localhost:3000/api/team/{teamId}/invite
Headers:
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body:
{
  "email": "friend@example.com",
  "role": "edit"
}

// Expected Response (200):
{
  "status": true,
  "message": "Gửi lời mời thành công",
  "invitation": {
    "id": "invitation-id",
    "teamId": "team-id",
    "inviterId": "your-id",
    "inviteeEmail": "friend@example.com",
    "status": "pending",
    "role": "edit"
  }
}

// Test mời người không có tài khoản:
Body:
{
  "email": "nonexistent@example.com",
  "role": "view"
}
// Expected: Vẫn tạo invitation nhưng inviteeId = null

// ============================================
// 5. XEM LỜI MỜI (Từ phía người được mời)
// ============================================

GET http://localhost:3000/api/team/invitations/pending
Headers:
  Authorization: Bearer INVITEE_TOKEN

// Expected Response:
{
  "status": true,
  "invitations": [
    {
      "id": "invitation-id",
      "teamId": "team-id",
      "teamName": "My Test Team",
      "inviterName": "Inviter Name",
      "inviterEmail": "inviter@email.com",
      "role": "edit",
      "status": "pending"
    }
  ]
}

// ============================================
// 6. CHẤP NHẬN LỜI MỜI
// ============================================

POST http://localhost:3000/api/team/invitations/{invitationId}/accept
Headers:
  Authorization: Bearer INVITEE_TOKEN

// Expected Response:
{
  "status": true,
  "message": "Chấp nhận lời mời thành công"
}

// Sau đó kiểm tra lại members:
GET http://localhost:3000/api/team/{teamId}/members
// Should see new member with role "edit"

// ============================================
// 7. THAY ĐỔI QUYỀN THÀNH VIÊN
// ============================================

PUT http://localhost:3000/api/team/{teamId}/members/{memberId}/role
Headers:
  Authorization: Bearer LEADER_TOKEN
  Content-Type: application/json
Body:
{
  "role": "view"
}

// Expected Response:
{
  "status": true,
  "message": "Cập nhật quyền thành công"
}

// Test chuyển quyền leader:
Body:
{
  "role": "leader"
}
// Expected: Current leader becomes "edit", target becomes "leader"

// ============================================
// 8. XÓA THÀNH VIÊN
// ============================================

DELETE http://localhost:3000/api/team/{teamId}/members/{memberId}
Headers:
  Authorization: Bearer LEADER_TOKEN

// Expected Response:
{
  "status": true,
  "message": "Xóa thành viên thành công"
}

// Test xóa leader (should fail):
DELETE http://localhost:3000/api/team/{teamId}/members/{leaderId}
// Expected: status 400, "Không thể xóa leader khỏi nhóm"

// ============================================
// 9. XÓA NHÓM
// ============================================

DELETE http://localhost:3000/api/team/{teamId}
Headers:
  Authorization: Bearer LEADER_TOKEN
  Content-Type: application/json
Body:
{
  "password": "your-password"
}

// Expected Response:
{
  "status": true,
  "message": "Team deleted successfully"
}

// Test sai mật khẩu:
Body:
{
  "password": "wrong-password"
}
// Expected: status 400, "Mật khẩu không chính xác"

// Test không phải leader:
Headers:
  Authorization: Bearer NON_LEADER_TOKEN
// Expected: status 400, "Chỉ leader mới có quyền xóa nhóm"

// ============================================
// 10. LẤY DANH SÁCH BẠN BÈ CHƯA TRONG NHÓM
// ============================================

GET http://localhost:3000/api/team/{teamId}/friends-not-in-team
Headers:
  Authorization: Bearer YOUR_TOKEN

// Expected Response:
{
  "status": true,
  "friends": [
    {
      "id": "friend-id",
      "username": "friend-username",
      "email": "friend@email.com"
    }
  ]
}

// ============================================
// ERROR CASES TO TEST
// ============================================

// 1. Không có token:
GET http://localhost:3000/api/team/my-teams
// Expected: 401 Unauthorized

// 2. Token không hợp lệ:
Headers:
  Authorization: Bearer INVALID_TOKEN
// Expected: 401 Unauthorized

// 3. Mời thành viên với role không hợp lệ:
POST http://localhost:3000/api/team/{teamId}/invite
Body:
{
  "email": "test@test.com",
  "role": "admin"  // Invalid role
}
// Expected: 400 Bad Request, "Quyền hạn không hợp lệ"

// 4. Người không phải thành viên xem members:
GET http://localhost:3000/api/team/{teamId}/members
Headers:
  Authorization: Bearer NON_MEMBER_TOKEN
// Expected: 403 Forbidden, "Bạn không phải thành viên của nhóm này"

// 5. Mời người đã là thành viên:
POST http://localhost:3000/api/team/{teamId}/invite
Body:
{
  "email": "existing-member@email.com",
  "role": "edit"
}
// Expected: 400 Bad Request, "Người dùng đã là thành viên của nhóm"

// ============================================
// TESTING WORKFLOW
// ============================================

/**
 * Complete workflow test:
 * 
 * 1. User A tạo nhóm "Project Alpha"
 * 2. User A mời User B với quyền "edit"
 * 3. User B xem lời mời và chấp nhận
 * 4. User A thấy User B trong danh sách members
 * 5. User A thay đổi quyền User B thành "view"
 * 6. User B không thể mời người khác (không phải leader)
 * 7. User A mời User C với quyền "edit"
 * 8. User C chấp nhận lời mời
 * 9. User A chuyển quyền leader cho User C
 * 10. User A giờ là "edit", User C là "leader"
 * 11. User C xóa User B khỏi nhóm
 * 12. User C xóa nhóm (phải nhập password)
 */
