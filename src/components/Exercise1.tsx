import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';

const Exercise1 = () => {
  const [numA, setNumA] = useState<string>('');
  const [numB, setNumB] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeOp, setActiveOp] = useState<string>('');

  const getNumbers = (): { a: number; b: number; isValid: boolean } => {
    setError('');
    const a = parseFloat(numA);
    const b = parseFloat(numB);

    if (numA.trim() === '' || numB.trim() === '') {
      setError('Vui lòng nhập đầy đủ cả hai số a và b!');
      setResult('');
      return { a: 0, b: 0, isValid: false };
    }

    if (isNaN(a) || isNaN(b)) {
      setError('Giá trị nhập vào phải là số hợp lệ!');
      setResult('');
      return { a: 0, b: 0, isValid: false };
    }

    return { a, b, isValid: true };
  };

  const handleCalculate = (operation: 'add' | 'sub' | 'mul' | 'div' | 'compare') => {
    Keyboard.dismiss();
    const { a, b, isValid } = getNumbers();
    if (!isValid) {return;}

    setActiveOp(operation);
    switch (operation) {
      case 'add':
        setResult(`Tổng: ${a} + ${b} = ${parseFloat((a + b).toFixed(10))}`);
        break;
      case 'sub':
        setResult(`Hiệu: ${a} - ${b} = ${parseFloat((a - b).toFixed(10))}`);
        break;
      case 'mul':
        setResult(`Tích: ${a} × ${b} = ${parseFloat((a * b).toFixed(10))}`);
        break;
      case 'div':
        if (b === 0) {
          setError('Lỗi: Không thể chia cho số 0!');
          setResult('');
        } else {
          setResult(`Thương: ${a} ÷ ${b} = ${parseFloat((a / b).toFixed(10))}`);
        }
        break;
      case 'compare':
        if (a > b) {
          setResult(`So sánh: ${a} lớn hơn ${b} (${a} > ${b})`);
        } else if (a < b) {
          setResult(`So sánh: ${a} nhỏ hơn ${b} (${a} < ${b})`);
        } else {
          setResult(`So sánh: ${a} bằng ${b} (${a} = ${b})`);
        }
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Nhập dữ liệu</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số a</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 10"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={numA}
              onChangeText={(text) => {
                setNumA(text);
                setResult('');
                setError('');
                setActiveOp('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số b</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 5"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={numB}
              onChangeText={(text) => {
                setNumB(text);
                setResult('');
                setError('');
                setActiveOp('');
              }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Chọn phép tính (Dạng Button)</Text>

        <View style={styles.buttonGrid}>
          <TouchableOpacity
            style={[styles.calcButton, activeOp === 'add' && styles.activeButton]}
            onPress={() => handleCalculate('add')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, activeOp === 'add' && styles.activeButtonText]}>Cộng (+)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calcButton, activeOp === 'sub' && styles.activeButton]}
            onPress={() => handleCalculate('sub')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, activeOp === 'sub' && styles.activeButtonText]}>Trừ (-)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calcButton, activeOp === 'mul' && styles.activeButton]}
            onPress={() => handleCalculate('mul')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, activeOp === 'mul' && styles.activeButtonText]}>Nhân (×)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calcButton, activeOp === 'div' && styles.activeButton]}
            onPress={() => handleCalculate('div')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, activeOp === 'div' && styles.activeButtonText]}>Chia (÷)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.calcButton, styles.fullWidthButton, activeOp === 'compare' && styles.activeButton]}
            onPress={() => handleCalculate('compare')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, activeOp === 'compare' && styles.activeButtonText]}>So sánh (a & b)</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {result ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Kết Quả</Text>
            <Text style={styles.resultContent}>{result}</Text>
          </View>
        ) : null}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Exercise1;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
    paddingLeft: 4,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  calcButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    width: '48%',
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 4,
  },
  activeButton: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  activeButtonText: {
    color: '#ffffff',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803d',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  resultContent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#166534',
    lineHeight: 26,
  },
});
