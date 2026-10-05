<?php
// api.php - Backend API Endpoint (Xử lý Đặt lịch 5 bước & Ràng buộc Khóa Ngoại an toàn)
require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_REQUEST['action'] ?? '';
$pdo = get_pdo();



if ($action === 'book_appointment') {
    // Đặt lịch hẹn 5 bước từ phía khách hàng
    $customerName = trim($_POST['customerName'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $services = $_POST['services'] ?? [];
    if (is_string($services)) {
        $services = json_decode($services, true) ?: [$services];
    }
    $hairstyle = trim($_POST['hairstyle'] ?? 'Cắt Layer Bồng Bềnh Nữ');
    $haircolor = trim($_POST['haircolor'] ?? 'Nâu Trà Sữa (Milk Tea)');
    $stylist = trim($_POST['stylist'] ?? 'Alex Trần');
    $date = trim($_POST['date'] ?? 'Hôm nay');
    $time = trim($_POST['time'] ?? '09:30');
    $totalPrice = intval($_POST['totalPrice'] ?? 0);
    $paymentMethod = trim($_POST['paymentMethod'] ?? 'AtSalon');

    if (empty($customerName) || empty($phone)) {
        response_json('error', 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
    }

    // Đảm bảo SĐT khách hàng tồn tại trong bảng users
    $stmtUser = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmtUser->execute([$phone]);
    if (!$stmtUser->fetch()) {
        $stmtInsUser = $pdo->prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, '123456', 'customer')");
        $stmtInsUser->execute([$customerName, $phone]);
    }

    // Kiểm tra khớp tên kiểu tóc với bảng hairstyles
    $stmtHs = $pdo->prepare("SELECT name FROM hairstyles WHERE name = ? OR name LIKE ? LIMIT 1");
    $stmtHs->execute([$hairstyle, '%' . strtok($hairstyle, ' ') . '%']);
    $matchedHs = $stmtHs->fetchColumn();
    $hairstyle = $matchedHs ?: null;

    // Kiểm tra khớp tên màu nhuộm với bảng haircolors
    $stmtHc = $pdo->prepare("SELECT name FROM haircolors WHERE name = ? OR name LIKE ? LIMIT 1");
    $stmtHc->execute([$haircolor, '%' . strtok($haircolor, ' ') . '%']);
    $matchedHc = $stmtHc->fetchColumn();
    $haircolor = $matchedHc ?: null;

    // Kiểm tra khớp tên thợ với bảng stylists
    $stmtSt = $pdo->prepare("SELECT name FROM stylists WHERE name = ? LIMIT 1");
    $stmtSt->execute([$stylist]);
    $matchedSt = $stmtSt->fetchColumn();
    $stylist = $matchedSt ?: 'Alex Trần';

    // BẢO VỆ XUNG ĐỘT KHÓA GIỜ (ANTI DOUBLE-BOOKING SERVER-SIDE)
    $candDuration = calculate_services_duration($pdo, $services);
    $candStart = parse_time_to_minutes($time);
    
    if ($stylist !== 'Bất Kỳ Thợ Nào') {
        if (is_stylist_busy_at_slot($pdo, $stylist, $date, $candStart, $candDuration)) {
            response_json('error', "Rất tiếc! Stylist $stylist đã có ca hẹn trùng vào lúc $time ($date). Vui lòng chọn khung giờ khác!");
        }
    }

    $appointmentId = 'LUMI-' . rand(1000, 9999);
    $createdTime = date('H:i - d/m');
    $servicesJson = json_encode(!empty($services) ? $services : ['Cắt & Styling Nam Premium'], JSON_UNESCAPED_UNICODE);
    $depositAmount = max(intval($totalPrice * 0.20), 50000);

    // Kiểm tra xem bảng appointments có cột paymentMethod chưa
    try {
        $pdo->exec("ALTER TABLE appointments ADD COLUMN paymentMethod VARCHAR(50) DEFAULT 'AtSalon'");
    } catch (Exception $e) {}

    $stmt = $pdo->prepare("INSERT INTO appointments (id, customerName, phone, services, hairstyle, haircolor, stylist, date, time, totalPrice, depositAmount, depositStatus, status, createdTime, paymentMethod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Paid', 'Pending', ?, ?)");
    $stmt->execute([$appointmentId, $customerName, $phone, $servicesJson, $hairstyle, $haircolor, $stylist, $date, $time, $totalPrice, $depositAmount, $createdTime, $paymentMethod]);

    // Tự động lưu phiên đăng nhập khách hàng nếu chưa đăng nhập
    if (empty($_SESSION['user'])) {
        $_SESSION['user'] = [
            'name' => $customerName,
            'phone' => $phone,
            'email' => '',
            'role' => 'customer'
        ];
    }

    response_json('success', '🎉 Đặt lịch hẹn & Đặt cọc thành công!', [
        'appointment' => [
            'id' => $appointmentId,
            'customerName' => $customerName,
            'phone' => $phone,
            'date' => $date,
            'time' => $time,
            'totalPrice' => $totalPrice,
            'depositAmount' => $depositAmount,
            'paymentMethod' => $paymentMethod
        ]
    ]);
}

elseif ($action === 'get_my_appointments') {
    $loggedUser = get_logged_user();
    if (!$loggedUser) {
        response_json('error', 'Bạn chưa đăng nhập!');
    }
    $phone = $loggedUser['phone'];
    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE phone = ? ORDER BY createdTime DESC");
    $stmt->execute([$phone]);
    $list = $stmt->fetchAll();

    foreach ($list as &$app) {
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

    response_json('success', 'Thành công', ['appointments' => $list]);
}

elseif ($action === 'login_customer') {
    $phone = trim($_POST['phone'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($phone) || empty($password)) {
        response_json('error', 'Vui lòng nhập Số điện thoại và Mật khẩu!');
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmt->execute([$phone]);
    $matchedUser = $stmt->fetch();

    if ($matchedUser && $matchedUser['password'] === $password) {
        $_SESSION['user'] = [
            'name' => $matchedUser['name'],
            'phone' => $matchedUser['phone'],
            'email' => $matchedUser['email'] ?? '',
            'role' => 'customer'
        ];
        response_json('success', 'Đăng nhập thành công!', ['user' => $_SESSION['user']]);
    } else {
        $name = "Khách Hàng (" . substr($phone, -4) . ")";
        if (!$matchedUser) {
            $stmtInsert = $pdo->prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, 'customer')");
            $stmtInsert->execute([$name, $phone, $password]);
        }
        $_SESSION['user'] = [
            'name' => $name,
            'phone' => $phone,
            'email' => '',
            'role' => 'customer'
        ];
        response_json('success', 'Đăng nhập thành công!', ['user' => $_SESSION['user']]);
    }
}

elseif ($action === 'login_admin') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === 'admin' && $password === '123456') {
        $_SESSION['admin'] = true;
        response_json('success', 'Đăng nhập Quản Trị thành công!');
    } else {
        response_json('error', 'Tên đăng nhập hoặc Mật khẩu không đúng!');
    }
}

elseif ($action === 'login_stylist') {
    $name = trim($_POST['stylist_name'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($name)) {
        response_json('error', 'Vui lòng chọn tên Stylist!');
    }

    $stmt = $pdo->prepare("SELECT * FROM stylists WHERE name = ? LIMIT 1");
    $stmt->execute([$name]);
    $matched = $stmt->fetch();

    if ($matched) {
        $_SESSION['stylist'] = [
            'id' => $matched['id'],
            'name' => $matched['name'],
            'role' => $matched['role'],
            'avatar' => $matched['avatar']
        ];
        response_json('success', 'Đăng nhập Cổng Stylist thành công!', ['stylist' => $_SESSION['stylist']]);
    } else {
        response_json('error', 'Không tìm thấy thợ cắt tóc này!');
    }
}

elseif ($action === 'logout') {
    unset($_SESSION['user']);
    unset($_SESSION['admin']);
    unset($_SESSION['stylist']);
    session_destroy();
    response_json('success', 'Đã đăng xuất thành công');
}

elseif ($action === 'update_status') {
    if (!is_admin_logged_in() && !is_stylist_logged_in()) {
        response_json('error', 'Bạn không có quyền thực hiện thao tác này!');
    }
    $id = trim($_POST['id'] ?? '');
    $status = trim($_POST['status'] ?? 'Confirmed');

    $stmt = $pdo->prepare("UPDATE appointments SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    $extraMsg = '';
    if ($status === 'Completed') {
        // Tự động trừ kho hóa chất dựa trên các dịch vụ thực hiện
        deduct_inventory_for_appointment($pdo, $id);
        
        // Cộng +50 điểm thưởng thành viên cho khách hàng
        $stmtApp = $pdo->prepare("SELECT phone FROM appointments WHERE id = ?");
        $stmtApp->execute([$id]);
        $appPhone = $stmtApp->fetchColumn();

        if ($appPhone) {
            $pdo->prepare("UPDATE users SET loyalty_points = loyalty_points + 50 WHERE phone = ?")->execute([$appPhone]);
            $extraMsg = ' (Đã tự động trừ kho hóa chất & tích +50 điểm thưởng cho khách hàng!)';
        }
    }

    response_json('success', "Đã cập nhật trạng thái đơn $id thành " . get_status_label($status) . $extraMsg);
}

elseif ($action === 'add_service') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập trang quản trị!');
    }
    $name = trim($_POST['name'] ?? '');
    $category = trim($_POST['category'] ?? 'Cắt & Tạo Kiểu');
    $price = intval($_POST['price'] ?? 0);
    $duration = trim($_POST['duration'] ?? '45 phút');
    $description = trim($_POST['description'] ?? 'Dịch vụ làm tóc chất lượng cao được tư vấn bởi các chuyên gia salon.');
    $image = trim($_POST['image'] ?? '');

    if (empty($name) || $price <= 0) {
        response_json('error', 'Vui lòng điền Tên dịch vụ và Giá hợp lệ!');
    }

    // Xử lý tải tệp ảnh trực tiếp từ máy tính (File Upload)
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/services/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $ext = pathinfo($_FILES['image_file']['name'], PATHINFO_EXTENSION);
        $fileName = 'svc_' . time() . '_' . rand(1000, 9999) . '.' . ($ext ?: 'jpg');
        $targetPath = $uploadDir . $fileName;
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetPath)) {
            $image = 'uploads/services/' . $fileName;
        }
    }

    if (empty($image)) {
        $image = 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600';
    }

    $id = 'svc-' . time();

    $stmt = $pdo->prepare("INSERT INTO services (id, name, category, duration, minutes, price, description, badge, image) VALUES (?, ?, ?, ?, ?, ?, ?, 'Mới', ?)");
    $stmt->execute([$id, $name, $category, $duration, intval($duration), $price, $description, $image]);

    response_json('success', '🎉 Đã thêm dịch vụ mới kèm hình ảnh minh họa thành công!');
}

