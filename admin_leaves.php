<?php
// admin_leaves.php - Trang Quản Lý & Duyệt Đơn Xin Nghỉ Phép Của Stylist
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

if (!is_admin_logged_in()) {
    header('Location: login.php?tab=admin');
    exit;
}

$pdo = get_pdo();
$leaves = $pdo->query("SELECT * FROM stylist_leaves ORDER BY created_at DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Duyệt Nghỉ Phép Stylist</title>
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
  <?php render_admin_nav('leaves'); ?>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
    
    <!-- HEADER -->
    <div class="flex justify-between items-center border-b border-stone-200 pb-5">
      <div>
        <h1 class="font-serif text-3xl font-bold text-stone-900 flex items-center gap-3">
          📝 Quản Lý & Duyệt Đơn Xin Nghỉ Phép Stylist
        </h1>
        <p class="text-xs text-stone-500 mt-1">Khi đơn xin nghỉ được Admin phê duyệt, hệ thống tự động khóa tất cả các khung giờ nhận lịch của thợ đó trong ngày nghỉ</p>
      </div>
    </div>

    <!-- LEAVES TABLE -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      <h2 class="font-serif text-xl font-bold text-stone-900">📋 Danh Sách Đơn Xin Nghỉ Phép</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-stone-100 text-stone-600 uppercase border-b border-stone-200 font-bold">
              <th class="p-3.5">Mã Đơn</th>
              <th class="p-3.5">Thợ Stylist Xin Nghỉ</th>
              <th class="p-3.5 text-center">Ngày Xin Nghỉ</th>
              <th class="p-3.5">Lý Do Xin Nghỉ</th>
              <th class="p-3.5 text-center">Ngày Gửi Đơn</th>
              <th class="p-3.5 text-center">Trạng Thái Duyệt</th>
              <th class="p-3.5 text-center">Thao Tác Duyệt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <?php if (empty($leaves)): ?>
              <tr>
                <td colspan="7" class="text-center py-8 text-stone-400 italic">Chưa có đơn xin nghỉ phép nào được gửi.</td>
              </tr>
            <?php else: ?>
              <?php foreach ($leaves as $l): ?>
                <tr class="hover:bg-stone-50 transition">
                  <td class="p-3.5 font-mono font-bold text-stone-500">
                    #LEAVE-<?= $l['id'] ?>
                  </td>
                  <td class="p-3.5 font-bold text-stone-900 font-serif text-sm">
                    <?= htmlspecialchars($l['stylist_name']) ?>
                  </td>
                  <td class="p-3.5 text-center font-bold text-rose-700 font-serif text-base bg-rose-50/50">
                    📅 <?= htmlspecialchars($l['leave_date']) ?>
                  </td>
                  <td class="p-3.5 text-stone-700 italic">
                    "<?= htmlspecialchars($l['reason']) ?>"
                  </td>
                  <td class="p-3.5 text-center text-stone-400">
                    <?= date('d/m/Y H:i', strtotime($l['created_at'])) ?>
                  </td>
                  <td class="p-3.5 text-center">
                    <?php if ($l['status'] === 'Approved'): ?>
                      <span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold">
                        ✅ Đã Duyệt (Đã Khóa Giờ)
                      </span>
                    <?php elseif ($l['status'] === 'Rejected'): ?>
                      <span class="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-[10px] font-bold">
                        ✕ Từ Chối
                      </span>
                    <?php else: ?>
                      <span class="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse">
                        ⏳ Chờ Phê Duyệt
                      </span>
                    <?php endif; ?>
                  </td>
                  <td class="p-3.5 text-center">
                    <?php if ($l['status'] === 'Pending'): ?>
                      <div class="flex items-center justify-center gap-2">
                        <button onclick="updateLeave(<?= $l['id'] ?>, 'Approved')" class="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-xl shadow-sm transition">
                          ✓ Phê Duyệt
                        </button>
                        <button onclick="updateLeave(<?= $l['id'] ?>, 'Rejected')" class="px-3 py-1 bg-stone-200 hover:bg-rose-700 hover:text-white text-stone-700 font-bold text-[11px] rounded-xl transition">
                          ✕ Từ Chối
                        </button>
                      </div>
                    <?php else: ?>
                      <span class="text-stone-400 text-[11px]">Đã xử lý</span>
                    <?php endif; ?>
                  </td>
                </tr>
              <?php endforeach; ?>
            <?php endif; ?>
          </tbody>
        </table>
      </div>
    </section>

  </main>

  <script>
    async function updateLeave(id, status) {
      if (!confirm('Bạn có chắc chắn muốn ' + (status === 'Approved' ? 'PHÊ DUYỆT (Hệ thống sẽ khóa giờ thợ này)' : 'TỪ CHỐI') + ' đơn này?')) return;
      
      const body = new FormData();
      body.append('action', 'manage_stylist_leave');
      body.append('id', id);
      body.append('status', status);

      const res = await fetch('api.php', { method: 'POST', body }).then(r => r.json());
      if (res.status === 'success') {
        alert(res.message);
        location.reload();
      } else {
        alert(res.message);
      }
    }
  </script>
</body>
</html>
