<?php
// customer_portal.php - Cổng Thông Tin Khách Hàng (Xem Lịch Sử Lịch Hẹn & Tích Điểm Thành Viên)
require_once __DIR__ . '/db.php';
$isAdmin = is_admin_logged_in();
$isAdminPreview = (($_GET['view'] ?? '') === 'admin_preview') || $isAdmin;
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Salon - Cổng Thông Tin Khách Hàng & Điểm Thưởng</title>
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
<body class="bg-[#FBF9F5] min-h-screen text-stone-900 flex flex-col justify-between">

  <!-- HEADER -->
  <header class="bg-stone-900 text-white px-8 py-5 flex justify-between items-center border-b border-stone-800 shadow-md">
    <a href="index.php" class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-[#4A6B5D] text-white flex items-center justify-center font-serif font-bold text-xl">L</div>
      <div>
        <h1 class="font-serif font-bold text-white text-lg leading-tight">LUMIÈRE Hair Studio</h1>
        <p class="text-xs text-[#C89F82]">Cổng Tra Cứu Lịch Sử & Tích Điểm Thành Viên</p>
      </div>
    </a>

    <a href="index.php" class="text-xs text-stone-300 hover:text-white px-4 py-2 rounded-xl bg-stone-800 border border-stone-700 transition">
      🌐 <span>Quay Về Trang Chủ</span>
    </a>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="max-w-5xl mx-auto w-full p-8 my-6 space-y-8 flex-1">
    
    <?php if ($isAdminPreview): ?>
      <!-- FORBIDDEN ACCESS CARD FOR ADMIN -->
      <div class="bg-rose-50 border-2 border-rose-300 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6 shadow-xl">
        <div class="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-4xl mx-auto border border-rose-200">
          🚫
        </div>
        <div class="space-y-3">
          <h2 class="font-serif font-bold text-2xl text-rose-950">CẤM TRUY CẬP CỔNG Ý KIẾN & CÁ NHÂN KHÁCH HÀNG</h2>
          <p class="text-xs sm:text-sm text-rose-800 leading-relaxed font-medium">
            Tài khoản <b>Quản Trị Admin</b> được phép xem trước giao diện trang khách hàng, nhưng <b class="text-rose-950">CẤM TRUY CẬP / XÂM PHẠM</b> vào Ý kiến cá nhân, Điểm thưởng & Lịch sử riêng tư của Khách hàng!
          </p>
        </div>
        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs text-left space-y-1">
          <p class="font-bold">🔒 Quy định phân quyền & Bảo vệ quyền riêng tư Khách Hàng:</p>
          <p class="text-[11px] text-amber-800">Admin quản lý thông tin lịch hẹn tổng quan tại Bảng Điều Khiển Admin (admin.php). Không được xâm phạm tài khoản cá nhân & ý kiến của khách hàng.</p>
        </div>
        <div class="pt-2 flex justify-center flex-wrap gap-4">
          <a href="admin.php" class="px-7 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-2xl shadow-lg transition">
            ← Quay Về Trang Quản Trị Admin
          </a>
          <a href="index.php" class="px-7 py-3.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-bold text-xs rounded-2xl transition">
            🌐 Xem Trang Chủ Salon
          </a>
        </div>
      </div>
    <?php else: ?>
      <!-- SEARCH PHONE BOX -->
      <div class="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center max-w-xl mx-auto space-y-4">
        <span class="text-3xl block">📱</span>
        <h2 class="font-serif text-2xl font-bold text-stone-900">Tra Cứu Lịch Sử Làm Tóc & Tích Điểm</h2>
        <p class="text-xs text-stone-500">Nhập số điện thoại đã từng đặt lịch tại LUMIÈRE Salon để xem điểm thưởng & ca hẹn</p>
        
        <form onsubmit="searchCustomerPortal(event)" class="flex gap-2">
          <input type="tel" id="custPhoneInput" required placeholder="Nhập SĐT (ví dụ: 0912345678)" value="" class="flex-1 px-5 py-3 rounded-2xl border border-stone-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]">
          <button type="submit" class="px-6 py-3 bg-[#4A6B5D] hover:bg-emerald-800 text-white font-bold text-xs rounded-2xl shadow-md transition">
            🔍 Tra Cứu Ngay
          </button>
        </form>
      </div>

      <!-- RESULT AREA -->
      <div id="portalResult" class="space-y-6">
        <!-- Dynamic JS Content -->
      </div>
    <?php endif; ?>
  </main>

  <footer class="bg-stone-900 text-stone-400 text-center py-6 text-xs border-t border-stone-800">
    LUMIÈRE Hair Studio &copy; 2026 - Đặt Lịch Thông Minh & Chăm Sóc Khách Hàng Đỉnh Cao
  </footer>

  <script>
    async function searchCustomerPortal(e) {
      if (e) e.preventDefault();
      const phone = document.getElementById('custPhoneInput').value.trim();
      if (!phone) return;

      const res = await fetch('api.php?action=get_customer_portal&phone=' + encodeURIComponent(phone)).then(r => r.json());
      const container = document.getElementById('portalResult');

      if (res.status !== 'success') {
        container.innerHTML = `<div class="bg-rose-50 text-rose-700 p-6 rounded-3xl text-center text-xs font-bold border border-rose-200">${res.message}</div>`;
        return;
      }

      const user = res.user;
      const apps = res.appointments;

      let tierBadge = 'bg-stone-100 text-stone-800';
      if (user.membership_tier.includes('Vàng') || user.membership_tier.includes('VIP')) {
        tierBadge = 'bg-amber-100 text-amber-800 border-amber-300';
      } else if (user.membership_tier.includes('Bạc')) {
        tierBadge = 'bg-slate-100 text-slate-800 border-slate-300';
      }

      let html = `
        <!-- CUSTOMER PROFILE CARD -->
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-[#4A6B5D] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md">
              ${user.name.charAt(0)}
            </div>
            <div>
              <h3 class="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                ${user.name}
                <span class="text-xs font-sans px-3 py-0.5 rounded-full border ${tierBadge} font-bold">👑 ${user.membership_tier}</span>
              </h3>
              <p class="text-xs text-stone-500 font-mono mt-0.5">📞 SĐT: ${user.phone}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
              <span class="text-[10px] text-amber-800 font-bold uppercase block">Điểm Thưởng Tích Lũy</span>
              <span class="font-serif font-bold text-2xl text-amber-700">${user.loyalty_points || 0} pts</span>
            </div>
            <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
              <span class="text-[10px] text-emerald-800 font-bold uppercase block">Ca Lần Làm Tóc</span>
              <span class="font-serif font-bold text-2xl text-emerald-700">${apps.length} ca</span>
            </div>
          </div>
        </div>

        <!-- APPOINTMENTS HISTORY TABLE -->
        <div class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <h4 class="font-serif font-bold text-lg text-stone-900">📅 Lịch Sử Các Ca Hẹn Đã Đặt</h4>
      `;

      if (apps.length === 0) {
        html += `<p class="text-xs text-stone-400 italic py-6 text-center">Bạn chưa có ca hẹn nào tại LUMIÈRE Salon.</p>`;
      } else {
        html += `
          <div class="space-y-3 text-xs">
        `;
        apps.forEach(a => {
          let stColor = 'bg-amber-100 text-amber-800';
          if (a.status === 'Completed') stColor = 'bg-emerald-100 text-emerald-800';
          if (a.status === 'Cancelled') stColor = 'bg-rose-100 text-rose-800';

          html += `
            <div class="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#4A6B5D] transition">
              <div class="space-y-1">
                <div class="flex items-center gap-2 font-bold text-stone-900">
                  <span class="bg-[#4A6B5D] text-white text-[10px] px-2.5 py-0.5 rounded-full font-mono">${a.id}</span>
                  <span class="font-serif text-sm">${a.services.join(', ')}</span>
                </div>
                <p class="text-stone-500 text-[11px]">💈 Stylist: <b>${a.stylist}</b> | Dáng tóc: <b>${a.hairstyle}</b> | Màu nhuộm: <b>${a.haircolor}</b></p>
                <p class="text-stone-400 text-[10px]">🕒 Thời gian: ${a.time} - Ngày ${a.date}</p>
              </div>

              <div class="text-right space-y-1 shrink-0">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold ${stColor}">${a.status}</span>
                <p class="font-serif font-bold text-stone-900 text-sm mt-1">${parseInt(a.totalPrice).toLocaleString('vi-VN')} ₫</p>
                <span class="text-[10px] text-stone-400">Đã cọc: ${parseInt(a.depositAmount).toLocaleString('vi-VN')} ₫ (${a.depositStatus})</span>
              </div>
            </div>
          `;
        });
        html += `</div>`;
      }

      html += `</div>`;
      container.innerHTML = html;
    }

    // Auto search on page load
    searchCustomerPortal();
  </script>
</body>
</html>
