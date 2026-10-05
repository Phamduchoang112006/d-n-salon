import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const Layout1 = () => {
  return (
    <SafeAreaView style={styles.screenWrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#ff758f" />

      {/* HEADER: Gồm Logo và Banner */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../images/hinh1.jpg')} style={styles.logoImage} />
        </View>
        <View style={styles.bannerContainer}>
          <Image source={require('../images/banner.png')} style={styles.bannerImage} />
        </View>
      </View>

      {/* BODY: Danh sách sản phẩm nổi bật */}
      <ScrollView contentContainerStyle={styles.bodyScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>SẢN PHẨM NỔI BẬT</Text>

          <View style={styles.grid}>
            {/* Sản phẩm 1 */}
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={require('../images/ao_thun.png')} style={styles.productImage} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.productTitle}>Áo Thun Nam</Text>
                <Text style={styles.productPrice}>150.000đ</Text>
              </View>
              <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>

            {/* Sản phẩm 2 */}
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={require('../images/quan_jean.png')} style={styles.productImage} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.productTitle}>Quần Jean</Text>
                <Text style={styles.productPrice}>350.000đ</Text>
              </View>
              <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>

            {/* Sản phẩm 3 */}
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={require('../images/giay_the_thao.png')} style={styles.productImage} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.productTitle}>Giày Thể Thao</Text>
                <Text style={styles.productPrice}>500.000đ</Text>
              </View>
              <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>

            {/* Sản phẩm 4 */}
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={require('../images/balo_laptop.png')} style={styles.productImage} />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.productTitle}>Balo Laptop</Text>
                <Text style={styles.productPrice}>250.000đ</Text>
              </View>
              <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER: Chính sách bảo mật và Liên kết mạng xã hội */}
      <View style={styles.footer}>
        <Text style={styles.footerPolicy}>Chính sách bảo mật</Text>
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>🌐 FB</Text>
          <Text style={styles.socialText}>📷 IG</Text>
          <Text style={styles.socialText}>▶️ YT</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Layout1;

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#f0f9ff', // Nền xanh da trời nhạt, dịu mắt
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1e293b', // Nền Slate tối giúp nổi bật logo/banner
    padding: 10,
    height: 120,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#0f172a',
  },
  logoContainer: {
    flex: 1.1,
    backgroundColor: '#ffffff', // Nền trắng sạch sẽ cho Logo
    borderRadius: 8,
    marginRight: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bannerContainer: {
    flex: 2.2,
    backgroundColor: '#ffffff', // Nền trắng sạch sẽ cho Banner
    borderRadius: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bodyScroll: {
    flexGrow: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#f0f9ff', // Nền xanh da trời nhạt dịu mắt
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    color: '#1e293b', // Tiêu đề xanh tối rõ ràng, dễ nhìn
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 1,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 38) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    justifyContent: 'space-between',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  cardBody: {
    alignItems: 'center',
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444', // Màu giá tiền đỏ tươi rõ nét
  },
  buyButton: {
    backgroundColor: '#10b981', // Màu xanh lá ngọc hiện đại
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    height: 56,
    backgroundColor: '#1e293b', // Đồng bộ với header
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#0f172a',
  },
  footerPolicy: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  socialText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '700',
  },
});
