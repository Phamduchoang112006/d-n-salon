<?php
// admin_reviews.php - Trang 5: Quản Lý Đánh Giá Khách Hàng
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$db = get_db();
$reviews = $db['reviews'] ?? [];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Quản Lý Đánh Giá Khách Hàng</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { salon: { primary: '#4A6B5D', secondary: '#C89F82' } }
        }
      }
    }
  </script>
</head>
<body class="bg-[#F8F6F0] min-h-screen text-stone-900 flex">

  <!-- SIDEBAR NAV -->
  <?php render_admin_nav('reviews'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Quản Lý Đánh Giá Khách Hàng</h2>
        <p class="text-xs text-stone-500">Xem nhận xét & phản hồi chất lượng từ người dùng</p>
      </div>
      <div class="text-xs text-stone-500 bg-stone-100 px-3.5 py-2 rounded-xl font-bold">
        Tổng: <?= count($reviews) ?> đánh giá
      </div>
    </header>

    <main class="p-8 space-y-6 flex-1 overflow-y-auto">
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <?php foreach ($reviews as $rev): ?>
          <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <img src="<?= htmlspecialchars($rev['avatar']) ?>" class="w-10 h-10 rounded-full object-cover border" />
              <div>
                <h4 class="font-bold text-xs text-stone-900"><?= htmlspecialchars($rev['name']) ?></h4>
                <p class="text-[10px] text-[#C89F82] font-semibold"><?= htmlspecialchars($rev['service']) ?></p>
              </div>
            </div>
            <div class="text-amber-400 text-xs">★★★★★</div>
            <p class="text-xs text-stone-600 italic leading-relaxed">
              "<?= htmlspecialchars($rev['content']) ?>"
            </p>
          </div>
        <?php endforeach; ?>
      </div>

    </main>
  </div>

  <script>
    function logoutAdmin() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=admin');
    }
  </script>
</body>
</html>
