<?php
// db.php - Module kết nối Cơ Sở Dữ Liệu SQL (MySQL phpMyAdmin / SQLite) qua PHP PDO

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// CẤU HÌNH LOẠI DATABASE: 'mysql' (Đã kết nối với phpMyAdmin) hoặc 'sqlite'
define('DB_TYPE', 'mysql');

// Cấu hình MySQL / phpMyAdmin
define('MYSQL_HOST', '127.0.0.1');
define('MYSQL_PORT', '3306');
define('MYSQL_DB', 'lumiere_salon');
define('MYSQL_USER', 'root');
define('MYSQL_PASS', '');

// Cấu hình SQLite File Path (Dự phòng)
define('SQLITE_FILE', __DIR__ . '/data/salon.db');

/**
 * Lấy đối tượng kết nối PDO Database (Tự động chuyển đổi thông minh MySQL <-> SQLite)
 */
function get_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    // 1. Thử kết nối MySQL nếu DB_TYPE là 'mysql'
    if (DB_TYPE === 'mysql') {
        try {
            $dsn = 'mysql:host=' . MYSQL_HOST . ';port=' . MYSQL_PORT . ';dbname=' . MYSQL_DB . ';charset=utf8mb4';
            $pdo = new PDO($dsn, MYSQL_USER, MYSQL_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch (PDOException $e) {
            // MySQL chưa khởi động (ví dụ XAMPP MySQL tắt) -> Tự động chuyển sang SQLite an toàn!
        }
    }

    // 2. Chế độ Dự phòng Chống Sập (SQLite Auto-Fallback Engine)
    try {
        $dir = dirname(SQLITE_FILE);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }
        $need_init = !file_exists(SQLITE_FILE);
        $pdo = new PDO('sqlite:' . SQLITE_FILE);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        init_sqlite_tables($pdo);
        return $pdo;
    } catch (PDOException $e) {
        die('Lỗi kết nối CSDL: ' . $e->getMessage());
    }
}

/**
 * Tự động tạo bảng & Nạp dữ liệu ban đầu cho SQLite
 */