elseif ($action === 'delete_service') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $id = trim($_POST['id'] ?? '');
    $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
    $stmt->execute([$id]);

    response_json('success', 'Đã xóa dịch vụ khỏi Database thành công');
}

elseif ($action === 'add_stylist') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $name = trim($_POST['name'] ?? '');
    $role = trim($_POST['role'] ?? 'Senior Hair Artist');
    $level = trim($_POST['level'] ?? 'Senior');
    $experience = trim($_POST['experience'] ?? '5 năm kinh nghiệm');
    $specialty = trim($_POST['specialty'] ?? 'Chuyên gia tạo kiểu & uốn nhuộm');
    $baseSalary = intval($_POST['base_salary'] ?? 8000000);
    $avatar = trim($_POST['avatar'] ?? '');

    if (empty($name)) {
        response_json('error', 'Vui lòng nhập Tên Stylist!');
    }

    // Xử lý tải tệp ảnh đại diện từ máy tính (File Upload)
    if (isset($_FILES['avatar_file']) && $_FILES['avatar_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/uploads/stylists/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $ext = pathinfo($_FILES['avatar_file']['name'], PATHINFO_EXTENSION);
        $fileName = 'st_' . time() . '_' . rand(1000, 9999) . '.' . ($ext ?: 'jpg');
        $targetPath = $uploadDir . $fileName;
        if (move_uploaded_file($_FILES['avatar_file']['tmp_name'], $targetPath)) {
            $avatar = 'uploads/stylists/' . $fileName;
        }
    }

    if (empty($avatar)) {
        $avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
    }

    $id = 'st-' . time();

    // Thêm các cột nếu chưa có trong DB
    try { $pdo->exec("ALTER TABLE stylists ADD COLUMN level VARCHAR(50) DEFAULT 'Senior'"); } catch (Exception $e) {}
    try { $pdo->exec("ALTER TABLE stylists ADD COLUMN baseSalary INT DEFAULT 8000000"); } catch (Exception $e) {}

    $stmt = $pdo->prepare("INSERT INTO stylists (id, name, role, level, experience, rating, reviews, avatar, specialty, baseSalary, isAny) VALUES (?, ?, ?, ?, ?, 5.0, 100, ?, ?, ?, 0)");
    $stmt->execute([$id, $name, $role, $level, $experience, $avatar, $specialty, $baseSalary]);

    response_json('success', '🎉 Đã thêm Thợ cắt tóc (Stylist) mới kèm ảnh đại diện thành công!');
}

