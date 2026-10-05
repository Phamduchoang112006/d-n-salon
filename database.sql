-- database.sql - Schema và Dữ liệu Khởi tạo SQL cho LUMIÈRE Hair Studio (Kèm Khóa Ngoại Nối Dây phpMyAdmin Designer)

CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  duration VARCHAR(50),
  minutes INT DEFAULT 45,
  price INT NOT NULL,
  description TEXT,
  badge VARCHAR(50),
  image TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS hairstyles (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  image TEXT,
  tag VARCHAR(50),
  `desc` TEXT,
  KEY `idx_hairstyle_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS haircolors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  hex VARCHAR(20),
  badge VARCHAR(50),
  `desc` TEXT,
  image TEXT,
  KEY `idx_haircolor_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stylists (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  level VARCHAR(50) DEFAULT 'Senior',
  baseSalary INT DEFAULT 8000000,
  experience VARCHAR(100),
  rating FLOAT DEFAULT 5.0,
  reviews INT DEFAULT 0,
  avatar TEXT,
  specialty TEXT,
  isAny INT DEFAULT 0,
  KEY `idx_stylist_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) DEFAULT 'Khách hàng',
  avatar TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  service VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  role VARCHAR(20) DEFAULT 'customer',
  loyalty_points INT DEFAULT 0,
  membership_tier VARCHAR(50) DEFAULT 'Thành Viên',
  KEY `idx_user_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Hóa Chất',
  quantity FLOAT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'ml',
  min_threshold FLOAT DEFAULT 500,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vouchers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percent', 'fixed') DEFAULT 'percent',
  discount_value INT NOT NULL,
  min_spend INT DEFAULT 0,
  max_discount INT DEFAULT 500000,
  expiry_date DATE,
  usage_limit INT DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS stylist_leaves (
  id INT AUTO_INCREMENT PRIMARY KEY,
  stylist_name VARCHAR(255) NOT NULL,
  leave_date VARCHAR(50) NOT NULL,
  reason TEXT,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_leave_stylist` FOREIGN KEY (`stylist_name`) REFERENCES `stylists` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS service_materials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity_used FLOAT NOT NULL,
  CONSTRAINT `fk_mat_item` FOREIGN KEY (`item_name`) REFERENCES `inventory` (`item_name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(50) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  services TEXT,
  hairstyle VARCHAR(255),
  haircolor VARCHAR(255),
  stylist VARCHAR(255),
  date VARCHAR(50),
  time VARCHAR(50),
  totalPrice INT DEFAULT 0,
  depositAmount INT DEFAULT 0,
  depositStatus VARCHAR(50) DEFAULT 'Paid',
  refundAmount INT DEFAULT 0,
  cancelReason TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  createdTime VARCHAR(100),
  paymentMethod VARCHAR(50) DEFAULT 'AtSalon',
  CONSTRAINT `fk_appointment_user` FOREIGN KEY (`phone`) REFERENCES `users` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointment_stylist` FOREIGN KEY (`stylist`) REFERENCES `stylists` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_appointment_hairstyle` FOREIGN KEY (`hairstyle`) REFERENCES `hairstyles` (`name`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_appointment_haircolor` FOREIGN KEY (`haircolor`) REFERENCES `haircolors` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_phone VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  sender ENUM('customer', 'admin') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read TINYINT(1) DEFAULT 0,
  CONSTRAINT `fk_chat_user` FOREIGN KEY (`customer_phone`) REFERENCES `users` (`phone`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notification_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notif_app` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CHÈN DỮ LIỆU BAN ĐẦU (SEED DATA)

INSERT IGNORE INTO services (id, name, category, duration, minutes, price, description, badge, image) VALUES
('cut-women', 'Cắt & Tạo Kiểu Nữ', 'Cắt & Tạo Kiểu', '45 phút', 45, 250000, 'Tư vấn dáng mặt, cắt tỉa layer chuyên sâu & sấy tạo kiểu bồng bềnh tự nhiên.', 'Phổ biến', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'),
('cut-men', 'Cắt & Styling Nam Premium', 'Cắt & Tạo Kiểu', '30 phút', 30, 160000, 'Cắt tạo phom chuẩn nam tính, cạo viền sắc nét & sấy vuốt sáp tạo kiểu cao cấp.', 'Yêu thích', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600'),
('perm-korean', 'Uốn Sóng Lơi Hàn Quốc', 'Uốn & Nhuộm', '120 phút', 120, 850000, 'Kỹ thuật uốn xoăn sóng lơi tự nhiên, không khô xơ, giữ nếp lâu dài.', 'Hot Trend 2026', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=600'),
('color-premium', 'Nhuộm Màu Thời Trang Premium', 'Uốn & Nhuộm', '90 phút', 90, 650000, 'Sử dụng thuốc nhuộm thảo mộc chứa dưỡng chất, màu lên chuẩn bóng khỏe.', 'Khuyên dùng', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'),
('keratin-treatment', 'Phục Hồi Keratin Chuyên Sâu', 'Chăm Sóc & Phục Hồi', '60 phút', 60, 520000, 'Bổ sung Keratin và Collagen tự nhiên tái tạo cấu trúc tóc hư tổn nặng.', 'Cứu rỗi tóc', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'),
('head-spa', 'Gội Đầu Dưỡng Sinh Thảo Dược', 'Chăm Sóc & Phục Hồi', '45 phút', 45, 180000, 'Gội thảo mộc thiên nhiên kết hợp massage ấn huyệt cổ vai gáy giảm căng thẳng.', 'Thư giãn', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600');

INSERT IGNORE INTO hairstyles (id, name, category, image, tag, `desc`) VALUES
('style-layer-female', 'Cắt Layer Bồng Bềnh Nữ', 'Tóc Nữ', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400', 'Hot Trend', 'Cắt tỉa tầng ôm trọn khuôn mặt, tạo độ phồng dịu dàng tự nhiên'),
('style-wavy-loi', 'Uốn Sóng Lơi Sóng Nước', 'Tóc Nữ', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400', 'Xu Hướng 2026', 'Nếp sóng xoăn nhẹ nhàng tự nhiên như không uốn'),
('style-hippie', 'Uốn Hippie Retro Cổ Điển', 'Tóc Nữ', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400', 'Cá Tính', 'Xoăn xù mì bồng bềnh mang phong cách Vintage tự do'),
('style-bob-chic', 'Cắt Bob Ngắn Thanh Lịch', 'Tóc Nữ', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', 'Thanh Lịch', 'Mái tóc ngắn ôm gáy phom dáng tối giản hiện đại'),
('style-sidepart', 'Side Part 7/3 Hàn Quốc', 'Tóc Nam', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400', 'Lịch Lãm', 'Tạo phồng chân tóc nhẹ nhàng, lịch sự công sở & đi chơi'),
('style-undercut', 'Undercut High Fade Modern', 'Tóc Nam', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Cắt Ngắn Gọn', 'Cắt sát hai bên sắc nét, vuốt phồng đỉnh đầu cá tính');

INSERT IGNORE INTO haircolors (id, name, hex, badge, `desc`, image) VALUES
('color-none', 'Giữ Màu Tóc Tự Nhiên / Không Nhuộm', '#2B2725', 'Nguyên Bản', 'Chỉ thực hiện dịch vụ cắt/uốn/chăm sóc phục hồi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
('color-milktea', 'Nâu Trà Sữa (Milk Tea)', '#D2B48C', 'Hot Trend 2026', 'Tông màu siêu sáng da, trẻ trung bồng bềnh thu hút', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'),
('color-ash-brown', 'Nâu Lạnh Khói (Ash Brown)', '#8B8580', 'Tôn Da Sáng', 'Sắc khói huyền bí tây tây, không tẩy tóc vẫn đẹp', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400'),
('color-chestnut', 'Nâu Hạt Dẻ Trầm (Chestnut)', '#5C4033', 'Công Sở / Học Sinh', 'Thanh lịch dịu dàng, tự nhiên hợp mọi trang phục', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400'),
('color-balayage-ash', 'Balayage Khói Bạch Kim', '#C0C0C0', 'Nghệ Thuật Cao Cấp', 'Kỹ thuật nhuộm chuyển sắc loang ngọn tóc độc bản', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400'),
('color-rose-pink', 'Hồng Ánh Kim (Rose Gold)', '#B76E79', 'Nổi Bật Cá Tính', 'Tông màu nổi bật, thời thời phong cách Idol', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400'),
('color-blue-black', 'Xanh Đen Âm Trầm (Blue Black)', '#1C2833', 'Bí Ẩn Sành Điệu', 'Trầm ẩn trong nhà, ánh xanh rực rỡ khi ra nắng', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400'),
('color-mocha-brown', 'Nâu Bambi Mocha (Bambi Brown)', '#6F4E37', 'Ngọt Ngào', 'Tông nâu ấm áp ngọt ngào phong cách tiểu thư Hàn Quốc', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400'),
('color-smoky-purple', 'Tím Khói Trầm (Smoky Purple)', '#4A3B52', 'Cá Tính Idol', 'Sắc tím huyền bí rực rỡ dưới ánh đèn và ánh nắng', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'),
('color-copper-orange', 'Cam Đồng Thời Trang (Copper Orange)', '#D35400', 'Hot Trend 2026', 'Tông màu cá tính rực rỡ tôn làn da trắng ngần', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400'),
('color-matcha-green', 'Rêu Khói Matcha (Matcha Green)', '#4B6F44', 'Sành Điệu', 'Sắc xanh rêu ánh khói tây tây vô cùng thời thượng', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400'),
('color-honey-blonde', 'Vàng Bạch Kim Ánh Mật (Honey Blonde)', '#E5C158', 'Tây Âu Sáng Da', 'Màu nhuộm sang chảnh nổi bật tôn đường nét khuôn mặt', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
('color-charcoal-gray', 'Xám Khói Chân Thật (Charcoal Gray)', '#708090', 'Xu Hướng Độc Bản', 'Sắc xám khói hiện đại phong cách thời trang cao cấp', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400');

INSERT IGNORE INTO stylists (id, name, role, level, baseSalary, experience, rating, reviews, avatar, specialty, isAny) VALUES
('any', 'Bất Kỳ Thợ Nào', 'Sắp xếp thợ sẵn sàng nhanh nhất', 'Senior', 0, 'Linh hoạt', 5.0, 450, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Tiết kiệm thời gian chờ', 1),
('alex-tran', 'Alex Trần', 'Master Stylist', 'Master', 12000000, '10 năm kinh nghiệm', 4.9, 320, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Chuyên gia Uốn Sóng & Nhuộm Balayage', 0),
('minh-anh', 'Minh Anh', 'Senior Hair Artist', 'Senior', 8000000, '7 năm kinh nghiệm', 4.8, 245, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'Cắt Layer & Tạo Kiểu Hàn Quốc', 0),
('david-nguyen', 'David Nguyễn', 'Barber Specialist', 'Senior', 8000000, '8 năm kinh nghiệm', 4.9, 198, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Undercut, Fade & Cắt Nam Hiện Đại', 0),
('elena-vu', 'Elena Vũ', 'Treatment & Spa Expert', 'Senior', 8000000, '5 năm kinh nghiệm', 5.0, 160, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300', 'Phục Hồi Tóc Hư Tổn & Gội Dưỡng Sinh', 0),
('phong-le', 'Phong Lê (Leo)', 'Creative Color Director', 'Master', 12000000, '9 năm kinh nghiệm', 4.9, 280, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Tẩy Tóc Nghệ Thuật & Nhuộm Ombre Khói', 0),
('huyen-my', 'Huyền My', 'Senior Extension & Styling Expert', 'Senior', 8000000, '6 năm kinh nghiệm', 4.9, 210, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Nối Tóc Lông Vũ & Cắt Mái Bay Hàn Quốc', 0),
('ken-dinh', 'Ken Dũng', 'Master Barber & Hair Tattoo', 'Master', 12000000, '8 năm kinh nghiệm', 5.0, 310, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300', 'Cắt Textured Crop, Tattoo Tóc & Săn Sóc Râu', 0),
('gia-bao', 'Gia Bảo', 'Korean Perm Master', 'Senior', 8000000, '6 năm kinh nghiệm', 4.8, 175, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', 'Uốn Phồng Chân Tóc & Uốn Hippie Retro', 0),
('mai-lan', 'Mai Lan', 'Head Spa & Scalp Therapist', 'Senior', 8000000, '7 năm kinh nghiệm', 5.0, 290, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', 'Gội Dưỡng Sinh Thảo Dược & Massage Cổ Vai Gáy', 0),
('hoang-nam', 'Hoàng Nam', 'Junior Stylist', 'Junior', 5000000, '2 năm kinh nghiệm', 4.7, 45, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Thợ Phụ Cắt & Uốn Sấy', 0),
('thanh-tung', 'Thanh Tùng', 'Junior Barber', 'Junior', 5000000, '2 năm kinh nghiệm', 4.6, 38, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Gội Dưỡng Sinh & Cắt Nam Cơ Bản', 0);

INSERT IGNORE INTO reviews (id, name, role, avatar, content, rating, service) VALUES
(1, 'Nguyễn Bích Phương', 'Khách hàng thân thiết', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', 'Mình chọn nhuộm màu Nâu Trà Sữa với uốn sóng lơi. Tóc mềm mịn cực kỳ, lên màu chuẩn y như hình tư vấn luôn!', 5, 'Uốn Sóng & Nhuộm Trà Sữa'),
(2, 'Trần Hoàng Nam', 'Khách hàng', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150', 'Đặt lịch trên mobile chọn kiểu Side Part 7/3 rất tiện. Anh David cắt rất kĩ, vuốt sáp chuẩn phom Hàn Quốc.', 5, 'Cắt Side Part Nam'),
(3, 'Lê Thảo My', 'Khách hàng', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', 'Kiểu tóc Layer kết hợp phục hồi Keratin làm xong ai cũng khen. Không gian thơm mùi trà thảo mộc rất thư thái.', 5, 'Phục Hồi Keratin');

INSERT IGNORE INTO users (id, name, phone, password, email, role) VALUES
(1, 'Nguyễn Bích Phương', '0912345678', '123456', 'bichphuong@gmail.com', 'customer'),
(2, 'Quản Trị Viên', 'admin', '123456', 'admin@lumiere.vn', 'admin');

INSERT IGNORE INTO appointments (id, customerName, phone, services, hairstyle, haircolor, stylist, date, time, totalPrice, status, createdTime) VALUES
('LUMI-8921', 'Nguyễn Bích Phương', '0912345678', '["Uốn Sóng Lơi Hàn Quốc", "Nhuộm Màu Thời Trang Premium"]', 'Uốn Sóng Lơi Sóng Nước', 'Nâu Trà Sữa (Milk Tea)', 'Alex Trần', 'Hôm nay', '09:30', 1500000, 'Confirmed', '08:15 - Hôm nay'),
('LUMI-7412', 'Trần Hoàng Nam', '0987654321', '["Cắt & Styling Nam Premium"]', 'Side Part 7/3 Hàn Quốc', 'Giữ Màu Tóc Tự Nhiên', 'David Nguyễn', 'Hôm nay', '10:30', 160000, 'InProgress', '07:45 - Hôm nay'),
('LUMI-6309', 'Lê Thảo My', '0933112233', '["Cắt & Tạo Kiểu Nữ", "Phục Hồi Keratin Chuyên Sâu"]', 'Cắt Layer Bồng Bềnh Nữ', 'Nâu Lạnh Khói (Ash Brown)', 'Minh Anh', 'Hôm nay', '14:30', 770000, 'Pending', '09:00 - Hôm nay');
