import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import Header from './Header';
import { useAppContext } from './AppContext';
import { fetchCategories, fetchProductsWithFilter, initDatabase, getImageSource, Product, Category } from './database';
import { useIsFocused } from '@react-navigation/native';

type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 32) / 2;
const bannerWidth = width - 32;

const BANNERS = [
  {
    id: '1',
    image: require('../images/banner.png'),
    title: 'Bộ Sưu Tập Hè 2026',
    subtitle: 'Giảm giá lên đến 50%',
    badge: 'MUA NGAY',
  },
  {
    id: '2',
    image: { uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80' },
    title: 'Thời Trang Nam Nữ',
    subtitle: 'Hàng mới về - Miễn phí ship',
    badge: 'KHÁM PHÁ',
  },
  {
    id: '3',
    image: { uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80' },
    title: 'Phụ Kiện Cao Cấp',
    subtitle: 'Ưu đãi đặc biệt giảm 30%',
    badge: 'SĂN DEAL',
  },
];

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const isFocused = useIsFocused();
  const { user, addToCart } = useAppContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Banner Carousel states
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Search & Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Auto-scroll banners
  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = currentBannerIndex + 1;
      if (nextIndex >= BANNERS.length) {
        nextIndex = 0;
      }
      setCurrentBannerIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000); // Tự động chuyển banner mỗi 4 giây

    return () => clearInterval(timer);
  }, [currentBannerIndex]);

  const onMomentumScrollEnd = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / bannerWidth);
    setCurrentBannerIndex(index);
  };

  useEffect(() => {
    initDatabase(() => {
      loadData();
    });
  }, []);

  // Reload data when screen is focused or filter params change
  useEffect(() => {
    if (isFocused) {
      loadProducts();
    }
  }, [isFocused, selectedCategoryId, searchKeyword, minPrice, maxPrice]);

  const loadData = async () => {
    const cats = await fetchCategories();
    setCategories(cats);
    loadProducts();
  };

  const loadProducts = async () => {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : 0;
    const list = await fetchProductsWithFilter(
      selectedCategoryId,
      min,
      max,
      searchKeyword
    );
    setProducts(list.reverse()); // Show newest products first
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginSqlite' as any) }
        ]
      );
      return;
    }
    addToCart(product);
    Alert.alert('Thành công', `Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Details', { product: item })}
          >
            <Image source={getImageSource(item.img)} style={styles.productImage} />
          </TouchableOpacity>
          {/* Wishlist Overlay */}
          <TouchableOpacity style={styles.wishlistOverlay} activeOpacity={0.7}>
            <Text style={styles.wishlistOverlayIcon}>🤍</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTag}>PREMIUM STYLE</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
            <TouchableOpacity 
              style={styles.circleAddBtn} 
              onPress={() => handleAddToCart(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.circleAddBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <FlatList
          ref={flatListRef}
          data={BANNERS}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, index) => ({
            length: bannerWidth,
            offset: bannerWidth * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width: bannerWidth, height: 110, position: 'relative' }}>
              <Image source={item.image} style={styles.bannerImage} />
              <View style={styles.bannerOverlay}>
                <View style={styles.bannerTextCol}>
                  <Text style={styles.bannerTitle}>{item.title}</Text>
                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>{item.badge}</Text>
                </View>
              </View>
            </View>
          )}
        />
        {/* Indicator Dots */}
        <View style={styles.indicatorContainer}>
          {BANNERS.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                currentBannerIndex === index && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInputField}
            placeholder="Tìm sản phẩm, danh mục..."
            placeholderTextColor="#94a3b8"
            value={searchKeyword}
            onChangeText={setSearchKeyword}
          />
        </View>
        <TouchableOpacity 
          style={styles.filterToggleBtn}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>{showFilters ? '▲ Ẩn' : '⚡ Lọc'}</Text>
        </TouchableOpacity>
      </View>

      {/* Collapsible Price Filter */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Lọc theo giá (đ)</Text>
          <View style={styles.priceInputsRow}>
            <TextInput
              style={styles.priceInput}
              placeholder="Giá tối thiểu"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text style={styles.priceSeparator}>-</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Giá tối đa"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>
          <TouchableOpacity 
            style={styles.clearFilterBtn}
            onPress={() => {
              setMinPrice('');
              setMaxPrice('');
            }}
          >
            <Text style={styles.clearFilterText}>Xóa bộ lọc giá</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Tabs */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'all', name: 'Tất cả' }, ...categories]}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.categoryScroll}
          renderItem={({ item }) => {
            const isSelected = selectedCategoryId === item.id;
            return (
              <TouchableOpacity
                style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                onPress={() => setSelectedCategoryId(item.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 14,
    height: 110,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  bannerBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bannerBadgeText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 44,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInputField: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    padding: 0, // Reset default padding
  },
  filterToggleBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  filterToggleText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  filterPanel: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  priceInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '500',
  },
  priceSeparator: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  clearFilterBtn: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  clearFilterText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '700',
  },
  categoryContainer: {
    marginBottom: 14,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  categoryBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  categoryText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  wishlistOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  wishlistOverlayIcon: {
    fontSize: 12,
    color: '#94a3b8',
  },
  ratingOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingOverlayText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  productImage: {
    width: '100%',
    height: COLUMN_WIDTH - 10,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 12,
  },
  cardTag: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    height: 40,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563eb',
  },
  circleAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  circleAddBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginTop: -2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorDotActive: {
    width: 14,
    backgroundColor: '#ffffff',
  },
});

export default HomeScreen;
