<?php
/**
 * Database.php - Singleton Connection Manager qua PDO
 * Quản lý kết nối an toàn với Cơ sở dữ liệu MySQL
 */
class Database {
    private static $host = '127.0.0.1';
    private static $port = '3306';
    private static $db_name = 'thuvien_db';
    private static $username = 'root';
    private static $password = '';
    private static $conn = null;

    /**
     * Lấy kết nối PDO Singleton
     * @return PDO
     */
    public static function getConnection() {
        if (self::$conn === null) {
            try {
                $dsn = "mysql:host=" . self::$host . ";port=" . self::$port . ";dbname=" . self::$db_name . ";charset=utf8mb4";
                self::$conn = new PDO($dsn, self::$username, self::$password, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]);
            } catch (PDOException $e) {
                // Đòn bẩy tự động SQLite nếu MySQL chưa bật (Fallback cho môi trường Dev)
                $sqlite_dir = __DIR__ . '/../data';
                if (!is_dir($sqlite_dir)) mkdir($sqlite_dir, 0777, true);
                $sqlite_file = $sqlite_dir . '/library_dev.sqlite';
                $need_init = !file_exists($sqlite_file);
                
                self::$conn = new PDO("sqlite:" . $sqlite_file, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);

                if ($need_init) {
                    self::initSqliteTables(self::$conn);
                }
            }
        }
        return self::$conn;
    }

    private static function initSqliteTables($pdo) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE, name TEXT, description TEXT);");
        $pdo->exec("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, isbn TEXT UNIQUE, title TEXT, author TEXT, category_id INTEGER, publisher TEXT, publish_year INTEGER, quantity INTEGER, available_qty INTEGER, cover_url TEXT);");
        $pdo->exec("INSERT INTO categories (code, name, description) VALUES ('CNTT', 'Công Nghệ Thông Tin', 'Sách lập trình'), ('VH', 'Văn Học', 'Tiểu thuyết');");
        $pdo->exec("INSERT INTO books (isbn, title, author, category_id, publisher, publish_year, quantity, available_qty, cover_url) VALUES 
            ('978-0132350884', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', 1, 'Prentice Hall', 2008, 10, 8, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'),
            ('978-0201616224', 'The Pragmatic Programmer', 'Andrew Hunt, David Thomas', 1, 'Addison-Wesley', 1999, 5, 4, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400');");
    }
}
