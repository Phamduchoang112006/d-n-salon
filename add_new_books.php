<?php
require 'library_db.php';
$db = get_lib_pdo();

// 1. Download covers for new books
$newBooks = [
    [
        'ma_sach' => 'BOOK-101',
        'ten_sach' => 'Conan - Tập 100: Trận Chiến Hoàng Gia',
        'tac_gia' => 'Gosho Aoyama',
        'category_id' => 1,
        'nha_xuat_ban' => 'NXB Kim Đồng',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 35000,
        'gia_thue_ngay' => 2000,
        'so_luong' => 15,
        'co_san' => 12,
        'luot_muon' => 240,
        'rating_score' => 4.9,
        'review_count' => 45,
        'tu_ke_kho' => 'Kệ M01-Tủ 02',
        'isbn' => '978-604-2-28001-1',
        'img_url' => 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80',
        'file_name' => 'cover_101.jpg'
    ],
    [
        'ma_sach' => 'BOOK-102',
        'ten_sach' => 'One Piece - Tập 105: Bình Minh Mới',
        'tac_gia' => 'Eiichiro Oda',
        'category_id' => 1,
        'nha_xuat_ban' => 'NXB Kim Đồng',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 38000,
        'gia_thue_ngay' => 2500,
        'so_luong' => 18,
        'co_san' => 15,
        'luot_muon' => 310,
        'rating_score' => 5.0,
        'review_count' => 62,
        'tu_ke_kho' => 'Kệ M01-Tủ 03',
        'isbn' => '978-604-2-28002-8',
        'img_url' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80',
        'file_name' => 'cover_102.jpg'
    ],
    [
        'ma_sach' => 'BOOK-103',
        'ten_sach' => 'Naruto - Tập 1: Cậu Bé Cáo Chín Đuôi',
        'tac_gia' => 'Masashi Kishimoto',
        'category_id' => 1,
        'nha_xuat_ban' => 'NXB Kim Đồng',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 32000,
        'gia_thue_ngay' => 2000,
        'so_luong' => 20,
        'co_san' => 16,
        'luot_muon' => 195,
        'rating_score' => 4.8,
        'review_count' => 38,
        'tu_ke_kho' => 'Kệ M02-Tủ 01',
        'isbn' => '978-604-2-28003-5',
        'img_url' => 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80',
        'file_name' => 'cover_103.jpg'
    ],
    [
        'ma_sach' => 'BOOK-104',
        'ten_sach' => 'Nhà Giả Kim (The Alchemist)',
        'tac_gia' => 'Paulo Coelho',
        'category_id' => 2,
        'nha_xuat_ban' => 'NXB Nhã Nam',
        'nam_xuat_ban' => 2022,
        'gia_bia' => 79000,
        'gia_thue_ngay' => 4000,
        'so_luong' => 12,
        'co_san' => 10,
        'luot_muon' => 450,
        'rating_score' => 4.9,
        'review_count' => 88,
        'tu_ke_kho' => 'Kệ T01-Tủ 01',
        'isbn' => '978-604-1-12004-2',
        'img_url' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
        'file_name' => 'cover_104.jpg'
    ],
    [
        'ma_sach' => 'BOOK-105',
        'ten_sach' => 'Cây Cam Ngọt Của Tôi',
        'tac_gia' => 'José Mauro de Vasconcelos',
        'category_id' => 2,
        'nha_xuat_ban' => 'NXB Hội Nhà Văn',
        'nam_xuat_ban' => 2022,
        'gia_bia' => 108000,
        'gia_thue_ngay' => 5000,
        'so_luong' => 10,
        'co_san' => 8,
        'luot_muon' => 520,
        'rating_score' => 5.0,
        'review_count' => 110,
        'tu_ke_kho' => 'Kệ T01-Tủ 02',
        'isbn' => '978-604-1-12005-9',
        'img_url' => 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
        'file_name' => 'cover_105.jpg'
    ],
    [
        'ma_sach' => 'BOOK-106',
        'ten_sach' => 'Mắt Biếc (Ấn Bản Kỷ Niệm)',
        'tac_gia' => 'Nguyễn Nhật Ánh',
        'category_id' => 2,
        'nha_xuat_ban' => 'NXB Trẻ',
        'nam_xuat_ban' => 2021,
        'gia_bia' => 110000,
        'gia_thue_ngay' => 5000,
        'so_luong' => 14,
        'co_san' => 11,
        'luot_muon' => 380,
        'rating_score' => 4.8,
        'review_count' => 74,
        'tu_ke_kho' => 'Kệ T02-Tủ 01',
        'isbn' => '978-604-1-12006-6',
        'img_url' => 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
        'file_name' => 'cover_106.jpg'
    ],
    [
        'ma_sach' => 'BOOK-107',
        'ten_sach' => 'Clean Code - Mã Sạch Nghệ Thuật Lập Trình',
        'tac_gia' => 'Robert C. Martin',
        'category_id' => 3,
        'nha_xuat_ban' => 'NXB Kỹ Thuật',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 210000,
        'gia_thue_ngay' => 9000,
        'so_luong' => 8,
        'co_san' => 6,
        'luot_muon' => 290,
        'rating_score' => 4.9,
        'review_count' => 52,
        'tu_ke_kho' => 'Kệ IT01-Tủ 01',
        'isbn' => '978-013-2-35088-4',
        'img_url' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&q=80',
        'file_name' => 'cover_107.jpg'
    ],
    [
        'ma_sach' => 'BOOK-108',
        'ten_sach' => 'Giáo Trình React Native & Expo Từ A-Z',
        'tac_gia' => 'Nguyễn Đăng Khải',
        'category_id' => 3,
        'nha_xuat_ban' => 'NXB ĐHQG Đà Nẵng',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 180000,
        'gia_thue_ngay' => 8000,
        'so_luong' => 16,
        'co_san' => 14,
        'luot_muon' => 410,
        'rating_score' => 5.0,
        'review_count' => 95,
        'tu_ke_kho' => 'Kệ IT01-Tủ 02',
        'isbn' => '978-604-8-00108-1',
        'img_url' => 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=80',
        'file_name' => 'cover_108.jpg'
    ],
    [
        'ma_sach' => 'BOOK-109',
        'ten_sach' => 'Thiết Kế Hệ Thống Phân Tán (System Design)',
        'tac_gia' => 'Alex Xu',
        'category_id' => 3,
        'nha_xuat_ban' => 'NXB Công Nghệ',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 250000,
        'gia_thue_ngay' => 10000,
        'so_luong' => 6,
        'co_san' => 5,
        'luot_muon' => 330,
        'rating_score' => 4.9,
        'review_count' => 48,
        'tu_ke_kho' => 'Kệ IT02-Tủ 01',
        'isbn' => '978-173-6-04910-5',
        'img_url' => 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
        'file_name' => 'cover_109.jpg'
    ],
    [
        'ma_sach' => 'BOOK-110',
        'ten_sach' => 'Dạy Con Làm Giàu - Tập 1: Để Có Tiền Tự Do',
        'tac_gia' => 'Robert Kiyosaki',
        'category_id' => 4,
        'nha_xuat_ban' => 'NXB Trẻ',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 115000,
        'gia_thue_ngay' => 5500,
        'so_luong' => 15,
        'co_san' => 12,
        'luot_muon' => 610,
        'rating_score' => 4.9,
        'review_count' => 120,
        'tu_ke_kho' => 'Kệ KN01-Tủ 01',
        'isbn' => '978-604-1-12110-0',
        'img_url' => 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=500&q=80',
        'file_name' => 'cover_110.jpg'
    ],
    [
        'ma_sach' => 'BOOK-111',
        'ten_sach' => 'Bí Mật Tư Duy Triệu Phú',
        'tac_gia' => 'T. Harv Eker',
        'category_id' => 4,
        'nha_xuat_ban' => 'NXB Thống Kê',
        'nam_xuat_ban' => 2023,
        'gia_bia' => 98000,
        'gia_thue_ngay' => 4500,
        'so_luong' => 12,
        'co_san' => 10,
        'luot_muon' => 490,
        'rating_score' => 4.8,
        'review_count' => 83,
        'tu_ke_kho' => 'Kệ KN01-Tủ 02',
        'isbn' => '978-604-1-12111-7',
        'img_url' => 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&q=80',
        'file_name' => 'cover_111.jpg'
    ],
    [
        'ma_sach' => 'BOOK-112',
        'ten_sach' => 'Tuyển Tập Nam Cao - Chí Phèo & Đời Thừa',
        'tac_gia' => 'Nam Cao',
        'category_id' => 2,
        'nha_xuat_ban' => 'NXB Văn Học',
        'nam_xuat_ban' => 2022,
        'gia_bia' => 85000,
        'gia_thue_ngay' => 4000,
        'so_luong' => 10,
        'co_san' => 8,
        'luot_muon' => 270,
        'rating_score' => 4.9,
        'review_count' => 41,
        'tu_ke_kho' => 'Kệ VH01-Tủ 01',
        'isbn' => '978-604-1-12112-4',
        'img_url' => 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&q=80',
        'file_name' => 'cover_112.jpg'
    ]
];

