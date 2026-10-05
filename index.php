<?php
// index.php - Trang Chủ LUMIÈRE Hair Studio (Phần Đặt Lịch Từng Bước 5 Bước Nằm Ở Cuối Trang)
require_once __DIR__ . '/db.php';
$db = get_db();

$services = $db['services'] ?? [];
$hairstyles = $db['hairstyles'] ?? [];
$haircolors = $db['haircolors'] ?? [];
$stylists = $db['stylists'] ?? [];
$reviews = $db['reviews'] ?? [];
$loggedUser = get_logged_user();
$isAdmin = is_admin_logged_in();
$isAdminPreview = (($_GET['view'] ?? '') === 'admin_preview') || $isAdmin;
?>
<!DOCTYPE html>
<html lang="vi" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Hair Studio - Đặt Lịch Từng Bước Cuối Trang (PHP & MySQL)</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            salon: {
              bg: '#FBF9F5',
              surface: '#FFFFFF',
              card: '#F5F0EB',
              primary: '#4A6B5D',
              primaryHover: '#3D5A4D',
              secondary: '#C89F82',
              secondaryLight: '#F7F1EC',
              text: '#1C1917',
              muted: '#78716C',
              border: '#E7E0D8'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    body { background-color: #FBF9F5; color: #1C1917; font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-serif-accent { font-family: 'Playfair Display', serif; }
    .glass-nav { background: rgba(251, 249, 245, 0.92); backdrop-filter: blur(12px); }
    .step-card { display: none; }
    .step-card.active { display: block; animation: fadeIn 0.4s ease-in-out; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body class="antialiased selection:bg-salon-primary/20 selection:text-salon-primary">

  <!-- ADMIN PREVIEW BANNER -->
  <?php if ($isAdminPreview): ?>
    <div class="bg-amber-500 text-stone-950 font-bold px-4 py-2.5 text-xs text-center flex flex-wrap items-center justify-center gap-3 border-b border-amber-600 shadow-md z-50 relative">
      <span class="flex items-center gap-1.5"><span class="text-base">🛡️</span> <b>CHẾ ĐỘ XEM TRƯỚC ADMIN (ADMIN PREVIEW):</b> Xem giao diện trang khách hàng thành công!</span>
      <span class="bg-stone-900 text-amber-300 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-400">🚫 CẤM truy cập / xem Ý kiến cá nhân & Cổng riêng Khách hàng</span>
      <a href="admin.php" class="bg-stone-900 text-white px-3.5 py-1 rounded-full text-[11px] font-bold hover:bg-stone-800 transition shadow-sm">← Quay về Trang Admin</a>
    </div>
  <?php endif; ?>

  <!-- TOAST NOTIFICATION -->
  <div id="toast" class="hidden fixed top-5 right-5 z-50 bg-stone-900 text-stone-100 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium items-center gap-3 border border-stone-700 animate-bounce">
    <span>⚡</span>
    <span id="toastMsg">Thông báo</span>
  </div>

  <!-- NAVIGATION HEADER -->
  <header class="sticky top-0 z-40 glass-nav border-b border-salon-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- LOGO BRAND -->
      <a href="index.php" class="flex items-center gap-3 group">
        <div class="w-11 h-11 rounded-full bg-salon-primary text-white flex items-center justify-center font-serif-accent text-2xl font-bold shadow-md transition group-hover:scale-105">
          L
        </div>
        <div>
          <span class="font-serif-accent text-2xl font-bold text-salon-text tracking-wide block leading-none">LUMIÈRE</span>
          <span class="text-[10px] tracking-[0.2em] text-salon-secondary uppercase font-semibold block mt-1">HAIR STUDIO</span>
        </div>
      </a>

      <!-- NAVIGATION LINKS -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
        <a href="#services" class="hover:text-salon-primary transition">Dịch Vụ</a>
        <a href="#hairstyles" class="hover:text-salon-primary transition">Mẫu Tóc</a>
        <a href="#haircolors" class="hover:text-salon-primary transition">Màu Nhuộm</a>
        <a href="#stylists" class="hover:text-salon-primary transition">Stylist</a>
        <?php if ($isAdminPreview): ?>
          <button onclick="handleAdminPortalBlocked(event)" class="hover:text-salon-primary transition font-bold text-amber-800 flex items-center gap-1">👑 Tích Điểm & Lịch Sử (Cấm xem)</button>
        <?php else: ?>
          <a href="customer_portal.php" class="hover:text-salon-primary transition font-bold text-amber-800 flex items-center gap-1">👑 Tích Điểm & Lịch Sử</a>
        <?php endif; ?>
        <button onclick="openAiTryOnModal()" class="hover:text-salon-primary transition font-bold text-emerald-800 flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full text-xs">📸 AI Thử Tóc</button>
        <a href="#booking-section" class="hover:text-salon-primary transition font-bold text-salon-primary">📅 Đặt Lịch 5 Bước</a>
      </nav>

      <!-- AUTH BUTTONS -->
      <div class="flex items-center gap-3">
        <?php if ($loggedUser): ?>
          <?php if ($isAdminPreview): ?>
            <button onclick="handleAdminPortalBlocked(event)" class="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-800 transition">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>👤 <?= htmlspecialchars($loggedUser['name']) ?></span>
              <span class="text-[10px] bg-salon-primary text-white px-2 py-0.5 rounded-full ml-1">Lịch sử</span>
            </button>
          <?php else: ?>
            <a href="customer_portal.php" class="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-full border border-stone-200 text-xs font-bold text-stone-800 transition">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>👤 <?= htmlspecialchars($loggedUser['name']) ?></span>
              <span class="text-[10px] bg-salon-primary text-white px-2 py-0.5 rounded-full ml-1">Lịch sử</span>
            </a>
          <?php endif; ?>
          <button onclick="logout()" class="text-xs text-rose-600 font-bold hover:underline">Đăng xuất</button>
        <?php else: ?>
          <a href="login.php" class="px-4 py-2 text-xs font-bold text-stone-700 hover:text-salon-primary transition">Đăng Nhập</a>
          <a href="login.php?tab=register" class="px-5 py-2.5 rounded-full bg-salon-primary hover:bg-salon-primaryHover text-white text-xs font-bold transition shadow-sm">Đăng Ký</a>
        <?php endif; ?>

        <?php if ($isAdmin): ?>
          <a href="admin.php" class="px-3.5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition">🔑 Admin</a>
        <?php else: ?>
          <button onclick="handleForbiddenAdminClick(event)" class="px-3.5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition">🔑 Admin</button>
        <?php endif; ?>
      </div>

    </div>
  </header>

  <!-- HERO BANNER -->
  <section class="relative bg-stone-900 text-white overflow-hidden py-16 sm:py-24">
    <img 
      src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=1600" 
      alt="Lumiere Hair Studio Ambiance" 
      class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8 items-center">
      <div class="md:col-span-8 space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-salon-secondary text-xs font-semibold">
          <span>🌿</span> Độc quyền Uốn Nhuộm Thảo Mộc 5 Sao
        </div>
        <h1 class="font-serif-accent text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-stone-100">
          Nâng Tầm Vẻ Đẹp Mái Tóc Với Phong Cách Riêng
        </h1>
        <p class="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Không gian trải nghiệm làm đẹp thư thái tuyệt đối. Đội ngũ Master Stylist 10 năm kinh nghiệm sẵn sàng kiến tạo kiểu tóc chuẩn phom gương mặt của bạn.
        </p>
        <div class="flex flex-wrap gap-4 pt-2">
          <a href="#booking-section" class="px-7 py-3.5 rounded-full bg-salon-primary hover:bg-salon-primaryHover text-white font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5">
            📅 Đặt Lịch Từng Bước Ở Cuối Trang
          </a>
          <a href="#services" class="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm backdrop-blur-md transition">
            Xem Bảng Giá Dịch Vụ
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- MAIN CONTAINER -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

    <!-- SERVICES CATALOG -->
    <section id="services" class="space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Danh Mục Dịch Vụ Nổi Bật</h2>
        <p class="text-xs sm:text-sm text-stone-500">Giá dịch vụ đã bao gồm trọn gói tư vấn dáng mặt & sấy tạo kiểu cao cấp</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php foreach ($services as $s): ?>
          <div class="bg-white rounded-3xl border border-salon-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group">
            <div class="relative aspect-video overflow-hidden">
              <img 
                src="<?= htmlspecialchars($s['image']) ?>" 
                alt="<?= htmlspecialchars($s['name']) ?>" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600';"
              />
              <span class="absolute top-3 left-3 bg-stone-900/80 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md">
                <?= htmlspecialchars($s['badge'] ?? 'Hot') ?>
              </span>
            </div>
            <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div class="space-y-2">
                <div class="flex justify-between items-start gap-2">
                  <h3 class="font-bold text-stone-900 text-lg group-hover:text-salon-primary transition">
                    <?= htmlspecialchars($s['name']) ?>
                  </h3>
                  <span class="font-bold text-salon-primary text-base whitespace-nowrap">
                    <?= format_vnd($s['price']) ?>
                  </span>
                </div>
                <p class="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  <?= htmlspecialchars($s['description']) ?>
                </p>
              </div>
              <div class="flex items-center justify-between pt-4 border-t border-stone-100 text-xs text-stone-400">
                <span>⏱️ <?= htmlspecialchars($s['duration']) ?></span>
                <a href="#booking-section" onclick="selectServiceFromCatalog('<?= htmlspecialchars($s['name']) ?>', <?= $s['price'] ?>)" class="text-salon-primary font-bold hover:underline">
                  + Chọn dịch vụ & Đặt ngay
                </a>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- HAIRSTYLES LOOKBOOK -->
    <section id="hairstyles" class="space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="inline-block px-3.5 py-1 rounded-full bg-salon-secondaryLight text-salon-secondary text-xs font-bold">
          ✂️ BỘ SƯU TẬP MẪU TÓC
        </span>
        <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Mẫu Tóc Hot Trend 2026</h2>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <?php foreach ($hairstyles as $hs): ?>
          <div class="bg-white p-3 rounded-2xl border border-salon-border shadow-sm text-center space-y-2 group hover:border-salon-primary transition">
            <div class="aspect-square rounded-xl overflow-hidden">
              <img src="<?= htmlspecialchars($hs['image']) ?>" alt="<?= htmlspecialchars($hs['name']) ?>" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400';" />
            </div>
            <p class="font-bold text-xs text-stone-800 line-clamp-1"><?= htmlspecialchars($hs['name']) ?></p>
            <span class="inline-block text-[10px] text-salon-secondary bg-salon-secondaryLight px-2 py-0.5 rounded-full font-bold"><?= htmlspecialchars($hs['tag'] ?? 'Hot') ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- HAIR COLORS PALETTE -->
    <section id="haircolors" class="space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <span class="inline-block px-3.5 py-1 rounded-full bg-salon-secondaryLight text-salon-secondary text-xs font-bold">
          🎨 BẢNG MÀU NHUỘM THỜI TRANG
        </span>
        <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Tông Màu Tôn Da & Sang Trọng</h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <?php foreach ($haircolors as $hc): ?>
          <div class="bg-white p-3 rounded-2xl border border-salon-border text-center space-y-2 hover:shadow-md transition">
            <div class="w-8 h-8 rounded-full mx-auto border-2 border-white shadow-md" style="background-color: <?= htmlspecialchars($hc['hex'] ?? '#4A6B5D') ?>"></div>
            <p class="font-bold text-[11px] text-stone-800 line-clamp-1"><?= htmlspecialchars($hc['name']) ?></p>
            <p class="text-[9px] text-stone-400"><?= htmlspecialchars($hc['badge'] ?? '') ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- STYLISTS TEAM -->
    <section id="stylists" class="space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Đội Ngũ Master Stylist</h2>
        <p class="text-xs text-stone-500">Kinh nghiệm từ 5 - 10 năm tạo kiểu cho các Idol & Show diễn thời trang</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php foreach ($stylists as $st): ?>
          <?php if (empty($st['isAny'])): ?>
            <div class="bg-white p-5 rounded-3xl border border-salon-border shadow-sm text-center space-y-3">
              <img src="<?= htmlspecialchars($st['avatar']) ?>" alt="<?= htmlspecialchars($st['name']) ?>" class="w-20 h-20 rounded-full mx-auto object-cover border-2 border-salon-primary shadow-md" />
              <div>
                <h3 class="font-bold text-stone-900 text-sm"><?= htmlspecialchars($st['name']) ?></h3>
                <p class="text-xs text-salon-secondary font-semibold"><?= htmlspecialchars($st['role']) ?></p>
                <p class="text-[11px] text-stone-400 mt-1"><?= htmlspecialchars($st['experience']) ?></p>
              </div>
              <p class="text-xs text-stone-600 bg-salon-bg p-2 rounded-xl border border-salon-border italic">
                "<?= htmlspecialchars($st['specialty']) ?>"
              </p>
            </div>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- REVIEWS SECTION -->
    <section id="reviews" class="space-y-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="space-y-1 text-center sm:text-left">
          <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Đánh Giá Từ Khách Hàng</h2>
          <p class="text-xs text-stone-500">Hàng ngàn khách hàng đã trải nghiệm dịch vụ tại Lumière Hair Studio</p>
        </div>
        <button onclick="openReviewModal()" class="px-5 py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition">
          ✍️ Viết Đánh Giá Mới
        </button>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <?php foreach ($reviews as $rev): ?>
          <div class="bg-white p-6 rounded-3xl border border-salon-border shadow-sm space-y-4">
            <div class="flex items-center gap-3">
              <img src="<?= htmlspecialchars($rev['avatar']) ?>" class="w-10 h-10 rounded-full object-cover" />
              <div>
                <h4 class="font-bold text-xs text-stone-900"><?= htmlspecialchars($rev['name']) ?></h4>
                <p class="text-[10px] text-salon-secondary"><?= htmlspecialchars($rev['service']) ?></p>
              </div>
            </div>
            <div class="text-amber-400 text-xs tracking-wider font-bold flex items-center gap-1">
              <span>
                <?php 
                  $r = intval($rev['rating'] ?? 5);
                  for ($i = 1; $i <= 5; $i++) {
                    echo ($i <= $r) ? '★' : '☆';
                  }
                ?>
              </span>
              <span class="text-[10px] text-stone-500 font-medium">(<?= $r ?>/5 sao)</span>
            </div>
            <p class="text-xs text-stone-600 italic leading-relaxed">
              "<?= htmlspecialchars($rev['content']) ?>"
            </p>
          </div>
        <?php endforeach; ?>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 🔥 PHẦN ĐẶT LỊCH TỪNG BƯỚC (5-STEP WIZARD) NẰM Ở CUỐI TRANG TRƯỚC FOOTER -->
    <!-- ========================================================================= -->
    <section id="booking-section" class="bg-white rounded-3xl border border-salon-border shadow-2xl p-6 sm:p-10 space-y-8">
      
      <!-- WIZARD HEADER & PROGRESS INDICATOR -->
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="inline-block px-3.5 py-1 rounded-full bg-salon-secondaryLight text-salon-secondary text-xs font-bold uppercase tracking-wider">
          💈 ĐẶT LỊCH HẸN TỪNG BƯỚC (5 BƯỚC HOÀN TẤT)
        </span>
        <h2 class="font-serif-accent text-3xl font-bold text-stone-900">Giữ Chỗ Đặt Lịch & Thanh Toán Dễ Dàng</h2>
        
        <!-- STEP INDICATOR DOTS -->
        <div class="grid grid-cols-5 gap-2 pt-4 max-w-2xl mx-auto">
          <div id="step-nav-1" onclick="goToStep(1)" class="cursor-pointer p-2.5 rounded-2xl border-2 border-salon-primary bg-salon-primary/10 text-center space-y-1 transition">
            <span class="block text-xs font-bold text-salon-primary">BƯỚC 1</span>
            <span class="block text-[11px] font-semibold text-stone-700 hidden sm:block">✂️ Dịch Vụ</span>
          </div>
          <div id="step-nav-2" onclick="goToStep(2)" class="cursor-pointer p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center space-y-1 transition">
            <span class="block text-xs font-bold text-stone-400">BƯỚC 2</span>
            <span class="block text-[11px] font-semibold text-stone-500 hidden sm:block">💇‍♀️ Kiểu & Màu</span>
          </div>
          <div id="step-nav-3" onclick="goToStep(3)" class="cursor-pointer p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center space-y-1 transition">
            <span class="block text-xs font-bold text-stone-400">BƯỚC 3</span>
            <span class="block text-[11px] font-semibold text-stone-500 hidden sm:block">👤 Stylist & Giờ</span>
          </div>
          <div id="step-nav-4" onclick="goToStep(4)" class="cursor-pointer p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center space-y-1 transition">
            <span class="block text-xs font-bold text-stone-400">BƯỚC 4</span>
            <span class="block text-[11px] font-semibold text-stone-500 hidden sm:block">📝 Thông Tin</span>
          </div>
          <div id="step-nav-5" onclick="goToStep(5)" class="cursor-pointer p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center space-y-1 transition">
            <span class="block text-xs font-bold text-stone-400">BƯỚC 5</span>
            <span class="block text-[11px] font-semibold text-stone-500 hidden sm:block">💳 Thanh Toán</span>
          </div>
        </div>
      </div>

      <!-- WIZARD STEP CONTENTS -->
      <div id="wizardContainer" class="max-w-4xl mx-auto">

        <!-- ================= BƯỚC 1: CHỌN DỊCH VỤ ================= -->
        <div id="step-1" class="step-card active space-y-6">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-serif-accent text-xl font-bold text-stone-900">Bước 1: Chọn Dịch Vụ Salon</h3>
            <span class="text-xs text-stone-500">Vui lòng chọn 1 gói dịch vụ mong muốn</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <?php foreach ($services as $index => $s): ?>
              <label class="cursor-pointer group">
                <input 
                  type="radio" 
                  name="wizardService" 
                  value="<?= htmlspecialchars($s['name']) ?>" 
                  data-price="<?= $s['price'] ?>"
                  <?= $index === 2 ? 'checked' : '' ?>
                  onchange="onSelectService(this)"
                  class="peer hidden" 
                />
                <div class="p-4 rounded-2xl border border-stone-200 bg-salon-bg peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition flex items-center gap-3">
                  <img src="<?= htmlspecialchars($s['image']) ?>" class="w-12 h-12 rounded-xl object-cover border" />
                  <div class="flex-1">
                    <p class="font-bold text-xs text-stone-900 group-hover:text-salon-primary"><?= htmlspecialchars($s['name']) ?></p>
                    <p class="text-xs font-bold text-salon-primary mt-0.5"><?= format_vnd($s['price']) ?></p>
                  </div>
                </div>
              </label>
            <?php endforeach; ?>
          </div>

          <div class="pt-6 border-t flex justify-between items-center">
            <div>
              <span class="text-xs text-stone-500">Đã chọn: <b id="step1SelectedText" class="text-salon-primary font-bold">Uốn Sóng Lơi Hàn Quốc</b></span>
            </div>
            <button onclick="nextStep(2)" class="px-8 py-3.5 rounded-full bg-salon-primary text-white font-bold text-xs shadow-lg hover:bg-stone-900 transition">
              Tiếp Theo: Chọn Kiểu & Màu Tóc ➔
            </button>
          </div>
        </div>

        <!-- ================= BƯỚC 2: CHỌN KIỂU TÓC & MÀU NHUỘM ================= -->
        <div id="step-2" class="step-card space-y-6">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-serif-accent text-xl font-bold text-stone-900">Bước 2: Chọn Mẫu Tóc & Màu Nhuộm</h3>
            <span class="text-xs text-stone-500">Tham khảo phom dáng chuẩn phong cách</span>
          </div>

          <div class="space-y-4">
            <label class="block text-xs font-bold uppercase text-stone-700">Chọn Mẫu Tóc</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <?php foreach ($hairstyles as $index => $hs): ?>
                <label class="cursor-pointer">
                  <input type="radio" name="wizardHairstyle" value="<?= htmlspecialchars($hs['name']) ?>" <?= $index === 0 ? 'checked' : '' ?> class="peer hidden" />
                  <div class="p-3 rounded-2xl border border-stone-200 bg-stone-50 peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition text-center space-y-1">
                    <img src="<?= htmlspecialchars($hs['image']) ?>" class="w-14 h-14 rounded-xl mx-auto object-cover" />
                    <p class="font-bold text-xs text-stone-800 line-clamp-1"><?= htmlspecialchars($hs['name']) ?></p>
                  </div>
                </label>
              <?php endforeach; ?>
            </div>
          </div>

          <div class="space-y-4 pt-2">
            <label class="block text-xs font-bold uppercase text-stone-700">Chọn Tông Màu Nhuộm</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <?php foreach ($haircolors as $index => $hc): ?>
                <label class="cursor-pointer">
                  <input type="radio" name="wizardHaircolor" value="<?= htmlspecialchars($hc['name']) ?>" <?= $index === 1 ? 'checked' : '' ?> class="peer hidden" />
                  <div class="p-3 rounded-2xl border border-stone-200 bg-stone-50 peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition text-center space-y-1">
                    <div class="w-6 h-6 rounded-full mx-auto border" style="background-color: <?= htmlspecialchars($hc['hex']) ?>"></div>
                    <p class="font-bold text-[11px] text-stone-800 line-clamp-1"><?= htmlspecialchars($hc['name']) ?></p>
                  </div>
                </label>
              <?php endforeach; ?>
            </div>
          </div>

          <div class="pt-6 border-t flex justify-between items-center">
            <button onclick="prevStep(1)" class="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100">
              ← Quay Lại Bước 1
            </button>
            <button onclick="nextStep(3)" class="px-8 py-3.5 rounded-full bg-salon-primary text-white font-bold text-xs shadow-lg hover:bg-stone-900 transition">
              Tiếp Theo: Chọn Stylist & Giờ ➔
            </button>
          </div>
        </div>

        <!-- ================= BƯỚC 3: CHỌN STYLIST & GIỜ HẸN ================= -->
        <div id="step-3" class="step-card space-y-6">
          <div class="flex justify-between items-center border-b pb-3">
            <div>
              <h3 class="font-serif-accent text-xl font-bold text-stone-900">Bước 3: Chọn Stylist & Thời Gian Hẹn</h3>
              <p id="slotDurationInfo" class="text-xs text-salon-primary font-bold mt-0.5">⏱️ Thời lượng dự kiến: 45 phút • Khóa trùng ca tự động theo thời gian thực</p>
            </div>
            <span class="text-xs text-stone-500 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border font-bold">🛡️ Chống Trùng Ca</span>
          </div>

          <div class="space-y-3">
            <label class="block text-xs font-bold uppercase text-stone-700">Chọn Thợ Cắt Tóc (Stylist)</label>
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <?php foreach ($stylists as $index => $st): ?>
                <label class="cursor-pointer">
                  <input type="radio" name="wizardStylist" value="<?= htmlspecialchars($st['name']) ?>" <?= $index === 0 ? 'checked' : '' ?> onchange="loadAvailableSlots()" class="peer hidden" />
                  <div class="p-3 rounded-2xl border border-stone-200 bg-stone-50 peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition text-center space-y-1">
                    <img src="<?= htmlspecialchars($st['avatar']) ?>" class="w-12 h-12 rounded-full mx-auto object-cover border" />
                    <p class="font-bold text-xs text-stone-800 line-clamp-1"><?= htmlspecialchars($st['name']) ?></p>
                  </div>
                </label>
              <?php endforeach; ?>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6 pt-2">
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase text-stone-700">Ngày Hẹn</label>
              <select id="wizardDate" onchange="loadAvailableSlots()" class="w-full px-4 py-3 rounded-2xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-salon-primary">
                <option value="Hôm nay">Hôm nay (<?= date('d/m') ?>)</option>
                <option value="Ngày mai">Ngày mai (<?= date('d/m', strtotime('+1 day')) ?>)</option>
                <option value="Ngày kia">Ngày kia (<?= date('d/m', strtotime('+2 day')) ?>)</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase text-stone-700">Khung Giờ Khả Dụng (Tự Động Quét Trống)</label>
              <select id="wizardTime" class="w-full px-4 py-3 rounded-2xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-salon-primary">
                <option value="09:30" selected>09:30 sáng</option>
              </select>
            </div>
          </div>

          <div class="pt-6 border-t flex justify-between items-center">
            <button onclick="prevStep(2)" class="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100">
              ← Quay Lại Bước 2
            </button>
            <button onclick="nextStep(4)" class="px-8 py-3.5 rounded-full bg-salon-primary text-white font-bold text-xs shadow-lg hover:bg-stone-900 transition">
              Tiếp Theo: Nhập Thông Tin Khách ➔
            </button>
          </div>
        </div>

        <!-- ================= BƯỚC 4: NHẬP THÔNG TIN KHÁCH HÀNG ================= -->
        <div id="step-4" class="step-card space-y-6">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-serif-accent text-xl font-bold text-stone-900">Bước 4: Nhập Thông Tin Khách Hàng</h3>
            <span class="text-xs text-stone-500">Thông tin liên hệ xác nhận đơn</span>
          </div>

          <div class="space-y-4 max-w-xl mx-auto">
            <div>
              <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Họ và Tên Khách Hàng (*)</label>
              <input type="text" id="wizardName" required value="<?= htmlspecialchars($loggedUser['name'] ?? '') ?>" placeholder="Nguyễn Bích Phương" class="w-full px-4 py-3 rounded-2xl border border-stone-300 text-xs focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-stone-700 mb-1">Số Điện Thoại (*)</label>
              <input type="tel" id="wizardPhone" required value="<?= htmlspecialchars($loggedUser['phone'] ?? '') ?>" placeholder="0912345678" class="w-full px-4 py-3 rounded-2xl border border-stone-300 text-xs focus:ring-2 focus:ring-salon-primary focus:outline-none" />
            </div>

            <!-- VOUCHER CODE BOX WITH PROMO SELECTOR -->
            <div class="bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 rounded-3xl border border-amber-200/80 space-y-4 shadow-sm">
              <div class="flex justify-between items-center">
                <label class="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  🎟️ Mã Giảm Giá & Voucher Ưu Đãi
                </label>
                <span class="text-[10px] font-semibold bg-amber-200/60 text-amber-900 px-2.5 py-0.5 rounded-full">Dành Cho Khách Mới & Khách Cũ</span>
              </div>

              <!-- SUGGESTED VOUCHERS LIST -->
              <div class="space-y-2">
                <p class="text-[11px] font-bold text-stone-600">💡 Chọn nhanh voucher ưu đãi bên dưới:</p>
                <div class="grid gap-2 text-xs">
                  <!-- FOR NEW CUSTOMERS -->
                  <div class="p-2.5 bg-white rounded-xl border border-emerald-200 flex justify-between items-center hover:border-emerald-400 transition">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">CHAOXIN20</span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">🎁 Khách Mới</span>
                      </div>
                      <p class="text-[11px] text-stone-600">Giảm 20% (tối đa 100k) cho đơn từ 150k cho khách lần đầu làm tóc</p>
                    </div>
                    <button type="button" onclick="selectAndApplyVoucher('CHAOXIN20')" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition shrink-0">
                      Áp Dụng
                    </button>
                  </div>

                  <div class="p-2.5 bg-white rounded-xl border border-emerald-200 flex justify-between items-center hover:border-emerald-400 transition">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">BANMOI50K</span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">🎉 Khách Mới</span>
                      </div>
                      <p class="text-[11px] text-stone-600">Giảm ngay 50k cho khách mới trải nghiệm dịch vụ</p>
                    </div>
                    <button type="button" onclick="selectAndApplyVoucher('BANMOI50K')" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition shrink-0">
                      Áp Dụng
                    </button>
                  </div>

                  <!-- FOR RETURNING CUSTOMERS -->
                  <div class="p-2.5 bg-white rounded-xl border border-amber-200 flex justify-between items-center hover:border-amber-400 transition">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">TRIAN100K</span>
                        <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">⭐ Khách Thân Thiết</span>
                      </div>
                      <p class="text-[11px] text-stone-600">Tri ân giảm 100k cho đơn từ 400k dành cho khách đã từng dịch vụ</p>
                    </div>
                    <button type="button" onclick="selectAndApplyVoucher('TRIAN100K')" class="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] rounded-lg transition shrink-0">
                      Áp Dụng
                    </button>
                  </div>

                  <div class="p-2.5 bg-white rounded-xl border border-purple-200 flex justify-between items-center hover:border-purple-400 transition">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">VIPSTUDIO25</span>
                        <span class="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">💎 Khách VIP / Cũ</span>
                      </div>
                      <p class="text-[11px] text-stone-600">Ưu đãi VIP giảm 25% (tối đa 200k) cho khách cũ quay lại</p>
                    </div>
                    <button type="button" onclick="selectAndApplyVoucher('VIPSTUDIO25')" class="px-3 py-1.5 bg-purple-800 hover:bg-purple-900 text-white font-bold text-[11px] rounded-lg transition shrink-0">
                      Áp Dụng
                    </button>
                  </div>
                </div>
              </div>

              <!-- MANUAL INPUT -->
              <div class="flex gap-2 pt-2">
                <input type="text" id="wizardVoucherCode" placeholder="Hoặc nhập mã voucher khác..." class="flex-1 px-4 py-2.5 rounded-xl border border-amber-300 text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                <button type="button" onclick="applyVoucherCode()" class="px-5 py-2.5 bg-amber-900 text-white font-bold text-xs rounded-xl hover:bg-stone-900 transition shadow">
                  Áp Dụng
                </button>
              </div>
              <p id="voucherMsg" class="text-[11px] font-bold text-emerald-700 hidden"></p>
            </div>
          </div>

          <div class="pt-6 border-t flex justify-between items-center">
            <button onclick="prevStep(3)" class="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100">
              ← Quay Lại Bước 3
            </button>
            <button onclick="nextStep(5)" class="px-8 py-3.5 rounded-full bg-salon-primary text-white font-bold text-xs shadow-lg hover:bg-stone-900 transition">
              Tiếp Theo: Thanh Toán & Xác Nhận ➔
            </button>
          </div>
        </div>

        <!-- ================= BƯỚC 5: THANH TOÁN & XÁC NHẬN (BƯỚC CUỐI CÙNG) ================= -->
        <div id="step-5" class="step-card space-y-6">
          <div class="flex justify-between items-center border-b pb-3">
            <h3 class="font-serif-accent text-xl font-bold text-stone-900">Bước 5: Thanh Toán & Hoàn Tất Đặt Lịch</h3>
            <span class="text-xs font-bold text-emerald-600">BƯỚC CUỐI CÙNG</span>
          </div>

          <!-- SUMMARY CONFIRMATION BOX -->
          <div class="bg-salon-bg p-6 rounded-3xl border border-salon-border space-y-4">
            <h4 class="font-serif-accent text-lg font-bold text-stone-900">📋 Tóm Tắt Chi Tiết Đơn Hẹn</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span class="text-stone-500 block">Khách hàng:</span>
                <b id="sumName" class="text-stone-900">Nguyễn Bích Phương</b>
              </div>
              <div>
                <span class="text-stone-500 block">Số điện thoại:</span>
                <b id="sumPhone" class="text-stone-900">0912345678</b>
              </div>
              <div>
                <span class="text-stone-500 block">Dịch vụ:</span>
                <b id="sumService" class="text-salon-primary">Uốn Sóng Lơi Hàn Quốc</b>
              </div>
              <div>
                <span class="text-stone-500 block">Kiểu & Màu:</span>
                <b id="sumHair" class="text-stone-900">Cắt Layer • Nâu Trà Sữa</b>
              </div>
              <div>
                <span class="text-stone-500 block">Stylist:</span>
                <b id="sumStylist" class="text-stone-900">Alex Trần</b>
              </div>
              <div>
                <span class="text-stone-500 block">Thời gian:</span>
                <b id="sumTime" class="text-stone-900">09:30 (Hôm nay)</b>
              </div>
            </div>
            <div class="pt-3 border-t space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="text-stone-600 font-medium">Tổng giá trị gói làm đẹp:</span>
                <span id="sumTotalPrice" class="font-serif-accent text-base font-bold text-stone-900">850.000 ₫</span>
              </div>
              <div class="flex justify-between items-center text-xs bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <span class="font-bold text-amber-800 flex items-center gap-1">💳 Tiền Đặt Cọc Giữ Chỗ (20%):</span>
                <span id="sumDepositPrice" class="font-serif-accent text-base font-bold text-amber-800">170.000 ₫</span>
              </div>
              <div class="flex justify-between items-center text-xs text-stone-500 pt-1">
                <span>Số tiền còn lại thanh toán tại Salon (80%):</span>
                <span id="sumRemainPrice" class="font-bold text-stone-700">680.000 ₫</span>
              </div>
            </div>

            <!-- CANCELLATION POLICY BOX -->
            <div class="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
              <div class="font-bold flex items-center gap-1">🛡️ Chính Sách Hủy Lịch & Hoàn Tiền Cọc Tự Động:</div>
              <p class="leading-relaxed">
                • <b>Hủy trước giờ hẹn ≥ 24h</b>: Hoàn tiền cọc <b>100%</b> về tài khoản.<br/>
                • <b>Hủy sát giờ hẹn &lt; 24h</b>: Tiền cọc được giữ lại làm phí phạt giữ chỗ cho Stylist theo quy định.
              </p>
            </div>
          </div>

          <!-- PAYMENT METHODS OPTION WITH DYNAMIC VIETQR -->
          <div class="space-y-3">
            <label class="block text-xs font-bold uppercase text-stone-700">Chọn Phương Thức Thanh Toán (*)</label>
            <div class="grid sm:grid-cols-2 gap-4">
              <label class="cursor-pointer">
                <input type="radio" name="wizardPayment" value="AtSalon" checked onchange="toggleVietQRBox(false)" class="peer hidden" />
                <div class="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition space-y-1">
                  <div class="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <span>💵</span> Thanh Toán Tại Salon
                  </div>
                  <p class="text-[11px] text-stone-500">Trả tiền mặt hoặc quẹt thẻ trực tiếp khi hoàn thành làm tóc tại Salon.</p>
                </div>
              </label>

              <label class="cursor-pointer">
                <input type="radio" name="wizardPayment" value="BankingQR" onchange="toggleVietQRBox(true)" class="peer hidden" />
                <div class="p-4 rounded-2xl border-2 border-stone-200 bg-stone-50 peer-checked:border-salon-primary peer-checked:bg-salon-primary/10 transition space-y-1">
                  <div class="flex items-center gap-2 font-bold text-xs text-stone-900">
                    <span>📱</span> Quét Mã VietQR Chuyển Khoản Ngân Hàng
                  </div>
                  <p class="text-[11px] text-stone-500">Tự động điền số tiền cọc 20% và nội dung chuyển khoản Napas247.</p>
                </div>
              </label>
            </div>

            <!-- DYNAMIC VIETQR CONTAINER -->
            <div id="vietqrBox" class="hidden p-5 bg-white rounded-3xl border-2 border-[#4A6B5D] text-center space-y-3 shadow-md">
              <span class="text-xs font-bold text-[#4A6B5D] uppercase block">📲 MÃ QUÉT MOMO / VIETQR NAPAS247 CHUYỂN KHOẢN CỌC</span>
              <img id="vietqrImage" src="assets/qr_momo_khai.png" class="w-64 h-auto mx-auto border-2 border-stone-200 rounded-2xl p-2 bg-white shadow-sm" />
              <div class="text-xs text-stone-600 space-y-1">
                <p>Ví MoMo / VietQR Napas247 | SĐT: <b>*******694</b></p>
                <p>Chủ Tài Khoản: <b>NGUYEN DANG KHAI</b></p>
                <p class="text-amber-800 font-bold bg-amber-50 py-1 px-3 rounded-full inline-block">Nội dung chuyển khoản tự động điền: <span id="vietqrMemo" class="font-mono text-emerald-800">LUMI-DEPOSIT</span></p>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t flex justify-between items-center">
            <button onclick="prevStep(4)" class="px-6 py-3 rounded-full border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100">
              ← Quay Lại Bước 4
            </button>
            <button onclick="submitWizardBooking()" class="px-10 py-4 rounded-full bg-salon-primary hover:bg-stone-900 text-white font-bold text-sm shadow-2xl transition transform hover:scale-105">
              🎉 HOÀN TẤT ĐẶT LỊCH & THANH TOÁN
            </button>
          </div>
        </div>

      </div>

    </section>

  </main>

  <!-- MY APPOINTMENTS MODAL FOR CUSTOMER -->
  <div id="myAppointmentsModal" onclick="if(event.target === this) closeMyAppointmentsModal()" class="hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 max-w-2xl w-full space-y-5 relative">
      <div class="flex justify-between items-center">
        <h3 class="font-serif-accent text-xl font-bold text-stone-900">Lịch Sử Đặt Lịch Của Tôi</h3>
        <button onclick="closeMyAppointmentsModal()" class="text-stone-400 hover:text-stone-700 font-bold text-lg">✕</button>
      </div>
      
      <div id="myAppointmentsList" class="space-y-3 max-h-96 overflow-y-auto p-1">
        <p class="text-xs text-stone-500 text-center py-4">Đang tải danh sách đơn...</p>
      </div>

      <div class="text-right pt-2 border-t">
        <button onclick="closeMyAppointmentsModal()" class="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold">Đóng</button>
      </div>
    </div>
  </div>

  <!-- REVIEW MODAL WITH STAR RATING SELECTOR -->
  <div id="reviewModal" onclick="if(event.target === this) closeReviewModal()" class="hidden fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-5 relative">
      <div class="flex justify-between items-center border-b pb-3">
        <h3 class="font-serif-accent text-xl font-bold text-stone-900">⭐ Viết Đánh Giá Của Bạn</h3>
        <button type="button" onclick="closeReviewModal()" class="text-stone-400 hover:text-stone-700 text-xl font-bold">&times;</button>
      </div>

      <form onsubmit="submitReview(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Tên của bạn (*)</label>
          <input type="text" id="revName" required placeholder="Nguyễn Văn A" value="<?= htmlspecialchars($loggedUser['name'] ?? '') ?>" class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary" />
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Chọn Đánh Giá Sao (*)</label>
          <div class="flex items-center gap-2 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
            <div id="starContainer" class="flex text-2xl cursor-pointer select-none">
              <span onclick="setStarRating(1)" onmouseover="hoverStarRating(1)" onmouseleave="resetStarRating()" class="star-icon text-amber-400 transition transform hover:scale-125">★</span>
              <span onclick="setStarRating(2)" onmouseover="hoverStarRating(2)" onmouseleave="resetStarRating()" class="star-icon text-amber-400 transition transform hover:scale-125">★</span>
              <span onclick="setStarRating(3)" onmouseover="hoverStarRating(3)" onmouseleave="resetStarRating()" class="star-icon text-amber-400 transition transform hover:scale-125">★</span>
              <span onclick="setStarRating(4)" onmouseover="hoverStarRating(4)" onmouseleave="resetStarRating()" class="star-icon text-amber-400 transition transform hover:scale-125">★</span>
              <span onclick="setStarRating(5)" onmouseover="hoverStarRating(5)" onmouseleave="resetStarRating()" class="star-icon text-amber-400 transition transform hover:scale-125">★</span>
            </div>
            <span id="starRatingLabel" class="text-xs font-bold text-amber-800 ml-2">5 / 5 Sao (Xuất sắc)</span>
            <input type="hidden" id="revRating" value="5" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Dịch vụ đã trải nghiệm (*)</label>
          <select id="revService" class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary bg-white">
            <option value="Combo Cắt Tóc + Tạo Kiểu VIP">✂️ Combo Cắt Tóc + Tạo Kiểu VIP</option>
            <option value="Uốn Tóc Hàn Quốc (Setting)">🌀 Uốn Tóc Hàn Quốc (Setting)</option>
            <option value="Nhuộm Tóc Thời Trang (Balayage)">🎨 Nhuộm Tóc Thời Trang (Balayage)</option>
            <option value="Gội Đầu Dưỡng Sinh Spa">💆‍♀️ Gội Đầu Dưỡng Sinh Spa</option>
            <option value="Phục Hồi Tóc Keratin Cao Cấp">✨ Phục Hồi Tóc Keratin Cao Cấp</option>
            <option value="Dịch Vụ Salon Khác">💇 Dịch Vụ Salon Khác</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Nội dung đánh giá (*)</label>
          <textarea id="revContent" required rows="3" placeholder="Chia sẻ trải nghiệm làm tóc của bạn tại LUMIÈRE Salon..." class="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary"></textarea>
        </div>

        <div class="flex gap-3 pt-2">
          <button type="button" onclick="closeReviewModal()" class="flex-1 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-100 transition">Hủy Bỏ</button>
          <button type="submit" class="flex-1 py-3 rounded-xl bg-salon-primary text-white text-xs font-bold hover:bg-stone-900 shadow-lg transition">Gửi Đánh Giá ⭐</button>
        </div>
      </form>
    </div>
  </div>

  <!-- FORBIDDEN ADMIN ACCESS MODAL FOR CUSTOMER -->
  <div id="forbiddenAdminModal" onclick="if(event.target === this) closeForbiddenModal()" class="hidden fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl border border-rose-300 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-5 text-center relative">
      <div class="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl mx-auto border border-rose-200">
        🚫
      </div>
      <div class="space-y-2">
        <h3 class="font-serif-accent text-xl font-bold text-stone-900">CẤM TRUY CẬP TRANG QUẢN TRỊ ADMIN</h3>
        <p class="text-xs text-stone-600 leading-relaxed">
          Tài khoản Khách Hàng <b class="text-stone-900"><?= htmlspecialchars($loggedUser['name'] ?? 'Khách Hàng') ?></b> không có quyền truy cập trang Quản Trị Admin.
        </p>
      </div>
      <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 font-medium text-left">
        💡 <b>Quy định phân quyền hệ thống:</b> Chỉ tài khoản Quản Trị Viên (Admin) mới có quyền vào Bảng Điều Khiển Admin. Nếu bạn là Admin, vui lòng chuyển tài khoản hoặc đăng nhập.
      </div>
      <div class="flex gap-3 pt-2">
        <button onclick="closeForbiddenModal()" class="flex-1 py-3 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 transition">Đóng</button>
        <a href="login.php?tab=admin" class="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-md flex items-center justify-center gap-1">🔑 Đăng Nhập Admin</a>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="bg-stone-900 text-white border-t border-stone-800 py-12 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
      <div class="font-serif-accent text-2xl font-bold text-salon-secondary">LUMIÈRE HAIR STUDIO</div>
      <p class="text-xs text-stone-400">Không gian tạo kiểu & uốn nhuộm thảo mộc 5 sao</p>
      <p class="text-[11px] text-stone-500">© 2026 LUMIÈRE Hair Studio. All rights reserved (Phiên bản PHP & MySQL Database).</p>
    </div>
  </footer>

  <!-- JAVASCRIPT 5-STEP WIZARD LOGIC -->
  <script>
    let currentStep = 1;
    let wizardServiceName = "Uốn Sóng Lơi Hàn Quốc";
    let wizardPrice = 850000;

    function handleForbiddenAdminClick(e) {
      if (e) e.preventDefault();
      document.getElementById('forbiddenAdminModal').classList.remove('hidden');
    }

    function closeForbiddenModal() {
      document.getElementById('forbiddenAdminModal').classList.add('hidden');
    }

    function handleAdminPortalBlocked(e) {
      if (e) e.preventDefault();
      showToast('🚫 CẤM: Admin không được phép xem Ý kiến cá nhân hoặc Cổng thông tin của Khách hàng!');
      alert('🚫 CẤM TRUY CẬP DỮ LIỆU CÁ NHÂN KHÁCH HÀNG:\nỞ Chế độ Xem Trang (Admin Preview), Quản trị viên được phép xem giao diện Salon nhưng CẤM TRUY CẬP vào Cổng thông tin riêng tư & Ý kiến cá nhân của Khách hàng!');
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toastMsg').innerText = msg;
      toast.classList.remove('hidden');
      toast.classList.add('flex');
      setTimeout(() => {
        toast.classList.add('hidden');
        toast.classList.remove('flex');
      }, 3500);
    }

    function selectServiceFromCatalog(name, price) {
      wizardServiceName = name;
      wizardPrice = price;
      // Select the radio button in wizard
      const radios = document.querySelectorAll('input[name="wizardService"]');
      radios.forEach(r => {
        if (r.value === name) r.checked = true;
      });
      document.getElementById('step1SelectedText').innerText = name;
      showToast(`Đã chọn dịch vụ: ${name}`);
      goToStep(1);
    }

    function onSelectService(radio) {
      wizardServiceName = radio.value;
      wizardPrice = parseInt(radio.getAttribute('data-price')) || 850000;
      document.getElementById('step1SelectedText').innerText = wizardServiceName;
    }

    function updateStepUI() {
      for (let i = 1; i <= 5; i++) {
        const stepCard = document.getElementById(`step-${i}`);
        const navBtn = document.getElementById(`step-nav-${i}`);
        if (i === currentStep) {
          stepCard.classList.add('active');
          navBtn.className = "cursor-pointer p-2.5 rounded-2xl border-2 border-salon-primary bg-salon-primary/10 text-center space-y-1 transition";
        } else {
          stepCard.classList.remove('active');
          navBtn.className = "cursor-pointer p-2.5 rounded-2xl border-2 border-stone-200 bg-stone-50 text-center space-y-1 transition";
        }
      }

      // If going to Step 3, load real-time slot availability
      if (currentStep === 3) {
        loadAvailableSlots();
      }

      // If going to Step 5 (Payment), populate summary
      if (currentStep === 5) {
        const name = document.getElementById('wizardName').value || 'Khách Hàng';
        const phone = document.getElementById('wizardPhone').value || '0912345678';
        const hairstyle = document.querySelector('input[name="wizardHairstyle"]:checked')?.value || 'Cắt Layer Bồng Bềnh Nữ';
        const haircolor = document.querySelector('input[name="wizardHaircolor"]:checked')?.value || 'Nâu Trà Sữa (Milk Tea)';
        const stylist = document.querySelector('input[name="wizardStylist"]:checked')?.value || 'Alex Trần';
        const date = document.getElementById('wizardDate').value;
        const time = document.getElementById('wizardTime').value;

        document.getElementById('sumName').innerText = name;
        document.getElementById('sumPhone').innerText = phone;
        document.getElementById('sumService').innerText = wizardServiceName;
        document.getElementById('sumHair').innerText = `${hairstyle} • ${haircolor}`;
        document.getElementById('sumStylist').innerText = stylist;
        document.getElementById('sumTime').innerText = `${time} (${date})`;
        document.getElementById('sumTotalPrice').innerText = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wizardPrice);
      }
    }

    function loadAvailableSlots() {
      const date = document.getElementById('wizardDate')?.value || 'Hôm nay';
      const stylist = document.querySelector('input[name="wizardStylist"]:checked')?.value || 'Alex Trần';
      const timeSelect = document.getElementById('wizardTime');
      if (!timeSelect) return;

      timeSelect.disabled = true;
      timeSelect.innerHTML = `<option value="">⏳ Đang quét lịch trống của ${stylist}...</option>`;

      const url = `api.php?action=get_available_slots&date=${encodeURIComponent(date)}&stylist=${encodeURIComponent(stylist)}&services=${encodeURIComponent(JSON.stringify([wizardServiceName]))}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          timeSelect.disabled = false;
          if (data.status === 'success') {
            const slots = data.slots || [];
            const dur = data.totalDurationMinutes || 45;
            
            const durationText = document.getElementById('slotDurationInfo');
            if (durationText) {
              durationText.innerText = `⏱️ Thời lượng dự kiến ca này: ${dur} phút • Tự động khóa ca bận của ${stylist}`;
            }

            let firstAvailable = null;
            timeSelect.innerHTML = slots.map(s => {
              if (s.available) {
                if (!firstAvailable) firstAvailable = s.time;
                return `<option value="${s.time}">🟢 ${s.time} (Giờ trống khả dụng)</option>`;
              } else {
                return `<option value="${s.time}" disabled class="text-stone-400 bg-stone-100">🔒 ${s.time} - ${s.reason}</option>`;
              }
            }).join('');

            if (firstAvailable) {
              timeSelect.value = firstAvailable;
            } else {
              timeSelect.innerHTML = '<option value="" disabled selected>❌ Rất tiếc! Stylist đã kín ca ngày này, vui lòng đổi Stylist hoặc Ngày khác</option>';
            }
          }
        });
    }

    function nextStep(target) {
      if (target === 5) {
        const name = document.getElementById('wizardName').value.trim();
        const phone = document.getElementById('wizardPhone').value.trim();
        if (!name || !phone) {
          showToast('⚠️ Vui lòng nhập đầy đủ Họ tên và Số điện thoại!');
          return;
        }
      }
      currentStep = target;
      updateStepUI();
    }

    function prevStep(target) {
      currentStep = target;
      updateStepUI();
    }

    function goToStep(target) {
      currentStep = target;
      updateStepUI();
    }

    // Synthesized Web Audio Victory Chime
    function playSuccessSound() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const startTime = ctx.currentTime + idx * 0.09;
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
      } catch(e) {}
    }

    // Canvas Confetti Fireworks Animation
    function triggerConfetti() {
      const canvas = document.getElementById('confettiCanvas');
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext('2d');
      const particles = [];
      const colors = ['#4A6B5D', '#C89F82', '#E5C158', '#4B6F44', '#708090', '#FF6B6B', '#4ECDC4'];

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.7) * 18,
          size: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
          opacity: 1
        });
      }

      function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.35; // gravity
          p.opacity -= 0.015;
          p.rotation += p.vRot;

          if (p.opacity > 0) {
            alive = true;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        });

        if (alive) {
          requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      render();
    }

    function submitWizardBooking() {
      const btn = document.querySelector('button[onclick="submitWizardBooking()"]');
      const origBtnHtml = btn ? btn.innerHTML : '🎉 HOÀN TẤT ĐẶT LỊCH & THANH TOÁN';

      const name = document.getElementById('wizardName').value.trim();
      const phone = document.getElementById('wizardPhone').value.trim();
      const hairstyle = document.querySelector('input[name="wizardHairstyle"]:checked')?.value || 'Cắt Layer Bồng Bềnh Nữ';
      const haircolor = document.querySelector('input[name="wizardHaircolor"]:checked')?.value || 'Nâu Trà Sữa (Milk Tea)';
      const stylist = document.querySelector('input[name="wizardStylist"]:checked')?.value || 'Alex Trần';
      const date = document.getElementById('wizardDate').value;
      const time = document.getElementById('wizardTime').value;
      const paymentMethod = document.querySelector('input[name="wizardPayment"]:checked')?.value || 'AtSalon';

      if (!name || !phone) {
        showToast('⚠️ Vui lòng nhập Tên và Số điện thoại ở Bước 4!');
        prevStep(4);
        return;
      }

      // Show Loading State on Button immediately
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="inline-block animate-spin mr-2">⚡</span> Đang Xử Lý Đặt Lịch & Tạo Đơn...';
      }

      const formData = new FormData();
      formData.append('action', 'book_appointment');
      formData.append('customerName', name);
      formData.append('phone', phone);
      formData.append('services', JSON.stringify([wizardServiceName]));
      formData.append('hairstyle', hairstyle);
      formData.append('haircolor', haircolor);
      formData.append('stylist', stylist);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('totalPrice', wizardPrice);
      formData.append('paymentMethod', paymentMethod);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origBtnHtml;
        }

        if (data.status === 'success') {
          // 1. Play Audio Success Chime
          playSuccessSound();
          
          // 2. Trigger Confetti Fireworks Burst
          triggerConfetti();

          // 3. Display Toast Notification
          showToast(`🎉 ĐẶT LỊCH THÀNH CÔNG! Mã đơn: ${data.appointment.id}`);

          // 4. Display Celebration Modal
          document.getElementById('succAppId').textContent = data.appointment.id;
          document.getElementById('succCustName').textContent = name;
          document.getElementById('succServices').textContent = wizardServiceName;
          document.getElementById('succStylistTime').textContent = `${stylist} • ${time} (${date})`;
          document.getElementById('bookingSuccessModal').classList.remove('hidden');
        } else {
          showToast(`❌ ${data.message}`);
        }
      })
      .catch(err => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origBtnHtml;
        }
        showToast('❌ Lỗi kết nối máy chủ!');
      });
    }

    function openMyAppointmentsModal() {
      document.getElementById('myAppointmentsModal').classList.remove('hidden');
      fetch('api.php?action=get_my_appointments')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('myAppointmentsList');
        if (data.status === 'success' && data.appointments.length > 0) {
          container.innerHTML = data.appointments.map(app => {
            const depSt = app.depositStatus || 'Paid';
            let depBadge = '';
            if (depSt === 'Refunded') {
              depBadge = '<span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">🟢 Đã hoàn 100% cọc</span>';
            } else if (depSt === 'Forfeited') {
              depBadge = '<span class="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">⚠️ Phạt hủy cọc (<24h)</span>';
            } else {
              depBadge = `<span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">💳 Đã cọc 20% (${new Intl.NumberFormat('vi-VN').format(app.depositAmount || Math.round(app.totalPrice * 0.2))} ₫)</span>`;
            }

            const canCancel = app.status !== 'Cancelled' && app.status !== 'Completed';
            const cancelBtn = canCancel ? `<button onclick="cancelMyAppointment('${app.id}')" class="mt-2 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] rounded-lg border border-rose-200 transition">Hủy Ca Hẹn</button>` : '';

            return `
              <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex justify-between items-start">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-xs text-salon-primary">${app.id} - ${app.time} (${app.date})</p>
                    ${depBadge}
                  </div>
                  <p class="text-xs font-semibold text-stone-800">${(app.services || []).join(', ')}</p>
                  <p class="text-[10px] text-stone-500">Stylist: ${app.stylist} • Tổng: ${new Intl.NumberFormat('vi-VN').format(app.totalPrice)} ₫</p>
                </div>
                <div class="flex flex-col items-end gap-1">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${app.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' : app.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : app.status === 'Cancelled' ? 'bg-stone-200 text-stone-700' : 'bg-amber-100 text-amber-800'}">${app.status}</span>
                  ${cancelBtn}
                </div>
              </div>
            `;
          }).join('');
        } else {
          container.innerHTML = '<p class="text-xs text-stone-500 text-center py-4">Bạn chưa có đơn đặt lịch nào.</p>';
        }
      });
    }

    function cancelMyAppointment(id) {
      if (!confirm(`Bạn có chắc chắn muốn hủy đơn hẹn ${id}? Hệ thống sẽ tự động áp dụng quy tắc hoàn cọc 100% (nếu hủy ≥ 24h) hoặc phạt giữ cọc (nếu hủy < 24h).`)) return;

      const formData = new FormData();
      formData.append('action', 'cancel_appointment');
      formData.append('id', id);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        showToast(data.message);
        setTimeout(() => openMyAppointmentsModal(), 1200);
      });
    }
    function closeMyAppointmentsModal() { document.getElementById('myAppointmentsModal').classList.add('hidden'); }

    let selectedRating = 5;
    const ratingLabels = {
      1: "1 / 5 Sao (Cần cải thiện)",
      2: "2 / 5 Sao (Tạm ổn)",
      3: "3 / 5 Sao (Hài lòng)",
      4: "4 / 5 Sao (Rất hài lòng)",
      5: "5 / 5 Sao (Xuất sắc)"
    };

    function openReviewModal() {
      document.getElementById('reviewModal').classList.remove('hidden');
      setStarRating(5);
    }
    
    function closeReviewModal() {
      document.getElementById('reviewModal').classList.add('hidden');
    }

    function setStarRating(rating) {
      selectedRating = rating;
      document.getElementById('revRating').value = rating;
      updateStarUI(rating);
    }

    function hoverStarRating(rating) {
      updateStarUI(rating);
    }

    function resetStarRating() {
      updateStarUI(selectedRating);
    }

    function updateStarUI(rating) {
      const stars = document.querySelectorAll('#starContainer .star-icon');
      stars.forEach((star, index) => {
        if (index < rating) {
          star.classList.remove('text-stone-300');
          star.classList.add('text-amber-400');
        } else {
          star.classList.remove('text-amber-400');
          star.classList.add('text-stone-300');
        }
      });
      document.getElementById('starRatingLabel').textContent = ratingLabels[rating] || `${rating} / 5 Sao`;
    }

    function submitReview(e) {
      e.preventDefault();
      const name = document.getElementById('revName').value.trim();
      const content = document.getElementById('revContent').value.trim();
      const rating = document.getElementById('revRating').value;
      const service = document.getElementById('revService').value;

      const formData = new FormData();
      formData.append('action', 'add_review');
      formData.append('name', name);
      formData.append('content', content);
      formData.append('rating', rating);
      formData.append('service', service);

      fetch('api.php', { method: 'POST', body: formData })
      .then(res => res.json())
      .then(data => {
        closeReviewModal();
        showToast('⭐ ' + data.message);
        setTimeout(() => location.reload(), 1000);
      });
    }

    function logout() {
      fetch('api.php?action=logout').then(() => location.reload());
    }

    let chatInterval = null;

    function toggleCustomerChat() {
      const box = document.getElementById('customerChatBox');
      const isHidden = box.classList.contains('hidden');
      if (isHidden) {
        box.classList.remove('hidden');
        loadCustomerChatHistory();
        if (!chatInterval) {
          chatInterval = setInterval(loadCustomerChatHistory, 3000);
        }
      } else {
        box.classList.add('hidden');
        if (chatInterval) {
          clearInterval(chatInterval);
          chatInterval = null;
        }
      }
    }

    function getChatPhone() {
      const phoneInput = document.getElementById('chatCustPhone');
      return phoneInput ? phoneInput.value.trim() : '';
    }

    function getChatName() {
      const nameInput = document.getElementById('chatCustName');
      return nameInput ? nameInput.value.trim() : 'Khách Hàng';
    }

    function loadCustomerChatHistory() {
      const phone = getChatPhone();
      if (!phone) return;

      fetch(`api.php?action=get_chat_history&customer_phone=${encodeURIComponent(phone)}&reader=customer`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const msgs = data.messages || [];
            const container = document.getElementById('customerChatMsgs');
            if (msgs.length === 0) return;

            const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;

            container.innerHTML = msgs.map(m => {
              const isCust = m.sender === 'customer';
              const timeStr = m.created_at ? m.created_at.substring(11, 16) : '';
              return `
                <div class="flex ${isCust ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${isCust ? 'bg-[#4A6B5D] text-white rounded-br-none shadow-sm' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'}">
                    <div class="flex justify-between items-center gap-3 text-[9px] opacity-75">
                      <span class="font-bold">${isCust ? 'Bạn' : 'LUMIÈRE Salon'}</span>
                      <span>${timeStr}</span>
                    </div>
                    <p class="leading-relaxed font-normal">${escapeHtml(m.message)}</p>
                  </div>
                </div>
              `;
            }).join('');

            if (isScrolledToBottom) {
              container.scrollTop = container.scrollHeight;
            }
          }
        });
    }

    function sendCustomerMsg(e) {
      e.preventDefault();
      const phone = getChatPhone();
      const name = getChatName();
      const input = document.getElementById('chatInputMsg');
      const msg = input.value.trim();

      if (!phone) {
        showToast('⚠️ Vui lòng nhập Số điện thoại để gửi tin nhắn!');
        return;
      }
      if (!msg) return;

      const formData = new FormData();
      formData.append('action', 'send_chat');
      formData.append('sender', 'customer');
      formData.append('customer_phone', phone);
      formData.append('customer_name', name);
      formData.append('message', msg);

      input.value = '';

      fetch('api.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            loadCustomerChatHistory();
          } else {
            showToast(`❌ ${data.message}`);
          }
        });
    }

    function selectAndApplyVoucher(code) {
      document.getElementById('wizardVoucherCode').value = code;
      applyVoucherCode();
    }

    let currentAppliedVoucher = null;

    async function applyVoucherCode() {
      const code = document.getElementById('wizardVoucherCode').value.trim();
      const phone = document.getElementById('wizardPhone').value.trim();
      const totalPrice = parseInt(document.getElementById('sumTotalPrice').textContent.replace(/[^\d]/g, '')) || 850000;
      
      if (!code) {
        showToast('⚠️ Vui lòng nhập mã giảm giá!');
        return;
      }

      const body = new FormData();
      body.append('action', 'apply_voucher');
      body.append('code', code);
      body.append('phone', phone);
      body.append('totalPrice', totalPrice);

      const res = await fetch('api.php', { method: 'POST', body }).then(r => r.json());
      const msgElem = document.getElementById('voucherMsg');

      if (res.status === 'success') {
        currentAppliedVoucher = res;
        msgElem.textContent = '✅ ' + res.message;
        msgElem.classList.remove('hidden');
        msgElem.classList.replace('text-rose-600', 'text-emerald-700');

        // Update sum total price & deposit price
        const finalTot = res.finalTotal;
        const newDeposit = Math.round(finalTot * 0.2);
        const newRemain = finalTot - newDeposit;

        document.getElementById('sumTotalPrice').textContent = finalTot.toLocaleString('vi-VN') + ' ₫';
        document.getElementById('sumDepositPrice').textContent = newDeposit.toLocaleString('vi-VN') + ' ₫';
        document.getElementById('sumRemainPrice').textContent = newRemain.toLocaleString('vi-VN') + ' ₫';

        // Update VietQR image
        updateVietQRUrl(newDeposit);
        showToast('🎉 ' + res.message);
      } else {
        msgElem.textContent = '❌ ' + res.message;
        msgElem.classList.remove('hidden');
        msgElem.classList.replace('text-emerald-700', 'text-rose-600');
        showToast('❌ ' + res.message);
      }
    }

    function toggleVietQRBox(show) {
      const box = document.getElementById('vietqrBox');
      if (show) {
        box.classList.remove('hidden');
        const depositPrice = parseInt(document.getElementById('sumDepositPrice').textContent.replace(/[^\d]/g, '')) || 170000;
        updateVietQRUrl(depositPrice);
      } else {
        box.classList.add('hidden');
      }
    }

    function updateVietQRUrl(amount) {
      const img = document.getElementById('vietqrImage');
      const memo = 'LUMI' + Math.floor(1000 + Math.random() * 9000);
      document.getElementById('vietqrMemo').textContent = memo;
      img.src = 'assets/qr_momo_khai.png';
    }

    // Real-Time Canvas AI Hair Dye Engine (Pixel Color Detection & Skin Protection)
    let selectedAiColorName = 'Nâu Trà Sữa';
    let selectedAiColorHex = '#D2B48C';
    let loadedAiImgObj = new Image();

    function openAiTryOnModal() {
      document.getElementById('aiTryOnModal').classList.remove('hidden');
      if (!loadedAiImgObj.src) {
        selectSampleModel('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'Mẫu Nữ Tóc Dài');
      }
    }

    function closeAiTryOnModal() {
      document.getElementById('aiTryOnModal').classList.add('hidden');
    }

    function selectSampleModel(imgUrl, modelName) {
      document.getElementById('aiPlaceholderText').classList.add('hidden');
      document.getElementById('aiPreviewCanvas').classList.remove('hidden');
      
      loadedAiImgObj = new Image();
      loadedAiImgObj.crossOrigin = 'Anonymous';
      loadedAiImgObj.onload = function() {
        renderAiHairTryOnCanvas();
      };
      loadedAiImgObj.src = imgUrl;
      
      applyAiColorFilter(selectedAiColorHex, selectedAiColorName);
    }

    function handleAiImageUpload(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('aiPlaceholderText').classList.add('hidden');
          document.getElementById('aiPreviewCanvas').classList.remove('hidden');
          
          loadedAiImgObj = new Image();
          loadedAiImgObj.onload = function() {
            renderAiHairTryOnCanvas();
          };
          loadedAiImgObj.src = evt.target.result;
          
          applyAiColorFilter(selectedAiColorHex, selectedAiColorName);
        };
        reader.readAsDataURL(file);
      }
    }

    function applyAiColorFilter(hex, colorName) {
      selectedAiColorHex = hex;
      selectedAiColorName = colorName;

      const textElem = document.getElementById('aiActiveColorText');
      if (textElem) textElem.textContent = '✨ Đang thử màu nhuộm AI: ' + colorName;

      renderAiHairTryOnCanvas();
    }

    function adjustAiColorOpacity(val) {
      const opacityElem = document.getElementById('aiOpacityValue');
      if (opacityElem) opacityElem.textContent = val + '%';
      renderAiHairTryOnCanvas();
    }

    function adjustFaceProtection(val) {
      const valElem = document.getElementById('faceProtectValue');
      if (valElem) valElem.textContent = val + '%';
      renderAiHairTryOnCanvas();
    }

    // Color conversion utilities
    function rgbToHsl(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return { h: h * 360, s: s, l: l };
    }

    function hslToRgb(h, s, l) {
      h /= 360;
      let r, g, b;
      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
      return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    function hexToRgb(hex) {
      hex = hex.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }

    // High Precision HTML5 Canvas Pixel Hair Recoloring Engine
    function renderAiHairTryOnCanvas() {
      const canvas = document.getElementById('aiHairCanvas');
      if (!canvas || !loadedAiImgObj.src || !loadedAiImgObj.complete) return;

      const w = canvas.width = 450;
      const h = canvas.height = 450;
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(loadedAiImgObj, 0, 0, w, h);

      let imgData;
      try {
        imgData = ctx.getImageData(0, 0, w, h);
      } catch(e) {
        return; // Fallback if cross-origin image policy blocks pixel reading
      }

      const data = imgData.data;
      const targetRgb = hexToRgb(selectedAiColorHex);
      const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

      const opacityVal = (parseInt(document.getElementById('aiOpacityRange')?.value || 75)) / 100;
      const skinProtectSens = (parseInt(document.getElementById('faceProtectRange')?.value || 30)) / 100;

      const centerX = w * 0.5;
      const centerY = h * 0.52;
      const faceRx = w * 0.22 * (skinProtectSens * 2.6);
      const faceRy = h * 0.28 * (skinProtectSens * 2.6);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];

        const px = (i / 4) % w;
        const py = Math.floor((i / 4) / w);

        // Distance from center of face
        const dx = (px - centerX) / faceRx;
        const dy = (py - centerY) / faceRy;
        const distSq = dx * dx + dy * dy;

        // Detect human skin color profile (face/skin protection)
        const isSkin = (r > 40 && g > 25 && b > 15 && r > g && g > b && (r - g) > 10 && (r - b) > 15);

        // If inside face center AND is skin -> 100% UNTOUCHED ORIGINAL SKIN!
        if (distSq < 1.0 && isSkin) {
          continue; 
        }

        let hairWeight = 1.0;
        if (distSq < 1.35) {
          hairWeight = Math.max(0, (distSq - 0.75) / 0.6);
        }
        if (isSkin) {
          hairWeight *= 0.1; // Strongly suppress skin dyeing outside face
        }
        if (py > h * 0.80) {
          hairWeight *= Math.max(0, (h - py) / (h * 0.20)); // Soft falloff for shirt/clothes
        }

        if (hairWeight > 0.02) {
          const pixelHsl = rgbToHsl(r, g, b);
          
          // PRESERVE HAIR STRAND TEXTURE & HIGHLIGHTS by keeping original Luminance (L)!
          const newH = targetHsl.h;
          const newS = Math.min(1.0, targetHsl.s * 0.85 + pixelHsl.s * 0.25);
          const newL = pixelHsl.l;

          const dyedRgb = hslToRgb(newH, newS, newL);
          const alpha = opacityVal * hairWeight;

          data[i]   = Math.round(r * (1 - alpha) + dyedRgb.r * alpha);
          data[i+1] = Math.round(g * (1 - alpha) + dyedRgb.g * alpha);
          data[i+2] = Math.round(b * (1 - alpha) + dyedRgb.b * alpha);
        }
      }

      ctx.putImageData(imgData, 0, 0);
    }

    function confirmAiTryOnSelection() {
      closeAiTryOnModal();

      const bookingSec = document.getElementById('booking-section');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }

      // Automatically select Nhuộm Tóc in Step 1
      const dyeCheckbox = document.querySelector('input[name="wizardServices"][value="3"]') || document.querySelector('input[name="wizardServices"]');
      if (dyeCheckbox && !dyeCheckbox.checked) {
        dyeCheckbox.checked = true;
        updateWizardSummary();
      }

      showToast(`🎨 Đã áp dụng màu nhuộm AI "${selectedAiColorName}" vào đơn đặt lịch của bạn!`);
    }

    function escapeHtml(text) {
      return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    // Lắng nghe phím ESC để đóng mọi cửa sổ Modal lập tức
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAiTryOnModal();
        if (typeof closeReviewModal === 'function') closeReviewModal();
        if (typeof closeMyAppointmentsModal === 'function') closeMyAppointmentsModal();
        if (typeof closeForbiddenModal === 'function') closeForbiddenModal();
        var successM = document.getElementById('bookingSuccessModal');
        if (successM) successM.classList.add('hidden');
      }
    });
  </script>

  <!-- MODAL: AI VIRTUAL HAIR TRY-ON SIMULATOR (CANVAS PIXEL ENGINE) -->
  <div id="aiTryOnModal" onclick="if(event.target === this) closeAiTryOnModal()" class="hidden fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 text-center relative my-8">
      
      <!-- FLOATING TOP-RIGHT CLOSE BUTTON -->
      <button type="button" onclick="closeAiTryOnModal()" class="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-stone-100 hover:bg-rose-100 hover:text-rose-600 text-stone-600 font-bold text-xl flex items-center justify-center transition shadow-md border border-stone-200" title="Đóng cửa sổ (ESC)">✕</button>

      <div class="flex justify-between items-center border-b pb-3 pr-10">
        <h3 class="font-serif-accent text-xl font-bold text-stone-900 flex items-center gap-2">
          📸 AI Virtual Hair Try-On Simulator
        </h3>
        <button type="button" onclick="closeAiTryOnModal()" class="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-rose-100 hover:text-rose-600 text-stone-600 text-xs font-bold transition flex items-center gap-1">✕ Đóng</button>
      </div>

      <p class="text-xs text-stone-500">Thử màu nhuộm &amp; phong cách tạo kiểu AI trực tiếp trên gương mặt trước khi đặt lịch làm tóc</p>

      <!-- SAMPLE PORTRAIT SELECTOR -->
      <div class="space-y-2">
        <span class="text-[11px] font-bold text-stone-700 block">💡 Chọn nhanh mẫu chân dung thử nghiệm sẵn có:</span>
        <div class="flex justify-center gap-3">
          <button type="button" onclick="selectSampleModel('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 'Mẫu Nữ Tóc Dài')" class="group text-center">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" class="w-12 h-12 rounded-full object-cover border-2 border-stone-300 group-hover:border-salon-primary transition shadow-sm" />
            <span class="text-[9px] text-stone-600 block mt-1">Nữ Tóc Dài</span>
          </button>
          <button type="button" onclick="selectSampleModel('https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600', 'Mẫu Nữ Tóc Ngắn')" class="group text-center">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150" class="w-12 h-12 rounded-full object-cover border-2 border-stone-300 group-hover:border-salon-primary transition shadow-sm" />
            <span class="text-[9px] text-stone-600 block mt-1">Nữ Tóc Ngắn</span>
          </button>
          <button type="button" onclick="selectSampleModel('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600', 'Mẫu Nam Layer')" class="group text-center">
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" class="w-12 h-12 rounded-full object-cover border-2 border-stone-300 group-hover:border-salon-primary transition shadow-sm" />
            <span class="text-[9px] text-stone-600 block mt-1">Nam Layer</span>
          </button>
          <button type="button" onclick="selectSampleModel('https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600', 'Mẫu Nữ Uốn Sóng')" class="group text-center">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150" class="w-12 h-12 rounded-full object-cover border-2 border-stone-300 group-hover:border-salon-primary transition shadow-sm" />
            <span class="text-[9px] text-stone-600 block mt-1">Nữ Uốn Sóng</span>
          </button>
        </div>
      </div>

      <!-- CANVAS CONTAINER FOR PIXEL HAIR DYEING -->
      <div class="relative w-80 h-80 mx-auto rounded-3xl overflow-hidden border-2 border-stone-300 bg-stone-100 flex items-center justify-center shadow-xl group">
        <span id="aiPlaceholderText" class="text-xs text-stone-400 px-6 text-center">📷 Nhấn nút bên dưới để tải ảnh chân dung hoặc chọn mẫu ảnh có sẵn</span>
        <div id="aiPreviewCanvas" class="hidden relative w-full h-full">
          <!-- Real-Time Pixel Hair recoloring Canvas -->
          <canvas id="aiHairCanvas" class="w-full h-full object-cover rounded-3xl"></canvas>
        </div>
      </div>

      <!-- CONTROLS: OPACITY & FACE SKIN PROTECTION -->
      <div class="space-y-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-xs">
        <p id="aiActiveColorText" class="font-bold text-salon-primary text-center">✨ Đang thử màu nhuộm AI: Nâu Trà Sữa (Hot Trend)</p>
        <div class="grid grid-cols-2 gap-3 text-stone-600 pt-1.5 border-t border-stone-200/80">
          <div class="flex items-center gap-1.5 justify-center">
            <span>Độ đậm màu:</span>
            <input type="range" id="aiOpacityRange" min="20" max="95" value="75" oninput="adjustAiColorOpacity(this.value)" class="w-24 accent-salon-primary cursor-pointer" />
            <span id="aiOpacityValue" class="font-mono font-bold text-stone-800">75%</span>
          </div>
          <div class="flex items-center gap-1.5 justify-center">
            <span>🛡️ Lọc da mặt:</span>
            <input type="range" id="faceProtectRange" min="15" max="38" value="30" oninput="adjustFaceProtection(this.value)" class="w-24 accent-amber-600 cursor-pointer" />
            <span id="faceProtectValue" class="font-mono font-bold text-stone-800">30%</span>
          </div>
        </div>
      </div>

      <!-- UPLOAD BUTTON -->
      <div>
        <label class="inline-block px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold cursor-pointer transition shadow-md">
          📁 Tải Ảnh Chân Dung Từ Máy Của Bạn
          <input type="file" accept="image/*" onchange="handleAiImageUpload(event)" class="hidden" />
        </label>
      </div>

      <!-- PALETTE COLOR SELECTOR -->
      <div class="space-y-2 pt-3 border-t">
        <span class="text-[11px] font-bold uppercase text-stone-700 block">🎨 Bảng Màu Nhuộm Hot Trend Salon Lumière</span>
        <div class="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
          <button type="button" onclick="applyAiColorFilter('#D2B48C', 'Nâu Trà Sữa')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #D2B48C;"></span> Nâu Trà Sữa
          </button>
          <button type="button" onclick="applyAiColorFilter('#8B8580', 'Nâu Lạnh Khói')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #8B8580;"></span> Nâu Lạnh Khói
          </button>
          <button type="button" onclick="applyAiColorFilter('#B76E79', 'Hồng Pastel')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #B76E79;"></span> Hồng Pastel
          </button>
          <button type="button" onclick="applyAiColorFilter('#1C2833', 'Xanh Đen')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #1C2833;"></span> Xanh Đen
          </button>
          <button type="button" onclick="applyAiColorFilter('#D35400', 'Cam Đồng')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #D35400;"></span> Cam Đồng
          </button>
          <button type="button" onclick="applyAiColorFilter('#4B6F44', 'Rêu Khói Matcha')" class="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-bold flex items-center gap-1.5 hover:scale-105 transition bg-white shadow-sm">
            <span class="w-4 h-4 rounded-full inline-block border" style="background-color: #4B6F44;"></span> Rêu Khói
          </button>
        </div>
      </div>

      <div class="pt-3 border-t grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onclick="confirmAiTryOnSelection()" class="w-full py-3.5 bg-salon-primary hover:bg-stone-900 text-white text-xs font-bold rounded-2xl shadow-xl transition transform hover:scale-105">
          ✨ Đặt Lịch Ngay Với Màu Nhuộm Này
        </button>
        <button type="button" onclick="closeAiTryOnModal()" class="w-full py-3.5 bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-700 text-xs font-bold rounded-2xl transition shadow-sm border border-stone-300">
          ❌ Đóng / Thoát Trải Nghiệm AI
        </button>
      </div>
    </div>
  </div>

  <!-- FLOATING LIVE CHAT WIDGET -->
  <div id="chatWidgetBtn" onclick="toggleCustomerChat()" class="fixed bottom-6 right-6 z-40 bg-[#4A6B5D] text-white p-4 rounded-full shadow-2xl hover:scale-105 hover:bg-stone-900 transition flex items-center justify-center cursor-pointer border-2 border-white/20 group">
    <span class="text-2xl">💬</span>
    <span class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">Chat Tư Vấn</span>
    <span id="chatUnreadDot" class="hidden absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-ping"></span>
  </div>

  <div id="customerChatBox" class="hidden fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
    <!-- CHAT HEADER -->
    <div class="bg-[#4A6B5D] text-white p-4 flex justify-between items-center shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">✨</div>
        <div>
          <h4 class="font-serif font-bold text-sm leading-tight">LUMIÈRE Studio Chat</h4>
          <p class="text-[10px] text-emerald-200 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Trực tuyến • Tư vấn 24/7</p>
        </div>
      </div>
      <button onclick="toggleCustomerChat()" class="text-white/80 hover:text-white text-lg font-bold">✕</button>
    </div>

    <!-- CUSTOMER INFO PRE-FORM IF NOT LOGGED IN -->
    <div id="chatUserSetup" class="<?= $loggedUser ? 'hidden' : 'p-4 bg-stone-50 border-b border-stone-200 space-y-2' ?>">
      <p class="text-[11px] text-stone-600 font-bold">Nhập thông tin để bắt đầu chat với Stylist:</p>
      <div class="grid grid-cols-2 gap-2">
        <input type="text" id="chatCustName" value="<?= htmlspecialchars($loggedUser['name'] ?? '') ?>" placeholder="Họ và tên..." class="px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[#4A6B5D]" />
        <input type="tel" id="chatCustPhone" value="<?= htmlspecialchars($loggedUser['phone'] ?? '') ?>" placeholder="Số điện thoại..." class="px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1 focus:ring-[#4A6B5D]" />
      </div>
    </div>

    <!-- MESSAGES LIST -->
    <div id="customerChatMsgs" class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FBF9F5]">
      <div class="text-center text-xs text-stone-400 py-8">Xin chào! LUMIÈRE Studio có thể giúp gì cho bạn hôm nay?</div>
    </div>

    <!-- CHAT INPUT -->
    <form onsubmit="sendCustomerMsg(event)" class="p-3 bg-white border-t border-stone-200 flex gap-2 items-center shrink-0">
      <input type="text" id="chatInputMsg" placeholder="Soạn tin nhắn tư vấn..." required class="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
      <button type="submit" class="px-4 py-2.5 bg-[#4A6B5D] text-white rounded-xl text-xs font-bold hover:bg-stone-900 transition">Gửi</button>
    </form>
  </div>

  <!-- CANVAS CONFETTI SPARKLING FIREWORKS -->
  <canvas id="confettiCanvas" class="pointer-events-none fixed inset-0 z-50"></canvas>

  <!-- CELEBRATION BOOKING SUCCESS MODAL WITH RIPPLE ANIMATION -->
  <div id="bookingSuccessModal" class="hidden fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-300">
      <!-- GLOWING RING CHECKMARK -->
      <div class="relative w-20 h-20 mx-auto">
        <div class="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
        <div class="relative w-20 h-20 rounded-full bg-emerald-500 text-white font-bold text-4xl flex items-center justify-center shadow-lg border-4 border-white">
          ✓
        </div>
      </div>

      <div class="space-y-1">
        <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">🎉 Đặt Lịch Thành Công!</span>
        <h3 class="font-serif-accent text-2xl font-bold text-stone-900 pt-2">LUMIÈRE Hair Studio</h3>
        <p class="text-xs text-stone-500">Cảm ơn quý khách <b id="succCustName" class="text-stone-800">Bích Phương</b> đã lựa chọn dịch vụ làm đẹp!</p>
      </div>

      <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-2 text-left">
        <div class="flex justify-between border-b pb-1.5">
          <span class="text-stone-500">Mã Ca Hẹn:</span>
          <b id="succAppId" class="font-mono text-[#4A6B5D] font-bold">LUMI-8921</b>
        </div>
        <div class="flex justify-between border-b pb-1.5">
          <span class="text-stone-500">Dịch Vụ Chọn:</span>
          <b id="succServices" class="text-stone-900">Uốn Sóng Lơi Hàn Quốc</b>
        </div>
        <div class="flex justify-between">
          <span class="text-stone-500">Thời Gian Hẹn:</span>
          <b id="succStylistTime" class="text-stone-900">Alex Trần • 09:30 (Hôm nay)</b>
        </div>
      </div>

      <div class="pt-2">
        <button onclick="location.href='customer_portal.php'" class="w-full py-3.5 bg-[#4A6B5D] hover:bg-stone-900 text-white font-bold text-xs rounded-2xl shadow-xl transition transform hover:scale-105">
          👑 Xem Đơn & Tích Điểm Thành Viên →
        </button>
      </div>
    </div>
  </div>
</body>
</html>
