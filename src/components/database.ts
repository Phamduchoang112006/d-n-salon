// file myDatabase.db nằm ở /data/data/com.libraryappsqlite/databases/myDatabase.db
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

// Biến toàn cục dùng để lưu trữ kết nối cơ sở dữ liệu hiện tại (ban đầu là null)
let db: SQLiteDatabase | null = null;

/**
 * HAM BO TRO: MO HOAC LAY KET NOI DEN DATABASE
 * - Hàm áp dụng thiết kế Singleton: Nếu database đã mở rồi (db khác null), trả về luôn.
 * - Nếu chưa mở, tiến hành mở file 'myDatabase.db' ở vị trí mặc định rồi mới trả về.
 */
const getDb = async (): Promise<SQLiteDatabase> => {
  try {
    if (db) return db;

    db = await SQLite.openDatabase({
      name: 'mydb24cntt1a.db',
      location: 'default',
    });

    console.log('✅ DB OPEN SUCCESS');

    return db;
  } catch (err) {
    console.log('❌ OPEN DB ERROR', err);
    throw err;
  }
};

// Định nghĩa kiểu dữ liệu cho Danh mục (Category) gồm id và tên danh mục
export type Category = {
  id: number;
  name: string;
};

// Định nghĩa kiểu dữ liệu cho Sản phẩm (Product), liên kết với Category qua khóa ngoại categoryId
export type Product = {
  id: number;
  name: string;
  price: number;
  img: string;
  categoryId: number;
};

// Định nghĩa kiểu dữ liệu cho Người dùng (User) gồm tài khoản, mật khẩu và vai trò (admin/user...)
export type User = {
  id: number;
  username: string;
  password: string;
  role: string;
};

// Mảng dữ liệu mẫu cho danh mục sản phẩm (Chạy lần đầu khi tạo db)
// Mảng dữ liệu mẫu cho danh mục sản phẩm (Chạy lần đầu khi tạo db)
const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];

// Mảng dữ liệu mẫu cho các sản phẩm (Chạy lần đầu khi tạo db)
const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: 250000, img: 'ao_thun.png', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: 1100000, img: 'giay_the_thao.png', categoryId: 2 },
  { id: 3, name: 'Balo thời trang', price: 490000, img: 'balo_laptop.png', categoryId: 3 },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, img: 'mu_luoi_trai.png', categoryId: 4 },
  { id: 5, name: 'Túi xách nữ', price: 980000, img: 'tui_xach_nu.png', categoryId: 5 },
  { id: 6, name: 'Áo thun trơn Cotton', price: 180000, img: 'ao_thun_cotton.png', categoryId: 1 },
  { id: 7, name: 'Áo khoác gió thể thao', price: 350000, img: 'ao_khoac_the_thao.png', categoryId: 1 },
  { id: 8, name: 'Giày chạy bộ Performance', price: 850000, img: 'giay_chay_bo.png', categoryId: 2 },
  { id: 9, name: 'Giày Sneaker cổ cao', price: 1200000, img: 'giay_sneaker_co_cao.png', categoryId: 2 },
  { id: 10, name: 'Balo du lịch chống nước', price: 650000, img: 'balo_du_lich.png', categoryId: 3 },
  { id: 11, name: 'Balo mini thời trang', price: 280000, img: 'balo_laptop.png', categoryId: 3 },
  { id: 12, name: 'Mũ bucket phong cách', price: 150000, img: 'mu_luoi_trai.png', categoryId: 4 },
  { id: 13, name: 'Mũ len dệt kim', price: 180000, img: 'mu_luoi_trai.png', categoryId: 4 },
  { id: 14, name: 'Túi đeo chéo nam nữ', price: 220000, img: 'tui_deo_cheo.png', categoryId: 5 },
  { id: 15, name: 'Túi tote vải Canvas', price: 95000, img: 'tui_tote_canvas.png', categoryId: 5 },
  { id: 16, name: 'Áo Hoodie nỉ ngoại', price: 320000, img: 'ao_thun.png', categoryId: 1 },
  { id: 17, name: 'Giày Tây da Oxford', price: 1500000, img: 'giay_the_thao.png', categoryId: 2 },
  { id: 18, name: 'Balo chống gù tiểu học', price: 550000, img: 'balo_laptop.png', categoryId: 3 },
  { id: 19, name: 'Mũ tai bèo chống nắng', price: 110000, img: 'mu_luoi_trai.png', categoryId: 4 },
  { id: 20, name: 'Túi du lịch chống nước', price: 420000, img: 'tui_xach_nu.png', categoryId: 5 }
];

