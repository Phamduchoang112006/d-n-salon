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
  // Ảnh minh hoạ bóng đèn
  const lightBulbOn = 'https://cdn-icons-png.flaticon.com/512/702/702797.png';
  const lightBulbOff = 'https://cdn-icons-png.flaticon.com/512/702/702814.png';

  // Opacity thay đổi nhẹ theo độ sáng khi đèn bật để tăng tính minh hoạ
  const bulbOpacity = isLightOn ? Math.max(0.2, brightness / 100) : 1;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>===== COMPONENT CON =====</Text>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: isLightOn ? lightBulbOn : lightBulbOff }}
          style={[styles.image, { opacity: bulbOpacity }]}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.text}>
          Trạng thái nhận được:{' '}
          <Text style={[styles.statusText, { color: isLightOn ? 'green' : 'red' }]}>
            {isLightOn ? 'BẬT' : 'TẮT'}
          </Text>
        </Text>
        <Text style={styles.text}>Độ sáng nhận được: {brightness}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onToggleLight}>
          <Text style={styles.buttonText}>{isLightOn ? 'Tắt Đèn' : 'Bật Đèn'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!isLightOn || brightness >= 100) && styles.buttonDisabled]}
          onPress={onIncreaseBrightness}
          disabled={!isLightOn || brightness >= 100}
        >
          <Text style={styles.buttonText}>Tăng độ sáng (+10)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, (!isLightOn || brightness <= 0) && styles.buttonDisabled]}
          onPress={onDecreaseBrightness}
          disabled={!isLightOn || brightness <= 0}
        >
          <Text style={styles.buttonText}>Giảm độ sáng (-10)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fffbe6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#faad14',
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#d48806',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  infoBox: {
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  statusText: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    backgroundColor: '#1890ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#d9d9d9',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LightControl;