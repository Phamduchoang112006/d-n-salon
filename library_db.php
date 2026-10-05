<?php
// ============================================================
// HỆ THỐNG QUẢN LÝ THƯ VIỆN & TIỆM THUÊ TRUYỆN ENTERPRISE 5.0
// Database Connection & Full Content Seeder Module (25+ Đầu Sách & Truyện)
// Nhóm: Nguyễn Đăng Khải (Leader), Nguyễn Nhật Linh Ân, Phan Duy
// ============================================================

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

define('LIB_DB_TYPE', 'mysql');
define('LIB_MYSQL_HOST', '127.0.0.1');
define('LIB_MYSQL_PORT', '3306');
define('LIB_MYSQL_DB', 'thuvien_db');
define('LIB_MYSQL_USER', 'root');
define('LIB_MYSQL_PASS', '');

define('LIB_SQLITE_FILE', __DIR__ . '/data/library_enterprise_v5.sqlite');

function get_lib_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    if (LIB_DB_TYPE === 'mysql') {
        try {
            $dsn = 'mysql:host=' . LIB_MYSQL_HOST . ';port=' . LIB_MYSQL_PORT . ';dbname=' . LIB_MYSQL_DB . ';charset=utf8mb4';
            $pdo = new PDO($dsn, LIB_MYSQL_USER, LIB_MYSQL_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch (PDOException $e) {
            // SQLite Fallback
        }
    }

    $dir = dirname(LIB_SQLITE_FILE);
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $need_init = !file_exists(LIB_SQLITE_FILE);

    $pdo = new PDO('sqlite:' . LIB_SQLITE_FILE);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    init_sqlite_enterprise_tables($pdo);
    return $pdo;
}

function init_sqlite_enterprise_tables($pdo) {
    $queries = [
        "CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password_hash TEXT,
            full_name TEXT,
            email TEXT,
            role TEXT DEFAULT 'Quản trị viên',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS authors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ten_tac_gia TEXT UNIQUE,
            tieu_su TEXT,
            quoc_tich TEXT DEFAULT 'Nhật Bản',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_danh_muc TEXT UNIQUE,
            ten_danh_muc TEXT,
            mo_ta TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_sach TEXT UNIQUE,
            isbn TEXT,
            ten_sach TEXT,
            tac_gia TEXT,
            author_id INTEGER,
            category_id INTEGER,
            nha_xuat_ban TEXT,
            nam_xuat_ban INTEGER,
            gia_bia REAL DEFAULT 50000.00,
            ty_le_coc INTEGER DEFAULT 80,
            gia_thue_ngay REAL DEFAULT 3000.00,
            hinh_thuc TEXT DEFAULT 'Thuê lẻ',
            so_luong INTEGER DEFAULT 10,
            co_san INTEGER DEFAULT 8,
            hinh_anh TEXT,
            tu_ke_kho TEXT DEFAULT 'Kệ Manga-A1',
            ngon_ngu TEXT DEFAULT 'Tiếng Việt',
            mo_ta TEXT,
            luot_muon INTEGER DEFAULT 12,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS physical_copies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            barcode TEXT UNIQUE,
            tu_ke_kho TEXT DEFAULT 'Kệ A1-Tủ 01',
            tinh_trang_hao_mon TEXT DEFAULT 'Mới 99%',
            so_lan_thue INTEGER DEFAULT 0,
            trang_thai TEXT DEFAULT 'Có sẵn',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS readers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_doc_gia TEXT UNIQUE,
            ho_ten TEXT,
            email TEXT UNIQUE,
            so_dien_thoai TEXT,
            mat_khau_hash TEXT DEFAULT '123456',
            dia_chi TEXT,
            ngay_cap TEXT,
            han_the TEXT,
            so_du_vi REAL DEFAULT 500000.00,
            tien_coc_dong_bang REAL DEFAULT 0.00,
            xac_minh_kyc TEXT DEFAULT 'Đã xác minh eKYC',
            loai_doc_gia TEXT DEFAULT 'Thường',
            trang_thai TEXT DEFAULT 'Hoạt động',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS rental_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_don TEXT UNIQUE,
            reader_id INTEGER,
            ngay_bat_dau DATE,
            ngay_ket_thuc DATE,
            ngay_tra_thuc_te DATE,
            phuong_thuc_nhan TEXT DEFAULT 'Giao tận nơi',
            tong_tien_thue REAL DEFAULT 0.00,
            tong_tien_coc REAL DEFAULT 0.00,
            tien_coc_da_hoan REAL DEFAULT 0.00,
            tien_phat REAL DEFAULT 0.00,
            so_lan_gia_han INTEGER DEFAULT 0,
            trang_thai TEXT DEFAULT 'Đang mượn',
            ghi_chu TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS rental_order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER,
            physical_copy_id INTEGER,
            tien_coc_item REAL,
            tien_thue_item REAL,
            tinh_trang_khi_tra TEXT DEFAULT 'Chưa trả'
        );",
        "CREATE TABLE IF NOT EXISTS wallet_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_id INTEGER,
            ma_giao_dich TEXT UNIQUE,
            loai_giao_dich TEXT,
            so_tien REAL,
            mo_ta TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS inventory_locks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            physical_copy_id INTEGER UNIQUE,
            reader_id INTEGER,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS manga_services (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            freelancer_name TEXT,
            freelancer_avatar TEXT,
            freelancer_badge TEXT DEFAULT 'Top Rated',
            rating_score REAL DEFAULT 4.9,
            review_count INTEGER DEFAULT 85,
            title TEXT,
            category_tag TEXT DEFAULT 'Vẽ Manga',
            portfolio_image TEXT,
            delivery_days INTEGER DEFAULT 2,
            starting_price REAL DEFAULT 150000.00,
            price_basic REAL DEFAULT 150000.00,
            price_standard REAL DEFAULT 350000.00,
            price_premium REAL DEFAULT 800000.00,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS manga_service_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_don_ve TEXT UNIQUE,
            reader_id INTEGER,
            service_id INTEGER,
            package_tier TEXT DEFAULT 'Gói Tiêu Chuẩn',
            so_tien REAL,
            yeu_cau_chi_tiet TEXT,
            trang_thai TEXT DEFAULT 'Đang thực hiện',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS book_reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            reader_id INTEGER,
            reader_name TEXT,
            rating_stars INTEGER DEFAULT 5,
            comment_text TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS book_reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ma_giu_cho TEXT UNIQUE,
            book_id INTEGER,
            reader_id INTEGER,
            ngay_dat DATE,
            trang_thai TEXT DEFAULT 'Đang giữ chỗ',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS digital_documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            file_pdf_url TEXT,
            mo_ta TEXT,
            min_role_download TEXT DEFAULT 'VIP Gold',
            view_count INTEGER DEFAULT 128,
            download_count INTEGER DEFAULT 45,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS library_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ten_su_kien TEXT,
            dia_diem TEXT,
            thoi_gian DATETIME,
            dien_gia TEXT,
            hinh_anh TEXT,
            mo_ta TEXT,
            so_luong_ve INTEGER DEFAULT 100,
            da_dang_ky INTEGER DEFAULT 42,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS event_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_id INTEGER,
            reader_id INTEGER,
            ho_ten TEXT,
            email TEXT,
            so_dien_thoai TEXT,
            trang_thai TEXT DEFAULT 'Đã xác nhận',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS book_donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_id INTEGER,
            nguoi_quyen_gop TEXT,
            email TEXT,
            so_dien_thoai TEXT,
            ten_sach_tang TEXT,
            tac_gia TEXT,
            so_luong INTEGER DEFAULT 1,
            tinh_trang_sach TEXT DEFAULT 'Mới 90%',
            trang_thai TEXT DEFAULT 'Chờ xét duyệt',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS user_notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_id INTEGER,
            title TEXT,
            message TEXT,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );",
        "CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_id INTEGER,
            sender_type TEXT DEFAULT 'reader',
            message_text TEXT,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );"
    ];

    foreach ($queries as $q) {
        $pdo->exec($q);
    }

    try { $pdo->exec("ALTER TABLE readers ADD COLUMN ngay_cap TEXT"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE readers ADD COLUMN han_the TEXT"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE books ADD COLUMN isbn TEXT"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE books ADD COLUMN ngon_ngu TEXT DEFAULT 'Tiếng Việt'"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE books ADD COLUMN mo_ta TEXT"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE books ADD COLUMN luot_muon INTEGER DEFAULT 12"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE user_notifications ADD COLUMN title TEXT"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE user_notifications ADD COLUMN message TEXT"); } catch (Exception $e) {}

    // Seed Admins
    if ($pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn() == 0) {
        $hash123 = password_hash('123456', PASSWORD_BCRYPT);
        $stmt_adm = $pdo->prepare("INSERT INTO admins (username, password_hash, full_name, email, role) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)");
        $stmt_adm->execute([
            'admin', $hash123, 'Nguyễn Đăng Khải', 'admin@thuvien.edu.vn', 'Quản trị viên',
            'thuthu', $hash123, 'Nguyễn Nhật Linh Ân', 'thuthu@thuvien.edu.vn', 'Thủ thư'
        ]);
    }

    // Seed Authors
    if ($pdo->query("SELECT COUNT(*) FROM authors")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO authors (ten_tac_gia, tieu_su, quoc_tich) VALUES
            ('Fujiko F. Fujio', 'Tác giả huyền thoại sáng tạo ra bộ truyện Doraemon', 'Nhật Bản'),
            ('Gosho Aoyama', 'Tác giả nổi tiếng bộ truyện Thám tử lừng danh Conan', 'Nhật Bản'),
            ('Akira Toriyama', 'Cha đẻ bộ truyện Bảy viên ngọc rồng (Dragon Ball)', 'Nhật Bản'),
            ('Eiichiro Oda', 'Tác giả bộ manga bán chạy nhất thế giới One Piece', 'Nhật Bản'),
            ('J.K. Rowling', 'Nữ nhà văn Anh Quốc sáng tạo thế giới Harry Potter', 'Anh Quốc'),
            ('Nguyễn Nhật Ánh', 'Nhà văn tài hoa nổi tiếng của thiếu nhi Việt Nam', 'Việt Nam'),
            ('Robert C. Martin', 'Chuyên gia phần mềm sáng lập phong trào Clean Code', 'Mỹ'),
            ('Dale Carnegie', 'Tác giả cuốn sách sinh tồn tâm lý Đắc Nhân Tâm', 'Mỹ');");
    }

    // Seed Categories
    if ($pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO categories (ma_danh_muc, ten_danh_muc, mo_ta) VALUES
            ('DM01', 'Truyện Tranh & Manga', 'Truyện tranh Nhật Bản, Manga, Comic kinh điển'),
            ('DM02', 'Tiểu Thuyết & Trinh Thám', 'Harry Potter, Sherlock Holmes, Nguyễn Nhật Ánh'),
            ('DM03', 'Công Nghệ & Lập Trình', 'Clean Code, ReactJS, PHP MySQL, Data Structure'),
            ('DM04', 'Sách Kỹ Năng & Kinh Tế', 'Cha Giàu Cha Nghèo, Đắc Nhân Tâm, Hạt Giống Tâm Hồn');");
    }

    // Seed 40+ Rich Books & Manga with Unique Cover Art
    if ($pdo->query("SELECT COUNT(*) FROM books")->fetchColumn() < 30) {
        $pdo->exec("DELETE FROM books;");
        $pdo->exec("INSERT INTO books (ma_sach, ten_sach, tac_gia, category_id, nha_xuat_ban, nam_xuat_ban, gia_bia, ty_le_coc, gia_thue_ngay, hinh_thuc, so_luong, co_san, hinh_anh, mo_ta) VALUES
            ('TT001', 'Doraemon - Tập 1: Chú Mèo Máy Đến Từ Tương Lai', 'Fujiko F. Fujio', 1, 'NXB Kim Đồng', 2023, 25000.00, 80, 2000.00, 'Thuê lẻ', 15, 12, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400', 'Bộ truyện tranh thiếu nhi kinh điển của Nhật Bản về chú mèo máy thông minh Doraemon.'),
            ('TT002', 'Thám Tử Lừng Danh Conan - Tập 100', 'Gosho Aoyama', 1, 'NXB Kim Đồng', 2023, 30000.00, 80, 3000.00, 'Thuê lẻ', 20, 16, 'https://images.unsplash.com/photo-1618663938039-b33024897776?w=400', 'Hành trình phá án kỳ kịch của thám tử học sinh Kudo Shinichi bị teo nhỏ thành Conan.'),
            ('TT003', 'Dragon Ball - Bảy Viên Ngọc Rồng Tập 1', 'Akira Toriyama', 1, 'NXB Kim Đồng', 2022, 28000.00, 80, 2500.00, 'Combo bộ', 12, 9, 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400', 'Hành trình tầm ngọc và tập luyện võ thuật phi thường của Son Goku.'),
            ('TT004', 'One Piece - Đảo Hải Tặc Tập 101', 'Eiichiro Oda', 1, 'NXB Kim Đồng', 2023, 32000.00, 80, 3000.00, 'Combo bộ', 18, 14, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400', 'Hành trình chinh phục đại hải trình vĩ đại của thuyền trưởng Monkey D. Luffy.'),
            ('TT005', 'Naruto - Huyền Thoại Làng Lá Tập 1', 'Masashi Kishimoto', 1, 'NXB Kim Đồng', 2021, 25000.00, 80, 2500.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', 'Câu chuyện cảm động về sự nỗ lực vươn lên thành Hokage của nhẫn giả Naruto.'),
            ('TT006', 'Jujutsu Kaisen - Chú Thuật Hồi Chiến Tập 1', 'Gege Akutami', 1, 'NXB Kim Đồng', 2023, 35000.00, 80, 3500.00, 'Thuê lẻ', 12, 10, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400', 'Trận chiến trừ tà đầy kịch tính giữa các chú thuật sư và nguyền hồn nguy hiểm.'),
            ('TT007', 'Demon Slayer - Thanh Gươm Diệt Quỷ Tập 1', 'Koyoharu Gotouge', 1, 'NXB Kim Đồng', 2022, 30000.00, 80, 3000.00, 'Thuê lẻ', 14, 11, 'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400', 'Cuộc phiêu lưu dũng cảm cứu em gái Nezuko của kiếm sĩ Tanjiro Kamado.'),
            ('TT008', 'Spy x Family - Gia Đình Điệp Viên Tập 1', 'Tatsuya Endo', 1, 'NXB Kim Đồng', 2023, 35000.00, 80, 3500.00, 'Thuê lẻ', 10, 9, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400', 'Gia đình hờ gồm điệp viên Loid, sát thủ Yor và bé Anya đọc suy nghĩ siêu hài hước.'),
            ('TT009', 'Attack on Titan - Đại Chiến Titan Tập 1', 'Hajime Isayama', 1, 'NXB Trẻ', 2021, 35000.00, 80, 3500.00, 'Thuê lẻ', 15, 12, 'https://images.unsplash.com/photo-1569701812189-80766a623707?w=400', 'Trận chiến sống còn bảo vệ bức tường cuối cùng của nhân loại trước loài sinh vật khổng lồ.'),
            ('TT010', 'Chainsaw Man - Thợ Săn Quỷ Tập 1', 'Tatsuki Fujimoto', 1, 'NXB Kim Đồng', 2023, 38000.00, 80, 3800.00, 'Thuê lẻ', 12, 10, 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400', 'Hành trình giật dây cưa máy diệt quỷ phi thường của chàng trai trẻ Denji.'),
            ('TT011', 'My Hero Academia - Học Viện Siêu Anh Hùng 1', 'Kohei Horikoshi', 1, 'NXB Kim Đồng', 2022, 30000.00, 80, 3000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=400', 'Thế giới nơi 80% con người sở hữu siêu năng lực và giấc mơ trở thành anh hùng của Midoriya.'),
            ('TT012', 'Tokyo Revengers - Đội Tiên Phong Tập 1', 'Ken Wakui', 1, 'NXB Kim Đồng', 2022, 32000.00, 80, 3000.00, 'Thuê lẻ', 14, 11, 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400', 'Cú du hành thời gian 12 năm trở về quá khứ cứu sống bạn gái của Takemichi.'),

            ('NO001', 'Harry Potter Và Hòn Đá Phù Thủy', 'J.K. Rowling', 2, 'NXB Trẻ', 2021, 150000.00, 80, 6000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400', 'Bộ tiểu thuyết huyền bí khám phá trường đào tạo phù thủy Hogwarts kỳ diệu.'),
            ('NO002', 'Sherlock Holmes - Cậu Bé Trinh Thám', 'Arthur Conan Doyle', 2, 'NXB Văn Học', 2021, 120000.00, 80, 5000.00, 'Thuê lẻ', 8, 6, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 'Những vụ án hóc húa được giải mã bằng phương pháp suy luận diễn dịch thiên tài của Sherlock Holmes.'),
            ('NO003', 'Mắt Biếc', 'Nguyễn Nhật Ánh', 2, 'NXB Trẻ', 2020, 110000.00, 80, 4500.00, 'Thuê lẻ', 12, 10, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'Mối tình si dịu dàng và da diết của Ngạn dành cho Hà Lan tại làng Đo Đo.'),
            ('NO004', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 2, 'NXB Trẻ', 2022, 125000.00, 80, 5000.00, 'Thuê lẻ', 15, 13, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 'Ký ức tuổi thơ tươi đẹp miền quê với tình anh em Thiều và Tường đầy xúc động.'),
            ('NO005', 'Nhà Giả Kim', 'Paulo Coelho', 2, 'NXB Hội Nhà Văn', 2021, 95000.00, 80, 4000.00, 'Thuê lẻ', 16, 14, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400', 'Hành trình đi tìm kho báu của chàng chăn cừu Santiago giúp thức tỉnh ước mơ cuộc đời.'),
            ('NO006', 'Án Mạng Trên Chuyến Tàu Tốc Hành Phương Đông', 'Agatha Christie', 2, 'NXB Trẻ', 2022, 130000.00, 80, 5500.00, 'Thuê lẻ', 9, 7, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400', 'Vụ án ly kỳ trên chuyến tàu Orient Express với sự tham gia của thám tử Hercule Poirot.'),
            ('NO007', 'Bố Già (The Godfather)', 'Mario Puzo', 2, 'NXB Văn Học', 2020, 165000.00, 80, 6500.00, 'Thuê lẻ', 11, 9, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'Kiệt tác văn học thế giới khắc họa thế giới ngầm mafia Ý tại nước Mỹ.'),
            ('NO008', 'Rừng Na Uy (Norwegian Wood)', 'Haruki Murakami', 2, 'NXB Hội Nhà Văn', 2021, 140000.00, 80, 6000.00, 'Thuê lẻ', 13, 10, 'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400', 'Cuốn tiểu thuyết lãng mạn khắc họa nỗi cô đơn và tình yêu của thanh xuân Nhật Bản.'),
            ('NO009', 'Không Gia Đình (Sans Famille)', 'Hector Malot', 2, 'NXB Văn Học', 2021, 135000.00, 80, 5500.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 'Hành trình bôn ba vất vả nhưng kiên cường của cậu bé mồ côi Remi.'),
            ('NO010', 'Hoàng Tử Bé (Le Petit Prince)', 'Antoine de Saint-Exupéry', 2, 'NXB Kim Đồng', 2023, 85000.00, 80, 3500.00, 'Thuê lẻ', 20, 17, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 'Cuốn sách triết lý sống nhẹ nhàng và sâu sắc dành cho cả trẻ em lẫn người lớn.'),

            ('MS001', 'Clean Code: Mã Sạch & Nghệ Thuật Lập Trình', 'Robert C. Martin', 3, 'Prentice Hall', 2020, 220000.00, 80, 8000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 'Tác phẩm gối đầu giường của lập trình viên về nguyên tắc viết mã sạch, dễ bảo trì.'),
            ('MS002', 'Lập Trình Web Với ReactJS & Node.js', 'Nguyễn Văn A', 3, 'NXB Thống Kê', 2023, 180000.00, 80, 7000.00, 'Thuê lẻ', 12, 10, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 'Hướng dẫn xây dựng ứng dụng Fullstack hiện đại với React hooks và Express REST API.'),
            ('MS003', 'Lập Trình PHP & MySQL Chuyên Nghiệp', 'Trần Thị B', 3, 'NXB Lao Động', 2022, 160000.00, 80, 6000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=400', 'Giáo trình toàn diện về phát triển web động PHP8 và quản trị CSDL MySQL.'),
            ('MS004', 'The Pragmatic Programmer', 'Andrew Hunt', 3, 'Addison-Wesley', 2021, 250000.00, 80, 9000.00, 'Thuê lẻ', 8, 6, 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400', 'Những lời khuyên thực tế vô giá giúp bạn trở thành lập trình viên lành nghề.'),
            ('MS005', 'Design Patterns: Reusable Object-Oriented', 'Erich Gamma', 3, 'Addison-Wesley', 2020, 280000.00, 80, 9500.00, 'Thuê lẻ', 7, 5, 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400', '23 mẫu thiết kế phần mềm hướng đối tượng kinh điển của Gang of Four.'),
            ('MS006', 'Clean Architecture: Software Structure', 'Robert C. Martin', 3, 'Prentice Hall', 2021, 240000.00, 80, 8500.00, 'Thuê lẻ', 9, 7, 'https://images.unsplash.com/photo-1516116211223-4c71414e21b2?w=400', 'Tổ chức các lớp phần mềm độc lập framework, tách biệt quy tắc nghiệp vụ.'),
            ('MS007', 'Introduction to Algorithms (CLRS)', 'Thomas H. Cormen', 3, 'MIT Press', 2020, 320000.00, 80, 10000.00, 'Thuê lẻ', 6, 4, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', 'Kinh thánh về giải thuật và cấu trúc dữ liệu giảng dạy tại các trường ĐH hàng đầu.'),
            ('MS008', 'System Design Interview – An Insider''s Guide', 'Alex Xu', 3, 'ByteByteGo', 2022, 290000.00, 80, 9500.00, 'Thuê lẻ', 11, 9, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', 'Hướng dẫn thiết kế hệ thống lớn scaled millions users như YouTube, Messenger, Uber.'),

            ('SK001', 'Đắc Nhân Tâm', 'Dale Carnegie', 4, 'NXB Tổng Hợp TPHCM', 2021, 98000.00, 80, 4000.00, 'Thuê lẻ', 20, 16, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400', 'Nghệ thuật ứng xử thu phục lòng người và xây dựng mối quan hệ bền vững.'),
            ('SK002', 'Cha Giàu Cha Nghèo', 'Robert Kiyosaki', 4, 'NXB Trẻ', 2022, 135000.00, 80, 5000.00, 'Thuê lẻ', 15, 12, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400', 'Bài học tự do tài chính, tư duy đầu tư và quản lý tài sản cá nhân.'),
            ('SK003', 'Tuổi Trẻ Đáng Giá Bao Nhiêu?', 'Rosie Nguyễn', 4, 'NXB Hội Nhà Văn', 2022, 115000.00, 80, 4500.00, 'Thuê lẻ', 18, 15, 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400', 'Cuốn sách truyền cảm hứng học tập, trải nghiệm và định hướng tương lai tuổi trẻ.'),
            ('SK004', 'Tư Duy Nhanh Và Chậm (Thinking Fast & Slow)', 'Daniel Kahneman', 4, 'NXB Thế Giới', 2021, 190000.00, 80, 7000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', 'Khám phá hai hệ thống tư duy chi phối mọi quyết định trong tâm lý học con người.'),
            ('SK005', 'Thói Quen Nguyên Tử (Atomic Habits)', 'James Clear', 4, 'NXB Thế Giới', 2022, 168000.00, 80, 6000.00, 'Thuê lẻ', 14, 11, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 'Phương pháp thay đổi 1% mỗi ngày tạo nên những kết quả đột phá đáng kinh ngạc.'),
            ('SK006', 'Tâm Lý Học Về Tiền (The Psychology of Money)', 'Morgan Housel', 4, 'NXB Trẻ', 2022, 150000.00, 80, 5500.00, 'Thuê lẻ', 12, 10, 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400', '19 câu chuyện ngắn kỳ diệu về cách con người suy nghĩ và đối xử với tiền bạc.'),
            ('SK007', 'Hạt Giống Tâm Hồn - Tập 1', 'Jack Canfield', 4, 'NXB Tổng Hợp TPHCM', 2021, 85000.00, 80, 3500.00, 'Thuê lẻ', 16, 13, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 'Những câu chuyện cảm động bồi đắp lòng nhân ái, nghị lực và tình yêu cuộc sống.'),
            ('SK008', 'Sức Mạnh Của Hiện Tại (The Power of Now)', 'Eckhart Tolle', 4, 'NXB Phụ Nữ', 2022, 145000.00, 80, 5000.00, 'Thuê lẻ', 10, 8, 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400', 'Giải thoát tâm trí khỏi lo âu quá khứ và tương lai để sống trọn vẹn từng khoảnh khắc.');");
    }

    // Seed Manga Freelancer Services (Fastlance Style)
    if ($pdo->query("SELECT COUNT(*) FROM manga_services")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO manga_services (freelancer_name, freelancer_avatar, freelancer_badge, rating_score, review_count, title, category_tag, portfolio_image, delivery_days, starting_price, price_basic, price_standard, price_premium, description) VALUES
            ('KuroNeko Studio', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'Top Rated Seller', 5.0, 142, 'Vẽ Truyện Tranh Manga & Webtoon Theo Yêu Cầu Phong Cách Chuẩn Nhật Bản', 'Vẽ Manga', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600', 3, 200000.00, 200000.00, 450000.00, 950000.00, 'Nhận thiết kế trang truyện tranh Manga kịch bản có sẵn. Đảm bảo góc quay sinh động, đổ bóng chi tiết, xuất file 300DPI in ấn.'),
            ('Họa Sĩ Linh Ân', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'Verified Pro', 4.9, 98, 'Thiết Kế Nhân Vật Anime / Chibi 2D Chuyên Nghiệp Cho Webtoon & Game', 'Vẽ Anime/Chibi', 'https://images.unsplash.com/photo-1618663938039-b33024897776?w=600', 2, 150000.00, 150000.00, 300000.00, 650000.00, 'Tạo hình nhân vật độc quyền kèm 3 biểu cảm cảm xúc (Vui, Giận, Khóc). File vector hoặc PNG tách nền rõ nét.'),
            ('Phan Duy Manga Art', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'Fast Delivery', 4.8, 64, 'Vẽ Minh Họa Bìa Light Novel / Manga Độc Bản Màu Sắc Rực Rỡ', 'Minh Họa Bìa', 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600', 1, 350000.00, 350000.00, 600000.00, 1200000.00, 'Vẽ bìa sách, bìa truyện tranh 4K màu kỹ thuật số. Bao gồm thiết kế Typography tiêu đề nghệ thuật.'),
            ('Sakura Manga Team', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'Top Rated Seller', 5.0, 210, 'Vẽ Lineart & Đổ Màu Manga Trọn Bộ Nhiều Trang Theo Yêu Cầu', 'Vẽ Manga', 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600', 4, 180000.00, 180000.00, 400000.00, 850000.00, 'Chuyên lineart sắc nét và tô màu phong cách Shonen/Shojo. Miễn phí chỉnh sửa 3 lần.'),
            ('Đăng Khải Comic', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Verified Pro', 4.9, 115, 'Chuyển Thể Kịch Bản Văn Học Thành Comic / Webtoon Màu Sắc Hiện Đại', 'Vẽ Webtoon', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600', 3, 250000.00, 250000.00, 500000.00, 1100000.00, 'Biến câu chuyện văn học thành từng khung hình webtoon cuộn dọc tối ưu đọc trên điện thoại thông minh.');");
    }

    // Seed Physical Copies
    if ($pdo->query("SELECT COUNT(*) FROM physical_copies")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO physical_copies (book_id, barcode, tu_ke_kho, tinh_trang_hao_mon, so_lan_thue, trang_thai) VALUES
            (1, 'BC-DORA-001', 'Kệ Manga-A1', 'Mới 99%', 2, 'Có sẵn'),
            (1, 'BC-DORA-002', 'Kệ Manga-A1', 'Khá', 8, 'Có sẵn'),
            (2, 'BC-CONAN-001', 'Kệ Manga-A2', 'Mới 99%', 1, 'Đang cho thuê'),
            (3, 'BC-DRAGON-001', 'Kệ Manga-A3', 'Mới 99%', 4, 'Có sẵn'),
            (4, 'BC-ONEPIECE-001', 'Kệ Manga-A4', 'Mới 99%', 5, 'Có sẵn'),
            (9, 'BC-HARRY-001', 'Kệ Novel-B1', 'Mới 99%', 3, 'Có sẵn'),
            (14, 'BC-CLEAN-001', 'Kệ CNTT-C1', 'Mới 99%', 0, 'Có sẵn');");
    }

    // Seed Readers
    if ($pdo->query("SELECT COUNT(*) FROM readers")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO readers (ma_doc_gia, ho_ten, email, so_dien_thoai, mat_khau_hash, dia_chi, so_du_vi, tien_coc_dong_bang, loai_doc_gia) VALUES
            ('DG001', 'Nguyễn Đăng Khải', 'khainguyen@gmail.com', '0905123456', '123456', 'Đà Nẵng', 850000.00, 24000.00, 'VIP Gold'),
            ('DG002', 'Nguyễn Nhật Linh Ân', 'anlinh@gmail.com', '0905234567', '123456', 'Đà Nẵng', 500000.00, 0.00, 'Sinh viên'),
            ('DG003', 'Phan Duy', 'duyphan@gmail.com', '0905345678', '123456', 'Đà Nẵng', 450000.00, 0.00, 'Sinh viên');");
    }

    if ($pdo->query("SELECT COUNT(*) FROM rental_orders")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO rental_orders (ma_don, reader_id, ngay_bat_dau, ngay_ket_thuc, tong_tien_thue, tong_tien_coc, trang_thai) VALUES
            ('RENT-8801', 1, '2026-09-01', '2026-09-15', 42000.00, 24000.00, 'Đang mượn');");
    }

    if ($pdo->query("SELECT COUNT(*) FROM wallet_transactions")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO wallet_transactions (reader_id, ma_giao_dich, loai_giao_dich, so_tien, mo_ta) VALUES
            (1, 'WT-1001', 'Nạp tiền', 1000000.00, 'Nạp tiền qua VietQR'),
            (1, 'WT-1002', 'Đóng băng cọc', 24000.00, 'Đóng băng tiền cọc đơn RENT-8801');");
    }

    // Seed Digital Documents (E-Library PDF)
    if ($pdo->query("SELECT COUNT(*) FROM digital_documents")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO digital_documents (book_id, file_pdf_url, mo_ta, min_role_download, view_count, download_count) VALUES
            (14, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Ebook mã nguồn mở Clean Code: Mã sạch và nghệ thuật lập trình phần mềm', 'VIP Gold', 420, 185),
            (15, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Giáo trình Lập trình Web với ReactJS & Node.js Enterprise 2026', 'Sinh viên', 310, 95),
            (18, 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'Sách E-Pub & PDF Đắc Nhân Tâm - Nghệ thuật thu phục lòng người', 'Tất cả', 890, 520);");
    }

    // Seed Library Events
    if ($pdo->query("SELECT COUNT(*) FROM library_events")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO library_events (ten_su_kien, dia_diem, thoi_gian, dien_gia, hinh_anh, mo_ta, so_luong_ve, da_dang_ky) VALUES
            ('Hội Sách Mùa Xuân 2026 & Triển Lãm Manga Bản Quyền', 'Hội trường Lớn - Thư viện Trung tâm', '2026-04-15 08:30:00', 'BTV NXB Kim Đồng & Họa sĩ Manga', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600', 'Sự kiện giao lưu văn hóa đọc truyện tranh Nhật Bản, tặng 500 quà tặng manga và trải nghiệm đọc thử miễn phí.', 200, 145),
            ('Workshop: Nghệ Thuật Lập Trình Clean Code & Architecture 2026', 'Phòng Chuyên đề CNTT - Tầng 3', '2026-04-20 14:00:00', 'Nguyễn Đăng Khải (Senior Architect)', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600', 'Buổi chia sẻ kiến thức thiết kế hệ thống phần mềm quy mô lớn, tái cấu trúc mã nguồn và tối ưu CSDL.', 100, 88);");
    }

    // Seed Book Donations
    if ($pdo->query("SELECT COUNT(*) FROM book_donations")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO book_donations (reader_id, nguoi_quyen_gop, email, so_dien_thoai, ten_sach_tang, tac_gia, so_luong, tinh_trang_sach, trang_thai) VALUES
            (1, 'Nguyễn Đăng Khải', 'khainguyen@gmail.com', '0905123456', 'Nhà Giả Kim (Bản cứng 2023)', 'Paulo Coelho', 2, 'Mới 98%', 'Chờ xét duyệt'),
            (2, 'Nguyễn Nhật Linh Ân', 'anlinh@gmail.com', '0905234567', 'Lập Trình Web Với PHP & MySQL', 'Trần Thị B', 1, 'Mới 90%', 'Đã nhận vào kho');");
    }

    // Seed Chat Messages
    if ($pdo->query("SELECT COUNT(*) FROM chat_messages")->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO chat_messages (reader_id, sender_type, message_text, is_read) VALUES
            (1, 'reader', 'Xin chào Thủ thư! Cuốn Doraemon Tập 1 hiện còn ở kệ A1 không ạ?', 1),
            (1, 'admin', 'Chào bạn Đăng Khải! Sách Doraemon Tập 1 hiện đang còn 12 cuốn sẵn tại Kệ Manga-A1 nhé. Bạn có thể đến quầy mượn ngay!', 1),
            (1, 'reader', 'Dạ cảm ơn Thủ thư nhiều ạ!', 1),
            (2, 'reader', 'Dạ cho em hỏi phí thuê sách Clean Code là bao nhiêu 1 ngày ạ?', 0);");
    }

    auto_fix_book_covers($pdo);
}

function generate_svg_book_cover_data_uri($title, $author, $category_name) {
    $cleanTitle = htmlspecialchars($title ?? 'Sách Thư Viện', ENT_QUOTES, 'UTF-8');
    $cleanAuthor = htmlspecialchars($author ?? 'Tác giả', ENT_QUOTES, 'UTF-8');
    $cleanCat = htmlspecialchars($category_name ?? 'Thư Viện Số', ENT_QUOTES, 'UTF-8');

    $bgGrad = ['#3b82f6', '#1d4ed8'];
    $icon = '📖';
    $catBadge = 'THƯ VIỆN SỐ';

    if (mb_strpos($cleanCat, 'Manga', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'Truyện', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'Comic', 0, 'UTF-8') !== false) {
        $bgGrad = ['#ec4899', '#831843'];
        $icon = '🎨';
        $catBadge = 'MANGA & COMIC';
    } else if (mb_strpos($cleanCat, 'Công Nghệ', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'Lập Trình', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'IT', 0, 'UTF-8') !== false) {
        $bgGrad = ['#0f172a', '#0284c7'];
        $icon = '💻';
        $catBadge = 'CÔNG NGHỆ IT';
    } else if (mb_strpos($cleanCat, 'Kỹ Năng', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'Kinh Tế', 0, 'UTF-8') !== false) {
        $bgGrad = ['#10b981', '#047857'];
        $icon = '⚡';
        $catBadge = 'KỸ NĂNG & KINH TẾ';
    } else if (mb_strpos($cleanCat, 'Tiểu Thuyết', 0, 'UTF-8') !== false || mb_strpos($cleanCat, 'Trinh Thám', 0, 'UTF-8') !== false) {
        $bgGrad = ['#8b5cf6', '#4c1d95'];
        $icon = '🔍';
        $catBadge = 'TIỂU THUYẾT';
    }

    $words = explode(' ', $cleanTitle);
    $lines = [];
    $currentLine = '';
    foreach ($words as $word) {
        if (mb_strlen($currentLine . ' ' . $word, 'UTF-8') > 16) {
            if ($currentLine !== '') $lines[] = trim($currentLine);
            $currentLine = $word;
        } else {
            $currentLine .= ' ' . $word;
        }
    }
    if (trim($currentLine) !== '') $lines[] = trim($currentLine);
    $lines = array_slice($lines, 0, 4);

    $titleY = 200 - (count($lines) * 10);
    $titleXml = '';
    foreach ($lines as $idx => $line) {
        $y = $titleY + ($idx * 24);
        $titleXml .= '<text x="150" y="' . $y . '" fill="#ffffff" font-size="15" font-weight="bold" font-family="sans-serif" text-anchor="middle">' . $line . '</text>';
    }

    $gradId = 'grad_' . abs(crc32($cleanTitle));

    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
        <defs>
            <linearGradient id="bg_' . $gradId . '" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="' . $bgGrad[0] . '"/>
                <stop offset="100%" stop-color="' . $bgGrad[1] . '"/>
            </linearGradient>
            <linearGradient id="spine_' . $gradId . '" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
            </linearGradient>
        </defs>
        <rect width="300" height="420" rx="12" fill="url(#bg_' . $gradId . ')"/>
        <rect x="0" y="0" width="18" height="420" fill="url(#spine_' . $gradId . ')"/>
        <rect x="30" y="24" width="240" height="372" rx="8" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="2"/>
        <rect x="45" y="45" width="140" height="24" rx="12" fill="#ffffff" fill-opacity="0.2"/>
        <text x="115" y="61" fill="#ffffff" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle" letter-spacing="1">' . $catBadge . '</text>
        <text x="150" y="135" font-size="48" text-anchor="middle">' . $icon . '</text>
        ' . $titleXml . '
        <line x1="60" y1="340" x2="240" y2="340" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1"/>
        <text x="150" y="365" fill="#f8fafc" font-size="12" font-weight="600" font-family="sans-serif" text-anchor="middle">Tác giả: ' . mb_substr($cleanAuthor, 0, 24, 'UTF-8') . '</text>
        <text x="150" y="390" fill="#93c5fd" font-size="10" font-family="sans-serif" text-anchor="middle">★ THƯ VIỆN SỐ ENTERPRISE ★</text>
    </svg>';

    return 'data:image/svg+xml;base64,' . base64_encode($svg);
}

function auto_fix_book_covers($pdo) {
    $pdo->exec("UPDATE books SET hinh_anh = '' WHERE hinh_anh LIKE 'data:%' OR hinh_anh LIKE '%unsplash%';");
}

function lib_response($status, $message = '', $data = []) {
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode(array_merge([
        'status' => $status,
        'message' => $message,
        'data' => $data
    ]), JSON_UNESCAPED_UNICODE);
    exit;
}

