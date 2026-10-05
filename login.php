<?php
// login.php - Trang Đăng Nhập, Đăng Ký, Quên Mật Khẩu Khách Hàng, Stylist & Quản Trị Viên (PHP)
require_once __DIR__ . '/db.php';
$db = get_db();
$pdo = get_pdo();

$errorMsg = '';
$successMsg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mode = $_POST['mode'] ?? 'customer_login';

    if ($mode === 'customer_login') {
        $phone = trim($_POST['phone'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($phone) || empty($password)) {
            $errorMsg = 'Vui lòng điền đầy đủ Số điện thoại và Mật khẩu!';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ? LIMIT 1");
            $stmt->execute([$phone]);
            $userObj = $stmt->fetch();

            if ($userObj) {
                if ($userObj['password'] !== $password) {
                    $errorMsg = 'Mật khẩu đăng nhập không chính xác!';
                } else {
                    $_SESSION['user'] = [
                        'id' => $userObj['id'],
                        'name' => $userObj['name'],
                        'phone' => $userObj['phone'],
                        'email' => $userObj['email'] ?? '',
                        'role' => $userObj['role'] ?? 'customer',
                        'loyalty_points' => $userObj['loyalty_points'] ?? 0
                    ];
                    header('Location: index.php');
                    exit;
                }
            } else {
                // Tạo tài khoản mặc định cho lần đầu nhập SĐT chưa có trong DB
                $stmtIns = $pdo->prepare("INSERT INTO users (name, phone, password, role, loyalty_points) VALUES (?, ?, ?, 'customer', 10)");
                $nameGuest = "Khách Hàng (" . substr($phone, -4) . ")";
                $stmtIns->execute([$nameGuest, $phone, $password]);

                $_SESSION['user'] = [
                    'name' => $nameGuest,
                    'phone' => $phone,
                    'email' => '',
                    'role' => 'customer',
                    'loyalty_points' => 10
                ];
                header('Location: index.php');
                exit;
            }
        }
    } elseif ($mode === 'customer_register') {
        $name = trim($_POST['name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');
        $confirm = trim($_POST['confirm_password'] ?? '');

        if (empty($name) || empty($phone) || empty($password)) {
            $errorMsg = 'Vui lòng nhập Họ tên, Số điện thoại và Mật khẩu tạo mới!';
        } elseif (!preg_match('/^[0-9]{9,11}$/', $phone)) {
            $errorMsg = 'Số điện thoại không hợp lệ (Phải từ 9 - 11 chữ số)!';
        } elseif (strlen($password) < 6) {
            $errorMsg = 'Mật khẩu tạo mới phải chứa tối thiểu 6 ký tự!';
        } elseif ($password !== $confirm) {
            $errorMsg = 'Mật khẩu xác nhận không khớp với Mật khẩu vừa tạo!';
        } else {
            $stmtCk = $pdo->prepare("SELECT COUNT(*) FROM users WHERE phone = ?");
            $stmtCk->execute([$phone]);
            if ($stmtCk->fetchColumn() > 0) {
                $errorMsg = 'Số điện thoại này đã được đăng ký tài khoản trước đó! Vui lòng chọn Quên Mật Khẩu hoặc Đăng Nhập.';
            } else {
                $ins = $pdo->prepare("INSERT INTO users (name, phone, password, email, role, loyalty_points) VALUES (?, ?, ?, ?, 'customer', 20)");
                $ins->execute([$name, $phone, $password, $email]);

                $_SESSION['user'] = [
                    'name' => $name,
                    'phone' => $phone,
                    'email' => $email,
                    'role' => 'customer',
                    'loyalty_points' => 20
                ];
                header('Location: index.php?registered=1');
                exit;
            }
        }
    } elseif ($mode === 'customer_forgot') {
        $phone = trim($_POST['phone'] ?? '');
        $new_password = trim($_POST['new_password'] ?? '');
        $confirm = trim($_POST['confirm_new_password'] ?? '');

        if (empty($phone) || empty($new_password)) {
            $errorMsg = 'Vui lòng nhập Số điện thoại và Mật khẩu mới!';
        } elseif (strlen($new_password) < 6) {
            $errorMsg = 'Mật khẩu mới phải chứa tối thiểu 6 ký tự!';
        } elseif ($new_password !== $confirm) {
            $errorMsg = 'Mật khẩu mới và Nhập lại mật khẩu không trùng khớp!';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE phone = ? LIMIT 1");
            $stmt->execute([$phone]);
            $userObj = $stmt->fetch();

            if (!$userObj) {
                $errorMsg = 'Số điện thoại này chưa đăng ký trong hệ thống!';
            } else {
                $upd = $pdo->prepare("UPDATE users SET password = ? WHERE phone = ?");
                $upd->execute([$new_password, $phone]);
                $successMsg = '🔑 Đặt lại mật khẩu thành công! Vui lòng Đăng nhập bằng mật khẩu mới.';
                $tab = 'login';
            }
        }
    } elseif ($mode === 'stylist_login') {
        $stylist_name = trim($_POST['stylist_name'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (!empty($stylist_name)) {
            $stmt = $pdo->prepare("SELECT * FROM stylists WHERE name = ? LIMIT 1");
            $stmt->execute([$stylist_name]);
            $matched = $stmt->fetch();
            if ($matched) {
                $_SESSION['stylist'] = [
                    'id' => $matched['id'],
                    'name' => $matched['name'],
                    'role' => $matched['role'],
                    'avatar' => $matched['avatar'],
                    'level' => $matched['level'] ?? 'Senior'
                ];
                header('Location: stylist_dashboard.php');
                exit;
            } else {
                $errorMsg = 'Không tìm thấy thông tin Thợ cắt tóc này!';
            }
        } else {
            $errorMsg = 'Vui lòng chọn Stylist!';
        }
    } elseif ($mode === 'admin_login') {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if ($username === 'admin' && $password === '123456') {
            $_SESSION['admin'] = true;
            header('Location: admin.php');
            exit;
        } else {
            $errorMsg = 'Tên đăng nhập hoặc Mật khẩu Quản trị không đúng!';
        }
    }
}

$tab = $_GET['tab'] ?? ($tab ?? 'login');
if (isset($_GET['error']) && $_GET['error'] === 'forbidden') {
    $errorMsg = '🚫 BỊ CẤM TRUY CẬP: Tài khoản Khách hàng không được phép vào Trang Quản Trị Admin! Vui lòng đăng nhập tài khoản Quản Trị Viên.';
    $tab = 'admin';
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Hair Studio - Đăng Nhập / Đăng Ký / Quên Mật Khẩu</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            salon: {
              bg: '#FBF9F5',
              surface: '#FFFFFF',
              primary: '#4A6B5D',
              secondary: '#C89F82',
              border: '#E7E0D8'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif']
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#F8F6F0] min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-4xl bg-white rounded-3xl border border-stone-200 shadow-2xl overflow-hidden grid md:grid-cols-12 min-h-[580px]">
    
    <!-- LEFT BANNER -->
    <div class="hidden md:flex md:col-span-5 relative bg-stone-900 p-8 text-white flex-col justify-between overflow-hidden">
      <img src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800" class="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
      <div class="relative z-10 space-y-2">
        <div class="w-12 h-12 rounded-full bg-salon-primary text-white flex items-center justify-center font-serif font-bold text-xl">L</div>
        <h2 class="font-serif text-2xl font-bold">LUMIÈRE Hair Studio</h2>
        <p class="text-xs text-stone-300 leading-relaxed">Hệ Thống Đặt Lịch & Quản Lý Ca Hẹn Stylist Cao Cấp 2026</p>
      </div>

      <div class="relative z-10 space-y-3 bg-stone-900/80 p-4 rounded-2xl border border-stone-700 text-xs backdrop-blur-sm">
        <div class="flex items-center gap-2 text-emerald-400 font-bold">
          <span>🎁 Đăng ký tài khoản nhận 20 điểm Loyalty</span>
        </div>
        <p class="text-stone-300 text-[11px]">Bấm vào **biểu tượng con mắt 👁️** để hiển thị hoặc ẩn mật khẩu khi nhập.</p>
      </div>

      <div class="relative z-10 text-xs text-stone-400">© 2026 LUMIÈRE Hair Studio</div>
    </div>

    <!-- RIGHT FORM CONTAINER -->
    <div class="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-white">
      <div class="space-y-1">
        <h1 class="font-serif text-2xl font-bold text-stone-900">Tài Khoản & Đăng Nhập</h1>
        <p class="text-xs text-stone-500">Đăng nhập Khách hàng, Đăng ký mới, Quên Mật Khẩu, Stylist & Admin</p>
      </div>

      <?php if ($errorMsg): ?>
        <div class="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span>⚠️</span> <span><?= htmlspecialchars($errorMsg) ?></span>
        </div>
      <?php endif; ?>

      <?php if ($successMsg): ?>
        <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <span>✅</span> <span><?= htmlspecialchars($successMsg) ?></span>
        </div>
      <?php endif; ?>

      <!-- TAB SELECTOR -->
      <div class="grid grid-cols-5 bg-stone-100 p-1 rounded-2xl border border-stone-200 gap-1 text-[11px] font-bold text-center">
        <button id="btnCustomerTab" onclick="switchTab('login')" class="py-2.5 rounded-xl transition">👤 Đăng Nhập</button>
        <button id="btnRegisterTab" onclick="switchTab('register')" class="py-2.5 rounded-xl transition">📝 Đăng Ký</button>
        <button id="btnForgotTab" onclick="switchTab('forgot')" class="py-2.5 rounded-xl transition">🔑 Quên MK</button>
        <button id="btnStylistTab" onclick="switchTab('stylist')" class="py-2.5 rounded-xl transition">✂️ Stylist</button>
        <button id="btnAdminTab" onclick="switchTab('admin')" class="py-2.5 rounded-xl transition">🔐 Admin</button>
      </div>

      <!-- 1. CUSTOMER LOGIN FORM -->
      <form id="formCustomer" method="POST" class="space-y-3.5">
        <input type="hidden" name="mode" value="customer_login" />
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Số Điện Thoại Khách Hàng</label>
          <input type="tel" name="phone" required placeholder="Nhập số điện thoại (ví dụ: 0912345678)" value="" class="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <label class="block text-xs font-bold uppercase text-stone-700">Mật Khẩu</label>
            <a href="javascript:void(0)" onclick="switchTab('forgot')" class="text-[11px] text-salon-primary font-bold hover:underline">Quên mật khẩu?</a>
          </div>
          <div class="relative">
            <input type="password" id="custPass" name="password" required placeholder="Mật khẩu của bạn" value="" class="w-full px-4 py-3 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('custPass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-salon-primary hover:bg-stone-800 text-white font-bold text-xs shadow-lg transition">
          🚀 ĐĂNG NHẬP KHÁCH HÀNG
        </button>
        <div class="text-center text-xs text-stone-500 pt-1">
          Chưa có tài khoản? <a href="javascript:void(0)" onclick="switchTab('register')" class="text-salon-primary font-bold hover:underline">Đăng ký ngay (Tặng 20 điểm)</a>
        </div>
      </form>

      <!-- 2. CUSTOMER REGISTER FORM -->
      <form id="formRegister" method="POST" class="space-y-3 hidden" onsubmit="return validateRegisterForm()">
        <input type="hidden" name="mode" value="customer_register" />
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Họ Và Tên Khách Hàng</label>
          <input type="text" name="name" required placeholder="Nguyễn Văn A" class="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Số Điện Thoại</label>
            <input type="tel" name="phone" required placeholder="09xxxx____" class="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Email (Không bắt buộc)</label>
            <input type="email" name="email" placeholder="khach@gmail.com" class="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Mật Khẩu Tạo Mới (Tối thiểu 6 ký tự)</label>
          <div class="relative">
            <input type="password" id="regPass" name="password" required placeholder="••••••••" oninput="checkPasswordStrength(this.value, 'regStrength', 'regHelp')" class="w-full px-4 py-2.5 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('regPass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
          
          <!-- STRENGTH METER -->
          <div class="mt-1 flex items-center justify-between text-[11px]">
            <span id="regHelp" class="text-stone-400">Tối thiểu 6 ký tự</span>
            <span id="regStrength" class="font-bold text-stone-400">Độ mạnh: Chưa nhập</span>
          </div>
          <div class="w-full bg-stone-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div id="regBar" class="h-full w-0 bg-rose-500 transition-all duration-300"></div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Xác Nhận Nhập Lại Mật Khẩu</label>
          <div class="relative">
            <input type="password" id="regConfirm" name="confirm_password" required placeholder="••••••••" class="w-full px-4 py-2.5 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('regConfirm', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-lg transition">
          ✨ ĐĂNG KÝ TÀI KHOẢN MỚI
        </button>
      </form>

      <!-- 3. CUSTOMER FORGOT PASSWORD FORM -->
      <form id="formForgot" method="POST" class="space-y-3 hidden" onsubmit="return validateForgotForm()">
        <input type="hidden" name="mode" value="customer_forgot" />
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Số Điện Thoại Đã Đăng Ký</label>
          <input type="tel" name="phone" required placeholder="0912345678" class="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Mật Khẩu Mới (Tối thiểu 6 ký tự)</label>
          <div class="relative">
            <input type="password" id="forgotPass" name="new_password" required placeholder="••••••••" oninput="checkPasswordStrength(this.value, 'forgotStrength', 'forgotHelp', 'forgotBar')" class="w-full px-4 py-2.5 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('forgotPass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
          
          <div class="mt-1 flex items-center justify-between text-[11px]">
            <span id="forgotHelp" class="text-stone-400">Tối thiểu 6 ký tự</span>
            <span id="forgotStrength" class="font-bold text-stone-400">Độ mạnh: Chưa nhập</span>
          </div>
          <div class="w-full bg-stone-200 h-1.5 rounded-full mt-1 overflow-hidden">
            <div id="forgotBar" class="h-full w-0 bg-rose-500 transition-all duration-300"></div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Nhập Lại Mật Khẩu Mới</label>
          <div class="relative">
            <input type="password" id="forgotConfirm" name="confirm_new_password" required placeholder="••••••••" class="w-full px-4 py-2.5 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('forgotConfirm', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
        </div>

        <button type="submit" class="w-full py-3.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-lg transition">
          🔑 XÁC NHẬN ĐẶT LẠI MẬT KHẨU MỚI
        </button>
      </form>

      <!-- 4. STYLIST FORM -->
      <form id="formStylist" method="POST" class="space-y-4 hidden">
        <input type="hidden" name="mode" value="stylist_login" />
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Chọn Tên Thợ Cắt Tóc / Stylist</label>
          <select name="stylist_name" required class="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none">
            <option value="" disabled selected>-- Chọn Stylist / Thợ --</option>
            <?php foreach ($db['stylists'] as $st): ?>
              <?php if (($st['isAny'] ?? 0) == 1) continue; ?>
              <option value="<?= htmlspecialchars($st['name']) ?>"><?= htmlspecialchars($st['name']) ?> - <?= htmlspecialchars($st['role']) ?> (<?= htmlspecialchars($st['level'] ?? 'Senior') ?>)</option>
            <?php endforeach; ?>
          </select>
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Mật Khẩu Stylist</label>
          <div class="relative">
            <input type="password" id="stylistPass" name="password" required placeholder="Mật khẩu thợ" value="" class="w-full px-4 py-3 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('stylistPass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-[#C89F82] hover:bg-stone-800 text-white font-bold text-xs shadow-lg transition">
          ✂️ ĐĂNG NHẬP CỔNG STYLIST
        </button>
      </form>

      <!-- 5. ADMIN FORM -->
      <form id="formAdmin" method="POST" class="space-y-4 hidden">
        <input type="hidden" name="mode" value="admin_login" />
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Tên Đăng Nhập Quản Trị</label>
          <input type="text" name="username" required placeholder="Tên đăng nhập (ví dụ: admin)" value="" class="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Mật Khẩu Quản Trị</label>
          <div class="relative">
            <input type="password" id="adminPass" name="password" required placeholder="••••••••" value="" class="w-full px-4 py-3 pr-11 rounded-2xl border border-stone-200 text-sm focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            <button type="button" onclick="togglePasswordVisibility('adminPass', this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1" title="Xem/Ẩn Mật Khẩu">
              <span class="eye-icon text-lg">👁️</span>
            </button>
          </div>
        </div>
        <button type="submit" class="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-lg transition">
          🔓 ĐĂNG NHẬP QUẢN TRỊ VIÊN
        </button>
      </form>

      <div class="text-center pt-2 border-t border-stone-100">
        <a href="index.php" class="text-xs text-salon-primary font-bold hover:underline">← Quay về Trang chủ LUMIÈRE Salon</a>
      </div>
    </div>
  </div>

  <script>
    const activeTab = "<?= $tab ?>";

    // 👁️ Bật / Tắt Hiển Thị Mật Khẩu
    function togglePasswordVisibility(inputId, btn) {
      const input = document.getElementById(inputId);
      if (!input) return;
      const eyeSpan = btn.querySelector('.eye-icon');

      if (input.type === 'password') {
        input.type = 'text';
        if (eyeSpan) eyeSpan.innerHTML = '🙈';
        btn.title = 'Ẩn mật khẩu';
      } else {
        input.type = 'password';
        if (eyeSpan) eyeSpan.innerHTML = '👁️';
        btn.title = 'Xem mật khẩu';
      }
    }

    function switchTab(tab) {
      document.getElementById('formCustomer').classList.add('hidden');
      document.getElementById('formRegister').classList.add('hidden');
      document.getElementById('formForgot').classList.add('hidden');
      document.getElementById('formStylist').classList.add('hidden');
      document.getElementById('formAdmin').classList.add('hidden');

      const defaultClass = "py-2.5 rounded-xl transition text-stone-500 hover:text-stone-900";
      const activeClass = "py-2.5 rounded-xl transition bg-white text-stone-900 shadow";

      document.getElementById('btnCustomerTab').className = defaultClass;
      document.getElementById('btnRegisterTab').className = defaultClass;
      document.getElementById('btnForgotTab').className = defaultClass;
      document.getElementById('btnStylistTab').className = defaultClass;
      document.getElementById('btnAdminTab').className = defaultClass;

      if (tab === 'register') {
        document.getElementById('formRegister').classList.remove('hidden');
        document.getElementById('btnRegisterTab').className = activeClass;
      } else if (tab === 'forgot') {
        document.getElementById('formForgot').classList.remove('hidden');
        document.getElementById('btnForgotTab').className = activeClass;
      } else if (tab === 'stylist') {
        document.getElementById('formStylist').classList.remove('hidden');
        document.getElementById('btnStylistTab').className = activeClass;
      } else if (tab === 'admin') {
        document.getElementById('formAdmin').classList.remove('hidden');
        document.getElementById('btnAdminTab').className = activeClass;
      } else {
        document.getElementById('formCustomer').classList.remove('hidden');
        document.getElementById('btnCustomerTab').className = activeClass;
      }
    }

    // Kiểm tra độ dài & Độ mạnh mật khẩu Real-Time
    function checkPasswordStrength(val, textId, helpId, barId = 'regBar') {
      const textElem = document.getElementById(textId);
      const helpElem = document.getElementById(helpId);
      const barElem = document.getElementById(barId);

      if (!val || val.length === 0) {
        textElem.innerHTML = "Độ mạnh: Chưa nhập";
        textElem.className = "font-bold text-stone-400";
        helpElem.innerHTML = "Tối thiểu 6 ký tự";
        helpElem.className = "text-stone-400";
        if (barElem) barElem.style.width = "0%";
        return;
      }

      if (val.length < 6) {
        textElem.innerHTML = "⚠️ Yếu (Quá ngắn)";
        textElem.className = "font-bold text-rose-600";
        helpElem.innerHTML = `❌ Chưa đủ 6 ký tự (${val.length}/6)`;
        helpElem.className = "text-rose-600 font-bold";
        if (barElem) {
          barElem.style.width = "30%";
          barElem.className = "h-full bg-rose-500 transition-all duration-300";
        }
      } else {
        let hasNum = /\d/.test(val);
        let hasLetter = /[a-zA-Z]/.test(val);
        if (val.length >= 8 && hasNum && hasLetter) {
          textElem.innerHTML = "💪 Rất Mạnh";
          textElem.className = "font-bold text-emerald-600";
          if (barElem) {
            barElem.style.width = "100%";
            barElem.className = "h-full bg-emerald-500 transition-all duration-300";
          }
        } else {
          textElem.innerHTML = "✅ Khá Mạnh (Hợp lệ)";
          textElem.className = "font-bold text-amber-600";
          if (barElem) {
            barElem.style.width = "70%";
            barElem.className = "h-full bg-amber-500 transition-all duration-300";
          }
        }
        helpElem.innerHTML = `✅ Đã đủ độ dài (${val.length} ký tự)`;
        helpElem.className = "text-emerald-600 font-semibold";
      }
    }

    function validateRegisterForm() {
      const pass = document.getElementById('regPass').value;
      const confirm = document.getElementById('regConfirm').value;
      if (pass.length < 6) {
        alert('⚠️ Mật khẩu tạo mới phải có ít nhất 6 ký tự!');
        return false;
      }
      if (pass !== confirm) {
        alert('⚠️ Mật khẩu xác nhận không khớp với mật khẩu vừa nhập!');
        return false;
      }
      return true;
    }

    function validateForgotForm() {
      const pass = document.getElementById('forgotPass').value;
      const confirm = document.getElementById('forgotConfirm').value;
      if (pass.length < 6) {
        alert('⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!');
        return false;
      }
      if (pass !== confirm) {
        alert('⚠️ Mật khẩu mới và Nhập lại mật khẩu không trùng khớp!');
        return false;
      }
      return true;
    }

    if (activeTab === 'admin' || activeTab === 'stylist' || activeTab === 'register' || activeTab === 'forgot') {
      switchTab(activeTab);
    }
  </script>
</body>
</html>
