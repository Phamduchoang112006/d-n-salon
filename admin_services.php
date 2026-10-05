<?php
// admin_services.php - Trang 3: Quản Lý Danh Mục Dịch Vụ Salon
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$db = get_db();
$services = $db['services'] ?? [];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Quản Lý Danh Mục Dịch Vụ</title>
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
  <?php render_admin_nav('services'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Quản Lý Danh Mục Dịch Vụ Salon</h2>
        <p class="text-xs text-stone-500">Thêm gói dịch vụ mới hoặc chỉnh sửa giá tiền & mô tả</p>
      </div>
      <button onclick="openAddServiceModal()" class="px-5 py-2.5 rounded-2xl bg-[#4A6B5D] hover:bg-stone-900 text-white text-xs font-bold shadow-md transition">
        + Thêm Dịch Vụ Mới
      </button>
    </header>

    <main class="p-8 space-y-6 flex-1 overflow-y-auto">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($services as $svc): ?>
          <div class="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
            <div class="flex items-start gap-4">
              <img src="<?= htmlspecialchars($svc['image']) ?>" class="w-16 h-16 rounded-2xl object-cover border" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600';" />
              <div class="space-y-1">
                <span class="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full font-bold text-stone-600"><?= htmlspecialchars($svc['category'] ?? 'Dịch vụ') ?></span>
                <h3 class="font-bold text-sm text-stone-900"><?= htmlspecialchars($svc['name']) ?></h3>
                <p class="text-xs font-bold text-[#4A6B5D]"><?= format_vnd($svc['price']) ?></p>
              </div>
            </div>
            <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed"><?= htmlspecialchars($svc['description']) ?></p>
            <div class="pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
              <span class="text-stone-400">⏱️ <?= htmlspecialchars($svc['duration']) ?></span>
              <button onclick="deleteService('<?= htmlspecialchars($svc['id']) ?>')" class="text-rose-600 font-bold hover:underline">Xóa Dịch Vụ</button>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

    </main>
  </div>

  <!-- ADD SERVICE MODAL -->
  <div id="addServiceModal" class="hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 my-8 shadow-2xl border border-stone-200">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-serif text-xl font-bold text-stone-900">Thêm Dịch Vụ Mới Vào MySQL</h3>
        <button type="button" onclick="closeAddServiceModal()" class="text-stone-400 hover:text-stone-700 text-xl font-bold">&times;</button>
      </div>
      
      <form onsubmit="submitAddService(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Tên Dịch Vụ (*)</label>
          <input type="text" id="svcName" required placeholder="Uốn Phồng Chân Tóc Hàn Quốc" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Giá Dịch Vụ (VNĐ) (*)</label>
            <input type="number" id="svcPrice" required placeholder="350000" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Thời Gian Thực Hiện</label>
            <input type="text" id="svcDuration" value="45 phút" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Danh Mục Dịch Vụ</label>
          <select id="svcCategory" class="w-full px-4 py-2.5 rounded-xl border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
            <option value="Cắt & Tạo Kiểu">✂️ Cắt & Tạo Kiểu</option>
            <option value="Uốn Tóc Hàn Quốc">🌀 Uốn Tóc Hàn Quốc</option>
            <option value="Nhuộm Màu Thời Trang">🎨 Nhuộm Màu Thời Trang</option>
            <option value="Gội Đầu & Spa">💆‍♀️ Gội Đầu & Spa</option>
            <option value="Phục Hồi Tóc">✨ Phục Hồi Tóc</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Mô Tả Dịch Vụ</label>
          <textarea id="svcDescription" rows="2" placeholder="Tư vấn phom dáng chuẩn gương mặt & sấy tạo kiểu cao cấp..." class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">Dịch vụ làm tóc cao cấp được thực hiện bởi Master Stylist tại LUMIÈRE Salon.</textarea>
        </div>

        <!-- HÌNH ẢNH MINH HỌA (IMAGE UPLOAD & URL & PREVIEW) -->
        <div class="space-y-2 border-t pt-3">
          <label class="block text-xs font-bold text-stone-700">🖼️ Hình Ảnh Minh Họa Dịch Vụ (*)</label>

          <!-- PREVIEW BOX -->
          <div class="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <img id="svcImgPreview" src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600" class="w-16 h-16 rounded-2xl object-cover border shadow-sm" />
            <div class="space-y-1 flex-1">
              <span class="text-[11px] font-bold text-stone-700 block">Xem trước ảnh minh họa</span>
              <p class="text-[10px] text-stone-500">Tải ảnh lên từ máy hoặc dán đường dẫn URL ảnh bên dưới</p>
            </div>
          </div>

          <!-- UPLOAD FILE OR PASTE URL -->
          <div class="space-y-2">
            <div>
              <label class="inline-block px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition shadow-sm">
                📁 Tải Ảnh Từ Máy Tính
                <input type="file" id="svcImgFile" accept="image/*" onchange="previewSvcImageFile(event)" class="hidden" />
              </label>
            </div>

            <div>
              <input type="url" id="svcImgUrl" oninput="previewSvcImageUrl(this.value)" placeholder="Hoặc dán URL ảnh (https://...)" class="w-full px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
            </div>

            <!-- QUICK SAMPLE IMAGES -->
            <div class="flex gap-2 pt-1 flex-wrap">
              <span class="text-[10px] text-stone-500 self-center">Chọn nhanh mẫu:</span>
              <button type="button" onclick="selectSampleSvcImage('https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">✂️ Cắt tóc</button>
              <button type="button" onclick="selectSampleSvcImage('https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=600')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">🌀 Uốn tóc</button>
              <button type="button" onclick="selectSampleSvcImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">🎨 Nhuộm tóc</button>
              <button type="button" onclick="selectSampleSvcImage('https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">💆‍♀️ Gội Spa</button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-3 border-t">
          <button type="button" onclick="closeAddServiceModal()" class="flex-1 py-3 rounded-xl border text-xs font-bold text-stone-600 hover:bg-stone-100 transition">Hủy Bỏ</button>
          <button type="submit" class="flex-1 py-3 rounded-xl bg-[#4A6B5D] hover:bg-stone-900 text-white text-xs font-bold shadow-md transition">💾 Lưu Dịch Vụ Mới</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').innerText = msg;
      toast.classList.remove('hidden');
      toast.classList.add('flex');
      setTimeout(() => toast.classList.add('hidden'), 3000);
    }

    function openAddServiceModal() { document.getElementById('addServiceModal').classList.remove('hidden'); }
    function closeAddServiceModal() { document.getElementById('addServiceModal').classList.add('hidden'); }

    function previewSvcImageFile(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('svcImgPreview').src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function previewSvcImageUrl(url) {
      if (url && url.trim()) {
        document.getElementById('svcImgPreview').src = url.trim();
      }
    }

    function selectSampleSvcImage(url) {
      document.getElementById('svcImgUrl').value = url;
      document.getElementById('svcImgPreview').src = url;
      document.getElementById('svcImgFile').value = '';
    }

    function submitAddService(e) {
      e.preventDefault();
      const name = document.getElementById('svcName').value.trim();
      const price = document.getElementById('svcPrice').value;
      const duration = document.getElementById('svcDuration').value;
      const category = document.getElementById('svcCategory').value;
      const description = document.getElementById('svcDescription').value;
      const imgUrl = document.getElementById('svcImgUrl').value.trim();
      const fileInput = document.getElementById('svcImgFile');

      const formData = new FormData();
      formData.append('action', 'add_service');
      formData.append('name', name);
      formData.append('price', price);
      formData.append('duration', duration);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('image', imgUrl);

      if (fileInput && fileInput.files[0]) {
        formData.append('image_file', fileInput.files[0]);
      }

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        closeAddServiceModal();
        showToast(data.message);
        setTimeout(() => location.reload(), 1000);
      });
    }

    function deleteService(id) {
      if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
      const formData = new FormData();
      formData.append('action', 'delete_service');
      formData.append('id', id);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        showToast(data.message);
        setTimeout(() => location.reload(), 1000);
      });
    }

    function logoutAdmin() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=admin');
    }
  </script>
</body>
</html>