$dir = __DIR__ . '/assets/covers';
if (!is_dir($dir)) mkdir($dir, 0777, true);

$insertStmt = $db->prepare("INSERT INTO books (ma_sach, ten_sach, tac_gia, category_id, nha_xuat_ban, nam_xuat_ban, gia_bia, gia_thue_ngay, so_luong, co_san, luot_muon, isbn, hinh_anh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($newBooks as $b) {
    $filePath = "assets/covers/{$b['file_name']}";
    $absPath = __DIR__ . "/$filePath";
    
    // Download real image if not present
    if (!file_exists($absPath)) {
        $imgData = @file_get_contents($b['img_url']);
        if ($imgData) {
            file_put_contents($absPath, $imgData);
            echo "Downloaded cover: $filePath\n";
        }
    }
    
    // Check if book already exists by ma_sach
    $chk = $db->prepare("SELECT id FROM books WHERE ma_sach=?");
    $chk->execute([$b['ma_sach']]);
    if (!$chk->fetch()) {
        $insertStmt->execute([
            $b['ma_sach'], $b['ten_sach'], $b['tac_gia'], $b['category_id'],
            $b['nha_xuat_ban'], $b['nam_xuat_ban'], $b['gia_bia'], $b['gia_thue_ngay'],
            $b['so_luong'], $b['co_san'], $b['luot_muon'],
            $b['isbn'], $filePath
        ]);
        echo "Inserted book: {$b['ten_sach']}\n";
    }
}

