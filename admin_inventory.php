<?php
// admin_inventory.php - Trang Quản Lý Kho Hóa Chất & Định Mức Vật Tư Salon
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

if (!is_admin_logged_in()) {
    header('Location: login.php?tab=admin');
    exit;
}

$pdo = get_pdo();
$inventory = $pdo->query("SELECT * FROM inventory ORDER BY (quantity <= min_threshold) DESC, item_name ASC")->fetchAll();
$materials = $pdo->query("SELECT * FROM service_materials ORDER BY service_name ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Quản Lý Kho Hóa Chất & Vật Tư</title>
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
  <?php render_admin_nav('inventory'); ?>

  <!-- MAIN CONTENT CONTAINER -->
  <main class="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
    
    <!-- HEADER -->
    <div class="flex justify-between items-center border-b border-stone-200 pb-5">
      <div>
        <h1 class="font-serif text-3xl font-bold text-stone-900 flex items-center gap-3">
          📦 Quản Lý Kho Hóa Chất & Định Mức Tự Trừ
        </h1>
        <p class="text-xs text-stone-500 mt-1">Theo dõi lượng tồn kho thuốc nhuộm, thuốc uốn, keratin và tự động trừ định mức khi nghiệm thu ca hẹn</p>
      </div>

      <button onclick="openAddModal()" class="bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-md transition">
        + Thêm Vật Tư Hóa Chất Mới
      </button>
    </div>

    <!-- INVENTORY TABLE SECTION -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
      <h2 class="font-serif text-xl font-bold text-stone-900">🧪 Danh Sách Vật Tư Trong Kho</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-stone-100 text-stone-600 uppercase border-b border-stone-200 font-bold">
              <th class="p-3.5">Tên Vật Tư / Hóa Chất</th>
              <th class="p-3.5">Phân Loại</th>
              <th class="p-3.5 text-center">Số Lượng Tồn Kho</th>
              <th class="p-3.5 text-center">Đơn Vị</th>
              <th class="p-3.5 text-center">Mức Cảnh Báo</th>
              <th class="p-3.5 text-center">Trạng Thái Tồn Kho</th>
              <th class="p-3.5 text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-200">
            <?php foreach ($inventory as $item): ?>
              <?php 
                $isLow = floatval($item['quantity']) <= floatval($item['min_threshold']);
              ?>
              <tr class="hover:bg-stone-50 transition <?= $isLow ? 'bg-rose-50/60' : '' ?>">
                <td class="p-3.5 font-bold text-stone-900 font-serif text-sm">
                  <?= htmlspecialchars($item['item_name']) ?>
                </td>
                <td class="p-3.5 font-medium text-stone-600">
                  <span class="bg-stone-100 border border-stone-300 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    <?= htmlspecialchars($item['category']) ?>
                  </span>
                </td>
                <td class="p-3.5 text-center font-serif text-base font-bold <?= $isLow ? 'text-rose-700' : 'text-stone-900' ?>">
                  <?= number_format($item['quantity']) ?>
                </td>
                <td class="p-3.5 text-center text-stone-500 font-medium">
                  <?= htmlspecialchars($item['unit']) ?>
                </td>
                <td class="p-3.5 text-center text-stone-500 font-medium">
                  &le; <?= number_format($item['min_threshold']) ?> <?= htmlspecialchars($item['unit']) ?>
                </td>
                <td class="p-3.5 text-center">
                  <?php if ($isLow): ?>
                    <span class="bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse inline-flex items-center gap-1">
                      ⚠️ Sắp Hết Hàng (Cần Nhập)
                    </span>
                  <?php else: ?>
                    <span class="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1">
                      ✅ An Toàn
                    </span>
                  <?php endif; ?>
                </td>
                <td class="p-3.5 text-center">
                  <button onclick="editStock(<?= htmlspecialchars(json_encode($item)) ?>)" class="px-3 py-1.5 bg-stone-100 hover:bg-[#4A6B5D] hover:text-white text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition">
                    ✏️ Cập Nhật Tồn Kho
                  </button>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SERVICE MATERIAL DEDUCTION RECIPE SECTION -->
    <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
      <h2 class="font-serif text-xl font-bold text-stone-900">📋 Bảng Định Mức Khấu Trừ Hóa Chất Tự Động Khi Nghiệm Thu Ca</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <?php foreach ($materials as $mat): ?>
          <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span class="font-bold text-[#4A6B5D] block text-sm font-serif">✂️ <?= htmlspecialchars($mat['service_name']) ?></span>
            <div class="flex justify-between items-center pt-2 border-t border-stone-200">
              <span class="text-stone-600 font-medium">🧪 <?= htmlspecialchars($mat['item_name']) ?></span>
              <span class="font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">-<?= $mat['quantity_used'] ?> ml / ca</span>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

  </main>

  <!-- ADD / EDIT STOCK MODAL -->
  <div id="stockModal" class="hidden fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
      <h3 id="modalTitle" class="font-serif text-lg font-bold text-stone-900">Thêm / Cập Nhật Vật Tư Hóa Chất</h3>
      <form onsubmit="saveStock(event)" class="space-y-3 text-xs">
        <div>
          <label class="block font-bold text-stone-700 mb-1">Tên Vật Tư / Hóa Chất (*)</label>
          <input type="text" id="itemName" required class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
        </div>
        <div>
          <label class="block font-bold text-stone-700 mb-1">Phân Loại</label>
          <select id="itemCat" class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none">
            <option value="Hóa Chất Nhuộm">Hóa Chất Nhuộm</option>
            <option value="Hóa Chất Uốn">Hóa Chất Uốn</option>
            <option value="Dưỡng Tóc">Dưỡng Tóc</option>
            <option value="Chăm Sóc">Chăm Sóc</option>
            <option value="Tạo Kiểu">Tạo Kiểu</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-stone-700 mb-1">Số Lượng TồnKho (*)</label>
            <input type="number" step="0.1" id="itemQty" required class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-stone-700 mb-1">Đơn Vị (ml, hũ...)</label>
            <input type="text" id="itemUnit" value="ml" required class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none">
          </div>
        </div>
        <div>
          <label class="block font-bold text-stone-700 mb-1">Mức Cảnh Báo Hết Hàng (Min Threshold)</label>
          <input type="number" step="0.1" id="itemMin" value="500" required class="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none">
        </div>
        <div class="flex gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold">Hủy</button>
          <button type="submit" class="flex-1 py-2.5 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800">Lưu Vật Tư</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function openAddModal() {
      document.getElementById('modalTitle').textContent = 'Thêm Vật Tư Hóa Chất Mới';
      document.getElementById('itemName').value = '';
      document.getElementById('itemName').readOnly = false;
      document.getElementById('itemQty').value = '1000';
      document.getElementById('stockModal').classList.remove('hidden');
    }

    function editStock(item) {
      document.getElementById('modalTitle').textContent = 'Cập Nhật Tồn Kho: ' + item.item_name;
      document.getElementById('itemName').value = item.item_name;
      document.getElementById('itemName').readOnly = true;
      document.getElementById('itemCat').value = item.category;
      document.getElementById('itemQty').value = item.quantity;
      document.getElementById('itemUnit').value = item.unit;
      document.getElementById('itemMin').value = item.min_threshold;
      document.getElementById('stockModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('stockModal').classList.add('hidden');
    }

    async function saveStock(e) {
      e.preventDefault();
      const body = new FormData();
      body.append('action', 'update_inventory');
      body.append('item_name', document.getElementById('itemName').value);
      body.append('category', document.getElementById('itemCat').value);
      body.append('quantity', document.getElementById('itemQty').value);
      body.append('unit', document.getElementById('itemUnit').value);
      body.append('min_threshold', document.getElementById('itemMin').value);

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
