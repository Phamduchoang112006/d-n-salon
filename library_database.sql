-- ============================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG QUẢN LÝ THƯ VIỆN (LIBRARY MANAGEMENT SYSTEM)
-- Nhóm thực hiện: Nguyễn Đăng Khải (Trưởng nhóm), Nguyễn Nhật Linh Ân, Phan Duy
-- Công nghệ: PHP, MySQL / SQLite, ReactJS, HTML5/CSS3, JavaScript
-- ============================================================

CREATE DATABASE IF NOT EXISTS `thuvien_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `thuvien_db`;

-- 1. BẢNG DANH MỤC SÁCH
DROP TABLE IF EXISTS `borrow_records`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `readers`;
DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_danh_muc` VARCHAR(20) NOT NULL UNIQUE,
    `ten_danh_muc` VARCHAR(100) NOT NULL,
    `mo_ta` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG SÁCH
CREATE TABLE `books` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_sach` VARCHAR(20) NOT NULL UNIQUE,
    `ten_sach` VARCHAR(255) NOT NULL,
    `tac_gia` VARCHAR(150) NOT NULL,
    `category_id` INT NOT NULL,
    `nha_xuat_ban` VARCHAR(150),
    `nam_xuat_ban` INT,
    `so_luong` INT NOT NULL DEFAULT 1,
    `co_san` INT NOT NULL DEFAULT 1,
    `hinh_anh` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG ĐỘC GIẢ
CREATE TABLE `readers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_doc_gia` VARCHAR(20) NOT NULL UNIQUE,
    `ho_ten` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `so_dien_thoai` VARCHAR(20) NOT NULL,
    `dia_chi` VARCHAR(255),
    `ngay_cap` DATE NOT NULL,
    `trang_thai` ENUM('Hoạt động', 'Khóa', 'Hết hạn') DEFAULT 'Hoạt động',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG PHIẾU MƯỢN / TRẢ SÁCH
CREATE TABLE `borrow_records` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_phieu` VARCHAR(20) NOT NULL UNIQUE,
    `reader_id` INT NOT NULL,
    `book_id` INT NOT NULL,
    `ngay_muon` DATE NOT NULL,
    `han_tra` DATE NOT NULL,
    `ngay_tra` DATE DEFAULT NULL,
    `tien_phat` DECIMAL(10, 2) DEFAULT 0.00,
    `ghi_chu` TEXT,
    `trang_thai` ENUM('Đang mượn', 'Đã trả', 'Quá hạn') DEFAULT 'Đang mượn',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reader_id`) REFERENCES `readers`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ============================================================

INSERT INTO `categories` (`ma_danh_muc`, `ten_danh_muc`, `mo_ta`) VALUES
('DM01', 'Công Nghệ Thông Tin', 'Sách lập trình, thiết kế web, trí tuệ nhân tạo, mạng máy tính và CSDL.'),
('DM02', 'Văn Học & Tiểu Thuyết', 'Các tác phẩm văn học Việt Nam và thế giới, tiểu thuyết nổi tiếng.'),
('DM03', 'Kinh Tế & Quản Lý', 'Sách về quản trị kinh doanh, tài chính, marketing, khởi nghiệp.'),
('DM04', 'Khoa Học & Kỹ Thuật', 'Tài liệu nghiên cứu khoa học tự nhiên, vật lý, toán học và kỹ thuật.'),
('DM05', 'Ngoại Ngữ', 'Sách học tiếng Anh, tiếng Nhật, tiếng Trung và luyện thi chứng chỉ.');

INSERT INTO `books` (`ma_sach`, `ten_sach`, `tac_gia`, `category_id`, `nha_xuat_ban`, `nam_xuat_ban`, `so_luong`, `co_san`, `hinh_anh`) VALUES
('MS001', 'Lập Trình Web Với ReactJS & Node.js', 'Nguyễn Văn A', 1, 'NXB Thống Kê', 2023, 10, 8, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
('MS002', 'Lập Trình PHP & MySQL Từ Cơ Bản Đến Nâng Cao', 'Trần Thị B', 1, 'NXB Lao Động', 2022, 12, 10, 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=400'),
('MS003', 'Đắc Nhân Tâm', 'Dale Carnegie', 2, 'NXB Tổng Hợp TPHCM', 2021, 15, 12, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'),
('MS004', 'Cha Giàu Cha Nghèo', 'Robert Kiyosaki', 3, 'NXB Trẻ', 2020, 8, 6, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400'),
('MS005', 'Giải Thuật & Cấu Trúc Dữ Liệu', 'Lê Minh C', 1, 'NXB ĐHQG Hà Nội', 2023, 7, 5, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'),
('MS006', 'Tiếng Anh Giao Tiếp Cho Dân IT', 'Sarah Johnson', 5, 'NXB Giáo Dục', 2023, 9, 9, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400');

INSERT INTO `readers` (`ma_doc_gia`, `ho_ten`, `email`, `so_dien_thoai`, `dia_chi`, `ngay_cap`, `trang_thai`) VALUES
('DG001', 'Nguyễn Đăng Khải', 'khainguyen@gmail.com', '0905123456', 'Đà Nẵng', '2024-01-15', 'Hoạt động'),
('DG002', 'Nguyễn Nhật Linh Ân', 'anlinh@gmail.com', '0905234567', 'Đà Nẵng', '2024-01-15', 'Hoạt động'),
('DG003', 'Phan Duy', 'duyphan@gmail.com', '0905345678', 'Đà Nẵng', '2024-01-15', 'Hoạt động'),
('DG004', 'Trần Văn Minh', 'minhtran@gmail.com', '0914111222', 'Quảng Nam', '2024-02-01', 'Hoạt động'),
('DG005', 'Lê Thi Hương', 'huongle@gmail.com', '0988333444', 'Thừa Thiên Huế', '2024-02-10', 'Hoạt động');

INSERT INTO `borrow_records` (`ma_phieu`, `reader_id`, `book_id`, `ngay_muon`, `han_tra`, `ngay_tra`, `tien_phat`, `ghi_chu`, `trang_thai`) VALUES
('PM001', 1, 1, '2026-08-20', '2026-09-03', '2026-09-02', 0.00, 'Trả sách đúng hạn, tình trạng tốt', 'Đã trả'),
('PM002', 2, 2, '2026-08-25', '2026-09-08', NULL, 15000.00, 'Sách quá hạn 3 ngày', 'Quá hạn'),
('PM003', 3, 3, '2026-09-05', '2026-09-19', NULL, 0.00, 'Đang mượn sách', 'Đang mượn'),
('PM004', 4, 4, '2026-09-01', '2026-09-15', NULL, 0.00, 'Đang mượn sách', 'Đang mượn');