/**
 * HAM KHOI TAO CO SO DU LIEU (DATABASE INITIALIZATION)
 * - Tạo các bảng: categories, products, users nếu chúng chưa tồn tại.
 * - Duyệt mảng dữ liệu mẫu để chèn (Insert) danh mục và sản phẩm ban đầu bằng lệnh "INSERT OR IGNORE".
 * - Tự động tạo 1 tài khoản quản trị mặc định (admin/123456) nếu tài khoản này chưa có trong bảng users.
 * - Sử dụng Transaction để đảm bảo toàn vẹn dữ liệu: Nếu một câu lệnh SQL lỗi, toàn bộ tiến trình sẽ rollback.
 * - Kích hoạt hàm callback onSuccess (ví dụ: loadData lên giao diện) sau khi mọi thứ chạy xong xuôi không lỗi.
 */
export const initDatabase = async (onSuccess?: () => void): Promise<void> => {
    try {
      const database = await getDb();
 
      database.transaction((tx) => {
        // 1. Tạo bảng danh mục (categories) và chèn dữ liệu mẫu
        tx.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY, name TEXT)');
        initialCategories.forEach((category) => {
          tx.executeSql('INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)', [category.id, category.name]);
        });
 
        // 2. Tạo bảng sản phẩm (products) với khóa ngoại FOREIGN KEY nối tới bảng categories
        tx.executeSql(`CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          img TEXT,
          categoryId INTEGER,
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )`);
 
        // Chèn danh sách sản phẩm mẫu vào bảng products
        initialProducts.forEach((product) => {
          tx.executeSql('INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
            [product.id, product.name, product.price, product.img, product.categoryId]);
        });

        // Cập nhật đường dẫn ảnh mẫu mới và chèn thêm sản phẩm mẫu Quần Jeans nếu chưa có
        tx.executeSql("UPDATE products SET img = 'ao_thun.png' WHERE id = 1 OR name = 'Áo sơ mi'");
        tx.executeSql("UPDATE products SET img = 'giay_the_thao.png' WHERE id = 2 OR name = 'Giày sneaker'");
        tx.executeSql("UPDATE products SET img = 'balo_laptop.png' WHERE id = 3 OR name = 'Balo thời trang'");
        tx.executeSql("UPDATE products SET img = 'mu_luoi_trai.png' WHERE id = 4 OR name = 'Mũ lưỡi trai'");
        tx.executeSql("UPDATE products SET img = 'tui_xach_nu.png' WHERE id = 5 OR name = 'Túi xách nữ'");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Quần jeans slimfit', 390000, 'quan_jean.png', 1 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Quần jeans slimfit')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Áo thun trơn Cotton', 180000, 'ao_thun_cotton.png', 1 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Áo thun trơn Cotton')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Áo khoác gió thể thao', 350000, 'ao_khoac_the_thao.png', 1 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Áo khoác gió thể thao')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Giày chạy bộ Performance', 850000, 'giay_chay_bo.png', 2 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Giày chạy bộ Performance')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Giày Sneaker cổ cao', 1200000, 'giay_sneaker_co_cao.png', 2 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Giày Sneaker cổ cao')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Balo du lịch chống nước', 650000, 'balo_du_lich.png', 3 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Balo du lịch chống nước')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Balo mini thời trang', 280000, 'balo_laptop.png', 3 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Balo mini thời trang')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Mũ bucket phong cách', 150000, 'mu_luoi_trai.png', 4 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mũ bucket phong cách')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Mũ len dệt kim', 180000, 'mu_luoi_trai.png', 4 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mũ len dệt kim')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Túi đeo chéo nam nữ', 220000, 'tui_deo_cheo.png', 5 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Túi đeo chéo nam nữ')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Túi tote vải Canvas', 95000, 'tui_tote_canvas.png', 5 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Túi tote vải Canvas')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Áo Hoodie nỉ ngoại', 320000, 'ao_thun.png', 1 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Áo Hoodie nỉ ngoại')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Giày Tây da Oxford', 1500000, 'giay_the_thao.png', 2 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Giày Tây da Oxford')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Balo chống gù tiểu học', 550000, 'balo_laptop.png', 3 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Balo chống gù tiểu học')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Mũ tai bèo chống nắng', 110000, 'mu_luoi_trai.png', 4 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mũ tai bèo chống nắng')");
        tx.executeSql("INSERT INTO products (name, price, img, categoryId) SELECT 'Túi du lịch chống nước', 420000, 'tui_xach_nu.png', 5 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Túi du lịch chống nước')");

        // Cập nhật lại ảnh cho các sản phẩm đã có sẵn để đồng bộ ảnh mới không bị trùng
        tx.executeSql("UPDATE products SET img = 'ao_thun_cotton.png' WHERE name = 'Áo thun trơn Cotton'");
        tx.executeSql("UPDATE products SET img = 'ao_khoac_the_thao.png' WHERE name = 'Áo khoác gió thể thao'");
        tx.executeSql("UPDATE products SET img = 'giay_chay_bo.png' WHERE name = 'Giày chạy bộ Performance'");
        tx.executeSql("UPDATE products SET img = 'giay_sneaker_co_cao.png' WHERE name = 'Giày Sneaker cổ cao'");
        tx.executeSql("UPDATE products SET img = 'balo_du_lich.png' WHERE name = 'Balo du lịch chống nước'");
        tx.executeSql("UPDATE products SET img = 'tui_deo_cheo.png' WHERE name = 'Túi đeo chéo nam nữ'");
        tx.executeSql("UPDATE products SET img = 'tui_tote_canvas.png' WHERE name = 'Túi tote vải Canvas'");
        tx.executeSql("UPDATE products SET img = 'ao_thun.png' WHERE name = 'Áo Hoodie nỉ ngoại'");
        tx.executeSql("UPDATE products SET img = 'giay_the_thao.png' WHERE name = 'Giày Tây da Oxford'");
        tx.executeSql("UPDATE products SET img = 'balo_laptop.png' WHERE name = 'Balo chống gù tiểu học'");
        tx.executeSql("UPDATE products SET img = 'mu_luoi_trai.png' WHERE name = 'Mũ tai bèo chống nắng'");
        tx.executeSql("UPDATE products SET img = 'tui_xach_nu.png' WHERE name = 'Túi du lịch chống nước'");

        // 3. Tạo bảng người dùng (users) với thuộc tính username là duy nhất (UNIQUE)
         tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE,
              password TEXT,
              role TEXT
            )`,
            [],
            () => console.log('Users table created'),
            (_, error) => console.error('Error creating users table:', error)
          );

          // 4. Kiểm tra và chèn tài khoản admin mặc định nếu tài khoản này chưa tồn tại
          tx.executeSql(
            `INSERT INTO users (username, password, role)
            SELECT 'admin', '123456', 'admin'
            WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')`,
            [],
            () => console.log('Admin user added'),
            (_, error) => console.error('Error inserting admin:', error)
          );

          // 5. Tạo bảng đơn hàng (orders)
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS orders (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER,
              orderDate TEXT,
              totalAmount REAL,
              status TEXT,
              recipientName TEXT,
              recipientPhone TEXT,
              shippingAddress TEXT,
              paymentMethod TEXT,
              shippingMethod TEXT,
              shippingFee REAL,
              discountAmount REAL,
              note TEXT,
              FOREIGN KEY(userId) REFERENCES users(id)
            )`,
            [],
            () => console.log('Orders table created'),
            (_, error) => console.error('Error creating orders table:', error)
          );

          // 6. Tạo bảng chi tiết đơn hàng (order_items)
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS order_items (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              orderId INTEGER,
              productId INTEGER,
              quantity INTEGER,
              price REAL,
              FOREIGN KEY(orderId) REFERENCES orders(id),
              FOREIGN KEY(productId) REFERENCES products(id)
            )`,
            [],
            () => console.log('Order items table created'),
            (_, error) => console.error('Error creating order items table:', error)
          );

          // 7. Tạo bảng mã giảm giá (vouchers)
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS vouchers (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              code TEXT UNIQUE,
              type TEXT,
              value REAL,
              minOrderAmount REAL,
              maxDiscount REAL,
              description TEXT
            )`,
            [],
            () => {
              console.log('Vouchers table created');
              // Chèn các mã giảm giá mặc định nếu chưa tồn tại
              const initialVouchers = [
                { code: 'GIAMGIATOT', type: 'percent', value: 10, minOrderAmount: 0, maxDiscount: 100000, description: 'Giảm 10% tổng đơn hàng (tối đa 100k)' },
                { code: 'FREESHIP', type: 'freeship', value: 30000, minOrderAmount: 0, maxDiscount: 30000, description: 'Miễn phí vận chuyển tối đa 30k' },
                { code: 'HE2026', type: 'fixed', value: 50000, minOrderAmount: 300000, maxDiscount: 50000, description: 'Giảm ngay 50k cho đơn hàng từ 300k' }
              ];
              initialVouchers.forEach((v) => {
                tx.executeSql(
                  `INSERT OR IGNORE INTO vouchers (code, type, value, minOrderAmount, maxDiscount, description) VALUES (?, ?, ?, ?, ?, ?)`,
                  [v.code, v.type, v.value, v.minOrderAmount, v.maxDiscount, v.description]
                );
              });
            },
            (_, error) => console.error('Error creating vouchers table:', error)
          );

      },
      // Hồi đáp nếu xảy ra lỗi trong quá trình thực hiện transaction
      (error) => console.error('Transaction error:', error),
      // Hồi đáp khi toàn bộ transaction hoàn thành thành công tốt đẹp
      async () => {  
        console.log('Database initialized');
        try {
          // Thực hiện di trú cột độc lập ngoài transaction để tránh lỗi rollback
          await database.executeSql('ALTER TABLE orders ADD COLUMN paymentMethod TEXT').catch(() => {});
          await database.executeSql('ALTER TABLE orders ADD COLUMN shippingMethod TEXT').catch(() => {});
          await database.executeSql('ALTER TABLE orders ADD COLUMN shippingFee REAL').catch(() => {});
          await database.executeSql('ALTER TABLE orders ADD COLUMN discountAmount REAL').catch(() => {});
          await database.executeSql('ALTER TABLE orders ADD COLUMN note TEXT').catch(() => {});
          console.log('Migrations completed successfully');
        } catch (e) {
          console.log('Migration error ignored:', e);
        }
        if (onSuccess) onSuccess(); 
      });
 
    } catch (error) {
      console.error('initDatabase outer error:', error);
    }
  };
 
/**
 * HAM LAY TAT CA DANH MUC (FETCH ALL CATEGORIES)
 * - Truy vấn toàn bộ dữ liệu từ bảng categories.
 * - Vòng lặp for duyệt qua từng dòng dữ liệu (rows.item(i)), chuyển thành Object và đẩy vào mảng items để trả về.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM categories');
    const items: Category[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * HAM LAY TAT CA SAN PHAM (FETCH ALL PRODUCTS)
 * - Thực hiện câu lệnh SQL SELECT * FROM products để gom hết sản phẩm trong bảng.
 * - Duyệt qua tập kết quả trả về, đóng gói thành mảng cấu trúc Product[] để hiển thị lên màn hình danh sách.
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const database = await getDb();
    const results = await database.executeSql('SELECT * FROM products');
    const items: Product[] = [];
    const rows = results[0].rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * HAM THEM MOI MOT SAN PHAM (ADD PRODUCT)
 * - Tham số nhận vào là một đối tượng sản phẩm lược bỏ trường 'id' (Omit<Product, 'id'>) vì id tự động tăng.
 * - Thực thi câu lệnh INSERT INTO products kèm mảng tham số tương ứng để bảo mật và tránh lỗi cú pháp SQL.
 */
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const database = await getDb();
    await database.executeSql(
      'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
      [product.name, product.price, product.img, product.categoryId]
    );
    console.log('Product added');
  } catch (error) {
    console.error('Error adding product:', error);
  }
};

/**
 * HAM CAP NHAT SAN PHAM (UPDATE PRODUCT)
 * - Nhận vào object product chứa đầy đủ thông tin mới bao gồm cả id.
 * - Thực hiện lệnh UPDATE thay đổi tên, giá, mã loại, và hình ảnh dựa trên điều kiện WHERE id = ?.
 */
export const updateProduct = async (product: Product) => {
    try {
      const database = await getDb();
      await database.executeSql(
        'UPDATE products SET name = ?, price = ?, categoryId = ?, img = ? WHERE id = ?',
        [product.name, product.price, product.categoryId, product.img, product.id]
      );
      console.log('Product updated with image');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };
 
/**
 * HAM XOA SAN PHAM (DELETE PRODUCT)
 * - Nhận vào mã id của sản phẩm cần xóa.
 * - Chạy câu lệnh DELETE FROM products WHERE id = ? để loại bỏ hoàn toàn hàng đó ra khỏi database.
 */
export const deleteProduct = async (id: number) => {
  try {
    const database = await getDb();
    await database.executeSql('DELETE FROM products WHERE id = ?', [id]);
    console.log('Product deleted');
  } catch (error) {
    console.error('Error deleting product:', error);
  }
};

/**
 * HAM LOC SAN PHAM THEO DANH MUC (FILTER PRODUCTS BY CATEGORY)
 * - Nhận vào categoryId (Ví dụ: id = 2 tương ứng với danh mục 'Giày').
 * - Chạy câu lệnh SELECT kết hợp điều kiện WHERE categoryId = ? để trả về danh sách các sản phẩm thuộc nhóm đó.
 */
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM products WHERE categoryId = ?',
      [categoryId]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * HAM TIM KIEM SAN PHAM THEO TEN HOAC TEN DANH MUC (ADVANCED SEARCH)
 * - Thực hiện phép kết JOIN bảng products với bảng categories thông qua mã danh mục trùng nhau.
 * - Dùng từ khóa tìm kiếm tương đối LIKE phối hợp ký tự % để tìm xem từ khóa xuất hiện ở Tên sản phẩm HOẶC Tên danh mục.
 * (Ví dụ: Nhập từ khóa 'áo' -> tìm ra 'Áo sơ mi' (theo tên) và toàn bộ các mặt hàng nằm trong danh mục 'Áo').
 */
export const searchProductsByNameOrCategory = async (keyword: string): Promise<Product[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `
      SELECT products.* FROM products
      JOIN categories ON products.categoryId = categories.id
      WHERE products.name LIKE ? OR categories.name LIKE ?
      `,
      [`%${keyword}%`, `%${keyword}%`]
    );

    const products: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      products.push(rows.item(i));
    }

    return products;
  } catch (error) {
    console.error('Error searching by name or category:', error);
    return [];
  }
};

// ==========================================
// CAC HAM CRUD XU LY CHO BANG NGUOI DUNG (USER)
// ==========================================

/**
 * HAM THEM NGUOI DUNG / DANG KY TAI KHOAN (ADD USER)
 * - Nhận thông tin tài khoản, mật khẩu, vai trò để chèn một hàng mới vào bảng users.
 * - Trả về true nếu thêm thành công, trả về false nếu phát sinh lỗi (Ví dụ: Trùng tên username vì có ràng buộc UNIQUE).
 */
export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('User added');
    return true; 
  } catch (error) {
    console.error('Error adding user:', error);
    return false; 
  }
};

/**
 * HAM CAP NHAT THONG TIN NGUOI DUNG (UPDATE USER)
 * - Tìm kiếm người dùng dựa trên trường user.id và tiến hành ghi đè cập nhật lại username, mật khẩu mới hoặc phân quyền mới.
 */
export const updateUser = async (user: User) => {
  try {
    const db = await getDb();
    await db.executeSql(
      'UPDATE users SET username = ?, password = ?, role = ? WHERE id = ?',
      [user.username, user.password, user.role, user.id]
    );
    console.log('User updated');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

/**
 * HAM XOA NGUOI DUNG THEO ID (DELETE USER BY ID)
 * - Nhận vào id tài khoản, chạy lệnh loại bỏ hàng dữ liệu người dùng đó khỏi bảng users.
 */
export const deleteUser = async (id: number) => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM users WHERE id = ?', [id]);
    console.log('User deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

/**
 * HAM LAY TOAN BO DANH SACH NGUOI DUNG (FETCH ALL USERS)
 * - Thực hiện truy vấn lấy ra toàn bộ danh sách các tài khoản đang lưu trữ trong hệ thống (Thường hiển thị cho giao diện Admin quản lý).
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql('SELECT * FROM users');
    const users: User[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      users.push(rows.item(i));
    }
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * HAM XAC THUC TAI KHOAN DANG NHAP (GET USER BY CREDENTIALS)
 * - Nhận vào cặp thông tin username và password khi người dùng nhập vào Form Đăng nhập.
 * - Chạy câu lệnh quét điều kiện WHERE username = ? AND password = ?.
 * - Nếu tìm thấy bản ghi phù hợp (rows.length > 0), trả về Object thông tin User (để lưu trạng thái đăng nhập và check quyền hạn). 
 * - Nếu sai thông tin, hàm sẽ trả ra null.
 */
export const getUserByCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user by credentials:', error);
    return null;
  }
};

/**
 * HAM LAY THONG TIN CHI TIET NGUOI DUNG BANG ID (GET USER BY ID)
 * - Nhận mã số id định danh, truy vấn tìm kiếm một bản ghi duy nhất khớp ID trong bảng users.
 * - Thường dùng khi bạn cần lấy lại thông tin Profile chi tiết hoặc làm mới dữ liệu của người dùng hiện tại đang đăng nhập hệ thống.
 */
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user by id:', error);
    return null;
  }
};

// ==========================================
// CAC HAM QUAN LY DANH MUC (CATEGORY CRUD)
// ==========================================

export const addCategory = async (name: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('INSERT INTO categories (name) VALUES (?)', [name]);
    console.log('Category added:', name);
    return true;
  } catch (error) {
    console.error('Error adding category:', error);
    return false;
  }
};

export const updateCategory = async (id: number, name: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    console.log('Category updated:', id, name);
    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    return false;
  }
};

export const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('DELETE FROM categories WHERE id = ?', [id]);
    console.log('Category deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
};

// ==========================================
// LOC SAN PHAM NANG CAO (ADVANCED FILTERING)
// ==========================================

export const fetchProductsWithFilter = async (
  categoryId: number | string,
  minPrice: number,
  maxPrice: number,
  keyword: string
): Promise<Product[]> => {
  try {
    const db = await getDb();
    let query = 'SELECT p.* FROM products p JOIN categories c ON p.categoryId = c.id WHERE 1=1';
    const params: any[] = [];

    // Filter by Category
    if (categoryId !== 'all' && categoryId !== 0 && categoryId !== '') {
      query += ' AND p.categoryId = ?';
      params.push(Number(categoryId));
    }

    // Filter by Price Range
    if (minPrice > 0) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice > 0) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    // Filter by Keyword
    if (keyword.trim() !== '') {
      const sqlKeyword = keyword.trim().toLowerCase();
      
      const isMaleSearch = sqlKeyword === 'nam' || sqlKeyword === 'đồ nam' || sqlKeyword === 'do nam' || sqlKeyword === 'thời trang nam' || sqlKeyword === 'thoi trang nam';
      const isFemaleSearch = sqlKeyword === 'nữ' || sqlKeyword === 'nu' || sqlKeyword === 'đồ nữ' || sqlKeyword === 'do nu' || sqlKeyword === 'thời trang nữ' || sqlKeyword === 'thoi trang nu';

      if (isMaleSearch) {
        query += " AND (p.name LIKE ? OR c.name LIKE ? OR p.name LIKE '%nam%' OR p.name LIKE '%thun%' OR p.name LIKE '%khoác%' OR p.name LIKE '%chạy bộ%' OR p.name LIKE '%jeans%' OR p.name LIKE '%sơ mi%' OR p.name LIKE '%lưỡi trai%' OR p.name LIKE '%sneaker%' OR p.name LIKE '%thể thao%')";
        params.push(`%${keyword}%`, `%${keyword}%`);
      } else if (isFemaleSearch) {
        query += " AND (p.name LIKE ? OR c.name LIKE ? OR p.name LIKE '%nữ%' OR p.name LIKE '%nu%' OR p.name LIKE '%túi%' OR p.name LIKE '%tote%' OR p.name LIKE '%mini%' OR p.name LIKE '%len%' OR p.name LIKE '%bucket%' OR p.name LIKE '%xách%')";
        params.push(`%${keyword}%`, `%${keyword}%`);
      } else {
        const hasNam = sqlKeyword.includes('nam');
        const hasNu = sqlKeyword.includes('nữ') || sqlKeyword.includes('nu');
        
        if (hasNam) {
          const cleanKeyword = sqlKeyword.replace('nam', '').replace('đồ', '').replace('do', '').trim();
          if (cleanKeyword === '') {
            query += " AND (p.name LIKE '%nam%' OR p.name LIKE '%thun%' OR p.name LIKE '%khoác%' OR p.name LIKE '%chạy bộ%' OR p.name LIKE '%jeans%' OR p.name LIKE '%sơ mi%' OR p.name LIKE '%lưỡi trai%' OR p.name LIKE '%sneaker%' OR p.name LIKE '%thể thao%')";
          } else {
            query += " AND (p.name LIKE ? OR c.name LIKE ?) AND (p.name NOT LIKE '%nữ%' AND p.name NOT LIKE '%xách%')";
            params.push(`%${cleanKeyword}%`, `%${cleanKeyword}%`);
          }
        } else if (hasNu) {
          const cleanKeyword = sqlKeyword.replace('nữ', '').replace('nu', '').replace('đồ', '').replace('do', '').trim();
          if (cleanKeyword === '') {
            query += " AND (p.name LIKE '%nữ%' OR p.name LIKE '%nu%' OR p.name LIKE '%túi%' OR p.name LIKE '%tote%' OR p.name LIKE '%mini%' OR p.name LIKE '%len%' OR p.name LIKE '%bucket%' OR p.name LIKE '%xách%')";
          } else {
            query += " AND (p.name LIKE ? OR c.name LIKE ?) AND (p.name NOT LIKE '%slimfit%' AND p.name NOT LIKE '%men%')";
            params.push(`%${cleanKeyword}%`, `%${cleanKeyword}%`);
          }
        } else {
          query += ' AND (p.name LIKE ? OR c.name LIKE ?)';
          params.push(`%${keyword}%`, `%${keyword}%`);
        }
      }
    }

    const [results] = await db.executeSql(query, params);
    const items: Product[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('Error filtering products:', error);
    return [];
  }
};

// ==========================================
// QUAN LY DON HANG (ORDER & ORDER ITEM)
// ==========================================

export type Order = {
  id: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  username?: string; // Joint for display
  paymentMethod?: string;
  shippingMethod?: string;
  shippingFee?: number;
  discountAmount?: number;
  note?: string;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName?: string;
  productImg?: string;
};

export const createOrder = async (
  userId: number,
  totalAmount: number,
  items: { productId: number; quantity: number; price: number }[],
  details: { 
    name: string; 
    phone: string; 
    address: string;
    paymentMethod?: string;
    shippingMethod?: string;
    shippingFee?: number;
    discountAmount?: number;
    note?: string;
  }
): Promise<boolean> => {
  try {
    const db = await getDb();
    const orderDate = new Date().toISOString();
    const status = 'Pending'; // Trạng thái ban đầu: Đang chờ duyệt

    await db.transaction(async (tx) => {
      // 1. Chèn vào bảng orders bao gồm cả thông tin thanh toán & giao nhận nâng cao
      tx.executeSql(
        `INSERT INTO orders (userId, orderDate, totalAmount, status, recipientName, recipientPhone, shippingAddress, paymentMethod, shippingMethod, shippingFee, discountAmount, note) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId, 
          orderDate, 
          totalAmount, 
          status, 
          details.name, 
          details.phone, 
          details.address,
          details.paymentMethod || 'COD',
          details.shippingMethod || 'Standard',
          details.shippingFee || 0,
          details.discountAmount || 0,
          details.note || ''
        ],
        (_, results) => {
          const orderId = results.insertId;
          if (orderId) {
            // 2. Chèn các items vào bảng order_items
            items.forEach((item) => {
              tx.executeSql(
                `INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.productId, item.quantity, item.price]
              );
            });
          }
        },
        (_, err) => {
          console.error('Insert order SQL error:', err);
          throw err;
        }
      );
    });

    console.log('Order created successfully');
    return true;
  } catch (error) {
    console.error('Error creating order:', error);
    return false;
  }
};

export const fetchOrdersByUser = async (userId: number): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      'SELECT * FROM orders WHERE userId = ? ORDER BY orderDate DESC',
      [userId]
    );
    const orders: Order[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      orders.push(rows.item(i));
    }
    return orders;
  } catch (error) {
    console.error('Error fetching orders by user:', error);
    return [];
  }
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `SELECT o.*, u.username FROM orders o 
       LEFT JOIN users u ON o.userId = u.id 
       ORDER BY o.orderDate DESC`
    );
    const orders: Order[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      orders.push(rows.item(i));
    }
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: number, status: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    console.log('Order status updated:', orderId, status);
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
};

export const fetchOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  try {
    const db = await getDb();
    const [results] = await db.executeSql(
      `SELECT oi.*, p.name as productName, p.img as productImg FROM order_items oi 
       JOIN products p ON oi.productId = p.id 
       WHERE oi.orderId = ?`,
      [orderId]
    );
    const items: OrderItem[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i));
    }
    return items;
  } catch (error) {
    console.error('Error fetching order items:', error);
    return [];
  }
};

// ==========================================
// CAP NHAT PROIFLE NGUOI DUNG
// ==========================================

export const updateUserProfile = async (
  id: number,
  username: string,
  password?: string
): Promise<boolean> => {
  try {
    const db = await getDb();
    if (password && password.trim() !== '') {
      await db.executeSql(
        'UPDATE users SET username = ?, password = ? WHERE id = ?',
        [username, password, id]
      );
    } else {
      await db.executeSql(
        'UPDATE users SET username = ? WHERE id = ?',
        [username, id]
      );
    }
    console.log('User profile updated:', id);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
};

export const getImageSource = (imagePath: string) => {
  if (
    imagePath &&
    (imagePath.startsWith('file://') ||
      imagePath.startsWith('content://') ||
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://'))
  ) {
    return { uri: imagePath };
  }
  switch (imagePath) {
    case 'tui_tote_canvas.png':
      return require('../images/tui_tote_canvas.png');
    case 'tui_deo_cheo.png':
      return require('../images/tui_deo_cheo.png');
    case 'ao_thun_cotton.png':
      return require('../images/ao_thun_cotton.png');
    case 'ao_khoac_the_thao.png':
      return require('../images/ao_khoac_the_thao.png');
    case 'giay_chay_bo.png':
      return require('../images/giay_chay_bo.png');
    case 'giay_sneaker_co_cao.png':
      return require('../images/giay_sneaker_co_cao.png');
    case 'balo_du_lich.png':
      return require('../images/balo_du_lich.png');
    case 'ao_thun.png':
      return require('../images/ao_thun.png');
    case 'balo_laptop.png':
      return require('../images/balo_laptop.png');
    case 'giay_the_thao.png':
      return require('../images/giay_the_thao.png');
    case 'quan_jean.png':
      return require('../images/quan_jean.png');
    case 'tui_xach_nu.png':
      return require('../images/tui_xach_nu.png');
    case 'mu_luoi_trai.png':
      return require('../images/mu_luoi_trai.png');
    case 'banner.png':
      return require('../images/banner.png');
    case 'hinh1.jpg':
    default:
      return require('../images/hinh1.jpg');
  }
};

// ==========================================
// QUAN LY MA GIAM GIA (VOUCHERS)
// ==========================================

export type Voucher = {
  id: number;
  code: string;
  type: 'percent' | 'fixed' | 'freeship';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  description: string;
};

export const fetchVoucherByCode = async (code: string): Promise<Voucher | null> => {
  try {
    const database = await getDb();
    const [results] = await database.executeSql(
      'SELECT * FROM vouchers WHERE code = ?',
      [code.trim().toUpperCase()]
    );
    const rows = results.rows;
    if (rows.length > 0) {
      return rows.item(0) as Voucher;
    }
    return null;
  } catch (error) {
    console.error('Error fetching voucher by code:', error);
    return null;
  }
};

export const fetchAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const database = await getDb();
    const [results] = await database.executeSql('SELECT * FROM vouchers');
    const items: Voucher[] = [];
    const rows = results.rows;
    for (let i = 0; i < rows.length; i++) {
      items.push(rows.item(i) as Voucher);
    }
    return items;
  } catch (error) {
    console.error('Error fetching all vouchers:', error);
    return [];
  }
};