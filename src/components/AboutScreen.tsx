import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

type AboutScreenProps = NativeStackScreenProps<HomeStackParamList, 'About'>;

const AboutScreen = ({ navigation }: AboutScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giới Thiệu Cửa Hàng</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.brandContainer}>
          <Text style={styles.logoText}>🛍️ DangKhai <Text style={styles.logoHighlight}>Fashion</Text></Text>
          <Text style={styles.subtitleText}>Premium Style & Accessories</Text>
          <Text style={styles.versionText}>Phiên bản: 1.0.0 (React Native)</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>✨ Sứ mệnh của chúng tôi</Text>
          <Text style={styles.sectionText}>
            DangKhai Fashion cam kết mang đến cho quý khách hàng những sản phẩm thời trang cao cấp, đa dạng kiểu dáng từ áo sơ mi, áo thun cotton, quần jeans đến giày sneaker, balo chống nước và túi xách thời trang với chất lượng vượt trội cùng giá thành hợp lý nhất.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📍 Địa chỉ cửa hàng</Text>
          <Text style={styles.sectionText}>
            Trụ sở chính: 24 Đường Nguyễn Văn Cừ, An Khánh, Ninh Kiều, Cần Thơ, Việt Nam.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📞 Hỗ trợ khách hàng</Text>
          <Text style={styles.sectionText}>
            Hotline: 0987.654.321{'\n'}
            Email: hotro@dangkhaifashion.com{'\n'}
            Giờ làm việc: 8:00 AM - 10:00 PM (Hàng ngày)
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  logoHighlight: {
    color: '#E91E63',
  },
  subtitleText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: 8,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});

export default AboutScreen;