elseif ($action === 'delete_stylist') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $id = trim($_POST['id'] ?? '');
    $stmt = $pdo->prepare("DELETE FROM stylists WHERE id = ? AND isAny = 0");
    $stmt->execute([$id]);

    response_json('success', 'Đã xóa thợ cắt tóc thành công');
}

elseif ($action === 'add_review') {
    $name = trim($_POST['name'] ?? 'Khách Hàng');
    $content = trim($_POST['content'] ?? '');
    $rating = intval($_POST['rating'] ?? 5);
    $service = trim($_POST['service'] ?? 'Dịch vụ Salon');

    if (empty($content)) {
        response_json('error', 'Vui lòng nhập nội dung đánh giá!');
    }

    $stmtUser = $pdo->prepare("SELECT * FROM users WHERE name = ?");
    $stmtUser->execute([$name]);
    if (!$stmtUser->fetch()) {
        $phoneTmp = '09' . rand(10000000, 99999999);
        $stmtInsUser = $pdo->prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, '123456', 'customer')");
        $stmtInsUser->execute([$name, $phoneTmp]);
    }

    $avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150';
    $stmt = $pdo->prepare("INSERT INTO reviews (name, role, avatar, content, rating, service) VALUES (?, 'Khách hàng', ?, ?, ?, ?)");
    $stmt->execute([$name, $avatar, $content, $rating, $service]);

    response_json('success', 'Cảm ơn bạn đã gửi đánh giá vào Database!');
}

