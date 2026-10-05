import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useAppContext } from './AppContext';
import { fetchOrdersByUser, fetchOrderItems, Order, OrderItem, getImageSource } from './database';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';

type OrderHistoryScreenProps = NativeStackScreenProps<HomeStackParamList, 'OrderHistory'>;

const OrderHistoryScreen = ({ navigation }: OrderHistoryScreenProps) => {
  const { user } = useAppContext();
  const isFocused = useIsFocused();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderItemsMap, setOrderItemsMap] = useState<{ [key: number]: OrderItem[] }>({});

  useEffect(() => {
    if (isFocused && user) {
      loadOrders();
    }
  }, [isFocused, user]);

  const loadOrders = async () => {
    setLoading(true);
    if (user) {
      const list = await fetchOrdersByUser(user.id);
      setOrders(list);
    }
    setLoading(false);
  };

  const toggleExpandOrder = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);
    if (!orderItemsMap[orderId]) {
      const items = await fetchOrderItems(orderId);
      setOrderItemsMap((prev) => ({ ...prev, [orderId]: items }));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b'; // Amber
      case 'Processing':
        return '#3b82f6'; // Blue
      case 'Shipping':
        return '#8b5cf6'; // Purple
      case 'Completed':
        return '#10b981'; // Green
      case 'Cancelled':
        return '#ef4444'; // Red
      default:
        return '#64748b';
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xác nhận';
      case 'Processing':
        return 'Đang chuẩn bị';
      case 'Shipping':
        return 'Đang giao hàng';
      case 'Completed':
        return 'Đã hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderId === item.id;
    const items = orderItemsMap[item.id] || [];

    return (
      <View style={styles.card}>
        <TouchableOpacity style={styles.cardHeader} onPress={() => toggleExpandOrder(item.id)} activeOpacity={0.7}>
          <View>
            <Text style={styles.orderId}>Mã đơn hàng: #{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
              {translateStatus(item.status)}
            </Text>
            <Text style={styles.totalPrice}>{item.totalAmount.toLocaleString()}đ</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.divider} />
            <Text style={styles.detailsTitle}>Thông tin người nhận</Text>
            <Text style={styles.detailsText}>👤 Tên: {item.recipientName}</Text>
            <Text style={styles.detailsText}>📞 SĐT: {item.recipientPhone}</Text>
            <Text style={styles.detailsText}>📍 Địa chỉ: {item.shippingAddress}</Text>

            <View style={styles.divider} />
            <Text style={styles.detailsTitle}>Chi tiết vận chuyển & Thanh toán</Text>
            <Text style={styles.detailsText}>🚚 Vận chuyển: {item.shippingMethod === 'Express' ? '⚡ Hỏa tốc (2 giờ)' : '📦 Tiêu chuẩn (3-5 ngày)'}</Text>
            <Text style={styles.detailsText}>💵 Phí vận chuyển: {item.shippingFee ? `${item.shippingFee.toLocaleString()}đ` : '0đ'}</Text>
            {item.discountAmount ? (
              <Text style={styles.detailsText}>🎟️ Giảm giá (Voucher): -{item.discountAmount.toLocaleString()}đ</Text>
            ) : null}
            <Text style={styles.detailsText}>💳 Thanh toán: {
              item.paymentMethod === 'Bank' ? '🏦 Chuyển khoản ngân hàng' :
              item.paymentMethod === 'Momo' ? '🔴 Ví MoMo' : '💵 Khi nhận hàng (COD)'
            }</Text>
            {item.note ? (
              <Text style={styles.detailsText}>📝 Ghi chú: {item.note}</Text>
            ) : null}

            <View style={styles.divider} />
            <Text style={styles.detailsTitle}>Sản phẩm đặt mua</Text>
            {items.length === 0 ? (
              <ActivityIndicator size="small" color="#0f172a" style={{ marginVertical: 10 }} />
            ) : (
              items.map((prod) => (
                <View key={prod.id} style={styles.productRow}>
                  <Image source={getImageSource(prod.productImg || '')} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{prod.productName}</Text>
                    <Text style={styles.productPrice}>
                      {prod.quantity} x {prod.price.toLocaleString()}đ
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>{(prod.quantity * prod.price).toLocaleString()}đ</Text>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📜 Lịch Sử Mua Hàng</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0f172a" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa đặt đơn hàng nào.</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginVertical: 15,
  },
  list: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  orderDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  statusTag: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
    overflow: 'hidden',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  divider: {
    height: 1,
    backgroundColor: '#cbd5e1',
    marginVertical: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 6,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  productPrice: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E91E63',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  shopBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default OrderHistoryScreen;
