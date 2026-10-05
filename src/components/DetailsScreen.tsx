import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { getImageSource } from './database';
import { useAppContext } from './AppContext';

type DetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Details'>;

const DetailsScreen = ({ route, navigation }: DetailsScreenProps) => {
  const { product } = route.params;
  const { user, addToCart } = useAppContext();
  
  // Custom states for size, color and wishlist to look high-fidelity
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('#0f172a');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
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

  const colors = [
    { code: '#0f172a', name: 'Đen' },
    { code: '#E91E63', name: 'Hồng' },
    { code: '#3b82f6', name: 'Xanh dương' },
    { code: '#10b981', name: 'Xanh lá' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi Tiết Sản Phẩm</Text>
        <TouchableOpacity style={styles.favHeaderBtn} onPress={() => setIsFavorite(!isFavorite)} activeOpacity={0.7}>
          <Text style={styles.favHeaderIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image Container */}
        <View style={styles.imageContainer}>
          <Image source={getImageSource(product.img)} style={styles.productImage} />
        </View>

        {/* Product Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.skuText}>MÃ SP: #{product.id}  •  PREMIUM QUALITY</Text>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.priceContainer}>
            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>{product.price.toLocaleString()}đ</Text>
              <Text style={styles.originalPrice}>{(product.price * 1.3).toLocaleString()}đ</Text>
            </View>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-30% OFF</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Size Selector */}
          <Text style={styles.sectionTitle}>Chọn kích thước (Size)</Text>
          <View style={styles.sizeRow}>
            {['S', 'M', 'L', 'XL'].map((size) => {
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeBtn, isSelected && styles.sizeBtnActive]}
                  onPress={() => setSelectedSize(size)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.sizeBtnText, isSelected && styles.sizeBtnTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Color Selector */}
          <Text style={styles.sectionTitle}>Chọn màu sắc</Text>
          <View style={styles.colorRow}>
            {colors.map((c) => {
              const isSelected = selectedColor === c.code;
              return (
                <TouchableOpacity
                  key={c.code}
                  style={[
                    styles.colorBtn, 
                    { backgroundColor: c.code }, 
                    isSelected && styles.colorBtnActive
                  ]}
                  onPress={() => setSelectedColor(c.code)}
                  activeOpacity={0.7}
                />
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Description Section */}
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>
            Sản phẩm cao cấp được thiết kế tinh tế, chất liệu vải nhập khẩu mềm mại, thoáng mát và co giãn tốt, đem lại cảm giác thoải mái khi mặc. Đường may tỉ mỉ, phom dáng chuẩn, phù hợp cho nhiều dịp khác nhau.
          </Text>

          <View style={styles.divider} />

          {/* Policy Section */}
          <View style={styles.policyRow}>
            <Text style={styles.policyText}>🚚 Miễn phí vận chuyển toàn quốc</Text>
            <Text style={styles.policyText}>🔄 Đổi trả nhanh chóng trong 7 ngày</Text>
            <Text style={styles.policyText}>🛡️ Bảo hành chính hãng 12 tháng</Text>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.favBtn, isFavorite && styles.favBtnActive]} 
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
        >
          <Text style={styles.favBtnText}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart} activeOpacity={0.85}>
          <Text style={styles.cartButtonText}>🛒 Thêm Vào Giỏ Hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  backArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrowText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  favHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favHeaderIcon: {
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  productImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  skuText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    lineHeight: 28,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceValue: {
    fontSize: 24,
    color: '#2563eb',
    fontWeight: '900',
  },
  originalPrice: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '600',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  discountText: {
    color: '#2563eb',
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sizeBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  sizeBtnTextActive: {
    color: '#ffffff',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 16,
  },
  colorBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorBtnActive: {
    borderColor: '#ffffff',
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ scale: 1.15 }],
  },
  descriptionText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '400',
  },
  policyRow: {
    gap: 8,
  },
  policyText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  favBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  favBtnActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  favBtnText: {
    fontSize: 20,
  },
  cartButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cartButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default DetailsScreen;
