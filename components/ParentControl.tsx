import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import LightControl from './LightControl';

const ParentControl = () => {
  // Trạng thái đèn: Bật (true) / Tắt (false)
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  // Độ sáng của đèn: từ 0 -> 100
  const [brightness, setBrightness] = useState<number>(100);

  // Hàm Callback: Bật / Tắt đèn
  const handleToggleLight = () => {
    setIsLightOn((prev) => !prev);
  };

  // Hàm Callback: Tăng độ sáng (tối đa 100, mỗi lần +10, chỉ khi đèn bật)
  const handleIncreaseBrightness = () => {
    if (isLightOn) {
      setBrightness((prev) => {
        const newValue = prev + 10;
        return newValue > 100 ? 100 : newValue;
      });
    }
  };

  // Hàm Callback: Giảm độ sáng (tối thiểu 0, mỗi lần -10, chỉ khi đèn bật)
  const handleDecreaseBrightness = () => {
    if (isLightOn) {
      setBrightness((prev) => {
        const newValue = prev - 10;
        return newValue < 0 ? 0 : newValue;
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* HEADER CỦA TOÀN BỘ ỨNG DỤNG */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hệ Thống Điều Khiển Đèn Thông Minh</Text>
          <Text style={styles.headerSubtitle}>Smart Home IoT Dashboard</Text>
        </View>

        {/* COMPONENT CHA AREA */}
        <View style={styles.parentBox}>
          <Text style={styles.title}>===== COMPONENT CHA =====</Text>

          <View style={styles.telemetryContainer}>
            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>Trạng Thái Đèn</Text>
              <Text style={[
                styles.telemetryValue,
                isLightOn ? styles.statusOn : styles.statusOff,
              ]}>
                {isLightOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
              </Text>
            </View>

            <View style={styles.telemetryCard}>
              <Text style={styles.telemetryLabel}>Độ Sáng Hiện Tại</Text>
              <Text style={[
                styles.telemetryValue,
                styles.brightnessColor,
                !isLightOn && styles.brightnessOff,
              ]}>
                {brightness}%
              </Text>
            </View>
          </View>
        </View>

        {/* COMPONENT CON AREA */}
        <LightControl
          isLightOn={isLightOn}
          brightness={brightness}
          onToggleLight={handleToggleLight}
          onIncreaseBrightness={handleIncreaseBrightness}
          onDecreaseBrightness={handleDecreaseBrightness}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a', // Premium deep slate dark theme background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  parentBox: {
    backgroundColor: '#1e293b', // Deep slate gray card
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: '#94a3b8', // subtle label matching child component styling
    letterSpacing: 2,
    marginBottom: 20,
  },
  telemetryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  telemetryCard: {
    flex: 1,
    backgroundColor: '#0f172a', // Darker well inside card
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  telemetryLabel: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  telemetryValue: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusOn: {
    color: '#00e676',
  },
  statusOff: {
    color: '#ff1744',
  },
  brightnessColor: {
    color: '#ffeb3b', // Bright yellow for active brightness status
  },
  brightnessOff: {
    color: '#64748b',
  },
});

export default ParentControl;