elseif ($action === 'send_chat') {
    $sender = trim($_POST['sender'] ?? 'customer');
    $customerPhone = trim($_POST['customer_phone'] ?? '');
    $customerName = trim($_POST['customer_name'] ?? '');
    $message = trim($_POST['message'] ?? '');

    if (empty($customerPhone) || empty($message)) {
        response_json('error', 'Vui lòng cung cấp số điện thoại và nội dung tin nhắn!');
    }

    if (empty($customerName)) {
        $customerName = "Khách Hàng (" . substr($customerPhone, -4) . ")";
    }

    $stmtUser = $pdo->prepare("SELECT * FROM users WHERE phone = ?");
    $stmtUser->execute([$customerPhone]);
    if (!$stmtUser->fetch()) {
        $stmtIns = $pdo->prepare("INSERT INTO users (name, phone, password, role) VALUES (?, ?, '123456', 'customer')");
        $stmtIns->execute([$customerName, $customerPhone]);
    }

    $stmtMsg = $pdo->prepare("INSERT INTO chat_messages (customer_phone, customer_name, sender, message, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmtMsg->execute([$customerPhone, $customerName, $sender, $message]);

    response_json('success', 'Gửi tin nhắn thành công!');
}

elseif ($action === 'get_chat_history') {
    $customerPhone = trim($_REQUEST['customer_phone'] ?? '');
    $reader = trim($_REQUEST['reader'] ?? 'customer');

    if (empty($customerPhone)) {
        response_json('error', 'Thiếu thông tin số điện thoại khách hàng!');
    }

    if ($reader === 'admin') {
        $stmtRead = $pdo->prepare("UPDATE chat_messages SET is_read = 1 WHERE customer_phone = ? AND sender = 'customer'");
        $stmtRead->execute([$customerPhone]);
    } elseif ($reader === 'customer') {
        $stmtRead = $pdo->prepare("UPDATE chat_messages SET is_read = 1 WHERE customer_phone = ? AND sender = 'admin'");
        $stmtRead->execute([$customerPhone]);
    }

    $stmt = $pdo->prepare("SELECT * FROM chat_messages WHERE customer_phone = ? ORDER BY id ASC");
    $stmt->execute([$customerPhone]);
    $messages = $stmt->fetchAll();

    response_json('success', 'Thành công', ['messages' => $messages]);
}

elseif ($action === 'get_chat_conversations') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }

    $sql = "SELECT c.customer_phone, 
                   MAX(c.customer_name) as customer_name, 
                   MAX(c.created_at) as last_time,
                   (SELECT message FROM chat_messages WHERE customer_phone = c.customer_phone ORDER BY id DESC LIMIT 1) as last_message,
                   SUM(CASE WHEN c.sender = 'customer' AND c.is_read = 0 THEN 1 ELSE 0 END) as unread_count
            FROM chat_messages c
            GROUP BY c.customer_phone
            ORDER BY last_time DESC";

    $conversations = $pdo->query($sql)->fetchAll();
    response_json('success', 'Thành công', ['conversations' => $conversations]);
}

