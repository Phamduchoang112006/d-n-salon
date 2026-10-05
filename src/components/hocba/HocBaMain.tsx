import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { HocBaProvider, useHocBa } from './HocBaContext';
import { LoginScreen } from './screens/LoginScreen';
import { AdminScreens } from './screens/AdminScreens';
import { TeacherScreens } from './screens/TeacherScreens';
import { StudentParentScreens } from './screens/StudentParentScreens';
import { UserRole } from './hocBaTypes';

const HocBaContent: React.FC = () => {
  const { currentUser, logout, users, switchRoleQuickly } = useHocBa();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const getRoleBadgeInfo = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { text: 'Ban Giám Hiệu', bg: '#dbeafe', color: '#1e3a8a', emoji: '🛡️' };
      case 'teacher':
        return { text: 'Giáo Viên', bg: '#d1fae5', color: '#047857', emoji: '👩‍🏫' };
      case 'student':
        return { text: 'Phụ Huynh / Học Sinh', bg: '#fef3c7', color: '#b45309', emoji: '🎓' };
    }
  };

  const badge = currentUser ? getRoleBadgeInfo(currentUser.role) : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#0284c7" barStyle="light-content" />

      {/* App Header Bar */}
      <View style={styles.topHeader}>
        <View style={styles.schoolBrand}>
          <Text style={styles.brandEmoji}>🏫</Text>
          <View>
            <Text style={styles.brandTitle}>THCS MINH KHAI</Text>
            <Text style={styles.brandSubTitle}>Sổ Học Bạ Điện Tử</Text>
          </View>
        </View>

        {currentUser ? (
          <View style={styles.userControls}>
            <TouchableOpacity
              style={styles.roleSwitchBtn}
              onPress={() => setShowRoleModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.roleSwitchBtnText}>🔁 Đổi vai trò ({badge?.emoji})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
              <Text style={styles.logoutBtnText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* User Info Bar if logged in */}
      {currentUser && badge ? (
        <View style={styles.userBanner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.userBannerName}>{currentUser.name}</Text>
            <View style={[styles.bannerRoleBadge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.bannerRoleBadgeText, { color: badge.color }]}>{badge.text}</Text>
            </View>
          </View>
          <Text style={styles.userBannerUsername}>tk: {currentUser.username}</Text>
        </View>
      ) : null}

      {/* Main Screen Body */}
      <View style={styles.mainBody}>
        {!currentUser ? (
          <LoginScreen />
        ) : currentUser.role === 'admin' ? (
          <AdminScreens />
        ) : currentUser.role === 'teacher' ? (
          <TeacherScreens />
        ) : (
          <StudentParentScreens />
        )}
      </View>

      {/* Role Switcher Modal */}
      <Modal visible={showRoleModal} transparent animationType="fade" onRequestClose={() => setShowRoleModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>⚡ Đổi Vai Trò Nhanh</Text>
              <TouchableOpacity onPress={() => setShowRoleModal(false)}>
                <Text style={{ fontSize: 18, color: '#64748b' }}>✖</Text>
              </TouchableOpacity>
            </View>

            <ScrollView>
              {users.map(u => {
                const b = getRoleBadgeInfo(u.role);
                const isCurrent = currentUser?.id === u.id;
                return (
                  <TouchableOpacity
                    key={u.id}
                    style={[styles.userOptionCard, isCurrent && styles.userOptionCardActive]}
                    onPress={() => {
                      switchRoleQuickly(u.id);
                      setShowRoleModal(false);
                    }}
                  >
                    <Text style={{ fontSize: 22, marginRight: 10 }}>{b.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.userOptionName}>{u.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <View style={[styles.bannerRoleBadge, { backgroundColor: b.bg }]}>
                          <Text style={[styles.bannerRoleBadgeText, { color: b.color }]}>{b.text}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: '#64748b' }}> • {u.username}</Text>
                      </View>
                    </View>
                    {isCurrent ? <Text style={{ color: '#0284c7', fontWeight: '800' }}>✓ Đang chọn</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export const HocBaMain: React.FC = () => {
  return (
    <HocBaProvider>
      <HocBaContent />
    </HocBaProvider>
  );
};

export default HocBaMain;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0284c7',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0284c7',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  schoolBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 26,
    marginRight: 8,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  brandSubTitle: {
    fontSize: 11,
    color: '#e0f2fe',
    fontWeight: '600',
  },
  userControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleSwitchBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 6,
  },
  roleSwitchBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  userBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0369a1',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  userBannerName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 8,
  },
  bannerRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bannerRoleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  userBannerUsername: {
    color: '#bae6fd',
    fontSize: 11,
  },
  mainBody: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  userOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userOptionCardActive: {
    borderColor: '#0284c7',
    backgroundColor: '#f0f9ff',
  },
  userOptionName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
  },
});
