import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, SafeAreaView } from 'react-native';
import { fetchCategories, addCategory, updateCategory, deleteCategory, Category } from '../../database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { useIsFocused } from '@react-navigation/native';

type CategoryManagementProps = NativeStackScreenProps<HomeStackParamList, 'CategoryManagement'>;

const CategoryManagement = ({ navigation }: CategoryManagementProps) => {
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (isFocused) {
      loadCategories();
    }
  }, [isFocused]);

  const loadCategories = async () => {
    const list = await fetchCategories();
    setCategories(list);
  };

  const handleAddCategory = async () => {
    if (newCatName.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên danh mục.');
      return;
    }
    const success = await addCategory(newCatName.trim());
    if (success) {
      setNewCatName('');
      loadCategories();
      Alert.alert('Thành công', 'Thêm danh mục mới thành công!');
    } else {
      Alert.alert('Lỗi', 'Không thể thêm danh mục.');
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (editingId === null || editingName.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên danh mục hợp lệ.');
      return;
    }
    const success = await updateCategory(editingId, editingName.trim());
    if (success) {
      setEditingId(null);
      setEditingName('');
      loadCategories();
      Alert.alert('Thành công', 'Cập nhật danh mục thành công!');
    } else {
      Alert.alert('Lỗi', 'Cập nhật danh mục thất bại.');
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa danh mục "${name}"? Tất cả sản phẩm thuộc danh mục này sẽ bị ảnh hưởng.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteCategory(id);
            if (success) {
              loadCategories();
              Alert.alert('Thành công', 'Xóa danh mục thành công!');
            } else {
              Alert.alert('Lỗi', 'Không thể xóa danh mục.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📂 Quản Lý Danh Mục</Text>

      {/* Form thêm mới */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Tên danh mục mới"
          placeholderTextColor="#94a3b8"
          value={newCatName}
          onChangeText={setNewCatName}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAddCategory}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách danh mục */}
      <ScrollView style={styles.list}>
        {categories.map((cat) => (
          <View key={cat.id} style={styles.card}>
            {editingId === cat.id ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={editingName}
                  onChangeText={setEditingName}
                />
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                  <Text style={styles.saveBtnText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditingId(null)}>
                  <Text style={styles.cancelBtnText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.catRow}>
                <Text style={styles.cardText}>#{cat.id}. {cat.name}</Text>
                <View style={styles.actions}>
                  {/* Thêm sản phẩm tương ứng */}
                  <TouchableOpacity
                    style={styles.addProductBtn}
                    onPress={() => navigation.navigate('ProductManagement', { categoryId: cat.id })}
                  >
                    <Text style={styles.addProductBtnText}>+ SP</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.editBtn} onPress={() => handleStartEdit(cat)}>
                    <Text style={styles.editBtnText}>Sửa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteCategory(cat.id, cat.name)}>
                    <Text style={styles.deleteBtnText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  form: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#0f172a',
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: '#10b981',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  list: {
    flex: 1,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    padding: 12,
    justifyContent: 'center',
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addProductBtn: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  addProductBtnText: {
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
  editRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    color: '#0f172a',
  },
  saveBtn: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cancelBtn: {
    backgroundColor: '#64748b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  cancelBtnText: {
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

export default CategoryManagement;
