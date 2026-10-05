import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

type CategoriesScreenProps = NativeStackScreenProps<HomeStackParamList, 'Categories'>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.backArrowText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh Mục Sản Phẩm</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.titleText}>Khám phá phong cách của bạn</Text>
        <Text style={styles.subtitleText}>Bộ sưu tập đa dạng phù hợp với mọi nhu cầu thời trang.</Text>

        <View style={styles.listContainer}>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Fashion')} activeOpacity={0.85}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>👗</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>Thời trang Nam & Nữ</Text>
              <Text style={styles.itemDesc}>Quần áo sơ mi, jeans, áo thun cotton, áo khoác thể thao...</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Accessory')} activeOpacity={0.85}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>🎒</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>Phụ kiện thời trang</Text>
              <Text style={styles.itemDesc}>Balo laptop, balo du lịch chống nước, túi đeo chéo, mũ lưỡi trai...</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={[styles.item, styles.adminItem]} onPress={() => navigation.navigate('AdminDashboard')} activeOpacity={0.85}>
            <View style={[styles.itemIconContainer, styles.adminIconContainer]}>
              <Text style={styles.itemIcon}>⚙️</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemTitle, styles.adminItemText]}>Bảng Điều Khiển Admin</Text>
              <Text style={styles.adminItemDesc}>Quản lý sản phẩm, đơn hàng, người dùng và mã giảm giá.</Text>
            </View>
          </TouchableOpacity>
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
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
    fontWeight: '500',
  },
  listContainer: {
    width: '100%',
    marginBottom: 30,
    gap: 16,
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fdf2f8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    lineHeight: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  adminItem: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  adminIconContainer: {
    backgroundColor: '#ffe4e6',
  },
  adminItemText: {
    color: '#be123c',
  },
  adminItemDesc: {
    fontSize: 12,
    color: '#9f1239',
    marginTop: 4,
    lineHeight: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
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

export default CategoriesScreen;
