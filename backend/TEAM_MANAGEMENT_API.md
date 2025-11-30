# Tài liệu API Quản lý Nhóm (Team Management)

## Tổng quan
Hệ thống quản lý nhóm cho phép người dùng:
- Tạo nhóm để quản lý nhiều roadmap
- Mời thành viên vào nhóm
- Phân quyền cho thành viên (leader, edit, view)
- Xóa nhóm và quản lý thành viên

## Cấu trúc Database

### Bảng TeamInvitation (Mới)
```sql
CREATE TABLE TeamInvitation (
  id VARCHAR(36) PRIMARY KEY,
  teamId VARCHAR(36) NOT NULL,
  inviterId VARCHAR(36) NOT NULL,
  inviteeId VARCHAR(36) NULL,
  inviteeEmail VARCHAR(255) NOT NULL,
  status VARCHAR(16) DEFAULT 'pending', -- pending, accepted, rejected
  role VARCHAR(16) NOT NULL, -- edit, view
  createAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### 1. Tạo Nhóm
**Endpoint:** `POST /api/team/create`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Tên nhóm"
}
```

**Response Success (201):**
```json
{
  "status": true,
  "message": "Tạo nhóm thành công",
  "teamId": "uuid-of-team"
}
```

**Response Error (400):**
```json
{
  "status": false,
  "message": "Tên nhóm đã tồn tại trong tài khoản của bạn"
}
```

---

### 2. Xóa Nhóm
**Endpoint:** `DELETE /api/team/:teamId`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "mật khẩu tài khoản"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Team deleted successfully"
}
```

**Response Error (400):**
```json
{
  "status": false,
  "message": "Chỉ leader mới có quyền xóa nhóm"
}
```
hoặc
```json
{
  "status": false,
  "message": "Mật khẩu không chính xác"
}
```

---

### 3. Lấy Danh Sách Thành Viên Nhóm
**Endpoint:** `GET /api/team/:teamId/members`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "members": [
    {
      "id": "member-id",
      "accountId": "account-id",
      "teamId": "team-id",
      "role": "leader",
      "email": "user@example.com",
      "username": "username",
      "fullname": "Full Name",
      "avatar": "avatar-url"
    }
  ]
}
```

---

### 4. Mời Thành Viên Vào Nhóm
**Endpoint:** `POST /api/team/:teamId/invite`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "email@example.com",
  "role": "edit" // hoặc "view"
}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Gửi lời mời thành công",
  "invitation": {
    "id": "invitation-id",
    "teamId": "team-id",
    "inviterId": "inviter-id",
    "inviteeEmail": "email@example.com",
    "status": "pending",
    "role": "edit"
  }
}
```

**Response Error (400):**
```json
{
  "status": false,
  "message": "Chỉ leader mới có quyền mời thành viên"
}
```

---

### 5. Xem Lời Mời Đang Chờ
**Endpoint:** `GET /api/team/invitations/pending`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "invitations": [
    {
      "id": "invitation-id",
      "teamId": "team-id",
      "inviterId": "inviter-id",
      "inviteeId": "invitee-id",
      "inviteeEmail": "email@example.com",
      "status": "pending",
      "role": "edit",
      "teamName": "Team Name",
      "inviterName": "Inviter Name",
      "inviterEmail": "inviter@example.com"
    }
  ]
}
```

---

### 6. Chấp Nhận Lời Mời
**Endpoint:** `POST /api/team/invitations/:invitationId/accept`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Chấp nhận lời mời thành công"
}
```

---

### 7. Từ Chối Lời Mời
**Endpoint:** `POST /api/team/invitations/:invitationId/reject`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Từ chối lời mời thành công"
}
```

---

### 8. Xóa Thành Viên Khỏi Nhóm
**Endpoint:** `DELETE /api/team/:teamId/members/:memberId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "message": "Xóa thành viên thành công"
}
```

**Response Error (400):**
```json
{
  "status": false,
  "message": "Chỉ leader mới có quyền xóa thành viên"
}
```

---

