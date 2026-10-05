# BÁO CÁO ĐỒ ÁN MỞ RỘNG 4.1: HỆ THỐNG XÁC THỰC ĐĂNG KÝ & ĐĂNG NHẬP (AUTH SYSTEM)

## 1. PHÂN CÔNG THÀNH VIÊN NHÓM

- **Nguyễn Đăng Khải (Trưởng nhóm)**: Thiết kế Kiến trúc Xác thực Auth RESTful API cho cả Quản trị viên & Độc giả, xử lý lưu vết Session/Token, Mã hóa mật khẩu bảo mật và Bảng tài khoản `admins` / `readers`.
- **Nguyễn Nhật Linh Ân**: Thiết kế Giao diện Modal Đăng Nhập / Đăng Ký cho Độc giả (`library_user.html`) & Quản trị viên (`library_index.html`), Nút thoát session và Tải thông tin tài khoản sau đăng nhập.
- **Phan Duy**: Phụ trách tính năng Tặng Bonus 500,000 VND vào Ví nội bộ ngay sau khi độc giả Đăng ký tài khoản mới.

---

## 2. CHI TIẾT PHÂN HỆ XÁC THỰC (AUTHENTICATION)

### 🔑 A. Xác Thực Quản Trị Viên / Thủ Thư (Admin Auth)
- **Tài khoản mặc định thử nghiệm**:
  - **Tên đăng nhập**: `admin`
  - **Mật khẩu**: `123456` hoặc `123`
- **Tính năng**:
  - Đăng nhập Quản trị viên tại `library_index.html`.
  - Quản lý kho, Check-in Barcode nhận trả sách, Quỹ cọc và Kích hoạt Cron Job.

### 👤 B. Xác Thực Độc Giả / Người Thuê (Reader Auth)
- **Tài khoản mặc định thử nghiệm**:
  - **Email**: `khainguyen@gmail.com`
  - **Mật khẩu**: `123456` hoặc `123`
- **Đăng Ký Tài Khoản Mới**:
  - Tự động tạo Mã độc giả ngẫu nhiên (VD: `DG982`).
  - **Tặng ngay Bonus 500,000 ₫** vào Ví nội bộ để độc giả trải nghiệm thuê sách/truyện ngay lập tức.

---

## 3. HƯỚNG DẪN TRẢI NGHIỆM

Chạy máy chủ PHP local:
```bash
php -S 127.0.0.1:8088
```

- 📱 **Trang Độc Giả / Khách Hàng (Đăng Nhập & Đăng Ký)**: [http://127.0.0.1:8088/library_user.html](http://127.0.0.1:8088/library_user.html)
- 🖥️ **Trang Quản Trị Viên (Đăng Nhập Quản Trị)**: [http://127.0.0.1:8088/library_index.html](http://127.0.0.1:8088/library_index.html)
