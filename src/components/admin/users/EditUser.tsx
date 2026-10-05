import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { getUserById, updateUser, User } from '../../database';
import RNPickerSelect from 'react-native-picker-select';

type EditUserProps = NativeStackScreenProps<HomeStackParamList, 'EditUser'>;

const EditUser = ({ route, navigation }: EditUserProps) => {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    const u = await getUserById(userId);
    if (u) {
      setUser(u);
      setUsername(u.username);
      setRole(u.role);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    if (username.trim() === '') {
      Alert.alert('Thông báo', 'Tên tài khoản không được bỏ trống.');
      return;
    }

    const updatedUser: User = {
      id: userId,
      username: username.trim(),
      password: password.trim() !== '' ? password : user.password,
      role: role,
    };

    await updateUser(updatedUser);
    Alert.alert('Thành công', 'Cập nhật tài khoản thành công!');
    navigation.goBack();
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>✏️ Sửa Người Dùng ID: {userId}</Text>
      
      <Text style={styles.label}>Tên tài khoản</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên tài khoản"
        placeholderTextColor="#94a3b8"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mật khẩu mới (bỏ trống nếu không đổi)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Vai trò</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(val) => setRole(val)}
          items={[
            { label: 'Khách hàng (user)', value: 'user' },
            { label: 'Quản trị viên (admin)', value: 'admin' },
          ]}
          value={role}
          placeholder={{}}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Cập Nhật</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Hủy</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#0f172a',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    marginBottom: 25,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#64748b',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#0f172a',
    height: 50,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#0f172a',
    height: 50,
  },
});

export default EditUser;
