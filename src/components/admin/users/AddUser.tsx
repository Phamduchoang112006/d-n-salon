import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { addUser } from '../../database';
import RNPickerSelect from 'react-native-picker-select';

type AddUserProps = NativeStackScreenProps<HomeStackParamList, 'AddUser'>;

const AddUser = ({ navigation }: AddUserProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleSave = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Thông báo', 'Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    const success = await addUser(username.trim(), password, role);
    if (success) {
      Alert.alert('Thành công', 'Thêm người dùng mới thành công!');
      navigation.goBack();
    } else {
      Alert.alert('Thất bại', 'Tài khoản có thể đã được sử dụng.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👤 Thêm Người Dùng</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Tên tài khoản"
        placeholderTextColor="#94a3b8"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
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

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
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
    backgroundColor: '#10b981',
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

export default AddUser;
