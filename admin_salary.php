<?php
// admin_salary.php - Trang Quản Lý & Xuất Báo Cáo Lương Cuối Tháng Cho Stylist
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

if (!is_admin_logged_in()) {
    header('Location: login.php?tab=admin');
    exit;
}

$selectedMonthYear = $_GET['month'] ?? date('m/Y');
$reportData = get_monthly_salary_report($selectedMonthYear);

$summary = $reportData['summary'];
$stylistsReport = $reportData['stylistsReport'];
$displayMonthYear = $reportData['monthYear'];
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Báo Cáo Lương & Hoa Hồng Thợ</title>
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
  <style>
    @media print {
      body * { visibility: hidden; }
      #printableArea, #printableArea * { visibility: visible; }
      #printableArea { position: absolute; left: 0; top: 0; width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-[#F8F6F0] min-h-screen text-stone-900 flex">

  <!-- ADMIN SIDEBAR -->
  <?php render_admin_nav('salary'); ?>

  <!-- MAIN CONTENT CONTAINER -->
  <main class="flex-1 p-8 space-y-8 overflow-y-auto max-h-screen">
    
    <!-- TOP HEADER BAR -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print border-b border-stone-200 pb-5">
      <div>
        <h1 class="font-serif text-3xl font-bold text-stone-900 flex items-center gap-3">
          💵 Báo Cáo Lương & Hoa Hồng Thợ
          <span class="text-xs bg-[#4A6B5D] text-white px-3 py-1 rounded-full font-sans font-medium">Kỳ Tháng <?= htmlspecialchars($displayMonthYear) ?></span>
        </h1>
        <p class="text-xs text-stone-500 mt-1">Ghi nhận ca hẹn hoàn tất, phân bổ hoa hồng ma trận theo Cấp bậc (Master/Senior/Junior) & Loại dịch vụ</p>
      </div>

      <!-- ACTIONS & MONTH FILTER -->
      <div class="flex items-center gap-3">
        <form method="GET" class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-stone-300 shadow-sm">
          <label for="monthSelect" class="text-xs font-bold text-stone-600">📅 Chọn Kỳ:</label>
          <input type="month" id="monthSelect" name="month_input" value="<?= date('Y-m', strtotime('01/' . str_replace('/', '-', $displayMonthYear))) ?>" onchange="updateMonthParam(this.value)" class="text-xs font-bold text-stone-800 focus:outline-none bg-transparent cursor-pointer">
        </form>

        <a href="api.php?action=export_salary_csv&month=<?= urlencode($displayMonthYear) ?>" class="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition">
          📥 <span>Xuất CSV (Excel)</span>
        </a>

        <button onclick="window.print()" class="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-sm transition">
          🖨️ <span>In Phiếu Lương</span>
        </button>
      </div>
    </div>

    <div id="printableArea" class="space-y-8">
      
      <!-- PRINT HEADER FOR PAPER OUTPUT -->
      <div class="hidden print:block text-center border-b border-stone-300 pb-4 mb-6">
        <h1 class="text-2xl font-serif font-bold">LUMIÈRE HAIR STUDIO</h1>
        <h2 class="text-lg font-bold">BẢNG TỔNG HỢP LƯƠNG & HOA HỒNG THỢ CẮT TÓC</h2>
        <p class="text-xs text-stone-600">Kỳ Báo Cáo: <b>Tháng <?= htmlspecialchars($displayMonthYear) ?></b> | Ngày Xuất: <?= date('d/m/Y H:i') ?></p>
      </div>

      <!-- KPI METRIC CARDS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div class="flex justify-between items-center text-xs text-stone-500 font-bold uppercase">
            <span>Ca Hẹn Hoàn Thành</span>
            <span class="text-lg">✂️</span>
          </div>
          <div class="font-serif text-3xl font-bold text-stone-900"><?= number_format($summary['totalCompletedCount']) ?> <span class="text-xs text-stone-400 font-sans">ca</span></div>
          <p class="text-[11px] text-stone-500">Đã phục vụ & nghiệm thu</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2">
          <div class="flex justify-between items-center text-xs text-emerald-700 font-bold uppercase">
            <span>Doanh Thu Salon Tạo Ra</span>
            <span class="text-lg">💰</span>
          </div>
          <div class="font-serif text-2xl font-bold text-emerald-700"><?= format_vnd($summary['totalSalonRevenue']) ?></div>
          <p class="text-[11px] text-emerald-600 font-medium">Tổng giá trị đơn hoàn thành</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 bg-amber-50/70 border-amber-200">
          <div class="flex justify-between items-center text-xs text-amber-800 font-bold uppercase">
            <span>Hoa Hồng Phân Bổ</span>
            <span class="text-lg">✨</span>
          </div>
          <div class="font-serif text-2xl font-bold text-amber-800"><?= format_vnd($summary['totalSalonCommission']) ?></div>
          <p class="text-[11px] text-amber-700">Tự động theo ma trận tỷ lệ</p>
        </div>

        <div class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-2 bg-gradient-to-br from-[#4A6B5D]/10 to-emerald-100 border-[#4A6B5D]/30">
          <div class="flex justify-between items-center text-xs text-[#4A6B5D] font-bold uppercase">
            <span>Tổng Chi Phí Lương</span>
            <span class="text-lg">🏦</span>
          </div>
          <div class="font-serif text-2xl font-bold text-[#4A6B5D]"><?= format_vnd($summary['totalSalonPayout']) ?></div>
          <p class="text-[11px] text-stone-600 font-medium">Lương Cứng + Hoa Hồng Thợ</p>
        </div>
      </div>

      <!-- COMMISSION MATRIX REFERENCE -->
      <section class="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 no-print">
        <div class="flex justify-between items-center">
          <h2 class="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
            📐 Ma Trận Tỷ Lệ Hoa Hồng Phân Bổ (Commission Policy Matrix)
          </h2>
          <span class="text-[11px] bg-stone-100 px-3 py-1 rounded-full font-medium text-stone-600">Phân loại theo Loại Dịch Vụ & Cấp Bậc</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <!-- MASTER CARD -->
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <div class="flex justify-between items-center font-bold text-amber-900 border-b border-amber-200 pb-2">
              <span class="flex items-center gap-1.5">👑 Master Stylist</span>
              <span class="text-[10px] bg-amber-200 px-2 py-0.5 rounded-full">Lương cứng: 12.000.000 ₫</span>
            </div>
            <ul class="space-y-1 text-amber-800">
              <li class="flex justify-between"><span>• Uốn & Nhuộm:</span> <b>20%</b></li>
              <li class="flex justify-between"><span>• Cắt & Tạo Kiểu:</span> <b>15%</b></li>
              <li class="flex justify-between"><span>• Chăm Sóc & Phục Hồi:</span> <b>12%</b></li>
            </ul>
          </div>

          <!-- SENIOR CARD -->
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div class="flex justify-between items-center font-bold text-emerald-900 border-b border-emerald-200 pb-2">
              <span class="flex items-center gap-1.5">⭐ Senior Hair Artist</span>
              <span class="text-[10px] bg-emerald-200 px-2 py-0.5 rounded-full">Lương cứng: 8.000.000 ₫</span>
            </div>
            <ul class="space-y-1 text-emerald-800">
              <li class="flex justify-between"><span>• Uốn & Nhuộm:</span> <b>15%</b></li>
              <li class="flex justify-between"><span>• Cắt & Tạo Kiểu:</span> <b>12%</b></li>
              <li class="flex justify-between"><span>• Chăm Sóc & Phục Hồi:</span> <b>10%</b></li>
            </ul>
          </div>

          <!-- JUNIOR CARD -->
          <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
            <div class="flex justify-between items-center font-bold text-sky-900 border-b border-sky-200 pb-2">
              <span class="flex items-center gap-1.5">🌱 Junior Stylist</span>
              <span class="text-[10px] bg-sky-200 px-2 py-0.5 rounded-full">Lương cứng: 5.000.000 ₫</span>
            </div>
            <ul class="space-y-1 text-sky-800">
              <li class="flex justify-between"><span>• Uốn & Nhuộm:</span> <b>10%</b></li>
              <li class="flex justify-between"><span>• Cắt & Tạo Kiểu:</span> <b>8%</b></li>
              <li class="flex justify-between"><span>• Chăm Sóc & Phục Hồi:</span> <b>8%</b></li>
            </ul>
          </div>
        </div>
      </section>

      <!-- STYLIST SALARY REPORT TABLE -->
      <section class="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-5">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="font-serif text-xl font-bold text-stone-900">👥 Bảng Phân Bổ Lương Chi Tiết Từng Thợ</h2>
            <p class="text-xs text-stone-500">Danh sách tổng hợp lương cơ bản, số ca nghiệm thu, doanh thu tạo ra và tổng hoa hồng thực nhận</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-stone-100 text-stone-600 uppercase border-b border-stone-200 font-bold">
                <th class="p-3.5">Thợ Stylist & Cấp Bậc</th>
                <th class="p-3.5">Lương Cơ Bản</th>
                <th class="p-3.5 text-center">Ca Hoàn Thành</th>
                <th class="p-3.5 text-right">Doanh Thu Tạo Ra</th>
                <th class="p-3.5 text-right">Hoa Hồng Thực Nhận</th>
                <th class="p-3.5 text-right font-black text-[#4A6B5D]">TỔNG THỰC NHẬN</th>
                <th class="p-3.5 text-center no-print">Thao Tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-200">
              <?php foreach ($stylistsReport as $stData): ?>
                <?php 
                  $st = $stData['stylist'];
                  $level = $st['level'] ?? 'Senior';
                  $badgeClass = match($level) {
                      'Master' => 'bg-amber-100 text-amber-800 border-amber-300',
                      'Senior' => 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      'Junior' => 'bg-sky-100 text-sky-800 border-sky-300',
                      default => 'bg-stone-100 text-stone-700'
                  };
                  $badgeIcon = match($level) {
                      'Master' => '👑',
                      'Senior' => '⭐',
                      'Junior' => '🌱',
                      default => '👤'
                  };
                ?>
                <tr class="hover:bg-stone-50 transition">
                  <td class="p-3.5">
                    <div class="flex items-center gap-3">
                      <img src="<?= htmlspecialchars($st['avatar'] ?? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150') ?>" class="w-10 h-10 rounded-full object-cover border border-stone-200">
                      <div>
                        <span class="font-bold text-stone-900 block font-serif text-sm"><?= htmlspecialchars($st['name']) ?></span>
                        <span class="text-[10px] inline-flex items-center gap-1 font-sans font-bold px-2 py-0.5 rounded-full border <?= $badgeClass ?>">
                          <?= $badgeIcon ?> <?= $level ?> Stylist
                        </span>
                      </div>
                    </div>
                  </td>
                  <td class="p-3.5 font-medium text-stone-600">
                    <?= format_vnd($stData['baseSalary']) ?>
                  </td>
                  <td class="p-3.5 text-center font-bold text-stone-800 font-serif text-base">
                    <?= $stData['completedCount'] ?>
                  </td>
                  <td class="p-3.5 text-right font-medium text-stone-900">
                    <?= format_vnd($stData['revenue']) ?>
                  </td>
                  <td class="p-3.5 text-right font-bold text-amber-700">
                    +<?= format_vnd($stData['commission']) ?>
                  </td>
                  <td class="p-3.5 text-right font-serif font-black text-sm text-[#4A6B5D]">
                    <?= format_vnd($stData['totalPayout']) ?>
                  </td>
                  <td class="p-3.5 text-center no-print">
                    <button onclick="openDetailModal(<?= htmlspecialchars(json_encode([
                      'name' => $st['name'],
                      'level' => $level,
                      'avatar' => $st['avatar'],
                      'baseSalary' => format_vnd($stData['baseSalary']),
                      'commission' => format_vnd($stData['commission']),
                      'totalPayout' => format_vnd($stData['totalPayout']),
                      'appointments' => $stData['appointments']
                    ])) ?>)" class="px-3 py-1.5 bg-stone-100 hover:bg-[#4A6B5D] hover:text-white text-stone-700 text-xs font-bold rounded-xl border border-stone-300 transition flex items-center gap-1 mx-auto">
                      🔍 <span>Xem Bảng Kê</span>
                    </button>
                  </td>
                </tr>
              <?php endforeach; ?>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </main>

  <!-- MODAL: CHI TIẾT BẢNG KÊ CA HẸN THỢ -->
  <div id="detailModal" class="hidden fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col">
      <!-- MODAL HEADER -->
      <div class="flex justify-between items-start border-b border-stone-200 pb-4">
        <div class="flex items-center gap-3">
          <img id="mAvatar" class="w-12 h-12 rounded-full object-cover border-2 border-[#C89F82]">
          <div>
            <h3 id="mName" class="font-serif font-bold text-lg text-stone-900">Tên Thợ</h3>
            <p id="mLevel" class="text-xs text-stone-500 font-medium">Cấp bậc</p>
          </div>
        </div>

        <button onclick="closeDetailModal()" class="text-stone-400 hover:text-stone-700 text-xl font-bold p-1">✕</button>
      </div>

      <!-- MODAL SALARY BREAKDOWN SUMMARY -->
      <div class="grid grid-cols-3 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
        <div>
          <span class="text-stone-500 font-bold uppercase block">Lương Cơ Bản</span>
          <span id="mBaseSalary" class="font-serif font-bold text-stone-800 text-base">0 ₫</span>
        </div>
        <div>
          <span class="text-amber-800 font-bold uppercase block">Hoa Hồng Nhận Độc</span>
          <span id="mCommission" class="font-serif font-bold text-amber-700 text-base">0 ₫</span>
        </div>
        <div>
          <span class="text-[#4A6B5D] font-bold uppercase block">Tổng Lương Tháng</span>
          <span id="mTotalPayout" class="font-serif font-black text-[#4A6B5D] text-base">0 ₫</span>
        </div>
      </div>

      <!-- APPOINTMENTS BREAKDOWN LIST -->
      <div class="space-y-3 flex-1 overflow-y-auto pr-1">
        <h4 class="font-serif font-bold text-sm text-stone-800 flex items-center justify-between">
          <span>📋 Danh Sách Ca Hẹn Nghiệm Thu Trong Tháng</span>
          <span id="mAppCount" class="text-xs font-sans font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">0 ca</span>
        </h4>

        <div id="mAppList" class="space-y-3 text-xs">
          <!-- Dynamic JS Injection -->
        </div>
      </div>

      <!-- MODAL FOOTER -->
      <div class="pt-4 border-t border-stone-200 flex justify-end">
        <button onclick="closeDetailModal()" class="px-5 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition">
          Đóng Cửa Sổ
        </button>
      </div>
    </div>
  </div>

  <script>
    function updateMonthParam(val) {
      if (!val) return;
      const parts = val.split('-'); // YYYY-MM
      if (parts.length === 2) {
        const monthYear = parts[1] + '/' + parts[0];
        window.location.href = 'admin_salary.php?month=' + encodeURIComponent(monthYear);
      }
    }

    function openDetailModal(data) {
      document.getElementById('mName').textContent = data.name;
      document.getElementById('mLevel').textContent = data.level + ' Stylist';
      document.getElementById('mAvatar').src = data.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150';
      document.getElementById('mBaseSalary').textContent = data.baseSalary;
      document.getElementById('mCommission').textContent = data.commission;
      document.getElementById('mTotalPayout').textContent = data.totalPayout;
      document.getElementById('mAppCount').textContent = data.appointments.length + ' ca hoàn thành';

      const container = document.getElementById('mAppList');
      container.innerHTML = '';

      if (!data.appointments || data.appointments.length === 0) {
        container.innerHTML = '<div class="text-center py-6 text-stone-400 italic">Không có ca hẹn hoàn thành nào trong kỳ này.</div>';
      } else {
        data.appointments.forEach(app => {
          const commInfo = app.commissionInfo || { totalCommission: 0, servicesBreakdown: [] };
          let svcsHtml = '';

          if (commInfo.servicesBreakdown && commInfo.servicesBreakdown.length > 0) {
            commInfo.servicesBreakdown.forEach(s => {
              svcsHtml += `
                <div class="flex justify-between items-center py-1 text-[11px] border-b border-stone-100 last:border-0">
                  <span class="text-stone-700 font-medium">• ${s.serviceName} <span class="text-[10px] text-stone-400">(${s.category})</span></span>
                  <div class="text-right">
                    <span class="text-stone-500">${s.price.toLocaleString('vi-VN')} ₫</span>
                    <span class="mx-1 text-stone-300">×</span>
                    <span class="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">${s.ratePercent}</span>
                    <span class="mx-1 text-stone-300">=</span>
                    <span class="font-bold text-emerald-700">${s.commission.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              `;
            });
          }

          const card = document.createElement('div');
          card.className = 'p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2';
          card.innerHTML = `
            <div class="flex justify-between items-center border-b border-stone-200 pb-2 font-bold text-stone-900">
              <span class="flex items-center gap-2">
                <span class="bg-[#4A6B5D] text-white text-[10px] px-2 py-0.5 rounded-full font-mono">${app.id}</span>
                <span>${app.customerName} (${app.phone})</span>
              </span>
              <span class="text-stone-500 text-[11px]">🕒 ${app.time} - ${app.date}</span>
            </div>
            
            <div class="space-y-1">
              ${svcsHtml}
            </div>

            <div class="flex justify-between items-center pt-2 border-t border-stone-200 text-xs">
              <span class="text-stone-500 font-medium">Tổng Doanh Thu Ca: <b>${parseInt(app.totalPrice || 0).toLocaleString('vi-VN')} ₫</b></span>
              <span class="font-bold text-amber-800">Hoa Hồng Ca: <b>${commInfo.totalCommission.toLocaleString('vi-VN')} ₫</b></span>
            </div>
          `;
          container.appendChild(card);
        });
      }

      document.getElementById('detailModal').classList.remove('hidden');
    }

    function closeDetailModal() {
      document.getElementById('detailModal').classList.add('hidden');
    }
  </script>
</body>
</html>
