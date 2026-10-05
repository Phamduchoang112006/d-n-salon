<?php
// stylist_dashboard.php - Cổng Thông Tin Cá Nhân Cho Thợ Cắt Tóc / Stylist
require_once __DIR__ . '/db.php';

if (!is_stylist_logged_in()) {
    header('Location: login.php?tab=stylist');
    exit;
}

$loggedStylist = get_logged_stylist();
$db = get_db();
$allAppointments = $db['appointments'] ?? [];

// Lọc toàn bộ lịch hẹn thuộc về Stylist này
$myAppointments = array_filter($allAppointments, function($a) use ($loggedStylist) {
    return isset($a['stylist']) && $a['stylist'] === $loggedStylist['name'];
});

// Thống kê Doanh thu & Hoa hồng
$todayCount = 0;
$completedCount = 0;
$totalRevenue = 0;
$totalCommission = 0;
$stLevel = $loggedStylist['level'] ?? 'Senior';
$baseSalary = intval($loggedStylist['baseSalary'] ?? 8000000);

$dailyCommissions = [];

foreach ($myAppointments as $app) {
    $isToday = (isset($app['date']) && (strpos($app['date'], 'Hôm nay') !== false || $app['date'] === date('d/m/Y')));
    if ($isToday) {
        $todayCount++;
    }

    if ($app['status'] === 'Completed') {
        $completedCount++;
        $price = intval($app['totalPrice'] ?? 0);
        $totalRevenue += $price;

        $commInfo = calculate_appointment_commission($app, $loggedStylist);
        $appComm = $commInfo['totalCommission'];
        $totalCommission += $appComm;

        $dateKey = $app['date'] ?? 'Không rõ';
        if (!isset($dailyCommissions[$dateKey])) {
            $dailyCommissions[$dateKey] = [
                'count' => 0,
                'revenue' => 0,
                'commission' => 0
            ];
        }
        $dailyCommissions[$dateKey]['count']++;
        $dailyCommissions[$dateKey]['revenue'] += $price;
        $dailyCommissions[$dateKey]['commission'] += $appComm;
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Stylist Portal - <?= htmlspecialchars($loggedStylist['name']) ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            salon: { primary: '#4A6B5D', secondary: '#C89F82' }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-[#F8F6F0] min-h-screen text-stone-900 flex flex-col">

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="hidden fixed top-5 right-5 z-50 bg-stone-900 text-stone-100 px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium items-center gap-2 animate-bounce">
    <span>⚡</span>
    <span id="toastMsg">Thông báo</span>
  </div>

  <!-- STYLIST PORTAL HEADER -->
  <header class="bg-stone-900 text-white px-8 py-5 flex justify-between items-center border-b border-stone-800 shadow-md">
    <div class="flex items-center gap-4">
      <img src="<?= htmlspecialchars($loggedStylist['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300') ?>" class="w-12 h-12 rounded-full object-cover border-2 border-[#C89F82]" />
      <div>
        <h1 class="font-serif font-bold text-lg leading-tight text-white flex items-center gap-2">
          <?= htmlspecialchars($loggedStylist['name']) ?> 
          <span class="text-[10px] bg-[#C89F82] text-white px-2 py-0.5 rounded-full font-sans"><?= htmlspecialchars($loggedStylist['role']) ?></span>
        </h1>
        <p class="text-xs text-stone-400">Cổng Quản Lý Lịch Làm Việc & Hoa Hồng Cá Nhân</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="text-xs text-stone-300 bg-stone-800 px-3.5 py-2 rounded-xl border border-stone-700">
        📅 Hôm nay: <b><?= date('d/m/Y') ?></b>
      </div>
      <button onclick="logoutStylist()" class="px-4 py-2 bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-bold rounded-xl transition">
        🔒 Đăng Xuất
      </button>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="p-8 space-y-8 max-w-7xl mx-auto w-full flex-1">
    
    <!-- STATS SUMMARY CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
        <span class="text-xs text-stone-500 font-bold uppercase">Ca Hẹn Hôm Nay</span>
        <div class="font-serif text-3xl font-bold text-[#4A6B5D]"><?= $todayCount ?> <span class="text-xs text-stone-400 font-sans">ca</span></div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
        <span class="text-xs text-emerald-600 font-bold uppercase">Ca Đã Hoàn Thành</span>
        <div class="font-serif text-3xl font-bold text-emerald-600"><?= $completedCount ?> <span class="text-xs text-stone-400 font-sans">ca</span></div>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
        <span class="text-xs text-amber-700 font-bold uppercase">✨ Hoa Hồng Ma Trận Phân Bổ</span>
        <div class="font-serif text-2xl font-bold text-amber-700"><?= format_vnd($totalCommission) ?></div>
        <p class="text-[10px] text-stone-500 font-medium">Phân loại theo Cấp bậc (<?= $stLevel ?>)</p>
      </div>

      <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 bg-gradient-to-br from-[#4A6B5D]/10 to-emerald-100 border-[#4A6B5D]/30">
        <span class="text-xs text-[#4A6B5D] font-bold uppercase">💵 Thu Nhập Ước Tính</span>
        <div class="font-serif text-2xl font-bold text-[#4A6B5D]"><?= format_vnd($baseSalary + $totalCommission) ?></div>
        <p class="text-[10px] text-stone-600 font-medium">Lương cứng: <?= format_vnd($baseSalary) ?> + Hoa hồng</p>
      </div>
    </div>

    <!-- WORK SCHEDULE & APPOINTMENT MANAGEMENT -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="font-serif text-xl font-bold text-stone-900">📅 Lịch Trình Làm Việc Cá Nhân</h2>
          <p class="text-xs text-stone-500">Xem thông tin ca hẹn & Cập nhật trạng thái phục hồi/cắt uốn cho khách hàng</p>
        </div>

        <div class="flex items-center gap-2">
          <input type="text" id="schedSearch" onkeyup="filterSched()" placeholder="🔍 Tìm theo khách hàng..." class="px-4 py-2 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table id="schedTable" class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
              <th class="p-3.5">Mã Đơn</th>
              <th class="p-3.5">Khách Hàng</th>
              <th class="p-3.5">Dịch Vụ & Yêu Cầu Tóc</th>
              <th class="p-3.5">Thời Gian Hẹn</th>
              <th class="p-3.5">Giá Phục Vụ</th>
              <th class="p-3.5">Hoa Hồng (15%)</th>
              <th class="p-3.5">Trạng Thái</th>
              <th class="p-3.5">Cập Nhật Trạng Thái</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <?php if (empty($myAppointments)): ?>
              <tr>
                <td colspan="8" class="p-8 text-center text-stone-400">Bạn chưa có ca hẹn nào được phân công.</td>
              </tr>
            <?php else: ?>
              <?php foreach ($myAppointments as $app): ?>
                <?php 
                  $price = intval($app['totalPrice'] ?? 0);
                  $comm = $price * 0.15;
                  $st = $app['status'] ?? 'Pending';
                  $badgeClass = 'bg-amber-100 text-amber-800';
                  if ($st === 'Confirmed') $badgeClass = 'bg-blue-100 text-blue-800';
                  if ($st === 'InProgress') $badgeClass = 'bg-purple-100 text-purple-800';
                  if ($st === 'Completed') $badgeClass = 'bg-emerald-100 text-emerald-800';
                  if ($st === 'Cancelled') $badgeClass = 'bg-rose-100 text-rose-800';
                ?>
                <tr class="sched-row hover:bg-stone-50 transition">
                  <td class="p-3.5 font-bold text-[#4A6B5D]"><?= htmlspecialchars($app['id']) ?></td>
                  <td class="p-3.5">
                    <p class="font-bold text-stone-900"><?= htmlspecialchars($app['customerName']) ?></p>
                    <p class="text-[10px] text-stone-500">📱 <?= htmlspecialchars($app['phone']) ?></p>
                  </td>
                  <td class="p-3.5 space-y-0.5">
                    <p class="font-semibold text-stone-800"><?= htmlspecialchars(implode(', ', (array)($app['services'] ?? []))) ?></p>
                    <p class="text-[10px] text-stone-500">💇‍♀️ <?= htmlspecialchars($app['hairstyle'] ?? 'Mặc định') ?> • 🎨 <?= htmlspecialchars($app['haircolor'] ?? 'Không nhuộm') ?></p>
                  </td>
                  <td class="p-3.5">
                    <p class="font-bold text-stone-900"><?= htmlspecialchars($app['time']) ?></p>
                    <p class="text-[10px] text-stone-500"><?= htmlspecialchars($app['date']) ?></p>
                  </td>
                  <td class="p-3.5 font-bold text-stone-900"><?= format_vnd($price) ?></td>
                  <td class="p-3.5 font-bold text-amber-700"><?= format_vnd($comm) ?></td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold <?= $badgeClass ?>">
                      <?= htmlspecialchars(get_status_label($st)) ?>
                    </span>
                  </td>
                  <td class="p-3.5">
                    <select onchange="updateAppStatus('<?= htmlspecialchars($app['id']) ?>', this.value)" class="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
                      <option value="Pending" <?= $st === 'Pending' ? 'selected' : '' ?>>Chờ xác nhận</option>
                      <option value="Confirmed" <?= $st === 'Confirmed' ? 'selected' : '' ?>>Đã xác nhận</option>
                      <option value="InProgress" <?= $st === 'InProgress' ? 'selected' : '' ?>>Đang thực hiện</option>
                      <option value="Completed" <?= $st === 'Completed' ? 'selected' : '' ?>>Đã hoàn thành</option>
                      <option value="Cancelled" <?= $st === 'Cancelled' ? 'selected' : '' ?>>Đã hủy</option>
                    </select>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>

    <!-- DAILY REVENUE & COMMISSION TRACKER -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
      <div>
        <h2 class="font-serif text-lg font-bold text-stone-900">📊 Theo Dõi Doanh Thu & Hoa Hồng Theo Ngày</h2>
        <p class="text-xs text-stone-500">Chi tiết số tiền hoa hồng được tính dựa trên 15% tổng giá trị dịch vụ hoàn thành</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-stone-50 text-stone-500 uppercase border-b">
              <th class="p-3">Ngày Làm Việc</th>
              <th class="p-3">Số Ca Hoàn Thành</th>
              <th class="p-3">Tổng Giá Trị Phục Vụ</th>
              <th class="p-3">Hoa Hồng Nhận Được (15%)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <?php if (empty($dailyCommissions)): ?>
              <tr>
                <td colspan="4" class="p-6 text-center text-stone-400">Chưa có dữ liệu hoa hồng từ các ca hoàn thành.</td>
              </tr>
            <?php else: ?>
              <?php foreach ($dailyCommissions as $date => $info): ?>
                <tr class="hover:bg-stone-50">
                  <td class="p-3 font-bold text-stone-900">📅 <?= htmlspecialchars($date) ?></td>
                  <td class="p-3 font-medium text-stone-700"><?= $info['count'] ?> ca</td>
                  <td class="p-3 font-bold text-stone-800"><?= format_vnd($info['revenue']) ?></td>
                  <td class="p-3 font-bold text-amber-700 bg-amber-50/50"><?= format_vnd($info['commission']) ?></td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    <!-- STYLIST LEAVE REQUEST SECTION -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
      <div class="flex justify-between items-center border-b border-stone-200 pb-3">
        <div>
          <h2 class="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">📝 Đăng Ký Xin Nghỉ Phép</h2>
          <p class="text-xs text-stone-500">Gửi đơn nghỉ phép tới Admin (Khi đơn được duyệt, khung giờ ngày đó sẽ tự động khóa trên web)</p>
        </div>
      </div>

      <form onsubmit="submitStylistLeave(event)" class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end text-xs">
        <div>
          <label class="block font-bold text-stone-700 mb-1">Chọn Ngày Nghỉ Phép (*)</label>
          <select id="leaveDateInput" required class="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
            <option value="Hôm nay">Hôm nay (<?= date('d/m/Y') ?>)</option>
            <option value="Ngày mai">Ngày mai (<?= date('d/m/Y', strtotime('+1 day')) ?>)</option>
            <option value="Ngày kia">Ngày kia (<?= date('d/m/Y', strtotime('+2 day')) ?>)</option>
            <option value="<?= date('d/m/Y', strtotime('+3 day')) ?>"><?= date('d/m/Y', strtotime('+3 day')) ?></option>
          </select>
        </div>
        <div>
          <label class="block font-bold text-stone-700 mb-1">Lý Do Xin Nghỉ (*)</label>
          <input type="text" id="leaveReasonInput" required placeholder="Bận việc gia đình / Sức khỏe" class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
        </div>
        <div>
          <button type="submit" class="w-full py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xl shadow-sm transition">
            📩 Gửi Đơn Xin Nghỉ Phép
          </button>
        </div>
      </form>
    </section>

  </main>

  <script>
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').innerText = msg;
      toast.classList.remove('hidden');
      toast.classList.add('flex');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function updateAppStatus(id, newStatus) {
      const formData = new FormData();
      formData.append('action', 'update_status');
      formData.append('id', id);
      formData.append('status', newStatus);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        showToast(data.message);
        setTimeout(() => location.reload(), 800);
      });
    }

    function filterSched() {
      const query = document.getElementById('schedSearch').value.toLowerCase();
      const rows = document.querySelectorAll('.sched-row');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(query) ? '' : 'none';
      });
    }

    async function submitStylistLeave(e) {
      e.preventDefault();
      const body = new FormData();
      body.append('action', 'submit_stylist_leave');
      body.append('leave_date', document.getElementById('leaveDateInput').value);
      body.append('reason', document.getElementById('leaveReasonInput').value);

      const res = await fetch('api.php', { method: 'POST', body }).then(r => r.json());
      if (res.status === 'success') {
        showToast('🎉 ' + res.message);
        document.getElementById('leaveReasonInput').value = '';
      } else {
        showToast('❌ ' + res.message);
      }
    }

    function logoutStylist() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=stylist');
    }
  </script>
</body>
</html>
