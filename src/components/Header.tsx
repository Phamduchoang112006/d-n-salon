import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from './AppContext';

const Header = () => {
  const { user, logoutUser } = useAppContext();

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => {
            logoutUser();
            Alert.alert('Thành công', 'Bạn đã đăng xuất khỏi hệ thống.');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.logoText}>🛍️ DangKhai <Text style={styles.logoHighlight}>Fashion</Text></Text>
        <Text style={styles.subText}>Premium Style & Accessories</Text>
      </View>

      {user ? (
        <View style={styles.userInfoContainer}>
          <View style={styles.userTextContainer}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.usernameText} numberOfLines={1}>{user.username}</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout} 
            activeOpacity={0.7}
          >
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.userInfoContainer}>
          <View style={styles.userTextContainer}>
            <Text style={styles.welcomeText}>Xin chào,</Text>
            <Text style={styles.usernameText}>Khách</Text>
          </View>
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>✨</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  brandContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.2,
  },
  logoHighlight: {
    color: '#2563eb',
  },
  subText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    alignItems: 'flex-end',
    marginRight: 10,
  },
  welcomeText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
  guestBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guestBadgeText: {
    fontSize: 14,
  },
});

export default Header;
