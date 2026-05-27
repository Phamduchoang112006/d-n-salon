import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import LightControl from './LightControl';

const ParentControl = () => {
  const [isLightOn, setIsLightOn] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(100);

  const handleToggleLight = () => {
    setIsLightOn((prev) => !prev);
  };

  const handleIncreaseBrightness = () => {
    if (isLightOn && brightness < 100) {
      setBrightness((prev) => Math.min(prev + 10, 100));
    }
  };

  const handleDecreaseBrightness = () => {
    if (isLightOn && brightness > 0) {
      setBrightness((prev) => Math.max(prev - 10, 0));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.parentBox}>
        <Text style={styles.title}>===== COMPONENT CHA =====</Text>
        <View style={styles.infoBox}>
          <Text style={styles.text}>
            Trạng thái đèn:{' '}
            <Text style={[styles.statusText, { color: isLightOn ? 'green' : 'red' }]}>
              {isLightOn ? 'BẬT' : 'TẮT'}
            </Text>
          </Text>
          <Text style={styles.text}>Độ sáng hiện tại: {brightness}</Text>
        </View>
      </View>

      <LightControl
        isLightOn={isLightOn}
        brightness={brightness}
        onToggleLight={handleToggleLight}
        onIncreaseBrightness={handleIncreaseBrightness}
        onDecreaseBrightness={handleDecreaseBrightness}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  parentBox: {
    backgroundColor: '#e6f7ff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#91d5ff',
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0050b3',
  },
  infoBox: {
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontWeight: 'bold',
  },
});

export default ParentControl;