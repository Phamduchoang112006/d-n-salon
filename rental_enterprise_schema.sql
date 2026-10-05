-- ============================================================
-- CƠ SỞ DỮ LIỆU: HỆ THỐNG CHO THUÊ SÁCH & TRUYỆN TRANH CHUYÊN NGHIỆP
-- Nhóm thực hiện: Nguyễn Đăng Khải (Trưởng nhóm), Nguyễn Nhật Linh Ân, Phan Duy
-- Phiên bản: Enterprise 4.0 - Đặt Cọc, Ví Nội Bộ, Barcode Vật Lý & Check-in Hoàn Cọc
-- ============================================================

CREATE DATABASE IF NOT EXISTS `thuvien_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `thuvien_db`;

-- 1. DANH MỤC SÁCH & TRUYỆN
CREATE TABLE IF NOT EXISTS `categories` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_danh_muc` VARCHAR(20) NOT NULL UNIQUE,
    `ten_danh_muc` VARCHAR(100) NOT NULL,
    `mo_ta` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ĐẦU SÁCH & THÔNG TIN GIÁ CỌC / THUÊ (BOOKS)
CREATE TABLE IF NOT EXISTS `books` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_sach` VARCHAR(20) NOT NULL UNIQUE,
    `ten_sach` VARCHAR(255) NOT NULL,
    `tac_gia` VARCHAR(150) NOT NULL,
    `category_id` INT NOT NULL,
    `nha_xuat_ban` VARCHAR(150),
    `nam_xuat_ban` INT,
    `gia_bia` DECIMAL(10, 2) NOT NULL DEFAULT 50000.00 COMMENT 'Giá bìa thực tế',
    `ty_le_coc` INT NOT NULL DEFAULT 80 COMMENT 'Tỷ lệ cọc (% giá bìa: 70 - 100%)',
    `gia_thue_ngay` DECIMAL(10, 2) NOT NULL DEFAULT 3000.00 COMMENT 'Phí thuê/ngày',
    `hinh_thuc` ENUM('Thuê lẻ', 'Combo bộ') DEFAULT 'Thuê lẻ',
    `hinh_anh` VARCHAR(500),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢN SAO VẬT LÝ & MÃ BARCODE (PHYSICAL COPIES)
CREATE TABLE IF NOT EXISTS `physical_copies` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `book_id` INT NOT NULL,
    `barcode` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã Barcode/QR Code cho từng cuốn vật lý',
    `tu_ke_kho` VARCHAR(50) DEFAULT 'Kệ A1-Tủ 01' COMMENT 'Vị trí lưu kho vật lý',
    `tinh_trang_hao_mon` ENUM('Mới 99%', 'Khá', 'Cũ', 'Hỏng') DEFAULT 'Mới 99%',
    `so_lan_thue` INT DEFAULT 0 COMMENT 'Vòng đời - Số lần đã cho thuê',
    `trang_thai` ENUM('Có sẵn', 'Đang cho thuê', 'Đang kiểm duyệt', 'Bảo trì', 'Xả kho') DEFAULT 'Có sẵn',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ĐỘC GIẢ, VÍ NỘI BỘ & VÍ VIP (READERS)
CREATE TABLE IF NOT EXISTS `readers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_doc_gia` VARCHAR(20) NOT NULL UNIQUE,
    `ho_ten` VARCHAR(150) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `so_dien_thoai` VARCHAR(20) NOT NULL,
    `dia_chi` VARCHAR(255),
    `so_du_vi` DECIMAL(12, 2) DEFAULT 500000.00 COMMENT 'Số dư Ví nội bộ (Hoàn cọc / Nạp tiền)',
    `tien_coc_dong_bang` DECIMAL(12, 2) DEFAULT 0.00 COMMENT 'Số tiền cọc đang bị đóng băng',
    `xac_minh_kyc` ENUM('Chưa xác minh', 'Đã xác minh eKYC') DEFAULT 'Đã xác minh eKYC',
    `loai_doc_gia` ENUM('Thường', 'VIP Silver', 'VIP Gold') DEFAULT 'Thường',
    `trang_thai` ENUM('Hoạt động', 'Khóa') DEFAULT 'Hoạt động',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. ĐƠN THUÊ SÁCH & QUẢN LÝ CỌC / TRẢ (RENTAL ORDERS)
CREATE TABLE IF NOT EXISTS `rental_orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ma_don` VARCHAR(30) NOT NULL UNIQUE,
    `reader_id` INT NOT NULL,
    `ngay_bat_dau` DATE NOT NULL,
    `ngay_ket_thuc` DATE NOT NULL,
    `ngay_tra_thuc_te` DATE DEFAULT NULL,
    `phuong_thuc_nhan` ENUM('Giao tận nơi', 'Nhận tại cửa hàng') DEFAULT 'Giao tận nơi',
    `tong_tien_thue` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `tong_tien_coc` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `tien_coc_da_hoan` DECIMAL(10, 2) DEFAULT 0.00,
    `tien_phat` DECIMAL(10, 2) DEFAULT 0.00,
    `so_lan_gia_han` INT DEFAULT 0,
    `trang_thai` ENUM('Đang xử lý', 'Đang giao', 'Đang thuê', 'Đang trả/Kiểm duyệt', 'Hoàn tất', 'Hủy') DEFAULT 'Đang xử lý',
    `ghi_chu` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reader_id`) REFERENCES `readers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. CHI TIẾT CUỐN VẬT LÝ TRONG ĐƠN THUÊ
CREATE TABLE IF NOT EXISTS `rental_order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `physical_copy_id` INT NOT NULL,
    `tien_coc_item` DECIMAL(10, 2) NOT NULL,
    `tien_thue_item` DECIMAL(10, 2) NOT NULL,
    `tinh_trang_khi_tra` ENUM('Chưa trả', 'Bình thường', 'Hỏng nhẹ', 'Mất/Hỏng nặng') DEFAULT 'Chưa trả',
    FOREIGN KEY (`order_id`) REFERENCES `rental_orders`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`physical_copy_id`) REFERENCES `physical_copies`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. LỊCH SỬ GIAO DỊCH VÍ NỘI BỘ (WALLET TRANSACTIONS)
