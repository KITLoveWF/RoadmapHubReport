# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY TEAM MANAGEMENT

## Bước 1: Chạy Migration Database

### Cách 1: Sử dụng MySQL Command Line
```bash
mysql -u root -p test < migrations/create_team_invitation_table.sql
```

### Cách 2: Sử dụng MySQL Workbench hoặc phpMyAdmin
1. Mở file `migrations/create_team_invitation_table.sql`
2. Copy toàn bộ nội dung
3. Paste vào SQL editor và Execute

### Cách 3: Chạy trực tiếp trong MySQL CLI
```sql
USE test;
SOURCE migrations/create_team_invitation_table.sql;
```

## Bước 2: Kiểm Tra Bảng Đã Tạo

```sql
USE test;
SHOW TABLES LIKE 'TeamInvitation';
DESCRIBE TeamInvitation;
```

Kết quả mong đợi:
```
+---------------+--------------+------+-----+-------------------+
| Field         | Type         | Null | Key | Default           |
+---------------+--------------+------+-----+-------------------+
| id            | varchar(36)  | NO   | PRI | NULL              |
| teamId        | varchar(36)  | NO   | MUL | NULL              |
| inviterId     | varchar(36)  | NO   | MUL | NULL              |
| inviteeId     | varchar(36)  | YES  | MUL | NULL              |
| inviteeEmail  | varchar(255) | NO   | MUL | NULL              |
| status        | varchar(16)  | YES  |     | pending           |
| role          | varchar(16)  | NO   |     | NULL              |
| createAt      | datetime     | YES  |     | CURRENT_TIMESTAMP |
+---------------+--------------+------+-----+-------------------+
```

## Bước 3: Restart Server (Nếu đang chạy)

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó start lại
npm start
```

hoặc nếu dùng nodemon:
```bash
# Server sẽ tự động restart
```

## Bước 4: Kiểm Tra Routes Đã Load

Mở terminal và chạy:
```bash
curl http://localhost:3000/api/team/my-teams -H "Authorization: Bearer YOUR_TOKEN"
```

Hoặc sử dụng Postman/Insomnia để test.

## Bước 5: Test API Endpoints

### 5.1. Login để lấy Token
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "kitdevhoang@gmail.com",
  "password": "123123"
}
```

Lưu `accessToken` từ response.

### 5.2. Tạo Team Đầu Tiên
```http
POST http://localhost:3000/api/team/create
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "My First Team"
}
```

### 5.3. Xem Danh Sách Teams
```http
GET http://localhost:3000/api/team/my-teams
Authorization: Bearer {accessToken}
```

## Các Lỗi Thường Gặp và Cách Khắc Phục

### Lỗi 1: "Table 'TeamInvitation' doesn't exist"
**Nguyên nhân:** Chưa chạy migration

**Giải pháp:**
```bash
mysql -u root -p test < migrations/create_team_invitation_table.sql
```

### Lỗi 2: "Cannot find module '../daos/TeamInvitation.dao.js'"
**Nguyên nhân:** File chưa được tạo hoặc server chưa restart

**Giải pháp:**
1. Kiểm tra file tồn tại: `ls daos/TeamInvitation.dao.js`
2. Restart server: `npm start`

### Lỗi 3: "Foreign key constraint fails"
**Nguyên nhân:** Dữ liệu không hợp lệ

**Giải pháp:**
- Đảm bảo `teamId` tồn tại trong bảng `Team`
- Đảm bảo `inviterId` và `inviteeId` tồn tại trong bảng `Account`

### Lỗi 4: "Unauthorized" hoặc "Token not provided"
**Nguyên nhân:** Thiếu hoặc token không hợp lệ

**Giải pháp:**
1. Login lại để lấy token mới
2. Đảm bảo header: `Authorization: Bearer {token}`

### Lỗi 5: "Tên nhóm đã tồn tại trong tài khoản của bạn"
**Nguyên nhân:** Đúng như thông báo - tên trùng

**Giải pháp:**
- Đổi tên team khác
- Hoặc xóa team cũ trước

## Kiểm Tra Hoạt Động