elseif ($action === 'get_available_slots') {
    $date = trim($_REQUEST['date'] ?? 'Hôm nay');
    $stylist = trim($_REQUEST['stylist'] ?? 'Alex Trần');
    $servicesRaw = $_REQUEST['services'] ?? [];
    if (is_string($servicesRaw)) {
        $servicesArr = json_decode($servicesRaw, true) ?: [$servicesRaw];
    } else {
        $servicesArr = (array)$servicesRaw;
    }

    $totalDuration = calculate_services_duration($pdo, $servicesArr);

    $allSlots = [
        '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];

    $slotsResult = [];
    $closingMinutes = 20 * 60; // 20:00 (1200 mins)

    if ($stylist === 'Bất Kỳ Thợ Nào' || empty($stylist)) {
        $allRegularStylists = $pdo->query("SELECT name FROM stylists WHERE isAny = 0")->fetchAll(PDO::FETCH_COLUMN);
    } else {
        $allRegularStylists = [$stylist];
    }

    foreach ($allSlots as $slotStr) {
        $startMin = parse_time_to_minutes($slotStr);
        $endMin = $startMin + $totalDuration;

        if ($endMin > $closingMinutes) {
            $slotsResult[] = [
                'time' => $slotStr,
                'available' => false,
                'reason' => 'Không đủ thời gian trước giờ đóng cửa (20:00)'
            ];
            continue;
        }

        $isSlotFree = false;
        foreach ($allRegularStylists as $stName) {
            if (!is_stylist_busy_at_slot($pdo, $stName, $date, $startMin, $totalDuration)) {
                $isSlotFree = true;
                break;
            }
        }

        if ($isSlotFree) {
            $slotsResult[] = [
                'time' => $slotStr,
                'available' => true,
                'reason' => 'Giờ trống khả dụng'
            ];
        } else {
            $slotsResult[] = [
                'time' => $slotStr,
                'available' => false,
                'reason' => 'Stylist đã có lịch bận trùng giờ'
            ];
        }
    }

    response_json('success', 'Thành công', [
        'date' => $date,
        'stylist' => $stylist,
        'totalDurationMinutes' => $totalDuration,
        'slots' => $slotsResult
    ]);
}

elseif ($action === 'cancel_appointment') {
    $id = trim($_REQUEST['id'] ?? '');
    $reason = trim($_REQUEST['reason'] ?? 'Khách hàng yêu cầu hủy đơn');

    if (empty($id)) {
        response_json('error', 'Vui lòng cung cấp Mã đơn hẹn!');
    }

    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE id = ?");
    $stmt->execute([$id]);
    $app = $stmt->fetch();

    if (!$app) {
        response_json('error', 'Không tìm thấy đơn hẹn này!');
    }

    if ($app['status'] === 'Cancelled') {
        response_json('error', 'Đơn hẹn này đã được hủy trước đó!');
    }

    $dateStr = $app['date'] ?? 'Hôm nay';
    $depositAmount = intval($app['depositAmount'] ?? 0);
    if ($depositAmount <= 0) {
        $depositAmount = max(intval(intval($app['totalPrice'] ?? 0) * 0.20), 50000);
    }

    // Logic mốc thời gian 24h:
    // Nếu date là 'Ngày mai' hoặc 'Ngày kia' hoặc tương lai => > 24h => Hoàn cọc 100%
    // Nếu date là 'Hôm nay' => Sát giờ (< 24h) => Tịch thu/Phạt tiền cọc
    $isMoreThan24h = (strpos($dateStr, 'Ngày mai') !== false || strpos($dateStr, 'Ngày kia') !== false);

    if ($isMoreThan24h) {
        $depositStatus = 'Refunded';
        $refundAmount = $depositAmount;
        $msg = "🎉 Đã hủy lịch hẹn {$id} thành công! Do bạn hủy trước giờ hẹn ≥ 24h, 100% tiền cọc (" . format_vnd($depositAmount) . ") sẽ được hoàn trả lại trong 24h.";
    } else {
        $depositStatus = 'Forfeited';
        $refundAmount = 0;
        $msg = "⚠️ Đã hủy lịch hẹn {$id}. Do bạn hủy ca quá sát giờ (< 24h), tiền đặt cọc giữ chỗ (" . format_vnd($depositAmount) . ") đã bị khấu trừ làm phí phạt theo quy định của Salon.";
    }

    $stmtUpdate = $pdo->prepare("UPDATE appointments SET status = 'Cancelled', depositStatus = ?, refundAmount = ?, cancelReason = ? WHERE id = ?");
    $stmtUpdate->execute([$depositStatus, $refundAmount, $reason, $id]);

    response_json('success', $msg, [
        'id' => $id,
        'depositStatus' => $depositStatus,
        'refundAmount' => $refundAmount,
        'depositAmount' => $depositAmount
    ]);
}

elseif ($action === 'get_affected_appointments') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $fromStylist = trim($_REQUEST['from_stylist'] ?? '');
    $date = trim($_REQUEST['date'] ?? 'Hôm nay');

    $stmt = $pdo->prepare("SELECT * FROM appointments WHERE stylist = ? AND date = ? AND status IN ('Pending', 'Confirmed', 'InProgress') ORDER BY time ASC");
    $stmt->execute([$fromStylist, $date]);
    $list = $stmt->fetchAll();

    foreach ($list as &$app) {
        if (!empty($app['services'])) {
            $decoded = json_decode($app['services'], true);
            $app['services'] = is_array($decoded) ? $decoded : [$app['services']];
        }
    }

    response_json('success', 'Thành công', ['appointments' => $list]);
}

