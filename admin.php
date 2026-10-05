<?php
// admin.php - Trang 1: Bảng Điều Khiển Tổng Quan (Dashboard Overview)
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$db = get_db();
$appointments = $db['appointments'] ?? [];
$services = $db['services'] ?? [];
$stylists = $db['stylists'] ?? [];

$totalRev = 0;
$pendingCount = 0;
$confirmedCount = 0;
$completedCount = 0;

foreach ($appointments as $a) {
    if (in_array($a['status'], ['Completed', 'Confirmed', 'InProgress'])) {
        $totalRev += intval($a['totalPrice']);
    }
    if ($a['status'] === 'Pending') $pendingCount++;
    if (in_array($a['status'], ['Confirmed', 'InProgress'])) $confirmedCount++;
    if ($a['status'] === 'Completed') $completedCount++;
}

$latestAppointments = array_slice($appointments, 0, 5);
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Bảng Điều Khiển Tổng Quan</title>
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
  <?php render_admin_nav('dashboard'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Bảng Điều Khiển Tổng Quan</h2>
        <p class="text-xs text-stone-500">Báo cáo doanh thu & tóm tắt hoạt động Salon</p>
      </div>
      <div class="text-xs text-stone-500 bg-stone-100 px-3.5 py-2 rounded-xl font-medium">
        📅 <?= date('d/m/Y') ?>
      </div>
    </header>

    <main class="p-8 space-y-8 flex-1 overflow-y-auto">
      
      <!-- STATS CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span class="text-xs text-stone-500 font-bold uppercase">Tổng Doanh Thu Dự Kiến</span>
          <div class="font-serif text-2xl font-bold text-[#4A6B5D]"><?= format_vnd($totalRev) ?></div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span class="text-xs text-amber-600 font-bold uppercase">Đơn Chờ Xác Nhận</span>
          <div class="font-serif text-2xl font-bold text-amber-600"><?= $pendingCount ?> đơn</div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span class="text-xs text-blue-600 font-bold uppercase">Đang Thực Hiện / Đã Xác Nhận</span>
          <div class="font-serif text-2xl font-bold text-blue-600"><?= $confirmedCount ?> đơn</div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <span class="text-xs text-emerald-600 font-bold uppercase">Đã Hoàn Thành</span>
          <div class="font-serif text-2xl font-bold text-emerald-600"><?= $completedCount ?> đơn</div>
        </div>
      </div>

      <!-- QUICK LATEST APPOINTMENTS -->
      <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-serif text-lg font-bold text-stone-900">5 Đơn Đặt Lịch Mới Nhất</h3>
            <p class="text-xs text-stone-400">Các đơn vừa được khách hàng gửi qua web</p>
          </div>
          <a href="admin_appointments.php" class="text-xs font-bold text-[#4A6B5D] hover:underline">Xem Tất Cả Đơn →</a>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-stone-50 text-stone-500 uppercase border-b">
                <th class="p-3">Mã Đơn</th>
                <th class="p-3">Khách Hàng</th>
                <th class="p-3">Stylist</th>
                <th class="p-3">Ngày & Giờ</th>
                <th class="p-3">Tổng Tiền</th>
                <th class="p-3">Trạng Thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <?php foreach ($latestAppointments as $app): ?>
                <tr class="hover:bg-stone-50">
                  <td class="p-3 font-bold text-[#4A6B5D]"><?= htmlspecialchars($app['id']) ?></td>
                  <td class="p-3">
                    <p class="font-bold text-stone-900"><?= htmlspecialchars($app['customerName']) ?></p>
                    <p class="text-[10px] text-stone-500"><?= htmlspecialchars($app['phone']) ?></p>
                  </td>
                  <td class="p-3 font-medium text-stone-700"><?= htmlspecialchars($app['stylist']) ?></td>
                  <td class="p-3"><?= htmlspecialchars($app['time']) ?> (<?= htmlspecialchars($app['date']) ?>)</td>
                  <td class="p-3 font-bold text-stone-900"><?= format_vnd($app['totalPrice']) ?></td>
                  <td class="p-3">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold <?= $app['status'] === 'Confirmed' ? 'bg-blue-100 text-blue-800' : ($app['status'] === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800') ?>">
                      <?= htmlspecialchars(get_status_label($app['status'])) ?>
                    </span>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

      <!-- CHART.JS ANALYTICS BI SECTION -->
      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- REVENUE TREND LINE CHART -->
        <div class="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div class="flex justify-between items-center">
            <h3 class="font-serif font-bold text-lg text-stone-900">📈 Phân Tích Xu Hướng Doanh Thu Tháng 9/2026</h3>
            <span class="text-[11px] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Analytics BI</span>
          </div>
          <div class="h-64">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>

        <!-- POPULAR SERVICES DOUGHNUT CHART -->
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 class="font-serif font-bold text-lg text-stone-900">🍩 Tỷ Lệ Dịch Vụ Đặt Nhiều Nhất</h3>
          <div class="h-64 flex justify-center items-center">
            <canvas id="servicesChart"></canvas>
          </div>
        </div>
      </div>

      <!-- SYSTEM SNAPSHOT -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-serif font-bold text-stone-900 text-base">✂️ Dịch Vụ Nổi Bật</h4>
            <a href="admin_services.php" class="text-xs text-[#4A6B5D] font-bold hover:underline">Quản lý →</a>
          </div>
          <p class="text-xs text-stone-500">Đang kinh doanh tổng cộng <b><?= count($services) ?></b> dịch vụ làm tóc.</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-stone-200 space-y-3">
          <div class="flex justify-between items-center">
            <h4 class="font-serif font-bold text-stone-900 text-base">👤 Đội Ngũ Stylist</h4>
            <a href="admin_stylists.php" class="text-xs text-[#4A6B5D] font-bold hover:underline">Quản lý →</a>
          </div>
          <p class="text-xs text-stone-500">Đang có <b><?= count($stylists) ?></b> thợ cắt tóc phục vụ tại Salon.</p>
        </div>
      </div>

      <script>
        // Line Chart for Revenue
        const ctxRev = document.getElementById('revenueChart').getContext('2d');
        new Chart(ctxRev, {
          type: 'line',
          data: {
            labels: ['01/09', '03/09', '05/09', '07/09', '09/09', '11/09', '12/09'],
            datasets: [{
              label: 'Doanh Thu (VNĐ)',
              data: [450000, 1200000, 1370000, 890000, 1650000, 2100000, 2920000],
              borderColor: '#4A6B5D',
              backgroundColor: 'rgba(74, 107, 93, 0.1)',
              fill: true,
              tension: 0.4,
              borderWidth: 3
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });

        // Doughnut Chart for Popular Services
        const ctxSvc = document.getElementById('servicesChart').getContext('2d');
        new Chart(ctxSvc, {
          type: 'doughnut',
          data: {
            labels: ['Uốn Sóng Lơi', 'Nhuộm Premium', 'Cắt Layer Nữ', 'Phục Hồi Keratin', 'Cắt Nam Premium'],
            datasets: [{
              data: [35, 25, 20, 12, 8],
              backgroundColor: ['#4A6B5D', '#C89F82', '#E5C158', '#4B6F44', '#708090']
            }]
          },
          options: { responsive: true, maintainAspectRatio: false }
        });
      </script>

    </main>
  </div>

  <script>
    function logoutAdmin() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=admin');
    }
  </script>
</body>
</html>