function init_sqlite_tables($pdo) {
    $sqls = [
        "CREATE TABLE IF NOT EXISTS services (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, duration TEXT, minutes INTEGER DEFAULT 45, price INTEGER NOT NULL, description TEXT, badge TEXT, image TEXT);",
        "CREATE TABLE IF NOT EXISTS hairstyles (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT, image TEXT, tag TEXT, desc TEXT);",
        "CREATE TABLE IF NOT EXISTS haircolors (id TEXT PRIMARY KEY, name TEXT NOT NULL, hex TEXT, badge TEXT, desc TEXT, image TEXT);",
        "CREATE TABLE IF NOT EXISTS stylists (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT, level TEXT DEFAULT 'Senior', baseSalary INTEGER DEFAULT 8000000, experience TEXT, rating REAL DEFAULT 5.0, reviews INTEGER DEFAULT 0, avatar TEXT, specialty TEXT, isAny INTEGER DEFAULT 0);",
        "CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT DEFAULT 'Khách hàng', avatar TEXT, content TEXT NOT NULL, rating INTEGER DEFAULT 5, service TEXT);",
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT, role TEXT DEFAULT 'customer', loyalty_points INTEGER DEFAULT 0, membership_tier TEXT DEFAULT 'Thành Viên');",
        "CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT NOT NULL UNIQUE, category TEXT DEFAULT 'Hóa Chất', quantity REAL DEFAULT 0, unit TEXT DEFAULT 'ml', min_threshold REAL DEFAULT 500, updated_at TEXT);",
        "CREATE TABLE IF NOT EXISTS vouchers (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, discount_type TEXT DEFAULT 'percent', discount_value INTEGER NOT NULL, min_spend INTEGER DEFAULT 0, max_discount INTEGER DEFAULT 500000, expiry_date TEXT, usage_limit INTEGER DEFAULT 100, target_audience TEXT DEFAULT 'all', description TEXT);",
        "CREATE TABLE IF NOT EXISTS stylist_leaves (id INTEGER PRIMARY KEY AUTOINCREMENT, stylist_name TEXT NOT NULL, leave_date TEXT NOT NULL, reason TEXT, status TEXT DEFAULT 'Pending', created_at TEXT);",
        "CREATE TABLE IF NOT EXISTS service_materials (id INTEGER PRIMARY KEY AUTOINCREMENT, service_name TEXT NOT NULL, item_name TEXT NOT NULL, quantity_used REAL NOT NULL);",
        "CREATE TABLE IF NOT EXISTS appointments (id TEXT PRIMARY KEY, customerName TEXT NOT NULL, phone TEXT NOT NULL, services TEXT, hairstyle TEXT, haircolor TEXT, stylist TEXT, date TEXT, time TEXT, totalPrice INTEGER DEFAULT 0, depositAmount INTEGER DEFAULT 0, depositStatus TEXT DEFAULT 'Paid', refundAmount INTEGER DEFAULT 0, cancelReason TEXT, status TEXT DEFAULT 'Pending', createdTime TEXT, paymentMethod TEXT DEFAULT 'AtSalon');",
        "CREATE TABLE IF NOT EXISTS shift_transfers (id INTEGER PRIMARY KEY AUTOINCREMENT, appointment_id TEXT NOT NULL, from_stylist TEXT NOT NULL, to_stylist TEXT NOT NULL, reason TEXT, status TEXT DEFAULT 'Pending', created_at TEXT);"
    ];

    foreach ($sqls as $sql) {
        try { $pdo->exec($sql); } catch (Exception $e) {}
    }

    try {
        $count = $pdo->query("SELECT COUNT(*) FROM services")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("INSERT OR IGNORE INTO services (id, name, category, duration, minutes, price, description, badge, image) VALUES
            ('cut-women', 'Cắt & Tạo Kiểu Nữ', 'Cắt & Tạo Kiểu', '45 phút', 45, 250000, 'Tư vấn dáng mặt, cắt tỉa layer chuyên sâu & sấy tạo kiểu bồng bềnh tự nhiên.', 'Phổ biến', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600'),
            ('cut-men', 'Cắt & Styling Nam Premium', 'Cắt & Tạo Kiểu', '30 phút', 30, 160000, 'Cắt tạo phom chuẩn nam tính, cạo viền sắc nét & sấy vuốt sáp tạo kiểu cao cấp.', 'Yêu thích', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600'),
            ('perm-korean', 'Uốn Sóng Lơi Hàn Quốc', 'Uốn & Nhuộm', '120 phút', 120, 850000, 'Kỹ thuật uốn xoăn sóng lơi tự nhiên, không khô xơ, giữ nếp lâu dài.', 'Hot Trend 2026', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=600'),
            ('color-premium', 'Nhuộm Màu Thời Trang Premium', 'Uốn & Nhuộm', '90 phút', 90, 650000, 'Sử dụng thuốc nhuộm thảo mộc chứa dưỡng chất, màu lên chuẩn bóng khỏe.', 'Khuyên dùng', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'),
            ('keratin-treatment', 'Phục Hồi Keratin Chuyên Sâu', 'Chăm Sóc & Phục Hồi', '60 phút', 60, 520000, 'Bổ sung Keratin và Collagen tự nhiên tái tạo cấu trúc tóc hư tổn nặng.', 'Cứu rỗi tóc', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600'),
            ('head-spa', 'Gội Đầu Dưỡng Sinh Thảo Dược', 'Chăm Sóc & Phục Hồi', '45 phút', 45, 180000, 'Gội thảo mộc thiên nhiên kết hợp massage ấn huyệt cổ vai gáy giảm căng thẳng.', 'Thư giãn', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600');");
        }
    } catch (Exception $e) {}

    try {
        $count = $pdo->query("SELECT COUNT(*) FROM hairstyles")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("INSERT OR IGNORE INTO hairstyles (id, name, category, image, tag, desc) VALUES
            ('style-layer-female', 'Cắt Layer Bồng Bềnh Nữ', 'Tóc Nữ', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400', 'Hot Trend', 'Cắt tỉa tầng ôm trọn khuôn mặt, tạo độ phồng dịu dàng tự nhiên'),
            ('style-wavy-loi', 'Uốn Sóng Lơi Sóng Nước', 'Tóc Nữ', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400', 'Xu Hướng 2026', 'Nếp sóng xoăn nhẹ nhàng tự nhiên như không uốn'),
            ('style-hippie', 'Uốn Hippie Retro Cổ Điển', 'Tóc Nữ', 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&q=80&w=400', 'Cá Tính', 'Xoăn xù mì bồng bềnh mang phong cách Vintage tự do'),
            ('style-bob-chic', 'Cắt Bob Ngắn Thanh Lịch', 'Tóc Nữ', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400', 'Thanh Lịch', 'Mái tóc ngắn ôm gáy phom dáng tối giản hiện đại'),
            ('style-sidepart', 'Side Part 7/3 Hàn Quốc', 'Tóc Nam', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=400', 'Lịch Lãm', 'Tạo phồng chân tóc nhẹ nhàng, lịch sự công sở & đi chơi'),
            ('style-undercut', 'Undercut High Fade Modern', 'Tóc Nam', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', 'Cắt Ngắn Gọn', 'Cắt sát hai bên sắc nét, vuốt phồng đỉnh đầu cá tính');");
        }
    } catch (Exception $e) {}

    try {
        $count = $pdo->query("SELECT COUNT(*) FROM haircolors")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("INSERT OR IGNORE INTO haircolors (id, name, hex, badge, desc, image) VALUES
            ('color-none', 'Giữ Màu Tóc Tự Nhiên / Không Nhuộm', '#2B2725', 'Nguyên Bản', 'Chỉ thực hiện dịch vụ cắt/uốn/chăm sóc phục hồi', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'),
            ('color-milktea', 'Nâu Trà Sữa (Milk Tea)', '#D2B48C', 'Hot Trend 2026', 'Tông màu siêu sáng da, trẻ trung bồng bềnh thu hút', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400'),
            ('color-ash-brown', 'Nâu Lạnh Khói (Ash Brown)', '#8B8580', 'Tôn Da Sáng', 'Sắc khói huyền bí tây tây, không tẩy tóc vẫn đẹp', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=400'),
            ('color-chestnut', 'Nâu Hạt Dẻ Trầm (Chestnut)', '#5C4033', 'Công Sở / Học Sinh', 'Thanh lịch dịu dàng, tự nhiên hợp mọi trang phục', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400'),
            ('color-balayage-ash', 'Balayage Khói Bạch Kim', '#C0C0C0', 'Nghệ Thuật Cao Cấp', 'Kỹ thuật nhuộm chuyển sắc loang ngọn tóc độc bản', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400');");
        }
    } catch (Exception $e) {}

    try {
        $count = $pdo->query("SELECT COUNT(*) FROM stylists")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("INSERT OR IGNORE INTO stylists (id, name, role, level, baseSalary, experience, rating, reviews, avatar, specialty, isAny) VALUES
            ('any', 'Bất Kỳ Thợ Nào', 'Sắp xếp thợ sẵn sàng nhanh nhất', 'Senior', 0, 'Linh hoạt', 5.0, 450, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Tiết kiệm thời gian chờ', 1),
            ('alex-tran', 'Alex Trần', 'Master Stylist', 'Master', 12000000, '10 năm kinh nghiệm', 4.9, 320, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Chuyên gia Uốn Sóng & Nhuộm Balayage', 0),
            ('minh-anh', 'Minh Anh', 'Senior Hair Artist', 'Senior', 8000000, '7 năm kinh nghiệm', 4.8, 245, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'Cắt Layer & Tạo Kiểu Hàn Quốc', 0),
            ('david-nguyen', 'David Nguyễn', 'Barber Specialist', 'Senior', 8000000, '8 năm kinh nghiệm', 4.9, 198, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Undercut, Fade & Cắt Nam Hiện Đại', 0),
            ('elena-vu', 'Elena Vũ', 'Treatment & Spa Expert', 'Senior', 8000000, '5 năm kinh nghiệm', 5.0, 160, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300', 'Phục Hồi Tóc Hư Tổn & Gội Dưỡng Sinh', 0);");
        }
    } catch (Exception $e) {}

    try {
        $count = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
        if ($count == 0) {
            $pdo->exec("INSERT OR IGNORE INTO users (id, name, phone, password, email, role) VALUES
            (1, 'Nguyễn Bích Phương', '0912345678', '123456', 'bichphuong@gmail.com', 'customer'),
            (2, 'Quản Trị Viên', 'admin', '123456', 'admin@lumiere.vn', 'admin');");
        }
    } catch (Exception $e) {}
}

/**
 * Đọc toàn bộ dữ liệu từ SQL Database
 */
function get_db() {
    $pdo = get_pdo();

    $services = $pdo->query("SELECT * FROM services")->fetchAll();
    $hairstyles = $pdo->query("SELECT * FROM hairstyles")->fetchAll();
    $haircolors = $pdo->query("SELECT * FROM haircolors")->fetchAll();
    $stylists = $pdo->query("SELECT * FROM stylists")->fetchAll();
    $reviews = $pdo->query("SELECT * FROM reviews ORDER BY id DESC")->fetchAll();
    $users = $pdo->query("SELECT * FROM users")->fetchAll();
    $appointments = $pdo->query("SELECT * FROM appointments ORDER BY createdTime DESC")->fetchAll();

    // Decode JSON services in appointments
    foreach ($appointments as &$app) {
        if (!empty($app['services'])) {
            $decoded = json_decode($app['services'], true);
            if (is_string($decoded)) {
                $decoded = json_decode($decoded, true);
            }
            if (is_array($decoded)) {
                $app['services'] = array_map(function($s) {
                    return trim($s, "[]\"'\\ \t\n\r\0\x0B");
                }, $decoded);
            } else {
                $clean = trim($app['services'], "[]\"'\\ \t\n\r\0\x0B");
                $app['services'] = [$clean];
            }
        } else {
            $app['services'] = [];
        }
    }

    return [
        'services' => $services,
        'hairstyles' => $hairstyles,
        'haircolors' => $haircolors,
        'stylists' => $stylists,
        'reviews' => $reviews,
        'users' => $users,
        'appointments' => $appointments
    ];
}

/**
 * Chuyển mã trạng thái sang Tiếng Việt
 */
function get_status_label($st) {
    switch ($st) {
        case 'Pending': return 'Chờ xác nhận';
        case 'Confirmed': return 'Đã xác nhận';
        case 'InProgress': return 'Đang thực hiện';
        case 'Completed': return 'Đã hoàn thành';
        case 'Cancelled': return 'Đã hủy';
        default: return $st;
    }
}

/**
 * Định dạng tiền tệ VND
 */
function format_vnd($number) {
    return number_format($number, 0, ',', '.') . ' ₫';
}

/**
 * Lấy thông tin người dùng đang đăng nhập từ Session
 */
function get_logged_user() {
    return $_SESSION['user'] ?? null;
}

/**
 * Kiểm tra Admin đã đăng nhập hay chưa
 */
function is_admin_logged_in() {
    return !empty($_SESSION['admin']) && $_SESSION['admin'] === true;
}

/**
 * Kiểm tra Stylist đã đăng nhập hay chưa
 */
function is_stylist_logged_in() {
    return !empty($_SESSION['stylist']);
}

/**
 * Lấy thông tin Stylist đang đăng nhập từ Session
 */
function get_logged_stylist() {
    return $_SESSION['stylist'] ?? null;
}

if (!function_exists('parse_time_to_minutes')) {
    function parse_time_to_minutes($timeStr) {
        $timeStr = trim($timeStr);
        if (preg_match('/^(\d{1,2}):(\d{2})$/', $timeStr, $m)) {
            return intval($m[1]) * 60 + intval($m[2]);
        }
        return 540;
    }
}

if (!function_exists('calculate_services_duration')) {
    function calculate_services_duration($pdo, $servicesArr) {
        if (empty($servicesArr)) return 45;
        $placeholders = implode(',', array_fill(0, count($servicesArr), '?'));
        $stmt = $pdo->prepare("SELECT SUM(IFNULL(minutes, 45)) as total_min FROM services WHERE name IN ($placeholders)");
        $stmt->execute(array_values($servicesArr));
        $res = $stmt->fetchColumn();
        return max(intval($res), 30);
    }
}

if (!function_exists('is_stylist_busy_at_slot')) {
    function is_stylist_busy_at_slot($pdo, $stylistName, $date, $candStart, $candDuration) {
        // 1. Kiểm tra đơn xin nghỉ phép đã được duyệt (Approved Leave)
        $stmtLeave = $pdo->prepare("SELECT COUNT(*) FROM stylist_leaves WHERE stylist_name = ? AND leave_date = ? AND status = 'Approved'");
        $stmtLeave->execute([$stylistName, $date]);
        if ($stmtLeave->fetchColumn() > 0) {
            return true; // Stylist nghỉ phép nguyên ngày
        }

        // 2. Kiểm tra trùng ca hẹn khác
        $candEnd = $candStart + $candDuration;

        $stmt = $pdo->prepare("SELECT services, time FROM appointments WHERE stylist = ? AND date = ? AND status IN ('Pending', 'Confirmed', 'InProgress')");
        $stmt->execute([$stylistName, $date]);
        $existingApps = $stmt->fetchAll();

        foreach ($existingApps as $app) {
            $existStart = parse_time_to_minutes($app['time']);
            $svcs = json_decode($app['services'], true) ?: [$app['services']];
            $existDur = calculate_services_duration($pdo, $svcs);
            $existEnd = $existStart + $existDur;

            if (($candStart < $existEnd) && ($candEnd > $existStart)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * Tự động trừ kho hóa chất khi đơn hẹn chuyển sang Completed
 */
function deduct_inventory_for_appointment($pdo, $appointmentId) {
    $stmt = $pdo->prepare("SELECT services FROM appointments WHERE id = ?");
    $stmt->execute([$appointmentId]);
    $app = $stmt->fetch();
    if (!$app) return false;

    $services = json_decode($app['services'], true) ?: [$app['services']];

    foreach ($services as $svcName) {
        $stmtMat = $pdo->prepare("SELECT item_name, quantity_used FROM service_materials WHERE service_name = ?");
        $stmtMat->execute([$svcName]);
        $mats = $stmtMat->fetchAll();

        foreach ($mats as $m) {
            $stmtDeduct = $pdo->prepare("UPDATE inventory SET quantity = GREATEST(0, quantity - ?) WHERE item_name = ?");
            $stmtDeduct->execute([$m['quantity_used'], $m['item_name']]);
        }
    }
    return true;
}

/**
 * Tự động tạo và cập nhật các mã Voucher mẫu dành cho Khách Mới và Khách Thân Thiết
 */
function seed_default_vouchers($pdo) {
    try {
        // Alter table if needed
        $pdo->exec("ALTER TABLE vouchers ADD COLUMN target_audience VARCHAR(50) DEFAULT 'all'");
    } catch (Exception $e) {}
    try {
        $pdo->exec("ALTER TABLE vouchers ADD COLUMN description VARCHAR(255) DEFAULT ''");
    } catch (Exception $e) {}

    try {
        $check = $pdo->query("SELECT COUNT(*) FROM vouchers")->fetchColumn();
        if ($check == 0) {
            $vouchers = [
                ['CHAOXIN20', 'percent', 20, 150000, 100000, 'new_customer', '🎁 Giảm 20% (Tối đa 100k) cho Khách Hàng Mới làm tóc lần đầu'],
                ['BANMOI50K', 'fixed', 50000, 100000, 50000, 'new_customer', '🎉 Giảm ngay 50k cho Khách Hàng Mới trải nghiệm'],
                ['TRIAN100K', 'fixed', 100000, 400000, 100000, 'returning', '⭐ Tri ân giảm 100k cho Khách Hàng Thân Thiết quay lại'],
                ['VIPSTUDIO25', 'percent', 25, 300000, 200000, 'returning', '💎 Ưu đãi VIP giảm 25% (Tối đa 200k) cho Khách Cũ'],
                ['LUMIERE2026', 'percent', 15, 100000, 150000, 'all', '🔥 Giảm 15% cho Tất Cả Khách Hàng đặt lịch'],
                ['SALON100K', 'fixed', 100000, 500000, 100000, 'all', '✨ Giảm 100k cho đơn dịch vụ từ 500k']
            ];
            $stmt = $pdo->prepare("INSERT INTO vouchers (code, discount_type, discount_value, min_spend, max_discount, target_audience, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            foreach ($vouchers as $v) {
                $stmt->execute($v);
            }
        }
    } catch (Exception $e) {}
}

/**
 * Kiểm tra và áp dụng Mã Giảm Giá (Voucher) có phân loại Khách Mới & Khách Cũ
 */
function validate_voucher($pdo, $code, $spendAmount, $phone = '') {
    seed_default_vouchers($pdo);

    $stmt = $pdo->prepare("SELECT * FROM vouchers WHERE UPPER(code) = UPPER(?) AND (expiry_date >= CURDATE() OR expiry_date IS NULL)");
    $stmt->execute([trim($code)]);
    $v = $stmt->fetch();

    if (!$v) {
        return ['valid' => false, 'message' => 'Mã giảm giá không tồn tại hoặc đã hết hạn!'];
    }

    if ($spendAmount < intval($v['min_spend'])) {
        return ['valid' => false, 'message' => 'Đơn hàng tối thiểu ' . number_format($v['min_spend']) . ' ₫ để sử dụng mã này!'];
    }

    // Kiểm tra điều kiện Khách Hàng Mới vs Khách Hàng Cũ
    $target = $v['target_audience'] ?? 'all';
    if (!empty($phone)) {
        // Đếm số đơn đã đặt của số điện thoại này
        $stmtApp = $pdo->prepare("SELECT COUNT(*) FROM appointments WHERE user_phone = ? AND status != 'Cancelled'");
        $stmtApp->execute([$phone]);
        $appCount = intval($stmtApp->fetchColumn());

        if ($target === 'new_customer' && $appCount > 0) {
            return ['valid' => false, 'message' => 'Mã `' . $v['code'] . '` chỉ dành riêng cho Khách Hàng Mới lần đầu làm tóc!'];
        }

        if ($target === 'returning' && $appCount == 0) {
            return ['valid' => false, 'message' => 'Mã `' . $v['code'] . '` dành riêng cho Khách Hàng Thân Thiết đã từng sử dụng dịch vụ! (Mẹo: Bạn có thể dùng mã CHAOXIN20 cho khách mới)'];
        }
    }

    $discount = 0;
    if ($v['discount_type'] === 'percent') {
        $discount = round(($spendAmount * intval($v['discount_value'])) / 100);
        if ($v['max_discount'] > 0 && $discount > intval($v['max_discount'])) {
            $discount = intval($v['max_discount']);
        }
    } else {
        $discount = intval($v['discount_value']);
    }

    return [
        'valid' => true,
        'code' => $v['code'],
        'discountAmount' => $discount,
        'finalTotal' => max(0, $spendAmount - $discount),
        'message' => 'Áp dụng mã ' . $v['code'] . ' thành công! Giảm ' . number_format($discount) . ' ₫'
    ];
}

/**
 * Hàm trả về JSON Response cho AJAX
 */
function response_json($status, $message, $extra = []) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message
    ], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Tra cứu % Hoa hồng dựa trên Cấp Bậc Thợ (Master/Senior/Junior) và Loại Dịch Vụ
 */
function get_commission_rate($level, $category) {
    $level = ucfirst(strtolower($level ?? 'Senior'));
    $cat = trim($category ?? '');

    // Ma trận Tỷ lệ Hoa hồng
    $matrix = [
        'Master' => [
            'Uốn & Nhuộm' => 0.20,
            'Cắt & Tạo Kiểu' => 0.15,
            'Chăm Sóc & Phục Hồi' => 0.12,
            'default' => 0.15
        ],
        'Senior' => [
            'Uốn & Nhuộm' => 0.15,
            'Cắt & Tạo Kiểu' => 0.12,
            'Chăm Sóc & Phục Hồi' => 0.10,
            'default' => 0.12
        ],
        'Junior' => [
            'Uốn & Nhuộm' => 0.10,
            'Cắt & Tạo Kiểu' => 0.08,
            'Chăm Sóc & Phục Hồi' => 0.08,
            'default' => 0.08
        ]
    ];

    if (!isset($matrix[$level])) {
        $level = 'Senior';
    }

    if (isset($matrix[$level][$cat])) {
        return $matrix[$level][$cat];
    }
    return $matrix[$level]['default'];
}

/**
 * Tính toán Hoa hồng chi tiết cho một Ca Hẹn đã Hoàn Thành
 */
function calculate_appointment_commission($app, $stylistObj = null) {
    $pdo = get_pdo();

    if (!$stylistObj && !empty($app['stylist'])) {
        $stmt = $pdo->prepare("SELECT * FROM stylists WHERE name = ?");
        $stmt->execute([$app['stylist']]);
        $stylistObj = $stmt->fetch();
    }

    $level = $stylistObj['level'] ?? 'Senior';
    $servicesList = is_array($app['services']) ? $app['services'] : (json_decode($app['services'], true) ?: [$app['services']]);

    $servicesBreakdown = [];
    $totalCommission = 0;
    $appTotalPrice = intval($app['totalPrice'] ?? 0);

    if (!empty($servicesList)) {
        // Fetch service details from DB
        $placeholders = implode(',', array_fill(0, count($servicesList), '?'));
        $stmt = $pdo->prepare("SELECT * FROM services WHERE name IN ($placeholders)");
        $stmt->execute(array_values($servicesList));
        $fetchedSvcs = $stmt->fetchAll();

        $svcMap = [];
        $sumSvcPrices = 0;
        foreach ($fetchedSvcs as $s) {
            $svcMap[$s['name']] = $s;
            $sumSvcPrices += intval($s['price']);
        }

        foreach ($servicesList as $sName) {
            $svcData = $svcMap[$sName] ?? null;
            $cat = $svcData['category'] ?? 'Khác';

            // Price allocation
            if ($svcData) {
                $svcPrice = intval($svcData['price']);
                if ($sumSvcPrices > 0 && $appTotalPrice > 0 && $sumSvcPrices != $appTotalPrice) {
                    // Proportionally scale if appointment had discount/package
                    $svcPrice = round(($svcPrice / $sumSvcPrices) * $appTotalPrice);
                }
            } else {
                $svcPrice = ($sumSvcPrices > 0) ? round($appTotalPrice / count($servicesList)) : $appTotalPrice;
            }

            $rate = get_commission_rate($level, $cat);
            $commission = round($svcPrice * $rate);
            $totalCommission += $commission;

            $servicesBreakdown[] = [
                'serviceName' => $sName,
                'category' => $cat,
                'price' => $svcPrice,
                'rate' => $rate,
                'ratePercent' => ($rate * 100) . '%',
                'commission' => $commission
            ];
        }
    }

    return [
        'totalCommission' => $totalCommission,
        'level' => $level,
        'servicesBreakdown' => $servicesBreakdown
    ];
}

/**
 * Tổng hợp Báo Cáo Lương Cuối Tháng cho Toàn Bộ Thợ
 */
function get_monthly_salary_report($selectedMonthYear = null) {
    $pdo = get_pdo();

    if (!$selectedMonthYear) {
        $selectedMonthYear = date('m/Y');
    }

    // Standardize month & year search pattern
    // e.g. "09/2026" or "2026-09"
    $parts = explode('/', str_replace('-', '/', $selectedMonthYear));
    if (count($parts) === 2) {
        if (strlen($parts[0]) === 4) {
            $yearStr = $parts[0];
            $monthStr = str_pad($parts[1], 2, '0', STR_PAD_LEFT);
        } else {
            $monthStr = str_pad($parts[0], 2, '0', STR_PAD_LEFT);
            $yearStr = $parts[1];
        }
    } else {
        $monthStr = date('m');
        $yearStr = date('Y');
    }

    // Fetch all stylists (exclude 'any')
    $stylists = $pdo->query("SELECT * FROM stylists WHERE isAny = 0 ORDER BY FIELD(level, 'Master', 'Senior', 'Junior'), name ASC")->fetchAll();

    // Fetch all completed appointments
    $apps = $pdo->query("SELECT * FROM appointments WHERE status = 'Completed'")->fetchAll();

    $report = [];
    $totalSalonRevenue = 0;
    $totalSalonCommission = 0;
    $totalSalonBaseSalary = 0;
    $totalSalonPayout = 0;
    $totalCompletedApps = 0;

    foreach ($stylists as $st) {
        $stName = $st['name'];
        $stLevel = $st['level'] ?? 'Senior';
        $baseSalary = intval($st['baseSalary'] ?? 8000000);

        $stCompletedApps = [];
        $stRevenue = 0;
        $stCommission = 0;

        foreach ($apps as $a) {
            if ($a['stylist'] !== $stName) continue;

            // Date filtering check: e.g. "05/09/2026" or "Hôm nay" (if today is in month)
            $aDate = $a['date'] ?? '';
            $isMatch = false;

            if (strpos($aDate, 'Hôm nay') !== false) {
                if (date('m') === $monthStr && date('Y') === $yearStr) {
                    $isMatch = true;
                }
            } else if (preg_match('/(\d{1,2})\/(\d{1,2})\/(\d{4})/', $aDate, $m)) {
                $appM = str_pad($m[2], 2, '0', STR_PAD_LEFT);
                $appY = $m[3];
                if ($appM === $monthStr && $appY === $yearStr) {
                    $isMatch = true;
                }
            } else {
                // Default match if no specific date format block
                $isMatch = true;
            }

            if ($isMatch) {
                // Decode services if needed
                if (!is_array($a['services'])) {
                    $decoded = json_decode($a['services'], true);
                    $a['services'] = is_array($decoded) ? $decoded : [$a['services']];
                }

                $commInfo = calculate_appointment_commission($a, $st);
                $a['commissionInfo'] = $commInfo;

                $stCompletedApps[] = $a;
                $stRevenue += intval($a['totalPrice'] ?? 0);
                $stCommission += $commInfo['totalCommission'];
            }
        }

        $totalEarnings = $baseSalary + $stCommission;

        $totalSalonRevenue += $stRevenue;
        $totalSalonCommission += $stCommission;
        $totalSalonBaseSalary += $baseSalary;
        $totalSalonPayout += $totalEarnings;
        $totalCompletedApps += count($stCompletedApps);

        $report[] = [
            'stylist' => $st,
            'completedCount' => count($stCompletedApps),
            'revenue' => $stRevenue,
            'baseSalary' => $baseSalary,
            'commission' => $stCommission,
            'totalPayout' => $totalEarnings,
            'appointments' => $stCompletedApps
        ];
    }

    return [
        'monthYear' => $monthStr . '/' . $yearStr,
        'summary' => [
            'totalCompletedCount' => $totalCompletedApps,
            'totalSalonRevenue' => $totalSalonRevenue,
            'totalSalonCommission' => $totalSalonCommission,
            'totalSalonBaseSalary' => $totalSalonBaseSalary,
            'totalSalonPayout' => $totalSalonPayout
        ],
        'stylistsReport' => $report
    ];
}