elseif ($action === 'get_equivalent_stylists') {
    $fromStylist = trim($_REQUEST['from_stylist'] ?? '');
    $stmt = $pdo->prepare("SELECT * FROM stylists WHERE isAny = 0 AND name != ? ORDER BY rating DESC");
    $stmt->execute([$fromStylist]);
    $stylists = $stmt->fetchAll();

    response_json('success', 'Thành công', ['stylists' => $stylists]);
}

elseif ($action === 'batch_reassign_stylist') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền thực hiện thao tác này!');
    }
    $fromStylist = trim($_POST['from_stylist'] ?? '');
    $toStylist = trim($_POST['to_stylist'] ?? '');
    $date = trim($_POST['date'] ?? 'Hôm nay');
    $channel = trim($_POST['channel'] ?? 'Both');

    if (empty($fromStylist) || empty($toStylist)) {
        response_json('error', 'Vui lòng chọn Stylist nghỉ và Stylist thay thế!');
    }

    if ($fromStylist === $toStylist) {
        response_json('error', 'Stylist thay thế phải khác Stylist xin nghỉ!');
    }

    $stmtSelect = $pdo->prepare("SELECT * FROM appointments WHERE stylist = ? AND date = ? AND status IN ('Pending', 'Confirmed', 'InProgress')");
    $stmtSelect->execute([$fromStylist, $date]);
    $affectedApps = $stmtSelect->fetchAll();

    if (empty($affectedApps)) {
        response_json('error', "Không có ca hẹn bận nào của Stylist $fromStylist vào ngày $date cần chuyển dời!");
    }

    $stmtUpdate = $pdo->prepare("UPDATE appointments SET stylist = ? WHERE stylist = ? AND date = ? AND status IN ('Pending', 'Confirmed', 'InProgress')");
    $stmtUpdate->execute([$toStylist, $fromStylist, $date]);

    $logCount = 0;
    $stmtLog = $pdo->prepare("INSERT INTO notification_logs (appointment_id, customer_phone, customer_name, channel, message, sent_at) VALUES (?, ?, ?, ?, ?, NOW())");

    foreach ($affectedApps as $app) {
        $custName = $app['customerName'];
        $phone = $app['phone'];
        $appId = $app['id'];
        $time = $app['time'];

        $smsContent = "[LUMIÈRE SALON] Kính chào quý khách {$custName}! Do Stylist {$fromStylist} có sự cố nghỉ đột xuất, ca hẹn {$appId} ({$time} - {$date}) đã được chuyển dời sang Master Stylist {$toStylist} phục vụ. Hotline hỗ trợ: 0912345678.";
        $emailContent = "[LUMIÈRE SALON EMAIL] Kính gửi {$custName},\nChúng tôi xin thông báo ca hẹn mã {$appId} lúc {$time} ngày {$date} đã được chuyển giao cho Chuyên gia Stylist {$toStylist} phụ trách. LUMIÈRE xin cam kết chất lượng phục vụ 5 sao tốt nhất cho quý khách.";

        $fullMsg = ($channel === 'SMS') ? $smsContent : (($channel === 'Email') ? $emailContent : "📲 SMS: $smsContent\n📧 EMAIL: $emailContent");

        $stmtLog->execute([$appId, $phone, $custName, $channel, $fullMsg]);
        $logCount++;
    }

    response_json('success', "🎉 Đã chuyển dời thành công " . count($affectedApps) . " ca hẹn từ {$fromStylist} sang {$toStylist}. Đã tự động gửi thông báo ({$channel}) tới {$logCount} khách hàng!", [
        'reassignedCount' => count($affectedApps),
        'fromStylist' => $fromStylist,
        'toStylist' => $toStylist,
        'date' => $date
    ]);
}