CREATE TABLE IF NOT EXISTS `wallet_transactions` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reader_id` INT NOT NULL,
    `ma_giao_dich` VARCHAR(30) NOT NULL UNIQUE,
    `loai_giao_dich` ENUM('Nạp tiền', 'Đóng băng cọc', 'Hoàn tiền cọc', 'Thanh toán phí thuê', 'Trừ tiền phạt') NOT NULL,
    `so_tien` DECIMAL(10, 2) NOT NULL,
    `mo_ta` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`reader_id`) REFERENCES `readers`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. KHÓA GIỮ CHỖ CHỐNG TRÙNG MƯỢN (INVENTORY CONCURRENCY LOCKS)
CREATE TABLE IF NOT EXISTS `inventory_locks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `physical_copy_id` INT NOT NULL UNIQUE,
    `reader_id` INT NOT NULL,
    `expires_at` DATETIME NOT NULL COMMENT 'Hết hạn sau 15 phút',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- NẠP DỮ LIỆU MẪU BAN ĐẦU
-- ============================================================
INSERT INTO `categories` (`ma_danh_muc`, `ten_danh_muc`, `mo_ta`) VALUES
('DM01', 'Truyện Tranh & Manga', 'Manga Nhật Bản, Comic kinh điển'),
('DM02', 'Light Novel & Kỳ Ảo', 'Tiểu thuyết nhẹ, trinh thám, Harry Potter'),
('DM03', 'Công Nghệ & Giáo Trình', 'Sách lập trình, CNTT, thiết kế web');

INSERT INTO `books` (`ma_sach`, `ten_sach`, `tac_gia`, `category_id`, `nha_xuat_ban`, `nam_xuat_ban`, `gia_bia`, `ty_le_coc`, `gia_thue_ngay`, `hinh_anh`) VALUES
('TT001', 'Doraemon - Tập 1: Chú Mèo Máy Đến Từ Tương Lai', 'Fujiko F. Fujio', 1, 'NXB Kim Đồng', 2023, 25000.00, 80, 2000.00, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400'),
('TT002', 'Thám Tử Lừng Danh Conan - Tập 100', 'Gosho Aoyama', 1, 'NXB Kim Đồng', 2023, 30000.00, 80, 3000.00, 'https://images.unsplash.com/photo-1618663938039-b33024897776?w=400'),
('TT005', 'Harry Potter Và Hòn Đá Phù Thủy', 'J.K. Rowling', 2, 'NXB Trẻ', 2021, 150000.00, 80, 6000.00, 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400'),
('MS001', 'Lập Trình Web Với ReactJS & Node.js', 'Nguyễn Văn A', 3, 'NXB Thống Kê', 2023, 180000.00, 80, 7000.00, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400');

INSERT INTO `physical_copies` (`book_id`, `barcode`, `tu_ke_kho`, `tinh_trang_hao_mon`, `so_lan_thue`, `trang_thai`) VALUES
(1, 'BC-DORA-001', 'Kệ Manga-A1', 'Mới 99%', 2, 'Có sẵn'),
(1, 'BC-DORA-002', 'Kệ Manga-A1', 'Khá', 8, 'Có sẵn'),
(2, 'BC-CONAN-001', 'Kệ Manga-A2', 'Mới 99%', 1, 'Đang cho thuê'),
(3, 'BC-HARRY-001', 'Kệ Novel-B1', 'Mới 99%', 3, 'Có sẵn'),
(4, 'BC-REACT-001', 'Kệ CNTT-C1', 'Mới 99%', 0, 'Có sẵn');

INSERT INTO `readers` (`ma_doc_gia`, `ho_ten`, `email`, `so_dien_thoai`, `dia_chi`, `so_du_vi`, `tien_coc_dong_bang`, `loai_doc_gia`) VALUES
('DG001', 'Nguyễn Đăng Khải', 'khainguyen@gmail.com', '0905123456', 'Đà Nẵng', 850000.00, 24000.00, 'VIP Gold'),
('DG002', 'Nguyễn Nhật Linh Ân', 'anlinh@gmail.com', '0905234567', 'Đà Nẵng', 500000.00, 0.00, 'Sinh viên'),
('DG003', 'Phan Duy', 'duyphan@gmail.com', '0905345678', 'Đà Nẵng', 450000.00, 0.00, 'Sinh viên');

INSERT INTO `rental_orders` (`ma_don`, `reader_id`, `ngay_bat_dau`, `ngay_ket_thuc`, `tong_tien_thue`, `tong_tien_coc`, `trang_thai`) VALUES
('RENT-8801', 1, '2026-09-01', '2026-09-15', 42000.00, 24000.00, 'Đang thuê');

INSERT INTO `rental_order_items` (`order_id`, `physical_copy_id`, `tien_coc_item`, `tien_thue_item`) VALUES
(1, 3, 24000.00, 42000.00);

INSERT INTO `wallet_transactions` (`reader_id`, `ma_giao_dich`, `loai_giao_dich`, `so_tien`, `mo_ta`) VALUES
(1, 'WT-1001', 'Nạp tiền', 1000000.00, 'Nạp tiền qua VietQR'),
(1, 'WT-1002', 'Đóng băng cọc', 24000.00, 'Đóng băng cọc đơn RENT-8801');
