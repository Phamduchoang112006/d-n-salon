import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useAppContext } from './AppContext';
import { updateUserProfile, getUserById } from './database';

const ProfileScreen = () => {
  const { user, loginUser, logoutUser } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (username.trim() === '') {
      Alert.alert('Thông báo', 'Tên đăng nhập không được bỏ trống.');
      return;
    }

    if (password !== '') {
      if (password.length < 6) {
        Alert.alert('Thông báo', 'Mật khẩu mới phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert('Thông báo', 'Xác nhận mật khẩu mới không khớp.');
        return;
      }
    }

    setSaving(true);
    const success = await updateUserProfile(user.id, username.trim(), password ? password : undefined);
    if (success) {
      // Refresh user details from database to update Context
      const updatedUser = await getUserById(user.id);
      if (updatedUser) {
        loginUser(updatedUser);
      }
      setPassword('');
      setConfirmPassword('');
      Alert.alert('Thành công', 'Cập nhật thông tin cá nhân thành công!');
    } else {
      Alert.alert('Lỗi', 'Cập nhật thất bại. Tên tài khoản có thể đã được sử dụng.');
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.title}>🔒 Tài Khoản Cá Nhân</Text>
          <Text style={styles.subTitle}>Vui lòng đăng nhập để xem thông tin hồ sơ.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Header with Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{user.username}</Text>
          <Text style={styles.profileRole}>
            {user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Khách hàng (User)'}
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã tài khoản</Text>
            <Text style={styles.infoVal}>#{user.id}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên tài khoản</Text>
            <Text style={styles.infoVal}>{user.username}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vai trò</Text>
            <Text style={[styles.infoVal, styles.roleText]}>
              {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Cập nhật thông tin</Text>

          <Text style={styles.label}>Tên tài khoản mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên tài khoản"
            placeholderTextColor="#94a3b8"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {password !== '' && (
            <>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu mới"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </>
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile} disabled={saving} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>{saving ? 'Đang lưu...' : 'Lưu Thay Đổi'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logoutUser} activeOpacity={0.85}>
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
    marginVertical: 15,
  },
  subTitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fdf2f8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E91E63',
    elevation: 3,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#E91E63',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  profileRole: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  infoVal: {
    fontSize: 15,
    color: '#0f172a',
    fontWeight: '700',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 10,
  },
  roleText: {
    color: '#E91E63',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '500',
  },
  saveBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  logoutBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default ProfileScreen;