elseif ($action === 'get_notification_logs') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $logs = $pdo->query("SELECT * FROM notification_logs ORDER BY id DESC LIMIT 50")->fetchAll();
    response_json('success', 'Thành công', ['logs' => $logs]);
}

elseif ($action === 'export_salary_csv') {
    if (!is_admin_logged_in()) {
        die('Bạn không có quyền thực hiện thao tác này!');
    }
    $month = $_GET['month'] ?? date('m/Y');
    $reportData = get_monthly_salary_report($month);

    $cleanMonthStr = str_replace(['/', '-'], '_', $reportData['monthYear']);
    
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="Bao_Cao_Luong_LUMIERE_' . $cleanMonthStr . '.csv"');

    // UTF-8 BOM for Excel compatibility
    echo "\xEF\xBB\xBF";

    $output = fopen('php://output', 'w');

    // Title line
    fputcsv($output, ['LUMIÈRE HAIR STUDIO - BÁO CÁO LƯƠNG & HOA HỒNG THỢ CẮT TÓC']);
    fputcsv($output, ['Kỳ Báo Cáo:', $reportData['monthYear']]);
    fputcsv($output, ['Ngày Xuất:', date('d/m/Y H:i:s')]);
    fputcsv($output, []);

    // Summary line
    fputcsv($output, ['TỔNG QUAN SALON']);
    fputcsv($output, ['Tổng Ca Nghiệm Thu:', $reportData['summary']['totalCompletedCount']]);
    fputcsv($output, ['Tổng Doanh Thu Salon:', $reportData['summary']['totalSalonRevenue'] . ' VND']);
    fputcsv($output, ['Tổng Hoa Hồng Phân Bổ:', $reportData['summary']['totalSalonCommission'] . ' VND']);
    fputcsv($output, ['Tổng Chi Phí Lương Salon:', $reportData['summary']['totalSalonPayout'] . ' VND']);
    fputcsv($output, []);

    // Table headers
    fputcsv($output, ['Tên Stylist', 'Cấp Bậc', 'Lương Cơ Bản (VND)', 'Ca Hoàn Thành', 'Doanh Thu (VND)', 'Hoa Hồng (VND)', 'Tổng Thực Nhận (VND)']);

    foreach ($reportData['stylistsReport'] as $stData) {
        $st = $stData['stylist'];
        fputcsv($output, [
            $st['name'],
            ($st['level'] ?? 'Senior') . ' Stylist',
            $stData['baseSalary'],
            $stData['completedCount'],
            $stData['revenue'],
            $stData['commission'],
            $stData['totalPayout']
        ]);
    }

    fclose($output);
    exit;
}

elseif ($action === 'apply_voucher') {
    $code = trim($_POST['code'] ?? '');
    $totalPrice = intval($_POST['totalPrice'] ?? 0);
    $phone = trim($_POST['phone'] ?? '');

    if (empty($code)) {
        response_json('error', 'Vui lòng nhập mã giảm giá!');
    }

    $res = validate_voucher($pdo, $code, $totalPrice, $phone);
    if ($res['valid']) {
        response_json('success', $res['message'], [
            'code' => $res['code'],
            'discountAmount' => $res['discountAmount'],
            'finalTotal' => $res['finalTotal']
        ]);
    } else {
        response_json('error', $res['message']);
    }
}

