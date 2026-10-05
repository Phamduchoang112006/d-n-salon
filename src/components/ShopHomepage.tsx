import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';

// Lấy kích thước màn hình để thiết kế responsive
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // Chia 2 cột, trừ margin/padding

// Interface cho Sản Phẩm
interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  category: 'laptop' | 'phone' | 'accessory';
  rating: number;
  discount?: string;
}

// 1. Khởi tạo mảng dữ liệu Sản Phẩm với hình ảnh local trong project để load offline ổn định
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro M3 14"',
    price: 42990000,
    image: require('../../assets/logo.png'),
    category: 'laptop',
    rating: 4.9,
    discount: '-8%',
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max 256GB',
    price: 29990000,
    image: require('../../assets/banner.png'),
    category: 'phone',
    rating: 4.8,
    discount: '-12%',
  },
  {
    id: '3',
    name: 'Tai nghe Sony WH-1000XM5',
    price: 6890000,
    image: require('../../assets/bulb_on.png'),
    category: 'accessory',
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Bàn phím cơ Keychron K2 V2',
    price: 1850000,
    image: require('../../assets/bulb_off.png'),
    category: 'accessory',
    rating: 4.6,
    discount: '-15%',
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    price: 26990000,
    image: require('../../assets/banner.png'),
    category: 'phone',
    rating: 4.8,
    discount: '-10%',
  },
  {
    id: '6',
    name: 'Chuột Logitech MX Master 3S',
    price: 2490000,
    image: require('../../assets/bulb_on.png'),
    category: 'accessory',
    rating: 4.9,
  },
  {
    id: '7',
    name: 'Laptop ASUS ROG Zephyrus G14',
    price: 36990000,
    image: require('../../assets/logo.png'),
    category: 'laptop',
    rating: 4.7,
    discount: '-5%',
  },
  {
    id: '8',
    name: 'Đế sạc không dây 3-in-1 Anker',
    price: 1200000,
    image: require('../../assets/bulb_off.png'),
    category: 'accessory',
    rating: 4.5,
  },
];

// Hàm định dạng giá tiền tệ VNĐ
const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' đ';
};

// ==========================================
// CÁCH 2: TẠO 1 COMPONENT CON CARD, TRUYỀN VÀO CÁC PROPS
// ==========================================
interface CardProps {
  name: string;
  price: number;
  image: any;
  discount?: string;
  rating: number;
  onPressBuy: () => void;
}

