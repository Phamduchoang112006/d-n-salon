import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ScrollView, Image } from 'react-native';
import { useAppContext } from './AppContext';
import { createOrder, getImageSource, fetchAllVouchers, fetchVoucherByCode, Voucher } from './database';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

type CheckoutScreenProps = NativeStackScreenProps<HomeStackParamList, 'Checkout'>;

const CheckoutScreen = ({ navigation }: CheckoutScreenProps) => {
  const { user, cart, clearCart } = useAppContext();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');

  // Shipping & Payment States
  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank' | 'Momo'>('COD');

  // Coupon States
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' }); // type: 'success' | 'error'
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = shippingMethod === 'Express' ? 50000 : 30000;

  // Load available vouchers from SQLite on mount
  useEffect(() => {
    const loadVouchers = async () => {
      const list = await fetchAllVouchers();
      setAvailableVouchers(list);
    };
    loadVouchers();
  }, []);

  // Recalculate discount if shipping method changes and applied coupon is FREESHIP
  useEffect(() => {
    if (appliedCoupon === 'FREESHIP') {
      const disc = Math.min(shippingFee, 30000);
      setDiscountAmount(disc);
    }
  }, [shippingMethod, appliedCoupon]);

  const applyVoucher = (v: Voucher) => {
    if (subtotal < v.minOrderAmount) {
      setCouponMsg({ text: `Đơn hàng tối thiểu phải từ ${v.minOrderAmount.toLocaleString()}đ`, type: 'error' });
      return;
    }

    let disc = 0;
    if (v.type === 'percent') {
      disc = Math.min(Math.round(subtotal * (v.value / 100)), v.maxDiscount);
    } else if (v.type === 'fixed') {
      disc = v.value;
    } else if (v.type === 'freeship') {
      disc = Math.min(shippingFee, v.value);
    }

    setDiscountAmount(disc);
    setAppliedCoupon(v.code);
    setCouponMsg({ text: `Áp dụng thành công! Giảm -${disc.toLocaleString()}đ`, type: 'success' });
  };

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (code === '') {
      setCouponMsg({ text: 'Vui lòng nhập mã giảm giá', type: 'error' });
      return;
    }

    const voucher = await fetchVoucherByCode(code);
    if (voucher) {
      applyVoucher(voucher);
    } else {
      setCouponMsg({ text: 'Mã giảm giá không tồn tại', type: 'error' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setCouponMsg({ text: '', type: '' });
  };

  const totalAmount = Math.max(0, subtotal + shippingFee - discountAmount);

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để tiến hành đặt hàng.', [
        { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginSqlite' as any) },
        { text: 'Hủy', style: 'cancel' },
      ]);
      return;
    }

    if (name.trim() === '' || phone.trim() === '' || address.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const success = await createOrder(user.id, totalAmount, orderItems, {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod,
      shippingMethod,
      shippingFee,
      discountAmount,
      note: note.trim(),
    });

    if (success) {
      Alert.alert('Thành công', 'Đơn hàng của bạn đã được đặt thành công!');
      clearCart();
      navigation.navigate('OrderHistory' as any);
    } else {
      Alert.alert('Lỗi', 'Đặt hàng thất bại. Vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>💳 Thanh Toán Đơn Hàng</Text>

        {/* 1. ĐƠN HÀNG CHI TIẾT */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>🛒 Danh sách sản phẩm ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Text>
          {cart.map((item) => (
            <View key={item.product.id} style={styles.productRow}>
              <Image source={getImageSource(item.product.img)} style={styles.productImg} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.product.name}</Text>
                <Text style={styles.productPrice}>{item.product.price.toLocaleString()}đ x {item.quantity}</Text>
              </View>
              <Text style={styles.productTotal}>{(item.product.price * item.quantity).toLocaleString()}đ</Text>
            </View>
          ))}
        </View>

        {/* 2. THÔNG TIN GIAO HÀNG */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>📍 Thông tin giao hàng</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Tên người nhận <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên người nhận"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Số điện thoại <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <Text style={styles.label}>Địa chỉ nhận hàng <Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nhập địa chỉ giao hàng chi tiết"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Ghi chú giao hàng</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              placeholder="Ví dụ: Giao giờ hành chính, gọi điện trước khi đến"
              placeholderTextColor="#94a3b8"
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        {/* 3. PHƯƠNG THỨC VẬN CHUYỂN */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>🚚 Phương thức vận chuyển</Text>
          <View style={styles.rowSelectors}>
            <TouchableOpacity
              style={[styles.selectorCard, shippingMethod === 'Standard' && styles.selectorActive]}
              onPress={() => setShippingMethod('Standard')}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorIcon, shippingMethod === 'Standard' && styles.selectorActiveText]}>📦</Text>
              <Text style={[styles.selectorName, shippingMethod === 'Standard' && styles.selectorActiveText]}>Tiêu chuẩn</Text>
              <Text style={styles.selectorDetail}>3 - 5 ngày</Text>
              <Text style={styles.selectorPrice}>30.000đ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectorCard, shippingMethod === 'Express' && styles.selectorActive]}
              onPress={() => setShippingMethod('Express')}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorIcon, shippingMethod === 'Express' && styles.selectorActiveText]}>⚡</Text>
              <Text style={[styles.selectorName, shippingMethod === 'Express' && styles.selectorActiveText]}>Hỏa tốc</Text>
              <Text style={styles.selectorDetail}>2 giờ nhận</Text>
              <Text style={styles.selectorPrice}>50.000đ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 4. MÃ GIẢM GIÁ */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>🎟️ Mã giảm giá / Voucher</Text>
          {!appliedCoupon ? (
            <View style={styles.couponInputRow}>
              <TextInput
                style={styles.couponInput}
                placeholder="Nhập mã giảm giá..."
                placeholderTextColor="#94a3b8"
                autoCapitalize="characters"
                value={couponCode}
                onChangeText={setCouponCode}
              />
              <TouchableOpacity style={styles.couponBtn} onPress={handleApplyCoupon} activeOpacity={0.8}>
                <Text style={styles.couponBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.appliedCouponRow}>
              <View style={styles.couponBadge}>
                <Text style={styles.couponBadgeText}>🎟️ {appliedCoupon}</Text>
              </View>
              <TouchableOpacity style={styles.removeCouponBtn} onPress={handleRemoveCoupon} activeOpacity={0.8}>
                <Text style={styles.removeCouponText}>Gỡ bỏ</Text>
              </TouchableOpacity>
            </View>
          )}
          {couponMsg.text !== '' && (
            <Text style={[styles.couponMsg, couponMsg.type === 'success' ? styles.msgSuccess : styles.msgError]}>
              {couponMsg.text}
            </Text>
          )}

          {/* HIỂN THỊ DANH SÁCH VOUCHER CÓ SẴN TỪ DATABASE */}
          {availableVouchers.length > 0 && (
            <View style={styles.voucherListContainer}>
              <Text style={styles.voucherListLabel}>Voucher có sẵn từ hệ thống:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.voucherScroll}>
                {availableVouchers.map((v) => {
                  const isMinMet = subtotal >= v.minOrderAmount;
                  const isCurrentlyApplied = appliedCoupon === v.code;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[
                        styles.voucherCard,
                        isCurrentlyApplied && styles.voucherCardApplied,
                        !isMinMet && styles.voucherCardDisabled
                      ]}
                      onPress={() => {
                        if (isCurrentlyApplied) return;
                        if (isMinMet) {
                          setCouponCode(v.code);
                          applyVoucher(v);
                        } else {
                          Alert.alert('Không đủ điều kiện', `Mã này chỉ áp dụng cho đơn hàng từ ${v.minOrderAmount.toLocaleString()}đ trở lên.`);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.voucherCodeText, isCurrentlyApplied && styles.voucherTextApplied]}>{v.code}</Text>
                      <Text style={styles.voucherDescText}>{v.description}</Text>
                      <View style={[styles.voucherTag, isCurrentlyApplied && styles.voucherTagApplied]}>
                        <Text style={[styles.voucherTagText, isCurrentlyApplied && styles.voucherTagTextApplied]}>
                          {isCurrentlyApplied ? 'Đang áp dụng' : isMinMet ? 'Dùng ngay' : `Đơn từ ${Math.round(v.minOrderAmount / 1000)}k`}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        {/* 5. PHƯƠNG THỨC THANH TOÁN */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>💳 Phương thức thanh toán</Text>
          <View style={styles.rowSelectors}>
            <TouchableOpacity
              style={[styles.selectorCard, paymentMethod === 'COD' && styles.selectorActive]}
              onPress={() => setPaymentMethod('COD')}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorIcon, paymentMethod === 'COD' && styles.selectorActiveText]}>💵</Text>
              <Text style={[styles.selectorName, paymentMethod === 'COD' && styles.selectorActiveText]}>COD</Text>
              <Text style={styles.selectorDetail}>Khi nhận hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectorCard, paymentMethod === 'Bank' && styles.selectorActive]}
              onPress={() => setPaymentMethod('Bank')}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorIcon, paymentMethod === 'Bank' && styles.selectorActiveText]}>🏦</Text>
              <Text style={[styles.selectorName, paymentMethod === 'Bank' && styles.selectorActiveText]}>Chuyển khoản</Text>
              <Text style={styles.selectorDetail}>Ngân hàng</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.selectorCard, paymentMethod === 'Momo' && styles.selectorActive]}
              onPress={() => setPaymentMethod('Momo')}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectorIcon, paymentMethod === 'Momo' && styles.selectorActiveText]}>🔴</Text>
              <Text style={[styles.selectorName, paymentMethod === 'Momo' && styles.selectorActiveText]}>Ví MoMo</Text>
              <Text style={styles.selectorDetail}>Ví điện tử</Text>
            </TouchableOpacity>
          </View>

          {/* HƯỚNG DẪN THANH TOÁN KHI CHỌN CK/MOMO */}
          {paymentMethod === 'Bank' && (
            <View style={styles.paymentGuide}>
              <Text style={styles.guideTitle}>🏦 HƯỚNG DẪN THANH TOÁN CHUYỂN KHOẢN</Text>
              <Text style={styles.guideText}>Ngân hàng: <Text style={styles.bold}>MB Bank</Text></Text>
              <Text style={styles.guideText}>Số tài khoản: <Text style={styles.bold}>0987654321</Text></Text>
              <Text style={styles.guideText}>Chủ tài khoản: <Text style={styles.bold}>NGUYEN DANG KHAI</Text></Text>
              <Text style={styles.guideText}>Số tiền: <Text style={[styles.bold, { color: '#2563eb' }]}>{totalAmount.toLocaleString()}đ</Text></Text>
              <Text style={styles.guideText}>Nội dung CK: <Text style={styles.bold}>THANHTOAN #{user?.id || 'DH'}</Text></Text>
              <Text style={styles.guideNote}>⚠️ Vui lòng thực hiện chuyển khoản đúng thông tin trước khi nhấn Xác nhận đặt hàng.</Text>
            </View>
          )}
 
          {paymentMethod === 'Momo' && (
            <View style={styles.paymentGuide}>
              <Text style={styles.guideTitle}>🔴 HƯỚNG DẪN THANH TOÁN MOMO</Text>
              <Text style={styles.guideText}>Số điện thoại: <Text style={styles.bold}>0987654321</Text></Text>
              <Text style={styles.guideText}>Chủ ví Momo: <Text style={styles.bold}>NGUYEN DANG KHAI</Text></Text>
              <Text style={styles.guideText}>Số tiền: <Text style={[styles.bold, { color: '#E91E63' }]}>{totalAmount.toLocaleString()}đ</Text></Text>
              <Text style={styles.guideText}>Nội dung CK: <Text style={styles.bold}>THANHTOAN #{user?.id || 'DH'}</Text></Text>
              <Text style={styles.guideNote}>⚠️ Mở ứng dụng MoMo, chuyển tiền đúng số điện thoại và số tiền hiển thị ở trên.</Text>
            </View>
          )}
        </View>

        {/* 6. CHI TIẾT THANH TOÁN */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>🧾 Chi tiết thanh toán</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tạm tính (tiền hàng)</Text>
            <Text style={styles.priceValue}>{subtotal.toLocaleString()}đ</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí vận chuyển ({shippingMethod === 'Express' ? 'Hỏa tốc' : 'Tiêu chuẩn'})</Text>
            <Text style={styles.priceValue}>+{shippingFee.toLocaleString()}đ</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: '#10b981' }]}>Giảm giá (Voucher)</Text>
              <Text style={[styles.priceValue, { color: '#10b981' }]}>-{discountAmount.toLocaleString()}đ</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={[styles.priceRow, { marginTop: 8 }]}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
          </View>
        </View>

        {/* NÚT THAO TÁC */}
        <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder} activeOpacity={0.8}>
          <Text style={styles.orderBtnText}>Xác nhận đặt hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại giỏ hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
    paddingLeft: 8,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  productImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  productPrice: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  productTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  form: {
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    color: '#0f172a',
    fontSize: 14,
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  rowSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectorCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectorActive: {
    borderColor: '#E91E63',
    backgroundColor: '#fdf2f8',
  },
  selectorIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  selectorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  selectorActiveText: {
    color: '#E91E63',
  },
  selectorDetail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  selectorPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginTop: 4,
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  couponInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#0f172a',
    fontSize: 14,
    backgroundColor: '#f8fafc',
  },
  couponBtn: {
    backgroundColor: '#0f172a',
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  couponBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  appliedCouponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  couponBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  couponBadgeText: {
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 13,
  },
  removeCouponBtn: {
    padding: 6,
  },
  removeCouponText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 13,
  },
  couponMsg: {
    fontSize: 12,
    marginTop: -4,
    marginBottom: 10,
    fontWeight: '500',
  },
  msgSuccess: {
    color: '#16a34a',
  },
  msgError: {
    color: '#ef4444',
  },
  voucherListContainer: {
    marginTop: 8,
  },
  voucherListLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  voucherScroll: {
    paddingVertical: 4,
  },
  voucherCard: {
    width: 140,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  voucherCardApplied: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  voucherCardDisabled: {
    backgroundColor: '#f1f5f9',
    opacity: 0.6,
  },
  voucherCodeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  voucherTextApplied: {
    color: '#10b981',
  },
  voucherDescText: {
    fontSize: 10,
    color: '#64748b',
    marginVertical: 4,
    height: 28,
  },
  voucherTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  voucherTagApplied: {
    backgroundColor: '#dcfce7',
  },
  voucherTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3b82f6',
  },
  voucherTagTextApplied: {
    color: '#10b981',
  },
  paymentGuide: {
    marginTop: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  guideText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
    color: '#0f172a',
  },
  guideNote: {
    fontSize: 11,
    color: '#b45309',
    marginTop: 6,
    lineHeight: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },
  orderBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  orderBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  backBtnText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CheckoutScreen;
