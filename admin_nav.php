<?php
// admin_nav.php - Thanh Điều Hướng Sidebar Dùng Chung Cho Các Trang Admin
require_once __DIR__ . '/db.php';

if (!is_admin_logged_in()) {
    header('Location: login.php?tab=admin&error=forbidden');
    exit;
}

function render_admin_nav($activeTab = 'dashboard') {
    $navItems = [
        'dashboard' => ['title' => 'Tổng Quan', 'icon' => '📊', 'link' => 'admin.php'],
        'appointments' => ['title' => 'Quản Lý Lịch Hẹn', 'icon' => '📅', 'link' => 'admin_appointments.php'],
        'chat' => ['title' => 'Hỗ Trợ Chat', 'icon' => '💬', 'link' => 'admin_chat.php'],
        'services' => ['title' => 'Quản Lý Dịch Vụ', 'icon' => '✂️', 'link' => 'admin_services.php'],
        'stylists' => ['title' => 'Đội Ngũ Stylist', 'icon' => '👤', 'link' => 'admin_stylists.php'],
        'inventory' => ['title' => 'Quản Lý Kho Hóa Chất', 'icon' => '📦', 'link' => 'admin_inventory.php'],
        'leaves' => ['title' => 'Duyệt Nghỉ Phép', 'icon' => '📝', 'link' => 'admin_leaves.php'],
        'salary' => ['title' => 'Báo Cáo Lương', 'icon' => '💵', 'link' => 'admin_salary.php'],
        'reviews' => ['title' => 'Quản Lý Đánh Giá', 'icon' => '⭐', 'link' => 'admin_reviews.php'],
    ];
    ?>
    <aside class="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between p-5 min-h-screen border-r border-stone-800 shrink-0">
      <div class="space-y-6">
        <!-- BRAND -->
        <a href="admin.php" class="flex items-center gap-3 px-2">
          <div class="w-10 h-10 rounded-full bg-[#4A6B5D] text-white flex items-center justify-center font-serif font-bold text-xl">L</div>
          <div>
            <h1 class="font-serif font-bold text-white text-base leading-tight">LUMIÈRE Admin</h1>
            <p class="text-[10px] text-emerald-400 font-bold">● MySQL Connected</p>
          </div>
        </a>

        <!-- NAV LINKS -->
        <nav class="space-y-1">
          <?php foreach ($navItems as $key => $item): ?>
            <?php $isActive = ($activeTab === $key); ?>
            <a href="<?= $item['link'] ?>" class="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition <?= $isActive ? 'bg-[#4A6B5D] text-white shadow-md' : 'text-stone-400 hover:bg-stone-800 hover:text-white' ?>">
              <span class="text-base"><?= $item['icon'] ?></span>
              <span><?= $item['title'] ?></span>
            </a>
          <?php endforeach; ?>
        </nav>
      </div>

      <!-- FOOTER ACTIONS -->
      <div class="space-y-2 pt-4 border-t border-stone-800">
        <a href="index.php?view=admin_preview" target="_blank" class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-900/60 text-amber-200 border border-amber-700/60 text-xs font-bold hover:bg-amber-800/80 transition">
          🌐 <span>Xem Trang Khách (Preview)</span>
        </a>
        <button onclick="logoutAdmin()" class="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-900/40 text-rose-300 text-xs font-bold hover:bg-rose-900/60 transition">
          🔒 <span>Đăng Xuất Admin</span>
        </button>
      </div>
    </aside>
    <?php
}
?>
