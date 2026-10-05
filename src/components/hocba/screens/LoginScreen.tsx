import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useHocBa } from '../HocBaContext';
import { UserRole } from '../hocBaTypes';

export const LoginScreen: React.FC = () => {
  const { login, users, switchRoleQuickly } = useHocBa();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      setErrorMessage('Vui lòng nhập tên đăng nhập');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setErrorMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
    } else {
      setErrorMessage('');
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { text: 'Ban Giám Hiệu / Admin', color: '#1e3a8a', bg: '#dbeafe', emoji: '🛡️' };
      case 'teacher':
        return { text: 'Giáo Viên', color: '#047857', bg: '#d1fae5', emoji: '👩‍🏫' };
      case 'student':
        return { text: 'Phụ Huynh / Học Sinh', color: '#b45309', bg: '#fef3c7', emoji: '🎓' };
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Brand Header */}
      <View style={styles.headerBox}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoEmoji}>🏫</Text>
        </View>
        <Text style={styles.schoolTitle}>TRƯỜNG THCS MINH KHAI</Text>
        <Text style={styles.appTitle}>SỔ HỌC BẠ ĐIỆN TỬ</Text>
        <Text style={styles.subTitle}>Hệ thống Quản lý Học bạ & Đánh giá Học sinh</Text>
      </View>

      {/* Manual Login Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeaderTitle}>🔑 Đăng nhập hệ thống</Text>
        
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên đăng nhập:</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={(txt) => {
              setUsername(txt);
              setErrorMessage('');
            }}
            placeholder="Nhập tên đăng nhập..."
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              setErrorMessage('');
            }}
            placeholder="Nhập mật khẩu (Mặc định: 123)..."
            placeholderTextColor="#94a3b8"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.loginBtnText}>ĐĂNG NHẬP HỆ THỐNG</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Demo Login Section */}
      <View style={styles.card}>
        <View style={styles.quickHeader}>
          <Text style={styles.cardHeaderTitle}>⚡ Chọn nhanh tài khoản dùng thử</Text>
          <Text style={styles.quickSubtitle}>Đăng nhập 1-chạm không cần gõ mật khẩu</Text>
        </View>

        {users.map(u => {
          const badge = getRoleBadge(u.role);
          return (
            <TouchableOpacity
              key={u.id}
              style={styles.userCard}
              onPress={() => switchRoleQuickly(u.id)}
              activeOpacity={0.7}
            >
              <View style={styles.userIconBox}>
                <Text style={{ fontSize: 24 }}>{badge.emoji}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{u.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                  <View style={[styles.roleBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.roleBadgeText, { color: badge.color }]}>{badge.text}</Text>
                  </View>
                  <Text style={styles.userAccountText}> • tk: {u.username}</Text>
                </View>
              </View>
              <Text style={styles.arrowText}>➔</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 THCS Minh Khai - Sổ học bạ điện tử thông minh</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  headerBox: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoEmoji: {
    fontSize: 34,
  },
  schoolTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0369a1',
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  loginBtn: {
    backgroundColor: '#0284c7',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickHeader: {
    marginBottom: 12,
  },
  quickSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: -8,
    marginBottom: 8,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userAccountText: {
    fontSize: 11,
    color: '#64748b',
  },
  arrowText: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
