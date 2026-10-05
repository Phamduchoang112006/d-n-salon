<?php
// admin_appointments.php - Trang 2: Quản Lý Lịch Hẹn Chuyên Biệt
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$db = get_db();
$appointments = $db['appointments'] ?? [];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Quản Lý Lịch Hẹn Đặt Trực Tuyến</title>
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

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="hidden fixed top-5 right-5 z-50 bg-stone-900 text-stone-100 px-5 py-3 rounded-2xl shadow-2xl text-xs font-medium items-center gap-2 animate-bounce">
    <span>⚡</span>
    <span id="toastMsg">Thông báo</span>
  </div>

  <!-- SIDEBAR NAV -->
  <?php render_admin_nav('appointments'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Quản Lý Lịch Hẹn Đặt Trực Tuyến</h2>
        <p class="text-xs text-stone-500">Xem, tìm kiếm & cập nhật trạng thái đơn hẹn từ khách hàng</p>
      </div>
      <div class="text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl font-bold">
        Tổng: <?= count($appointments) ?> đơn
      </div>
    </header>

    <main class="p-8 space-y-6 flex-1 overflow-y-auto">
      
      <!-- CONTROLS: SEARCH & STATUS TABS -->
      <div class="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        
        <!-- STATUS TABS -->
        <div class="flex flex-wrap gap-2 w-full md:w-auto">
          <button data-status="All" onclick="filterStatus('All')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-[#4A6B5D] text-white">Tất Cả</button>
          <button data-status="Pending" onclick="filterStatus('Pending')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Chờ xác nhận</button>
          <button data-status="Confirmed" onclick="filterStatus('Confirmed')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Đã xác nhận</button>
          <button data-status="InProgress" onclick="filterStatus('InProgress')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Đang thực hiện</button>
          <button data-status="Completed" onclick="filterStatus('Completed')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Đã hoàn thành</button>
          <button data-status="Cancelled" onclick="filterStatus('Cancelled')" class="tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200">Đã hủy</button>
        </div>

        <!-- SEARCH INPUT -->
        <div class="w-full md:w-72">
          <input type="text" id="appSearch" onkeyup="filterTable()" placeholder="🔍 Tìm theo Tên, SĐT, Mã đơn..." class="w-full px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>

      </div>

      <!-- APPOINTMENTS TABLE -->
      <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6">
        <div class="overflow-x-auto">
          <table id="appTable" class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-stone-50 text-stone-500 uppercase border-b border-stone-200">
                <th class="p-3.5">Mã Đơn</th>
                <th class="p-3.5">Khách Hàng</th>
                <th class="p-3.5">Dịch Vụ & Màu Nhuộm</th>
                <th class="p-3.5">Stylist</th>
                <th class="p-3.5">Ngày & Giờ Hẹn</th>
                <th class="p-3.5">Tổng Tiền</th>
                <th class="p-3.5">Trạng Thái</th>
                <th class="p-3.5">Cập Nhật Trạng Thái</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <?php foreach ($appointments as $app): ?>
                <tr class="app-row hover:bg-stone-50 transition" data-status="<?= htmlspecialchars($app['status']) ?>">
                  <td class="p-3.5 font-bold text-[#4A6B5D]"><?= htmlspecialchars($app['id']) ?></td>
                  <td class="p-3.5">
                    <p class="font-bold text-stone-900"><?= htmlspecialchars($app['customerName']) ?></p>
                    <p class="text-[10px] text-stone-500"><?= htmlspecialchars($app['phone']) ?></p>
                  </td>
                  <td class="p-3.5">
                    <p class="font-semibold text-stone-800"><?= htmlspecialchars(implode(', ', (array)$app['services'])) ?></p>
                    <p class="text-[10px] text-salon-secondary"><?= htmlspecialchars($app['haircolor'] ?? '') ?></p>
                  </td>
                  <td class="p-3.5 font-medium text-stone-700"><?= htmlspecialchars($app['stylist']) ?></td>
                  <td class="p-3.5">
                    <p class="font-bold text-stone-800"><?= htmlspecialchars($app['time']) ?></p>
                    <p class="text-[10px] text-stone-500"><?= htmlspecialchars($app['date']) ?></p>
                  </td>
                  <td class="p-3.5 font-bold text-stone-900"><?= format_vnd($app['totalPrice']) ?></td>
                  <td class="p-3.5">
                    <?php
                      $st = $app['status'];
                      $badgeClass = 'bg-stone-100 text-stone-700';
                      if ($st === 'Confirmed') $badgeClass = 'bg-blue-100 text-blue-800';
                      if ($st === 'InProgress') $badgeClass = 'bg-purple-100 text-purple-800';
                      if ($st === 'Completed') $badgeClass = 'bg-emerald-100 text-emerald-800';
                      if ($st === 'Pending') $badgeClass = 'bg-amber-100 text-amber-800';
                      if ($st === 'Cancelled') $badgeClass = 'bg-rose-100 text-rose-800';
                    ?>
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold <?= $badgeClass ?>">
                      <?= htmlspecialchars(get_status_label($st)) ?>
                    </span>
                  </td>
                  <td class="p-3.5">
                    <select onchange="updateStatus('<?= htmlspecialchars($app['id']) ?>', this.value)" class="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none">
                      <option value="Pending" <?= $st === 'Pending' ? 'selected' : '' ?>>Chờ xác nhận</option>
                      <option value="Confirmed" <?= $st === 'Confirmed' ? 'selected' : '' ?>>Đã xác nhận</option>
                      <option value="InProgress" <?= $st === 'InProgress' ? 'selected' : '' ?>>Đang thực hiện</option>
                      <option value="Completed" <?= $st === 'Completed' ? 'selected' : '' ?>>Đã hoàn thành</option>
                      <option value="Cancelled" <?= $st === 'Cancelled' ? 'selected' : '' ?>>Đã hủy</option>
                    </select>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>

  <script>
    let currentFilterStatus = 'All';

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').innerText = msg;
      toast.classList.remove('hidden');
      toast.classList.add('flex');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function filterStatus(status) {
      currentFilterStatus = status;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-status') === status) {
          btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-[#4A6B5D] text-white";
        } else {
          btn.className = "tab-btn px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200";
        }
      });
      filterTable();
    }

    function filterTable() {
      const query = document.getElementById('appSearch').value.toLowerCase();
      const rows = document.querySelectorAll('.app-row');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        const status = r.getAttribute('data-status');
        const matchSearch = text.includes(query);
        const matchStatus = (currentFilterStatus === 'All' || status === currentFilterStatus);
        r.style.display = (matchSearch && matchStatus) ? '' : 'none';
      });
    }

    function updateStatus(id, newStatus) {
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

    function logoutAdmin() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=admin');
    }
  </script>
</body>
</html>
