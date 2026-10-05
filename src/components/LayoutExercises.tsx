import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';

type TabType = 'layout1' | 'layout2' | 'layout3';

const LayoutExercises = () => {
  const [activeTab, setActiveTab] = useState<TabType>('layout1');

  // Load local images from assets folder
  const logoImg = require('../../assets/logo.png');
  const bannerImg = require('../../assets/banner.png');

  // LAYOUT 1: 3 equal regions in default direction (vertical/column)
  const renderLayout1 = () => {
    return (
      <View style={styles.layout1Container}>
        <View style={[styles.l1Card, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.cardEmoji}>📱</Text>
          <Text style={styles.cardTitle}>VÙNG 1</Text>
          <Text style={styles.cardDesc}>flex: 1</Text>
        </View>
        <View style={[styles.l1Card, { backgroundColor: '#10b981' }]}>
          <Text style={styles.cardEmoji}>💻</Text>
          <Text style={styles.cardTitle}>VÙNG 2</Text>
          <Text style={styles.cardDesc}>flex: 1</Text>
        </View>
        <View style={[styles.l1Card, { backgroundColor: '#8b5cf6' }]}>
          <Text style={styles.cardEmoji}>🖥️</Text>
          <Text style={styles.cardTitle}>VÙNG 3</Text>
          <Text style={styles.cardDesc}>flex: 1</Text>
        </View>
      </View>
    );
  };

  // LAYOUT 2: 3 equal regions in horizontal direction (row)
  const renderLayout2 = () => {
    return (
      <View style={styles.layout2Container}>
        <View style={[styles.l2Card, { backgroundColor: '#f59e0b' }]}>
          <Text style={styles.l2Emoji}>🍊</Text>
          <Text style={styles.l2Title}>VÙNG A</Text>
          <Text style={styles.l2Desc}>flex: 1</Text>
        </View>
        <View style={[styles.l2Card, { backgroundColor: '#ec4899' }]}>
          <Text style={styles.l2Emoji}>🌸</Text>
          <Text style={styles.l2Title}>VÙNG B</Text>
          <Text style={styles.l2Desc}>flex: 1</Text>
        </View>
        <View style={[styles.l2Card, { backgroundColor: '#06b6d4' }]}>
          <Text style={styles.l2Emoji}>💎</Text>
          <Text style={styles.l2Title}>VÙNG C</Text>
          <Text style={styles.l2Desc}>flex: 1</Text>
        </View>
      </View>
    );
  };

  // LAYOUT 3: Structured Header, Body (Sidebar + Content), Footer
  const renderLayout3 = () => {
    return (
      <View style={styles.layout3Container}>
        {/* HEADER: gồm logo và banner */}
        <View style={styles.header}>
          {/* Vùng Logo */}
          <View style={styles.logoWrapper}>
            <Image source={logoImg} style={styles.logoImg} />
            <Text style={styles.logoBrand}>NovaTech</Text>
          </View>
          
          {/* Vùng Banner */}
          <View style={styles.bannerWrapper}>
            <Image source={bannerImg} style={styles.bannerImg} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerText}>Summer Big Sale Up to 50% Off</Text>
              <Text style={styles.bannerSubtext}>Click to shop now</Text>
            </View>
          </View>
        </View>

        {/* BODY: gồm sidebar và content */}
        <View style={styles.body}>
          {/* Sidebar (Cột trái) */}
          <View style={styles.sidebar}>
            <Text style={styles.sidebarSectionTitle}>DANH MỤC</Text>
            <TouchableOpacity style={[styles.sidebarItem, styles.sidebarItemActive]}>
              <Text style={styles.sidebarItemTextActive}>🏠 Trang chủ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>📦 Sản phẩm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>🔔 Thông báo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>⚙️ Cài đặt</Text>
            </TouchableOpacity>
          </View>

          {/* Content (Cột phải) */}
          <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentInner}>
            <Text style={styles.contentMainTitle}>Trang Tin Tức & Thống Kê</Text>
            
            {/* Thống kê dạng thẻ (Metric Cards) */}
            <View style={styles.metricRow}>
              <View style={[styles.metricCard, { borderLeftColor: '#3b82f6' }]}>
                <Text style={styles.metricVal}>15.2K</Text>
                <Text style={styles.metricLabel}>Lượt Xem</Text>
              </View>
              <View style={[styles.metricCard, { borderLeftColor: '#10b981' }]}>
                <Text style={[styles.metricVal, { color: '#10b981' }]}>+28%</Text>
                <Text style={styles.metricLabel}>Tăng Trưởng</Text>
              </View>
            </View>

            {/* Khung nội dung chi tiết */}
            <View style={styles.articleCard}>
              <Text style={styles.articleTitle}>✨ Cập nhật mới hệ thống</Text>
              <Text style={styles.articleBody}>
                Chào mừng bạn tới bảng điều khiển của NovaTech. Các dịch vụ đang chạy ổn định. Phiên bản hệ thống hiện tại là v2.5.
              </Text>
              <TouchableOpacity
                style={styles.articleBtn}
                onPress={() => Alert.alert('Thông tin', 'Chương trình khuyến mãi hè áp dụng đến hết tháng 6.')}
              >
                <Text style={styles.articleBtnText}>Xem chi tiết sự kiện</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* FOOTER: Chính sách bảo mật và các icon mạng xã hội */}
        <View style={styles.footer}>
          {/* Chính sách bảo mật */}
          <TouchableOpacity
            onPress={() => Alert.alert('Bảo mật', 'Chính sách bảo mật thông tin khách hàng của NovaTech.')}
            activeOpacity={0.7}
          >
            <Text style={styles.privacyLink}>Chính sách bảo mật</Text>
          </TouchableOpacity>

          {/* Mạng xã hội */}
          <View style={styles.socialIconsRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#1877f2' }]}
              onPress={() => Alert.alert('Facebook', 'Kết nối qua trang Facebook của chúng tôi')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialBtnEmoji}>🔵</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#ff0000' }]}
              onPress={() => Alert.alert('YouTube', 'Truy cập kênh YouTube để xem hướng dẫn')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialBtnEmoji}>🔴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#24292e' }]}
              onPress={() => Alert.alert('GitHub', 'Mã nguồn mở của dự án trên GitHub')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialBtnEmoji}>🐙</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: '#1da1f2' }]}
              onPress={() => Alert.alert('Twitter', 'Cập nhật tin tức nhanh nhất qua Twitter')}
              activeOpacity={0.8}
            >
              <Text style={styles.socialBtnEmoji}>🐦</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Tab Navigation Segmented Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtnItem, activeTab === 'layout1' && styles.tabBtnItemActive]}
          onPress={() => setActiveTab('layout1')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'layout1' && styles.tabBtnTextActive]}>
            Layout 1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtnItem, activeTab === 'layout2' && styles.tabBtnItemActive]}
          onPress={() => setActiveTab('layout2')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'layout2' && styles.tabBtnTextActive]}>
            Layout 2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtnItem, activeTab === 'layout3' && styles.tabBtnItemActive]}
          onPress={() => setActiveTab('layout3')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'layout3' && styles.tabBtnTextActive]}>
            Layout 3
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {activeTab === 'layout1' && renderLayout1()}
        {activeTab === 'layout2' && renderLayout2()}
        {activeTab === 'layout3' && renderLayout3()}
      </View>
    </SafeAreaView>
  );
};

