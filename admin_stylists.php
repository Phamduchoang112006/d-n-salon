<?php
// admin_stylists.php - Trang 4: Quản Lý Đội Ngũ Stylist Salon & Chuyển Ca Khẩn Cấp
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$db = get_db();
$stylists = $db['stylists'] ?? [];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Quản Lý Đội Ngũ Stylist</title>
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
  <?php render_admin_nav('stylists'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0">
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Quản Lý Đội Ngũ Stylist Salon</h2>
        <p class="text-xs text-stone-500">Thêm thợ mới hoặc xử lý sự cố thợ nghỉ đột xuất & chuyển ca hàng loạt</p>
      </div>
      <div class="flex items-center gap-3">
        <button onclick="openEmergencyModal()" class="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2">
          <span>🚨</span> Báo Thợ Nghỉ & Chuyển Ca
        </button>
        <button onclick="openAddStylistModal()" class="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition">
          + Thêm Stylist Mới
        </button>
      </div>
    </header>

    <main class="p-8 space-y-6 flex-1 overflow-y-auto">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php foreach ($stylists as $st): ?>
          <?php 
            $stLevel = $st['level'] ?? 'Senior';
            $badgeColor = match($stLevel) {
                'Master' => 'bg-amber-100 text-amber-800 border-amber-300',
                'Senior' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                'Junior' => 'bg-sky-100 text-sky-800 border-sky-300',
                default => 'bg-stone-100 text-stone-700 border-stone-200'
            };
          ?>
          <div class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 text-center space-y-3 relative group">
            <img src="<?= htmlspecialchars($st['avatar']) ?>" class="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#4A6B5D] shadow-md" />
            <div>
              <div class="flex items-center justify-center gap-1 mb-1">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border <?= $badgeColor ?>">
                  <?= $stLevel ?> Stylist
                </span>
              </div>
              <h3 class="font-bold text-stone-900 text-sm"><?= htmlspecialchars($st['name']) ?></h3>
              <p class="text-xs text-[#C89F82] font-semibold"><?= htmlspecialchars($st['role']) ?></p>
              <p class="text-[11px] text-stone-400 mt-0.5"><?= htmlspecialchars($st['experience']) ?></p>
            </div>

            <?php if (empty($st['isAny'])): ?>
              <div class="text-[11px] bg-stone-50 py-1.5 px-3 rounded-xl border border-stone-200 text-stone-600 font-medium">
                💵 Lương cứng: <b><?= format_vnd($st['baseSalary'] ?? 8000000) ?></b>
              </div>
            <?php endif; ?>

            <p class="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-2xl border border-stone-200 italic line-clamp-2">
              "<?= htmlspecialchars($st['specialty']) ?>"
            </p>
            <?php if (empty($st['isAny'])): ?>
              <div class="pt-2 border-t border-stone-100 flex justify-between items-center text-xs">
                <button onclick="quickEmergencyTransfer('<?= htmlspecialchars($st['name']) ?>')" class="text-rose-600 font-bold hover:underline">🚨 Báo Nghỉ</button>
                <button onclick="deleteStylist('<?= htmlspecialchars($st['id']) ?>')" class="text-stone-400 hover:text-stone-700">Xóa</button>
              </div>
            <?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>

    </main>
  </div>

  <!-- ADD STYLIST MODAL -->
  <div id="addStylistModal" class="hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 my-8 shadow-2xl border border-stone-200">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-serif text-xl font-bold text-stone-900">Thêm Thợ Cắt Tóc Mới Vào MySQL</h3>
        <button type="button" onclick="closeAddStylistModal()" class="text-stone-400 hover:text-stone-700 text-xl font-bold">&times;</button>
      </div>

      <form onsubmit="submitAddStylist(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Họ và Tên Stylist (*)</label>
          <input type="text" id="stName" required placeholder="Khánh Vũ" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Chức Danh / Vị Trí</label>
            <input type="text" id="stRole" value="Senior Hair Artist" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Cấp Bậc (Level)</label>
            <select id="stLevel" class="w-full px-4 py-2.5 rounded-xl border text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
              <option value="Senior">Senior Stylist (5+ năm)</option>
              <option value="Master">Master Stylist (8+ năm)</option>
              <option value="Junior">Junior Stylist (2+ năm)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Kinh Nghiệm</label>
            <input type="text" id="stExperience" value="5 năm kinh nghiệm" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
          </div>
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Lương Cơ Bản (VNĐ)</label>
            <input type="number" id="stBaseSalary" value="8000000" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Sở Trường & Phong Cách Cắt</label>
          <input type="text" id="stSpecialty" value="Chuyên gia uốn sóng & cắt layer chuẩn phom mặt" class="w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>

        <!-- HÌNH ẢNH AVATAR STYLIST -->
        <div class="space-y-2 border-t pt-3">
          <label class="block text-xs font-bold text-stone-700">👤 Ảnh Đại Diện Stylist (Avatar) (*)</label>

          <!-- PREVIEW BOX -->
          <div class="flex items-center gap-4 bg-stone-50 p-3 rounded-2xl border border-stone-200">
            <img id="stAvatarPreview" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" class="w-16 h-16 rounded-full object-cover border-2 border-[#4A6B5D] shadow-sm" />
            <div class="space-y-1 flex-1">
              <span class="text-[11px] font-bold text-stone-700 block">Xem trước ảnh đại diện</span>
              <p class="text-[10px] text-stone-500">Tải ảnh từ máy hoặc dán đường dẫn URL ảnh bên dưới</p>
            </div>
          </div>

          <!-- UPLOAD FILE OR PASTE URL -->
          <div class="space-y-2">
            <div>
              <label class="inline-block px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer transition shadow-sm">
                📁 Tải Ảnh Từ Máy Tính
                <input type="file" id="stAvatarFile" accept="image/*" onchange="previewStAvatarFile(event)" class="hidden" />
              </label>
            </div>

            <div>
              <input type="url" id="stAvatarUrl" oninput="previewStAvatarUrl(this.value)" placeholder="Hoặc dán URL ảnh chân dung (https://...)" class="w-full px-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
            </div>

            <!-- QUICK SAMPLE AVATARS -->
            <div class="flex gap-2 pt-1 flex-wrap">
              <span class="text-[10px] text-stone-500 self-center">Mẫu ảnh sẵn:</span>
              <button type="button" onclick="selectSampleStAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">👩 Nữ 1</button>
              <button type="button" onclick="selectSampleStAvatar('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">👩 Nữ 2</button>
              <button type="button" onclick="selectSampleStAvatar('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">👨 Nam 1</button>
              <button type="button" onclick="selectSampleStAvatar('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300')" class="text-[10px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg border font-bold">👨 Nam 2</button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-3 border-t">
          <button type="button" onclick="closeAddStylistModal()" class="flex-1 py-3 rounded-xl border text-xs font-bold text-stone-600 hover:bg-stone-100 transition">Hủy Bỏ</button>
          <button type="submit" class="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-md transition">💾 Lưu Stylist Mới</button>
        </div>
      </form>
    </div>
  </div>

  <!-- EMERGENCY REASSIGNMENT MODAL -->
  <div id="emergencyModal" class="hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 relative max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center border-b pb-3">
        <div>
          <h3 class="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">🚨 Chuyển Ca Khẩn Cấp & Thông Báo SMS/Email</h3>
          <p class="text-xs text-stone-500">Xử lý khi thợ nghỉ đột xuất & tự động nhắn tin cho khách</p>
        </div>
        <button onclick="closeEmergencyModal()" class="text-stone-400 hover:text-stone-700 font-bold text-lg">✕</button>
      </div>

      <form onsubmit="submitEmergencyTransfer(event)" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-rose-700 mb-1">Stylist Xin Nghỉ Đột Xuất (*)</label>
            <select id="emFromStylist" onchange="previewAffectedApps()" class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none">
              <?php foreach ($stylists as $st): ?>
                <?php if (($st['isAny'] ?? 0) == 1) continue; ?>
                <option value="<?= htmlspecialchars($st['name']) ?>"><?= htmlspecialchars($st['name']) ?></option>
              <?php endforeach; ?>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-emerald-700 mb-1">Stylist Thay Thế Tương Đương (*)</label>
            <select id="emToStylist" class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none">
              <?php foreach ($stylists as $st): ?>
                <?php if (($st['isAny'] ?? 0) == 1) continue; ?>
                <option value="<?= htmlspecialchars($st['name']) ?>"><?= htmlspecialchars($st['name']) ?> (<?= htmlspecialchars($st['role']) ?>)</option>
              <?php endforeach; ?>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Ngày Bị Ảnh Hưởng</label>
            <select id="emDate" onchange="previewAffectedApps()" class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none">
              <option value="Hôm nay">Hôm nay (<?= date('d/m') ?>)</option>
              <option value="Ngày mai">Ngày mai (<?= date('d/m', strtotime('+1 day')) ?>)</option>
              <option value="Ngày kia">Ngày kia (<?= date('d/m', strtotime('+2 day')) ?>)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Kênh Thông Báo Cho Khách</label>
            <select id="emChannel" class="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none">
              <option value="Both">📲 SMS & 📧 Email Tự Động</option>
              <option value="SMS">Chỉ Gửi SMS</option>
              <option value="Email">📧 Chỉ Gửi Email</option>
            </select>
          </div>
        </div>

        <!-- AFFECTED APPOINTMENTS PREVIEW LIST -->
        <div class="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
          <p class="text-xs font-bold text-stone-800 flex justify-between">
            <span>📋 Danh sách ca hẹn cần chuyển dời:</span>
            <span id="emCountBadge" class="text-rose-600">0 ca</span>
          </p>
          <div id="emAffectedList" class="space-y-1.5 max-h-40 overflow-y-auto text-xs">
            <p class="text-stone-400 italic">Đang kiểm tra đơn hẹn bị ảnh hưởng...</p>
          </div>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" onclick="closeEmergencyModal()" class="flex-1 py-3 rounded-xl border border-stone-300 text-xs font-bold">Hủy</button>
          <button type="submit" class="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg transition">
            🚀 CHUYỂN CA & TỰ ĐỘNG THÔNG BÁO
          </button>
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

    function openAddStylistModal() { 
      document.getElementById('addStylistModal').classList.remove('hidden'); 
    }
    
    function closeAddStylistModal() { 
      document.getElementById('addStylistModal').classList.add('hidden'); 
    }

    function openEmergencyModal() {
      document.getElementById('emergencyModal').classList.remove('hidden');
      previewAffectedApps();
    }
    
    function closeEmergencyModal() { 
      document.getElementById('emergencyModal').classList.add('hidden'); 
    }

    function quickEmergencyTransfer(stylistName) {
      openEmergencyModal();
      document.getElementById('emFromStylist').value = stylistName;
      previewAffectedApps();
    }

    function previewAffectedApps() {
      const fromSt = document.getElementById('emFromStylist').value;
      const date = document.getElementById('emDate').value;
      const listDiv = document.getElementById('emAffectedList');
      const badge = document.getElementById('emCountBadge');

      fetch(`api.php?action=get_affected_appointments&from_stylist=${encodeURIComponent(fromSt)}&date=${encodeURIComponent(date)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.appointments.length > 0) {
          badge.innerText = `${data.appointments.length} ca hẹn bận`;
          listDiv.innerHTML = data.appointments.map(a => `
            <div class="p-2 rounded-xl bg-white border flex justify-between items-center">
              <div>
                <b class="text-[#4A6B5D]">${a.id}</b> - ${a.customerName} (${a.phone})
                <p class="text-[10px] text-stone-500">${(a.services || []).join(', ')}</p>
              </div>
              <span class="font-bold text-stone-800">${a.time}</span>
            </div>
          `).join('');
        } else {
          badge.innerText = `0 ca`;
          listDiv.innerHTML = `<p class="text-stone-400 italic">Không có ca hẹn nào bị ảnh hưởng của ${fromSt} vào ngày ${date}.</p>`;
        }
      });
    }

    function submitEmergencyTransfer(e) {
      e.preventDefault();
      const fromSt = document.getElementById('emFromStylist').value;
      const toSt = document.getElementById('emToStylist').value;
      const date = document.getElementById('emDate').value;
      const channel = document.getElementById('emChannel').value;

      if (fromSt === toSt) {
        showToast('⚠️ Stylist thay thế phải khác Stylist xin nghỉ!');
        return;
      }

      const formData = new FormData();
      formData.append('action', 'batch_reassign_stylist');
      formData.append('from_stylist', fromSt);
      formData.append('to_stylist', toSt);
      formData.append('date', date);
      formData.append('channel', channel);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        closeEmergencyModal();
        showToast(data.message);
        setTimeout(() => location.reload(), 1500);
      });
    }

    function previewStAvatarFile(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('stAvatarPreview').src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    }

    function previewStAvatarUrl(url) {
      if (url && url.trim()) {
        document.getElementById('stAvatarPreview').src = url.trim();
      }
    }

    function selectSampleStAvatar(url) {
      document.getElementById('stAvatarUrl').value = url;
      document.getElementById('stAvatarPreview').src = url;
      document.getElementById('stAvatarFile').value = '';
    }

    function submitAddStylist(e) {
      e.preventDefault();
      const name = document.getElementById('stName').value.trim();
      const role = document.getElementById('stRole').value.trim();
      const level = document.getElementById('stLevel').value;
      const experience = document.getElementById('stExperience').value.trim();
      const baseSalary = document.getElementById('stBaseSalary').value;
      const specialty = document.getElementById('stSpecialty').value.trim();
      const avatarUrl = document.getElementById('stAvatarUrl').value.trim();
      const fileInput = document.getElementById('stAvatarFile');

      const formData = new FormData();
      formData.append('action', 'add_stylist');
      formData.append('name', name);
      formData.append('role', role);
      formData.append('level', level);
      formData.append('experience', experience);
      formData.append('base_salary', baseSalary);
      formData.append('specialty', specialty);
      formData.append('avatar', avatarUrl);

      if (fileInput && fileInput.files[0]) {
        formData.append('avatar_file', fileInput.files[0]);
      }

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        closeAddStylistModal();
        showToast(data.message);
        setTimeout(() => location.reload(), 1000);
      });
    }

    function deleteStylist(id) {
      if (!confirm('Bạn có chắc muốn xóa thợ này?')) return;
      const formData = new FormData();
      formData.append('action', 'delete_stylist');
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
