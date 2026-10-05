import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Product,
  Category,
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  getImageSource,
} from '../../database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types';
import { useIsFocused } from '@react-navigation/native';

type ProductManagementProps = NativeStackScreenProps<HomeStackParamList, 'ProductManagement'>;

const ProductManagement = ({ route, navigation }: ProductManagementProps) => {
  const { categoryId: initialCategoryId } = route.params;
  const isFocused = useIsFocused();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(initialCategoryId || 1);
  const [img, setImg] = useState('hinh1.jpg');
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  useEffect(() => {
    if (initialCategoryId && initialCategoryId !== 0) {
      setCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    
    // Filter by initial category if specified
    if (initialCategoryId && initialCategoryId !== 0) {
      setProducts(prods.filter(p => p.categoryId === initialCategoryId).reverse());
    } else {
      setProducts(prods.reverse());
    }

    if (cats.length > 0 && !editingId && (!initialCategoryId || initialCategoryId === 0)) {
      setCategoryId(cats[0].id);
    }
  };

  const handleSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Lỗi', 'Không thể chọn ảnh từ thiết bị.');
        } else if (response.assets && response.assets.length > 0) {
          const selectedUri = response.assets[0].uri;
          if (selectedUri) {
            setImg(selectedUri);
          }
        }
      }
    );
  };

  const handleSaveProduct = async () => {
    if (name.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sản phẩm.');
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Thông báo', 'Vui lòng nhập giá sản phẩm hợp lệ.');
      return;
    }
    if (!categoryId) {
      Alert.alert('Thông báo', 'Vui lòng chọn danh mục.');
      return;
    }

    if (editingId) {
      const updatedProd: Product = {
        id: editingId,
        name: name.trim(),
        price: priceNum,
        img: img || 'hinh1.jpg',
        categoryId: categoryId,
      };
      await updateProduct(updatedProd);
      Alert.alert('Thông báo', 'Cập nhật sản phẩm thành công!');
      setEditingId(null);
    } else {
      const newProduct = {
        name: name.trim(),
        price: priceNum,
        img: img || 'hinh1.jpg',
        categoryId: categoryId,
      };
      await addProduct(newProduct);
      Alert.alert('Thông báo', 'Thêm sản phẩm thành công!');
    }

    setName('');
    setPrice('');
    setImg('hinh1.jpg');
    if (categories.length > 0) {
      setCategoryId(initialCategoryId || categories[0].id);
    }
    loadData();
  };

  const handleEdit = (item: Product) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setCategoryId(item.categoryId);
    setImg(item.img || 'hinh1.jpg');
  };

  const handleDelete = (id: number, productName: string) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc muốn xóa sản phẩm "${productName}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await deleteProduct(id);
            if (editingId === id) {
              setEditingId(null);
              setName('');
              setPrice('');
              setImg('hinh1.jpg');
              if (categories.length > 0) {
                setCategoryId(categories[0].id);
              }
            }
            loadData();
          },
        },
      ]
    );
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Image source={getImageSource(item.img)} style={styles.image} />
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
        <Text style={styles.productCategory}>
          Loại: {categories.find((c) => c.id === item.categoryId)?.name || 'Khác'}
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.icon}>✏️ Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
            <Text style={[styles.icon, styles.deleteIcon]}>❌ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>📦 Quản Lý Sản Phẩm</Text>
        {initialCategoryId !== 0 && (
          <Text style={styles.subtitle}>
            Chỉ hiển thị danh mục: {categories.find(c => c.id === initialCategoryId)?.name || `ID ${initialCategoryId}`}
          </Text>
        )}

        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
          <TextInput
            style={styles.input}
            placeholder="Tên sản phẩm"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Giá sản phẩm"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => {
                if (value !== null) {
                  setCategoryId(value);
                }
              }}
              items={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
              value={categoryId}
              placeholder={{}}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>

          {img && img !== 'hinh1.jpg' ? (
            <View style={styles.previewContainer}>
              <Image source={getImageSource(img)} style={styles.previewImage} />
              <Text style={styles.previewText} numberOfLines={1}>Ảnh đã chọn</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.purpleButton} onPress={handleSelectImage}>
              <Text style={styles.buttonText}>Chọn ảnh</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.blueButton} onPress={handleSaveProduct}>
              <Text style={styles.buttonText}>
                {editingId ? 'Cập nhật' : 'Lưu sản phẩm'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          }
          showsVerticalScrollIndicator={false}
          style={styles.list}
        />

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    maxHeight: 280,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 8,
    color: '#0f172a',
    fontSize: 14,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 5,
  },
  purpleButton: {
    backgroundColor: '#8b5cf6',
    flex: 1,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueButton: {
    backgroundColor: '#10b981',
    flex: 1,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 6,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  previewImage: {
    width: 28,
    height: 28,
    borderRadius: 4,
    marginRight: 8,
  },
  previewText: {
    fontSize: 12,
    color: '#475569',
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1e293b',
  },
  productPrice: {
    color: '#E91E63',
    fontWeight: 'bold',
    marginTop: 2,
    fontSize: 13,
  },
  productCategory: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  icon: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
  },
  deleteIcon: {
    color: '#ef4444',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748b',
    fontSize: 14,
  },
  backButton: {
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    paddingHorizontal: 10,
    color: '#0f172a',
    fontSize: 14,
  },
  inputAndroid: {
    height: 40,
    paddingHorizontal: 10,
    color: '#0f172a',
    fontSize: 14,
  },
});

export default ProductManagement;