### 9. Cập Nhật Quyền Hạn Thành Viên
**Endpoint:** `PUT /api/team/:teamId/members/:memberId/role`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "role": "edit" // "edit", "view", hoặc "leader"
}
```

**Lưu ý:** 
- Nếu gán quyền "leader" cho thành viên khác, người dùng hiện tại sẽ mất quyền leader và chuyển thành "edit"
- Chỉ có một leader trong mỗi nhóm

**Response Success (200):**
```json
{
  "status": true,
  "message": "Cập nhật quyền thành công"
}
```
hoặc khi chuyển quyền leader:
```json
{
  "status": true,
  "message": "Chuyển quyền leader thành công"
}
```

---

### 10. Lấy Danh Sách Bạn Bè Chưa Trong Nhóm
**Endpoint:** `GET /api/team/:teamId/friends-not-in-team`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "friends": [
    {
      "id": "account-id",
      "username": "username",
      "email": "email@example.com"
    }
  ]
}
```

---

### 11. Lấy Danh Sách Nhóm Của Người Dùng
**Endpoint:** `GET /api/team/my-teams`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "teams": [
    {
      "id": "team-id",
      "name": "Team Name",
      "role": "leader"
    }
  ]
}
```

---

### 12. Lấy Danh Sách Nhóm (Legacy)
**Endpoint:** `GET /api/team/get-teams`

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "status": true,
  "teams": [
    {
      "id": "team-id",
      "name": "Team Name"
    }
  ]
}
```

---

## Quy Tắc và Phân Quyền

### Vai trò (Roles):
1. **leader**: 
   - Có tất cả quyền
   - Mời thành viên mới
   - Xóa thành viên
   - Thay đổi quyền hạn thành viên
   - Xóa nhóm
   - Chỉnh sửa roadmap trong nhóm

2. **edit**: 
   - Xem roadmap trong nhóm
   - Chỉnh sửa roadmap trong nhóm
   - KHÔNG thể quản lý thành viên

3. **view**: 
   - Chỉ xem roadmap trong nhóm
   - KHÔNG thể chỉnh sửa

### Quy tắc:
- Tên nhóm không được trùng nhau trong cùng một tài khoản
- Mỗi nhóm chỉ có DUY NHẤT một leader
- Chỉ leader mới có quyền mời/xóa thành viên và thay đổi quyền hạn
- Khi chuyển quyền leader, người cũ tự động chuyển thành role "edit"
- Phải xác nhận mật khẩu khi xóa nhóm
- Người được mời phải chấp nhận lời mời mới vào được nhóm
- Không thể mời người đã là thành viên của nhóm
- Không thể gửi lời mời trùng lặp cho cùng một email

## Luồng Hoạt Động

### Tạo nhóm mới:
1. Người dùng gọi API `POST /api/team/create` với tên nhóm
2. Hệ thống kiểm tra tên nhóm có trùng không
3. Tạo nhóm và tự động thêm người tạo làm leader

### Mời thành viên:
1. Leader vào trang quản lý thành viên
2. Nhập email người cần mời hoặc chọn từ danh sách bạn bè
3. Chọn quyền hạn (edit/view)
4. Hệ thống gửi lời mời
5. Người được mời nhận thông báo
6. Người được mời chấp nhận hoặc từ chối

### Xóa nhóm:
1. Leader vào trang quản lý thành viên
2. Nhấn nút xóa nhóm
3. Nhập mật khẩu để xác nhận
4. Hệ thống xóa nhóm và tất cả thành viên

### Chuyển quyền leader:
1. Leader vào trang quản lý thành viên
2. Chọn thành viên cần gán quyền leader
3. Cập nhật role = "leader"
4. Leader cũ tự động chuyển thành role "edit"

## Migration

Chạy file migration để tạo bảng TeamInvitation:
```bash
mysql -u username -p database_name < migrations/create_team_invitation_table.sql
```

## Lưu Ý Khi Phát Triển Frontend

1. **Xác thực mật khẩu khi xóa nhóm**: Cần có form input để người dùng nhập mật khẩu
2. **Hiển thị danh sách bạn bè**: Sử dụng endpoint `/api/team/:teamId/friends-not-in-team` để gợi ý
3. **Xử lý lời mời**: Hiển thị số lượng lời mời pending và cho phép chấp nhận/từ chối
4. **Phân quyền UI**: Ẩn/hiện các nút chức năng dựa trên role của người dùng
5. **Thông báo**: Khi có lời mời mới, hiển thị thông báo cho người dùng
