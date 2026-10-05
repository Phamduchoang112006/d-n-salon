<?php
/**
 * api/books.php - RESTful API Controller quản lý Sách (Books)
 * Hỗ trợ phương thức: GET, POST, PUT, DELETE
 */

// Thiết lập Headers chuẩn RESTful API & CORS
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Xử lý Request OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/Database.php';

/**
 * Hàm trợ giúp trả về JSON Response chuẩn
 */
function sendJsonResponse($status, $message, $data = null, $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode([
        'status' => $status,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

try {
    $db = Database::getConnection();
    $method = $_SERVER['REQUEST_METHOD'];
    $inputData = json_decode(file_get_contents('php://input'), true) ?? [];

    switch ($method) {

        // ============================================================
        // 1. GET: LẤY DANH SÁCH SÁCH VÀ TÌM KIẾM / LỌC
        // ============================================================
        case 'GET':
            $search = isset($_GET['search']) ? trim($_GET['search']) : '';
            $categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;

            $sql = "SELECT b.*, c.name as category_name 
                    FROM books b 
                    LEFT JOIN categories c ON b.category_id = c.id 
                    WHERE 1=1";
            $params = [];

            if (!empty($search)) {
                $sql .= " AND (b.title LIKE :search OR b.author LIKE :search OR b.isbn LIKE :search)";
                $params[':search'] = "%{$search}%";
            }

            if (!empty($categoryId)) {
                $sql .= " AND b.category_id = :category_id";
                $params[':category_id'] = $categoryId;
            }

            $sql .= " ORDER BY b.id DESC";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $books = $stmt->fetchAll();

            sendJsonResponse('success', 'Lấy danh sách sách thành công', ['books' => $books]);
            break;

        // ============================================================
        // 2. POST: THÊM SÁCH MỚI
        // ============================================================
        case 'POST':
            $isbn = trim($inputData['isbn'] ?? '');
            $title = trim($inputData['title'] ?? '');
            $author = trim($inputData['author'] ?? '');
            $categoryId = (int)($inputData['category_id'] ?? 1);
            $publisher = trim($inputData['publisher'] ?? '');
            $publishYear = (int)($inputData['publish_year'] ?? date('Y'));
            $quantity = (int)($inputData['quantity'] ?? 1);
            $availableQty = isset($inputData['available_qty']) ? (int)$inputData['available_qty'] : $quantity;
            $coverUrl = trim($inputData['cover_url'] ?? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400');

            if (empty($isbn) || empty($title) || empty($author)) {
                sendJsonResponse('error', 'Mã ISBN, Tên sách và Tác giả không được để trống', null, 400);
            }

            $stmt = $db->prepare("INSERT INTO books (isbn, title, author, category_id, publisher, publish_year, quantity, available_qty, cover_url) 
                                  VALUES (:isbn, :title, :author, :category_id, :publisher, :publish_year, :quantity, :available_qty, :cover_url)");
            $stmt->execute([
                ':isbn' => $isbn,
                ':title' => $title,
                ':author' => $author,
                ':category_id' => $categoryId,
                ':publisher' => $publisher,
                ':publish_year' => $publishYear,
                ':quantity' => $quantity,
                ':available_qty' => $availableQty,
                ':cover_url' => $coverUrl
            ]);

            $newBookId = $db->lastInsertId();
            sendJsonResponse('success', 'Thêm sách mới thành công', ['id' => $newBookId], 201);
            break;

        // ============================================================
        // 3. PUT: CẬP NHẬT THÔNG TIN SÁCH
        // ============================================================
        case 'PUT':
            $id = (int)($inputData['id'] ?? $_GET['id'] ?? 0);
            if ($id <= 0) {
                sendJsonResponse('error', 'Thiếu ID sách cần cập nhật', null, 400);
            }

            $stmt = $db->prepare("UPDATE books SET 
                                    isbn = :isbn,
                                    title = :title,
                                    author = :author,
                                    category_id = :category_id,
                                    publisher = :publisher,
                                    publish_year = :publish_year,
                                    quantity = :quantity,
                                    available_qty = :available_qty,
                                    cover_url = :cover_url
                                  WHERE id = :id");
            $stmt->execute([
                ':isbn' => trim($inputData['isbn']),
                ':title' => trim($inputData['title']),
                ':author' => trim($inputData['author']),
                ':category_id' => (int)$inputData['category_id'],
                ':publisher' => trim($inputData['publisher']),
                ':publish_year' => (int)$inputData['publish_year'],
                ':quantity' => (int)$inputData['quantity'],
                ':available_qty' => (int)$inputData['available_qty'],
                ':cover_url' => trim($inputData['cover_url']),
                ':id' => $id
            ]);

            sendJsonResponse('success', 'Cập nhật thông tin sách thành công');
            break;

        // ============================================================
        // 4. DELETE: XÓA SÁCH KHỎI HỆ THỐNG
        // ============================================================
        case 'DELETE':
            $id = (int)($inputData['id'] ?? $_GET['id'] ?? 0);
            if ($id <= 0) {
                sendJsonResponse('error', 'Thiếu ID sách cần xóa', null, 400);
            }

            $stmt = $db->prepare("DELETE FROM books WHERE id = :id");
            $stmt->execute([':id' => $id]);

            sendJsonResponse('success', 'Xóa sách thành công');
            break;

        default:
            sendJsonResponse('error', 'Phương thức HTTP không được hỗ trợ', null, 405);
            break;
    }
} catch (Exception $e) {
    sendJsonResponse('error', 'Lỗi máy chủ Backend: ' . $e->getMessage(), null, 500);
}
