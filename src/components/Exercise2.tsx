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

type Operation = 'add' | 'sub' | 'mul' | 'div' | 'compare';

interface RadioOption {
  value: Operation;
  label: string;
  symbol: string;
}

const Exercise2 = () => {
  const [numA, setNumA] = useState<string>('');
  const [numB, setNumB] = useState<string>('');
  const [selectedOp, setSelectedOp] = useState<Operation>('add');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const radioOptions: RadioOption[] = [
    { value: 'add', label: 'Cộng', symbol: '+' },
    { value: 'sub', label: 'Trừ', symbol: '-' },
    { value: 'mul', label: 'Nhân', symbol: '×' },
    { value: 'div', label: 'Chia', symbol: '÷' },
    { value: 'compare', label: 'So sánh', symbol: 'a & b' },
  ];

  const handleCalculate = (op: Operation = selectedOp) => {
    Keyboard.dismiss();
    setError('');
    setResult('');

    const a = parseFloat(numA);
    const b = parseFloat(numB);

    if (numA.trim() === '' || numB.trim() === '') {
      setError('Vui lòng nhập đầy đủ cả hai số a và b!');
      return;
    }

    if (isNaN(a) || isNaN(b)) {
      setError('Giá trị nhập vào phải là số hợp lệ!');
      return;
    }

    switch (op) {
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
              placeholder="Ví dụ: 12"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={numA}
              onChangeText={(text) => {
                setNumA(text);
                setResult('');
                setError('');
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số b</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 4"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={numB}
              onChangeText={(text) => {
                setNumB(text);
                setResult('');
                setError('');
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chọn phép tính (Dạng Radio)</Text>

          <View style={styles.radioGroup}>
            {radioOptions.map((option) => {
              const isSelected = selectedOp === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.radioItem,
                    isSelected && styles.radioItemActive,
                  ]}
                  onPress={() => {
                    setSelectedOp(option.value);
                    handleCalculate(option.value);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.radioButton,
                    isSelected && styles.radioButtonActive,
                  ]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>

                  <View style={styles.radioTextContainer}>
                    <Text style={[
                      styles.radioLabel,
                      isSelected && styles.radioLabelActive,
                    ]}>
                      {option.label}
                    </Text>
                    <Text style={styles.radioSymbol}>
                      ({option.symbol})
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.calculateBtn}
          onPress={() => handleCalculate()}
          activeOpacity={0.8}
        >
          <Text style={styles.calculateBtnText}>TÍNH KẾT QUẢ</Text>
        </TouchableOpacity>

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

export default Exercise2;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  radioGroup: {
    gap: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  radioItemActive: {
    borderColor: '#6366f1',
    backgroundColor: '#f5f3ff',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioButtonActive: {
    borderColor: '#6366f1',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  radioTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginRight: 6,
  },
  radioLabelActive: {
    color: '#4f46e5',
  },
  radioSymbol: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
  },
  calculateBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
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