const ProductCard = ({ name, price, image, discount, rating, onPressBuy }: CardProps) => {
  return (
    <View style={styles.cardContainer}>
      {/* Hình ảnh sản phẩm */}
      <View style={styles.cardImageWrapper}>
        <Image source={typeof image === 'string' ? { uri: image } : image} style={styles.cardImage} />
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐️ {rating}</Text>
        </View>
      </View>

      {/* Thông tin sản phẩm */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardName} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.cardPrice}>{formatPrice(price)}</Text>
      </View>

      {/* Nút Mua Ngay */}
      <TouchableOpacity style={styles.buyButton} onPress={onPressBuy} activeOpacity={0.8}>
        <Text style={styles.buyButtonText}>Mua ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==========================================
// COMPONENT CHÍNH TRANG CHỦ BÁN HÀNG
// ==========================================
const ShopHomepage = () => {
  const [renderMode, setRenderMode] = useState<'array' | 'card'>('card');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartCount, setCartCount] = useState<number>(0);

  // Xử lý sự kiện khi ấn Mua ngay
  const handleBuyProduct = (productName: string) => {
    setCartCount(prev => prev + 1);
    Alert.alert(
      'Đặt hàng thành công 🎉',
      `Bạn đã thêm "${productName}" vào giỏ hàng thành công!`,
      [{ text: 'OK', style: 'default' }]
    );
  };

  // Lọc sản phẩm theo danh mục và tìm kiếm
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* 1. HEADER: Logo, Tiêu đề, Giỏ hàng */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
          <View>
            <Text style={styles.headerTitle}>NovaTech</Text>
            <Text style={styles.headerSubtitle}>Premium Gadget Store</Text>
          </View>
        </View>

        {/* Giỏ hàng với số lượng thực tế */}
        <TouchableOpacity 
          style={styles.cartContainer} 
          onPress={() => Alert.alert('Giỏ hàng', `Bạn hiện có ${cartCount} sản phẩm trong giỏ hàng.`)}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. CHỌN CÁCH RENDER (Phục vụ kiểm tra bài tập) */}
      <View style={styles.modeSelectorContainer}>
        <Text style={styles.modeLabel}>Chế độ Render (Bài Tập):</Text>
        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.tabButton, renderMode === 'array' && styles.tabButtonActive]}
            onPress={() => setRenderMode('array')}
          >
            <Text style={[styles.tabButtonText, renderMode === 'array' && styles.tabButtonTextActive]}>
              Cách 1: Dùng Mảng
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, renderMode === 'card' && styles.tabButtonActive]}
            onPress={() => setRenderMode('card')}
          >
            <Text style={[styles.tabButtonText, renderMode === 'card' && styles.tabButtonTextActive]}>
              Cách 2: Component Card
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modeInfoBanner}>
          <Text style={styles.modeInfoText}>
            {renderMode === 'array' 
              ? '💡 Đang hiển thị trực tiếp bằng việc map mảng PRODUCTS ngay trong FlatList.'
              : '💡 Đang hiển thị bằng cách gọi Component <ProductCard /> độc lập và truyền props.'}
          </Text>
        </View>
      </View>

      {/* FlatList hiển thị danh sách sản phẩm dạng Grid */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        
        // Component Header cho FlatList (gồm tìm kiếm, banner và bộ lọc danh mục)
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Thanh Tìm Kiếm */}
            <View style={styles.searchBarContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm sản phẩm công nghệ..."
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Text style={styles.clearSearchIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* BANNER KHUYẾN MÃI */}
            <View style={styles.bannerContainer}>
              <Image
                source={require('../../assets/banner.png')}
                style={styles.bannerImage}
              />
              <View style={styles.bannerOverlay}>
                <View style={styles.bannerTag}>
                  <Text style={styles.bannerTagText}>GIẢM ĐẾN 50%</Text>
                </View>
                <Text style={styles.bannerTitle}>Siêu Hội Công Nghệ</Text>
                <Text style={styles.bannerSub}>Giảm sâu tất cả các thiết bị hi-end cao cấp</Text>
                <TouchableOpacity style={styles.bannerButton} onPress={() => Alert.alert('Khuyến mãi', 'Chương trình diễn ra từ 01/06 đến 15/06')}>
                  <Text style={styles.bannerButtonText}>Khám phá ngay</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* BỘ LỌC DANH MỤC */}
            <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
            <View style={styles.categoryContainer}>
              {[
                { id: 'all', name: 'Tất cả', icon: '🛍️' },
                { id: 'laptop', name: 'Laptops', icon: '💻' },
                { id: 'phone', name: 'Phones', icon: '📱' },
                { id: 'accessory', name: 'Phụ kiện', icon: '🎧' },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                      {cat.icon} {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* TIÊU ĐỀ KHU VỰC SẢN PHẨM */}
            <View style={styles.productsTitleRow}>
              <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
              <Text style={styles.productsCount}>({filteredProducts.length} sản phẩm)</Text>
            </View>
          </View>
        }

        // Render từng sản phẩm theo 2 cách hiển thị
        renderItem={({ item }) => {
          if (renderMode === 'card') {
            // ==========================================
            // CÁCH 2: GỌI COMPONENT CON VÀ TRUYỀN PROPS
            // ==========================================
            return (
              <ProductCard
                name={item.name}
                price={item.price}
                image={item.image}
                rating={item.rating}
                discount={item.discount}
                onPressBuy={() => handleBuyProduct(item.name)}
              />
            );
          } else {
            // ==========================================
            // CÁCH 1: DÙNG MẢNG VÀ RENDER TRỰC TIẾP TRONG COMPONENT CHÍNH
            // ==========================================
            return (
              <View style={styles.cardContainer}>
                {/* Ảnh + badge của Cách 1 render trực tiếp */}
                <View style={styles.cardImageWrapper}>
                  <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.cardImage} />
                  {item.discount && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{item.discount}</Text>
                    </View>
                  )}
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐️ {item.rating}</Text>
                  </View>
                </View>

                {/* Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardPrice}>{formatPrice(item.price)}</Text>
                </View>

                {/* Button Mua ngay */}
                <TouchableOpacity
                  style={[styles.buyButton, { backgroundColor: '#10b981' }]} // Màu khác một chút để phân biệt
                  onPress={() => handleBuyProduct(item.name)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buyButtonText}>Mua ngay (Cách 1)</Text>
                </TouchableOpacity>
              </View>
            );
          }
        }}

        // Thông báo nếu không tìm thấy sản phẩm nào
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào phù hợp!</Text>
          </View>
        }

        // Component Footer cho FlatList
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2026 NovaTech Store. All rights reserved.</Text>
            <Text style={styles.footerLink}>Chính sách bảo mật & Điều khoản sử dụng</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default ShopHomepage;

// ==========================================
// TỐI ƯU GIAO DIỆN VỚI STYLESHEET
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // Sleek Dark Mode
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoImage: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  cartContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#1e293b',
  },
  cartBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
  // Chế độ Render Selector
  modeSelectorContainer: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modeLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: '#3b82f6', // Accent blue
  },
  tabButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  modeInfoBanner: {
    marginTop: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  modeInfoText: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Grid layout
  listContent: {
    padding: 12,
  },
  listHeader: {
    marginBottom: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  // Tìm kiếm
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  clearSearchIcon: {
    color: '#64748b',
    fontSize: 16,
    padding: 4,
  },
  // Banner
  bannerContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#1e293b',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bannerTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
  },
  bannerTagText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: '800',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  bannerSub: {
    color: '#cbd5e1',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  bannerButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bannerButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  // Danh mục
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  productsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productsCount: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
  },
  // Card thiết kế Grid
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardImageWrapper: {
    height: CARD_WIDTH * 0.9,
    width: '100%',
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 9,
    fontWeight: '700',
  },
  cardInfo: {
    padding: 10,
    gap: 4,
  },
  cardName: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    height: 38, // Giới hạn chiều cao để cân đối
    lineHeight: 18,
  },
  cardPrice: {
    color: '#3b82f6',
    fontSize: 15,
    fontWeight: '800',
  },
  buyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  // Trạng thái trống
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
  },
  // Footer
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
  footerLink: {
    color: '#3b82f6',
    fontSize: 11,
    fontWeight: '600',
  },
});
