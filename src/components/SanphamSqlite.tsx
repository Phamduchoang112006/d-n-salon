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
  StatusBar,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Product,
  Category,
  initDatabase,
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  searchProductsByNameOrCategory,
} from './database';

const SanphamSqlite = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [img, setImg] = useState('hinh1.jpg');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Search keyword state
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    initDatabase(() => {
      loadData(); // Chỉ gọi sau khi transaction xong
    });
  }, []);

  const loadData = async () => {
    const cats = await fetchCategories();
    const prods = await fetchProducts();
    setCategories(cats);
    setProducts(prods.reverse()); // Đảo ngược mảng để hiển thị sản phẩm mới lên đầu
    
    // Set default category if available
    if (cats.length > 0 && !editingId) {
      setCategoryId(cats[0].id);
    }
  };

  // Hàm ánh xạ với hình ảnh là URI hoặc ảnh tĩnh từ thư mục images
  const getImageSource = (imagePath: string) => {
    if (
      imagePath &&
      (imagePath.startsWith('file://') ||
        imagePath.startsWith('content://') ||
        imagePath.startsWith('http://') ||
        imagePath.startsWith('https://'))
    ) {
      return { uri: imagePath }; // Ảnh từ thư viện hoặc web
    }

    // Ảnh tĩnh từ assets
    switch (imagePath) {
      case 'hinh1.jpg':
        return require('../images/hinh1.jpg');
      // Thêm các ảnh khác nếu cần
      default:
        return require('../images/hinh1.jpg'); // Fallback nếu không tồn tại
    }
  };

  // Chọn hình ảnh từ máy
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

  // Thêm hoặc Cập nhật sản phẩm
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
      // Chế độ Cập nhật
      const updatedProduct: Product = {
        id: editingId,
        name: name.trim(),
        price: priceNum,
        img: img || 'hinh1.jpg',
        categoryId: categoryId,
      };
      await updateProduct(updatedProduct);
      Alert.alert('Thông báo', 'Cập nhật sản phẩm thành công!');
      setEditingId(null);
    } else {
      // Chế độ Thêm mới
      const newProduct = {
        name: name.trim(),
        price: priceNum,
        img: img || 'hinh1.jpg',
        categoryId: categoryId,
      };
      await addProduct(newProduct);
      Alert.alert('Thông báo', 'Thêm sản phẩm thành công!');
    }

    // Reset Form
    setName('');
    setPrice('');
    setImg('hinh1.jpg');
    if (categories.length > 0) {
      setCategoryId(categories[0].id);
    }
    setSearchKeyword('');
    loadData();
  };

  // Bắt đầu sửa sản phẩm
  const handleEdit = (item: Product) => {
    setEditingId(item.id);
    setName(item.name);
    setPrice(item.price.toString());
    setCategoryId(item.categoryId);
    setImg(item.img || 'hinh1.jpg');
  };

  // Xoá sản phẩm
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
            // Nếu sản phẩm đang sửa bị xóa thì reset form
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

  // Tìm kiếm sản phẩm
  const handleSearch = async (text: string) => {
    setSearchKeyword(text);
    if (text.trim() === '') {
      const prods = await fetchProducts();
      setProducts(prods.reverse());
    } else {
      const filteredProds = await searchProductsByNameOrCategory(text);
      setProducts(filteredProds.reverse());
    }
  };

  // Render sản phẩm
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.8}>
        <Image source={getImageSource(item.img)} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.cardInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} d</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <Text style={styles.title}>Quản lý sản phẩm</Text>
        
        {/* Nhập tên sản phẩm */}
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        
        {/* Nhập giá sản phẩm */}
        <TextInput
          style={styles.input}
          placeholder="Giá sản phẩm"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* Dropdown danh mục */}
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
          Icon={() => (
            <Text style={styles.pickerArrow}>▼</Text>
          )}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />

        {/* Xem trước ảnh đã chọn (nếu có) */}
        {img && img !== 'hinh1.jpg' ? (
          <View style={styles.previewContainer}>
            <Image source={getImageSource(img)} style={styles.previewImage} />
            <Text style={styles.previewText} numberOfLines={1}>
              Ảnh đã chọn
            </Text>
          </View>
        ) : null}

        {/* Nút Chọn hình ảnh */}
        <TouchableOpacity style={styles.purpleButton} onPress={handleSelectImage} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Chọn hình ảnh</Text>
        </TouchableOpacity>

        {/* Nút Thêm / Cập nhật sản phẩm */}
        <TouchableOpacity style={styles.blueButton} onPress={handleSaveProduct} activeOpacity={0.85}>
          <Text style={styles.buttonText}>
            {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
          </Text>
        </TouchableOpacity>

        {/* Tìm kiếm sản phẩm */}
        <TextInput
          style={styles.input}
          placeholder="Tìm theo tên sản phẩm hoặc loại"
          placeholderTextColor="#888"
          value={searchKeyword}
          onChangeText={handleSearch}
        />

        {/* Danh sách sản phẩm */}
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 220 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không có sản phẩm nào</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default SanphamSqlite;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    fontSize: 15,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  image: {
    width: 80,
    height: 80,
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  productPrice: {
    color: '#000',
    marginTop: 2,
    fontSize: 14,
  },
  iconRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  icon: {
    fontSize: 20,
    marginRight: 15,
  },
  purpleButton: {
    backgroundColor: '#581c87', // Màu tím sang trọng giống hình
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  blueButton: {
    backgroundColor: '#155e75', // Màu xanh đậm giống hình
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  pickerArrow: {
    fontSize: 11,
    color: '#666',
    marginRight: 12,
    marginTop: 14,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  previewImage: {
    width: 32,
    height: 32,
    borderRadius: 4,
    marginRight: 8,
  },
  previewText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 15,
  },
});

// Định nghĩa style riêng cho dropdown picker
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    fontSize: 15,
    paddingRight: 30,
    justifyContent: 'center',
  },
  inputAndroid: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000',
    fontSize: 15,
    paddingRight: 30,
    justifyContent: 'center',
  },
  iconContainer: {
    top: 0,
    right: 0,
  },
});
