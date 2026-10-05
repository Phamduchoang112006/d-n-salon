import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';

type AdminDashboardProps = NativeStackScreenProps<HomeStackParamList, 'AdminDashboard'>;

const AdminDashboard = ({ navigation }: AdminDashboardProps) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>⚙️ Bảng Điều Khiển Admin</Text>
      
      <View style={styles.menuGrid}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CategoryManagement')}>
          <Text style={styles.menuText}>📂 Quản Lý Danh Mục</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('UserManagement')}>
          <Text style={styles.menuText}>👥 Quản Lý Người Dùng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProductManagement', { categoryId: 0 })}>
          <Text style={styles.menuText}>📦 Quản Lý Sản Phẩm</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AdminOrderManagement' as any)}>
          <Text style={styles.menuText}>📋 Quản Lý Đơn Hàng</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 30,
  },
  menuGrid: {
    width: '100%',
    gap: 15,
    marginBottom: 30,
  },
  menuItem: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  backButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminDashboard;
