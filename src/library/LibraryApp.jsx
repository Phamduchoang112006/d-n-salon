import React, { useState, useEffect } from 'react';

const API_BASE = 'library_api.php';

export default function LibraryApp() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [books, setBooks] = useState([]);
    const [readers, setReaders] = useState([]);
    const [borrows, setBorrows] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [catFilter, setCatFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Modals state
    const [showBookModal, setShowBookModal] = useState(false);
    const [showReaderModal, setShowReaderModal] = useState(false);
    const [showBorrowModal, setShowBorrowModal] = useState(false);

    const [editingBook, setEditingBook] = useState(null);
    const [editingReader, setEditingReader] = useState(null);

    // Form inputs
    const [bookForm, setBookForm] = useState({
        ma_sach: '', ten_sach: '', tac_gia: '', category_id: 1, nha_xuat_ban: '', nam_xuat_ban: 2024, so_luong: 5, hinh_anh: ''
    });

    const [readerForm, setReaderForm] = useState({
        ma_doc_gia: '', ho_ten: '', email: '', so_dien_thoai: '', dia_chi: '', ngay_cap: new Date().toISOString().split('T')[0], trang_thai: 'Hoạt động'
    });

    const [borrowForm, setBorrowForm] = useState({
        reader_id: '', book_id: '', ngay_muon: new Date().toISOString().split('T')[0], han_tra: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0], ghi_chu: ''
    });

    useEffect(() => {
        fetchStats();
        fetchCategories();
        if (activeTab === 'books' || activeTab === 'dashboard') fetchBooks();
        if (activeTab === 'readers') fetchReaders();
        if (activeTab === 'borrows' || activeTab === 'dashboard') fetchBorrows();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}?action=stats`);
            const json = await res.json();
            if (json.status === 'success') setStats(json.data.stats);
        } catch (e) { console.error('Fetch stats error', e); }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_BASE}?action=get_categories`);
            const json = await res.json();
            if (json.status === 'success') setCategories(json.data.categories);
        } catch (e) { console.error(e); }
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}?action=get_books&search=${encodeURIComponent(searchQuery)}&category_id=${catFilter}`);
            const json = await res.json();
            if (json.status === 'success') setBooks(json.data.books);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchReaders = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}?action=get_readers&search=${encodeURIComponent(searchQuery)}`);
            const json = await res.json();
            if (json.status === 'success') setReaders(json.data.readers);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchBorrows = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}?action=get_borrows&search=${encodeURIComponent(searchQuery)}&status=${statusFilter}`);
            const json = await res.json();
            if (json.status === 'success') setBorrows(json.data.borrows);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSaveBook = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}?action=save_book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBook ? { ...bookForm, id: editingBook.id } : bookForm)
            });
            const json = await res.json();
            alert(json.message);
            if (json.status === 'success') {
                setShowBookModal(false);
                fetchBooks();
                fetchStats();
            }
        } catch (e) { alert('Lỗi lưu sách'); }
    };

    const handleSaveReader = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}?action=save_reader`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingReader ? { ...readerForm, id: editingReader.id } : readerForm)
            });
            const json = await res.json();
            alert(json.message);
            if (json.status === 'success') {
                setShowReaderModal(false);
                fetchReaders();
                fetchStats();
            }
        } catch (e) { alert('Lỗi lưu độc giả'); }
    };

    const handleIssueBorrow = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}?action=issue_borrow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(borrowForm)
            });
            const json = await res.json();
            alert(json.message);
            if (json.status === 'success') {
                setShowBorrowModal(false);
                fetchBorrows();
                fetchStats();
            }
        } catch (e) { alert('Lỗi lập phiếu mượn'); }
    };

    const handleReturnBook = async (borrowId) => {
        if (!confirm('Xác nhận độc giả đã trả lại cuốn sách này?')) return;
        try {
            const res = await fetch(`${API_BASE}?action=return_borrow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: borrowId })
            });
            const json = await res.json();
            alert(json.message);
            if (json.status === 'success') {
                fetchBorrows();
                fetchStats();
            }
        } catch (e) { alert('Lỗi trả sách'); }
    };

    return (
        <div className="app-container">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="brand-logo"><i className="fas fa-book-reader"></i></div>
                    <div>
                        <h2>QUẢN LÝ THƯ VIỆN</h2>
                        <p>Đồ Án Nhóm - PHP & ReactJS</p>
                    </div>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                            <i className="fas fa-chart-pie"></i> Thống Kê Tổng Quan
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
                            <i className="fas fa-book"></i> Quản Lý Sách
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'readers' ? 'active' : ''} onClick={() => setActiveTab('readers')}>
                            <i className="fas fa-users"></i> Quản Lý Độc Giả
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'borrows' ? 'active' : ''} onClick={() => setActiveTab('borrows')}>
                            <i className="fas fa-exchange-alt"></i> Mượn / Trả Sách
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>
                            <i className="fas fa-tags"></i> Danh Mục Sách
                        </button>
                    </li>
                    <li>
                        <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>
                            <i className="fas fa-user-shield"></i> Thông Tin Nhóm
                        </button>
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <div className="sidebar-team-info">
                        <span><i className="fas fa-users-cog"></i> Nhóm Thực Hiện:</span>
                        <strong>Nguyễn Đăng Khải</strong> (Trưởng nhóm)<br />
                        Nguyễn Nhật Linh Ân<br />
                        Phan Duy
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="main-content">
                <header className="top-navbar">
                    <div className="navbar-title">
                        <h1>
                            {activeTab === 'dashboard' && 'Thống Kê Tổng Quan'}
                            {activeTab === 'books' && 'Quản Lý Kho Sách'}
                            {activeTab === 'readers' && 'Quản Lý Độc Giả'}
                            {activeTab === 'borrows' && 'Quản Lý Mượn & Trả Sách'}
                            {activeTab === 'categories' && 'Quản Lý Danh Mục'}
                            {activeTab === 'team' && 'Thông Tin Thành Viên Nhóm'}
                        </h1>
                    </div>
                    <div className="navbar-user">
                        <div className="user-badge">
                            <div className="user-avatar">K</div>
                            <div className="user-info">
                                Nguyễn Đăng Khải
                                <small>Trưởng nhóm</small>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-body">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <p>TỔNG SỐ SÁCH</p>
                                        <h3>{stats ? stats.total_books : 0}</h3>
                                    </div>
                                    <div className="stat-icon blue"><i className="fas fa-book"></i></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <p>SÁCH ĐANG MƯỢN</p>
                                        <h3>{stats ? stats.active_borrows : 0}</h3>
                                    </div>
                                    <div className="stat-icon amber"><i className="fas fa-hand-holding-book"></i></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <p>ĐỘC GIẢ ĐĂNG KÝ</p>
                                        <h3>{stats ? stats.total_readers : 0}</h3>
                                    </div>
                                    <div className="stat-icon green"><i className="fas fa-user-graduate"></i></div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <p>PHIẾU QUÁ HẠN</p>
                                        <h3>{stats ? stats.overdue_borrows : 0}</h3>
                                    </div>
                                    <div className="stat-icon red"><i className="fas fa-exclamation-circle"></i></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