export default LayoutExercises;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabBtnItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnItemActive: {
    backgroundColor: '#3b82f6',
  },
  tabBtnText: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 13,
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
  },

  // Layout 1 (Dọc) Styles
  layout1Container: {
    flex: 1,
    padding: 12,
    gap: 12,
  },
  l1Card: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    padding: 20,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardDesc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },

  // Layout 2 (Ngang) Styles
  layout2Container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  l2Card: {
    flex: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    padding: 10,
  },
  l2Emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  l2Title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  l2Desc: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },

  // Layout 3 (Phức hợp) Styles
  layout3Container: {
    flex: 1,
  },
  header: {
    height: 90,
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    padding: 8,
    alignItems: 'center',
    gap: 8,
  },
  logoWrapper: {
    width: 90,
    height: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    padding: 4,
  },
  logoImg: {
    width: 36,
    height: 36,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  logoBrand: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  bannerWrapper: {
    flex: 1,
    height: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  bannerText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  bannerSubtext: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '28%',
    backgroundColor: '#1e293b',
    borderRightWidth: 1,
    borderRightColor: '#334155',
    paddingTop: 16,
    paddingHorizontal: 6,
    gap: 8,
  },
  sidebarSectionTitle: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    paddingLeft: 6,
    marginBottom: 6,
  },
  sidebarItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  sidebarItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },
  sidebarItemText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  sidebarItemTextActive: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  contentInner: {
    padding: 12,
    gap: 12,
  },
  contentMainTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    borderLeftWidth: 4,
  },
  metricVal: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  articleCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 8,
  },
  articleTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  articleBody: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  articleBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  articleBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  footer: {
    height: 60,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  privacyLink: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  socialIconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  socialBtnEmoji: {
    fontSize: 14,
  },
});