### Test 1: Tạo và Xóa Team
```bash
# 1. Tạo team
POST /api/team/create
Body: { "name": "Test Team" }

# 2. Lấy teamId từ response

# 3. Xóa team
DELETE /api/team/{teamId}
Body: { "password": "your-password" }
```

### Test 2: Mời và Chấp Nhận Thành Viên
```bash
# 1. User A tạo team

# 2. User A mời User B
POST /api/team/{teamId}/invite
Body: { "email": "userB@email.com", "role": "edit" }

# 3. User B login và xem lời mời
GET /api/team/invitations/pending

# 4. User B chấp nhận
POST /api/team/invitations/{invitationId}/accept

# 5. User A kiểm tra members
GET /api/team/{teamId}/members
```

### Test 3: Chuyển Quyền Leader
```bash
# 1. User A (leader) chuyển quyền cho User B
PUT /api/team/{teamId}/members/{userB_id}/role
Body: { "role": "leader" }

# 2. Kiểm tra lại members
GET /api/team/{teamId}/members
# User A giờ là "edit"
# User B giờ là "leader"
```

## Logs Để Debug

### Bật Console Logs
Uncomment các dòng console.log trong code nếu cần debug:

```javascript
// Trong controllers/Team.controller.js
console.log("Create team request:", req.body);
console.log("User ID:", req.authenticate.id);

// Trong services/Team.service.js
console.log("Checking team name:", name);
console.log("Result:", result);
```

### Xem Logs Database
```sql
-- Xem tất cả queries
SHOW PROCESSLIST;

-- Xem errors
SHOW ERRORS;
SHOW WARNINGS;
```

## Performance Tips

### 1. Index Optimization
Bảng TeamInvitation đã có các index cần thiết:
- `idx_invitee_email`
- `idx_invitee_id`
- `idx_status`
- `idx_team_id`
- `idx_pending_invitations`
- `idx_team_pending_invitations`

### 2. Query Optimization
Sử dụng `.select()` để chỉ lấy columns cần thiết:
```javascript
// Tốt
await db('Team').select('id', 'name').where({ id: teamId });

// Không tốt
await db('Team').select('*').where({ id: teamId });
```

### 3. Caching (Tùy chọn)
Có thể thêm Redis để cache:
- Danh sách teams của user
- Danh sách members
- Pending invitations count

## Monitoring

### 1. Kiểm Tra Số Lượng Records
```sql
SELECT COUNT(*) FROM Team;
SELECT COUNT(*) FROM TeamMember;
SELECT COUNT(*) FROM TeamInvitation;
SELECT COUNT(*) FROM TeamInvitation WHERE status = 'pending';
```

### 2. Kiểm Tra Data Integrity
```sql
-- Mỗi team phải có đúng 1 leader
SELECT teamId, COUNT(*) as leader_count 
FROM TeamMember 
WHERE role = 'leader' 
GROUP BY teamId 
HAVING leader_count != 1;
-- Should return empty
```

## Backup Data

Trước khi test, nên backup database:
```bash
mysqldump -u root -p test > backup_before_team_management.sql
```

Restore nếu cần:
```bash
mysql -u root -p test < backup_before_team_management.sql
```

## Next Steps

Sau khi backend hoạt động ổn định:

1. **Frontend Integration**
   - Tạo UI components cho team management
   - Implement API calls
   - Handle notifications

2. **Additional Features** (Tùy chọn)
   - Team avatars
   - Team settings
   - Activity logs
   - Team statistics

3. **Security Enhancements**
   - Rate limiting cho invitations
   - Email verification
   - Two-factor authentication cho delete team

4. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

## Support

Nếu gặp vấn đề:
1. Kiểm tra logs trong terminal
2. Xem chi tiết error message
3. Kiểm tra file `TEAM_MANAGEMENT_API.md` cho tài liệu đầy đủ
4. Sử dụng `TEST_GUIDE.md` để test từng endpoint
5. Chạy queries trong `TEST_QUERIES.sql` để debug database

---

✅ **Chúc bạn triển khai thành công!**