// 2. Add new Digital PDF Documents to digital_documents table
$newDocs = [
    [
        'title' => 'Giáo Trình Lập Trình React Native Enterprise v5.0 (PDF Bản Quyền)',
        'file_path' => 'assets/docs/react_native_guide.pdf',
        'file_size_mb' => 15.4,
        'page_count' => 180,
        'document_format' => 'PDF HD',
        'access_level' => 'Độc Giả VIP'
    ],
    [
        'title' => 'Kỷ Yếu Nghiên Cứu Hệ Thống Đèn Thông Minh IoT (PDF)',
        'file_path' => 'assets/docs/smart_lighting_iot.pdf',
        'file_size_mb' => 9.8,
        'page_count' => 120,
        'document_format' => 'PDF HD',
        'access_level' => 'Miễn Phí'
    ],
    [
        'title' => 'Tuyển Tập Manga Sách Số Hóa: Doraemon & Conan (PDF)',
        'file_path' => 'assets/docs/manga_digital_collection.pdf',
        'file_size_mb' => 25.2,
        'page_count' => 210,
        'document_format' => 'PDF Color',
        'access_level' => 'Miễn Phí'
    ],
    [
        'title' => 'Tài Liệu System Design Architecture Checklist 2024 (PDF)',
        'file_path' => 'assets/docs/system_design_checklist.pdf',
        'file_size_mb' => 7.5,
        'page_count' => 95,
        'document_format' => 'PDF HD',
        'access_level' => 'Độc Giả VIP'
    ],
    [
        'title' => 'Cẩm Nang Xây Dựng Thói Quen Đọc Sách Mỗi Ngày (PDF)',
        'file_path' => 'assets/docs/reading_habit_guide.pdf',
        'file_size_mb' => 4.2,
        'page_count' => 65,
        'document_format' => 'PDF Lite',
        'access_level' => 'Miễn Phí'
    ],
    [
        'title' => 'Hướng Dẫn Thanh Toán VietQR & Tích Hợp VNPAY API (PDF)',
        'file_path' => 'assets/docs/vietqr_integration_api.pdf',
        'file_size_mb' => 6.8,
        'page_count' => 85,
        'document_format' => 'PDF HD',
        'access_level' => 'Miễn Phí'
    ]
];

$docDir = __DIR__ . '/assets/docs';
if (!is_dir($docDir)) mkdir($docDir, 0777, true);

$docStmt = $db->prepare("INSERT INTO digital_documents (title, file_path, file_size_mb, page_count, document_format, access_level) VALUES (?, ?, ?, ?, ?, ?)");

foreach ($newDocs as $d) {
    // Create dummy PDF if not exists
    $absDoc = __DIR__ . "/{$d['file_path']}";
    if (!file_exists($absDoc)) {
        file_put_contents($absDoc, "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF");
    }

    $chkD = $db->prepare("SELECT id FROM digital_documents WHERE title=?");
    $chkD->execute([$d['title']]);
    if (!$chkD->fetch()) {
        $docStmt->execute([$d['title'], $d['file_path'], $d['file_size_mb'], $d['page_count'], $d['document_format'], $d['access_level']]);
        echo "Inserted digital document: {$d['title']}\n";
    }
}

echo "All 12 new books & 6 digital documents added successfully!\n";
