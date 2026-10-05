# PHIẾU TỰ CHẤM ĐIỂM & HƯỚNG DẪN BÁO CÁO
## HỌ VÀ TÊN: ĐẶNG KHẢI
## ĐỀ TÀI: DANGKHAI FASHION APP (REACT NATIVE & SQLITE)

---

### I. CHỨC NĂNG QUẢN TRỊ (6.0 ĐIỂM)

| STT | Yêu cầu chức năng | Điểm tối đa | Tự đánh giá | Vị trí file mã nguồn (Code) & Hướng dẫn test |
| :--- | :--- | :---: | :---: | :--- |
| **1** | **Quản trị loại sản phẩm (Danh mục)**<br>- Xem, thêm, sửa, xóa danh mục sản phẩm.<br>- Thêm sản phẩm cho loại tương ứng. | **2.0 đ** | **2.0 / 2.0 đ** | - **File Code:** [CategoryManagement.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/categories/CategoryManagement.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `fetchCategories`, `addCategory`, `updateCategory`, `deleteCategory`).<br>- **Test Thêm sản phẩm cho loại:** Nút `+ SP` cạnh mỗi danh mục điều hướng sang trang quản lý sản phẩm và tự động điền danh mục tương ứng (xem [ProductManagement.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/products/ProductManagement.tsx)).<br>- **Cách test:** Đăng nhập tài khoản `admin` -> Tab **Admin** ⚙️ -> Chọn **Quản Lý Danh Mục**. |
| **2** | **Quản trị sản phẩm**<br>- Xem danh sách, thêm, sửa, xóa sản phẩm.<br>- Hỗ trợ chọn ảnh từ thư viện thiết bị. | **2.0 đ** | **2.0 / 2.0 đ** | - **File Code:** [ProductManagement.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/products/ProductManagement.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `fetchProducts`, `addProduct`, `updateProduct`, `deleteProduct`).<br>- **Cách test:** Vào **Quản Lý Sản Phẩm** -> Nhập thông tin sản phẩm, nhấn **Chọn ảnh** -> nhấn **Lưu sản phẩm** để lưu hoặc click nút Sửa/Xóa. |
| **3** | **Quản trị user**<br>- Xem danh sách người dùng.<br>- Cập nhật vai trò (user/admin).<br>- Xóa người dùng. | **2.0 đ** | **2.0 / 2.0 đ** | - **File Code:** [UserManagement.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/users/UserManagement.tsx), [AddUser.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/users/AddUser.tsx), [EditUser.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/users/EditUser.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts).<br>- **Cách test:** Vào **Quản Lý Người Dùng** -> Nhấn **Đổi vai trò** hoặc **Xóa** người dùng (không được phép tự xóa tài khoản của chính mình). |

---

### II. BỔ SUNG CHỨC NĂNG NGƯỜI DÙNG VÀ QUẢN TRỊ (4.0 ĐIỂM)

| STT | Yêu cầu chức năng | Điểm tối đa | Tự đánh giá | Vị trí file mã nguồn (Code) & Hướng dẫn test |
| :--- | :--- | :---: | :---: | :--- |
| **4** | **Tìm kiếm theo tên/danh mục** | **1.0 đ** | **1.0 / 1.0 đ** | - **File Code:** [HomeScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/HomeScreen.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `fetchProductsWithFilter` thực hiện SQL JOIN và LIKE).<br>- **Cách test:** Nhập từ khóa tại thanh tìm kiếm trên trang chủ (Ví dụ: `áo`, `balo`...) để tìm theo tên sản phẩm hoặc tên danh mục. |
| **5** | **Lọc sản phẩm theo khoảng giá** | **1.0 đ** | **1.0 / 1.0 đ** | - **File Code:** [HomeScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/HomeScreen.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `fetchProductsWithFilter`).<br>- **Cách test:** Tại trang chủ, click **▼ Lọc giá** -> điền giá tối thiểu, giá tối đa để lọc. |
| **6** | **Chức năng khác của người dùng**<br>- Xem và cập nhật số lượng/xóa giỏ hàng.<br>- Checkout đơn hàng và Đặt hàng.<br>- Xem lịch sử mua hàng.<br>- Cập nhật thông tin cá nhân. | **1.0 đ** | **1.0 / 1.0 đ** | - **Giỏ hàng:** [CartScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/CartScreen.tsx).<br>- **Checkout & Đặt hàng:** [CheckoutScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/CheckoutScreen.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `createOrder`).<br>- **Lịch sử mua hàng:** [OrderHistoryScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/OrderHistoryScreen.tsx).<br>- **Cập nhật profile:** [ProfileScreen.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/ProfileScreen.tsx). |
| **7** | **Chức năng khác của admin**<br>- Quản trị đơn hàng: xem danh sách đơn hàng toàn hệ thống, cập nhật tình trạng đơn hàng. | **1.0 đ** | **1.0 / 1.0 đ** | - **File Code:** [AdminOrderManagement.tsx](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/admin/orders/AdminOrderManagement.tsx) và [database.ts](file:///c:/Users/Admin/ReactNative24cntt1a/src/components/database.ts) (hàm `fetchAllOrders`, `updateOrderStatus`).<br>- **Cách test:** Vào **Quản Lý Đơn Hàng** -> Chọn đơn hàng -> Thay đổi tình trạng trong dropdown (*Pending, Processing, Shipping, Completed, Cancelled*). |

---

### III. TỔNG ĐIỂM TỰ ĐÁNH GIÁ: **10 / 10 ĐIỂM** (Hoàn thành xuất sắc 100% tất cả yêu cầu)
