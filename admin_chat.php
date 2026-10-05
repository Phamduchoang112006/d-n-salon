<?php
// admin_chat.php - Trang Quản Lý Live Chat Với Khách Hàng
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/admin_nav.php';

$loggedAdmin = is_admin_logged_in();
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LUMIÈRE Admin - Trung Tâm Live Chat</title>
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
<body class="bg-[#F8F6F0] h-screen text-stone-900 flex overflow-hidden">

  <!-- SIDEBAR NAV -->
  <?php render_admin_nav('chat'); ?>

  <!-- MAIN CONTENT AREA -->
  <div class="flex-1 flex flex-col min-w-0 h-full">
    <!-- HEADER -->
    <header class="bg-white border-b border-stone-200 px-8 py-5 flex justify-between items-center shrink-0">
      <div>
        <h2 class="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">💬 Trung Tâm Live Chat Khách Hàng</h2>
        <p class="text-xs text-stone-500">Tư vấn trực tuyến & Hỗ trợ đặt lịch cho khách hàng</p>
      </div>
      <div class="text-xs text-stone-500 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-bold border border-emerald-200 flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
        <span>Hệ thống Chat Sẵn sàng</span>
      </div>
    </header>

    <!-- CHAT INTERFACE 2 COLUMNS -->
    <main class="flex-1 flex min-h-0 p-6 gap-6 overflow-hidden">
      
      <!-- LEFT PANEL: CONVERSATIONS LIST -->
      <aside class="w-80 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col shrink-0 overflow-hidden">
        <div class="p-4 border-b border-stone-100">
          <input type="text" id="searchThread" onkeyup="filterThreads()" placeholder="🔍 Tìm tên hoặc SĐT..." class="w-full px-4 py-2 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D]" />
        </div>

        <div id="conversationsList" class="flex-1 overflow-y-auto divide-y divide-stone-100">
          <div class="p-8 text-center text-xs text-stone-400">Đang tải cuộc trò chuyện...</div>
        </div>
      </aside>

      <!-- RIGHT PANEL: CHAT WINDOW -->
      <section class="flex-1 bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col min-w-0 overflow-hidden">
        <!-- CHAT HEADER -->
        <div id="chatHeader" class="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#4A6B5D] text-white font-bold flex items-center justify-center text-sm shadow-sm" id="activeAvatar">
              👤
            </div>
            <div>
              <h3 class="font-bold text-stone-900 text-sm" id="activeName">Chọn cuộc trò chuyện</h3>
              <p class="text-[11px] text-stone-500" id="activePhone">Chọn một khách hàng ở danh sách bên trái để bắt đầu chat</p>
            </div>
          </div>
        </div>

        <!-- CHAT MESSAGES BODY -->
        <div id="chatMessages" class="flex-1 p-6 overflow-y-auto space-y-4 bg-[#FBF9F5]">
          <div class="flex flex-col items-center justify-center h-full text-stone-400 space-y-2">
            <span class="text-4xl">💬</span>
            <p class="text-xs">Vui lòng chọn khách hàng để xem lịch sử hội thoại</p>
          </div>
        </div>

        <!-- CHAT INPUT FOOTER -->
        <form id="chatForm" onsubmit="sendAdminMessage(event)" class="p-4 bg-white border-t border-stone-200 flex gap-3 items-center shrink-0">
          <input type="text" id="adminMsgInput" placeholder="Nhập tin nhắn tư vấn gửi khách hàng..." disabled class="flex-1 px-4 py-3 rounded-2xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#4A6B5D] disabled:bg-stone-100" />
          <button type="submit" id="sendBtn" disabled class="px-6 py-3 bg-[#4A6B5D] text-white rounded-2xl text-xs font-bold shadow-md hover:bg-stone-900 transition disabled:opacity-50">
            Gửi ➔
          </button>
        </form>
      </section>

    </main>
  </div>

  <script>
    let activeCustomerPhone = null;
    let activeCustomerName = '';
    let conversationsData = [];

    function loadConversations() {
      fetch('api.php?action=get_chat_conversations')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            conversationsData = data.conversations || [];
            renderConversationsList();
          }
        });
    }

    function renderConversationsList() {
      const container = document.getElementById('conversationsList');
      const query = document.getElementById('searchThread').value.toLowerCase();
      
      const filtered = conversationsData.filter(c => 
        (c.customer_name && c.customer_name.toLowerCase().includes(query)) ||
        (c.customer_phone && c.customer_phone.includes(query))
      );

      if (filtered.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-xs text-stone-400">Chưa có tin nhắn nào từ khách hàng</div>`;
        return;
      }

      container.innerHTML = filtered.map(c => {
        const isActive = c.customer_phone === activeCustomerPhone;
        const unreadBadge = (c.unread_count > 0) ? `<span class="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${c.unread_count}</span>` : '';
        return `
          <div onclick="selectCustomer('${c.customer_phone}', '${escapeHtml(c.customer_name)}')" class="p-4 cursor-pointer hover:bg-stone-50 transition flex items-center justify-between gap-3 ${isActive ? 'bg-stone-100/80 border-l-4 border-[#4A6B5D]' : ''}">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-full bg-[#C89F82] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                ${escapeHtml(c.customer_name).charAt(0).toUpperCase()}
              </div>
              <div class="min-w-0">
                <p class="font-bold text-xs text-stone-900 truncate">${escapeHtml(c.customer_name)}</p>
                <p class="text-[10px] text-stone-400">${c.customer_phone}</p>
                <p class="text-[11px] text-stone-500 truncate mt-0.5">${escapeHtml(c.last_message || '')}</p>
              </div>
            </div>
            <div class="flex flex-col items-end shrink-0 gap-1">
              <span class="text-[9px] text-stone-400">${c.last_time ? c.last_time.substring(11, 16) : ''}</span>
              ${unreadBadge}
            </div>
          </div>
        `;
      }).join('');
    }

    function filterThreads() {
      renderConversationsList();
    }

    function selectCustomer(phone, name) {
      activeCustomerPhone = phone;
      activeCustomerName = name;

      document.getElementById('activeName').innerText = name;
      document.getElementById('activePhone').innerText = '📱 ' + phone;
      document.getElementById('activeAvatar').innerText = name.charAt(0).toUpperCase();

      document.getElementById('adminMsgInput').disabled = false;
      document.getElementById('sendBtn').disabled = false;

      renderConversationsList();
      loadMessages();
    }

    function loadMessages() {
      if (!activeCustomerPhone) return;

      fetch(`api.php?action=get_chat_history&customer_phone=${activeCustomerPhone}&reader=admin`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const msgs = data.messages || [];
            const container = document.getElementById('chatMessages');

            if (msgs.length === 0) {
              container.innerHTML = `<div class="text-center text-stone-400 text-xs py-8">Chưa có tin nhắn nào. Gửi tin nhắn đầu tiên để bắt đầu tư vấn!</div>`;
              return;
            }

            const isScrolledToBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 50;

            container.innerHTML = msgs.map(m => {
              const isAdmin = m.sender === 'admin';
              const timeStr = m.created_at ? m.created_at.substring(11, 16) : '';
              return `
                <div class="flex ${isAdmin ? 'justify-end' : 'justify-start'}">
                  <div class="max-w-[70%] p-3.5 rounded-2xl text-xs space-y-1 ${isAdmin ? 'bg-[#4A6B5D] text-white rounded-br-none shadow-md' : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-sm'}">
                    <div class="flex justify-between items-center gap-4 text-[9px] opacity-75">
                      <span class="font-bold">${isAdmin ? 'LUMIÈRE Admin' : escapeHtml(m.customer_name)}</span>
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

    function sendAdminMessage(e) {
      e.preventDefault();
      const input = document.getElementById('adminMsgInput');
      const msg = input.value.trim();
      if (!msg || !activeCustomerPhone) return;

      const formData = new FormData();
      formData.append('action', 'send_chat');
      formData.append('sender', 'admin');
      formData.append('customer_phone', activeCustomerPhone);
      formData.append('customer_name', activeCustomerName);
      formData.append('message', msg);

      input.value = '';

      fetch('api.php', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            loadMessages();
            loadConversations();
          }
        });
    }

    function escapeHtml(text) {
      return (text || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function logoutAdmin() {
      fetch('api.php?action=logout').then(() => location.href = 'login.php?tab=admin');
    }

    // Initial load and polling every 3s
    loadConversations();
    setInterval(() => {
      loadConversations();
      if (activeCustomerPhone) {
        loadMessages();
      }
    }, 3000);
  </script>
</body>
</html>