elseif ($action === 'get_vouchers') {
    seed_default_vouchers($pdo);
    $vouchers = $pdo->query("SELECT * FROM vouchers WHERE (expiry_date >= CURDATE() OR expiry_date IS NULL) ORDER BY target_audience DESC")->fetchAll();
    response_json('success', 'Lấy danh sách mã giảm giá thành công', ['vouchers' => $vouchers]);
}

elseif ($action === 'get_inventory') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $items = $pdo->query("SELECT * FROM inventory ORDER BY (quantity <= min_threshold) DESC, item_name ASC")->fetchAll();
    response_json('success', 'Thành công', ['inventory' => $items]);
}

elseif ($action === 'update_inventory') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền truy cập!');
    }
    $name = trim($_POST['item_name'] ?? '');
    $category = trim($_POST['category'] ?? 'Hóa Chất');
    $quantity = floatval($_POST['quantity'] ?? 0);
    $unit = trim($_POST['unit'] ?? 'ml');
    $threshold = floatval($_POST['min_threshold'] ?? 500);

    if (empty($name)) {
        response_json('error', 'Vui lòng nhập Tên vật tư hóa chất!');
    }

    $stmt = $pdo->prepare("INSERT INTO inventory (item_name, category, quantity, unit, min_threshold) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE category = VALUES(category), quantity = VALUES(quantity), unit = VALUES(unit), min_threshold = VALUES(min_threshold)");
    $stmt->execute([$name, $category, $quantity, $unit, $threshold]);

    response_json('success', 'Đã lưu vật tư hóa chất thành công!');
}

elseif ($action === 'submit_stylist_leave') {
    if (!is_stylist_logged_in()) {
        response_json('error', 'Bạn phải đăng nhập tài khoản Stylist!');
    }
    $stylist = get_logged_stylist();
    $leaveDate = trim($_POST['leave_date'] ?? '');
    $reason = trim($_POST['reason'] ?? 'Bận việc cá nhân');

    if (empty($leaveDate)) {
        response_json('error', 'Vui lòng chọn ngày muốn xin nghỉ phép!');
    }

    $stmt = $pdo->prepare("INSERT INTO stylist_leaves (stylist_name, leave_date, reason, status) VALUES (?, ?, ?, 'Pending')");
    $stmt->execute([$stylist['name'], $leaveDate, $reason]);

    response_json('success', 'Đã gửi đơn xin nghỉ phép ngày ' . $leaveDate . ' tới Admin thành công!');
}

elseif ($action === 'manage_stylist_leave') {
    if (!is_admin_logged_in()) {
        response_json('error', 'Bạn không có quyền thực hiện thao tác này!');
    }
    $id = intval($_POST['id'] ?? 0);
    $status = trim($_POST['status'] ?? 'Approved');

    $stmt = $pdo->prepare("UPDATE stylist_leaves SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    response_json('success', 'Đã cập nhật trạng thái đơn nghỉ phép thành ' . ($status === 'Approved' ? 'Đã Duyệt (Khóa Giờ)' : 'Từ Chối'));
}

elseif ($action === 'get_customer_portal') {
    if (is_admin_logged_in()) {
        response_json('error', '🚫 CẤM TRUY CẬP: Tài khoản Quản Trị Admin không được phép tra cứu / xem Ý kiến cá nhân & Cổng thông tin riêng của Khách hàng!');
    }
    $phone = trim($_REQUEST['phone'] ?? '');
    if (empty($phone)) {
        response_json('error', 'Vui lòng cung cấp số điện thoại!');
    }

    $stmtUser = $pdo->prepare("SELECT * FROM users WHERE phone = ? LIMIT 1");
    $stmtUser->execute([$phone]);
    $user = $stmtUser->fetch();

    $stmtApps = $pdo->prepare("SELECT * FROM appointments WHERE phone = ? ORDER BY createdTime DESC");
    $stmtApps->execute([$phone]);
    $apps = $stmtApps->fetchAll();

    foreach ($apps as &$a) {
        $a['services'] = json_decode($a['services'], true) ?: [$a['services']];
    }

    response_json('success', 'Lấy dữ liệu khách hàng thành công', [
        'user' => $user ?: ['name' => 'Khách Vãng Lai', 'phone' => $phone, 'loyalty_points' => count($apps) * 50, 'membership_tier' => 'Bạc'],
        'appointments' => $apps
    ]);
}

else {
    response_json('error', 'Yêu cầu không hợp lệ!');
}
