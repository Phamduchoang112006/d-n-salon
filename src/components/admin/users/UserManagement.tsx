import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, SafeAreaView } from 'react-native';
import { fetchUsers, deleteUser, updateUser, User } from '../../database';
import { useAppContext } from '../../AppContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { useIsFocused } from '@react-navigation/native';

type UserManagementProps = NativeStackScreenProps<HomeStackParamList, 'UserManagement'>;

const UserManagement = ({ navigation }: UserManagementProps) => {
  const isFocused = useIsFocused();
  const { user: currentUser } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadUsers();
    }
  }, [isFocused]);

  const loadUsers = async () => {
    const list = await fetchUsers();
    setUsers(list);
  };

  const handleToggleRole = async (targetUser: User) => {
    if (currentUser && currentUser.id === targetUser.id) {
      Alert.alert('Không cho phép', 'Bạn không thể tự thay đổi vai trò của chính mình.');
      return;
    }

    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    const updatedUser = { ...targetUser, role: nextRole };
    
    await updateUser(updatedUser);
    loadUsers();
    Alert.alert('Thành công', `Đã cập nhật vai trò của ${targetUser.username} thành ${nextRole}.`);
  };

  const handleDeleteUser = (id: number, username: string) => {
    if (currentUser && currentUser.id === id) {
      Alert.alert('Không cho phép', 'Bạn không thể tự xóa tài khoản của chính mình.');
      return;
    }

    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa tài khoản "${username}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteUser(id);
            loadUsers();
            Alert.alert('Thành công', 'Đã xóa người dùng thành công!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👥 Quản Lý Người Dùng</Text>
      
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddUser')}>
        <Text style={styles.addButtonText}>+ Thêm Người Dùng</Text>
      </TouchableOpacity>

      <ScrollView style={styles.list}>
        {users.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.info}>
              <Text style={styles.username}>Tài khoản: {item.username}</Text>
              <Text style={styles.role}>Vai trò: <Text style={styles.roleBadge}>{item.role}</Text></Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.roleBtn} onPress={() => handleToggleRole(item)}>
                <Text style={styles.roleBtnText}>Đổi vai trò</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditUser', { userId: item.id })}>
                <Text style={styles.editBtnText}>Sửa</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteUser(item.id, item.username)}>
                <Text style={styles.deleteBtnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 15,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  info: {
    marginBottom: 10,
  },
  username: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
  },
  role: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  roleBadge: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  roleBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  roleBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserManagement;
