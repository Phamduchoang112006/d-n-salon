import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

interface LightControlProps {
  isLightOn: boolean;
  brightness: number;
  onToggleLight: () => void;
  onIncreaseBrightness: () => void;
  onDecreaseBrightness: () => void;
}

const LightControl: React.FC<LightControlProps> = ({
  isLightOn,
  brightness,
  onToggleLight,
  onIncreaseBrightness,
  onDecreaseBrightness,
}) => {
  // Relative path to assets in the project root
  const bulbOn = require('../assets/bulb_on.png');
  const bulbOff = require('../assets/bulb_off.png');

  // Dynamic styling for the glowing effect of the bulb based on brightness
  const glowOpacity = isLightOn ? brightness / 100 : 0;
  const bulbScale = isLightOn ? 1 + (brightness / 200) * 0.15 : 1; // subtle pulse with brightness

  return (
    <View style={styles.container}>
      <Text style={styles.title}>===== COMPONENT CON =====</Text>

      {/* Light Bulb Container with dynamic shadow/glow */}
      <View style={styles.imageWrapper}>
        {isLightOn && (
          <View
            style={[
              styles.glowEffect,
              {
                opacity: glowOpacity,
                transform: [{ scale: bulbScale }],
              },
            ]}
          />
        )}
        <Image
          source={isLightOn ? bulbOn : bulbOff}
          style={[
            styles.image,
            isLightOn && { transform: [{ scale: bulbScale }] },
          ]}
        />
      </View>

      {/* Info Box showing received props */}
      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Trạng thái nhận được:</Text>
          <Text
            style={[
              styles.statusValue,
              isLightOn ? styles.statusOn : styles.statusOff,
            ]}
          >
            {isLightOn ? 'BẬT' : 'TẮT'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Độ sáng nhận được:</Text>
          <Text
            style={[
              styles.brightnessValue,
              isLightOn ? styles.brightnessOn : styles.brightnessOff,
            ]}
          >
            {brightness}%
          </Text>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.button,
            styles.toggleButton,
            isLightOn ? styles.buttonActive : styles.buttonInactive,
          ]}
          onPress={onToggleLight}
        >
          <Text style={styles.buttonText}>
            {isLightOn ? 'TẮT ĐÈN' : 'BẬT ĐÈN'}
          </Text>
        </TouchableOpacity>

        <View style={styles.adjustRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isLightOn || brightness <= 0}
            style={[
              styles.button,
              styles.adjustButton,
              (!isLightOn || brightness <= 0) && styles.buttonDisabled,
            ]}
            onPress={onDecreaseBrightness}
          >
            <Text style={styles.buttonText}>Giảm Độ Sáng (-10)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isLightOn || brightness >= 100}
            style={[
              styles.button,
              styles.adjustButton,
              (!isLightOn || brightness >= 100) && styles.buttonDisabled,
            ]}
            onPress={onIncreaseBrightness}
          >
            <Text style={styles.buttonText}>Tăng Độ Sáng (+10)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b', // Deep dark blue-gray card
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 24,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    color: '#94a3b8', // subtle text color for component demarcations
    letterSpacing: 2,
    marginBottom: 24,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 24,
  },
  glowEffect: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 235, 59, 0.45)',
    shadowColor: '#ffeb3b',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 25,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  infoBox: {
    backgroundColor: '#0f172a', // Ultra dark background for telemetry
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusOn: {
    color: '#00e676',
  },
  statusOff: {
    color: '#ff1744',
  },
  brightnessValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  brightnessOn: {
    color: '#ffeb3b',
  },
  brightnessOff: {
    color: '#b0bec5',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    marginBottom: 14,
  },
  buttonActive: {
    backgroundColor: '#ef4444', // Red for "Tắt đèn" when active
  },
  buttonInactive: {
    backgroundColor: '#10b981', // Green for "Bật đèn" when inactive
  },
  adjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  adjustButton: {
    flex: 1,
    backgroundColor: '#3b82f6', // Vivid blue for adjustment
  },
  buttonDisabled: {
    backgroundColor: '#475569',
    opacity: 0.5,
    elevation: 0,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default LightControl;
