import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';

const Calculator3 = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [operation, setOperation] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');

  const parseNumbers = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if (isNaN(numA) || isNaN(numB)) {
      setResult('Vui lòng nhập đúng số!');
      return null;
    }

    return { numA, numB };
  };

  const handleCalculate = (op: string | null = operation) => {
    Keyboard.dismiss();
    const values = parseNumbers();
    if (!values || !op) {
      if (!op) {
        setResult('Vui lòng chọn phép toán!');
      }
      return;
    }

    const { numA, numB } = values;
    let output = '';

    switch (op) {
      case 'add':
        output = `Tổng: ${numA + numB}`;
        break;
      case 'subtract':
        output = `Hiệu: ${numA - numB}`;
        break;
      case 'multiply':
        output = `Tích: ${numA * numB}`;
        break;
      case 'divide':
        output = numB === 0 ? 'Không thể chia cho 0' : `Thương: ${numA / numB}`;
        break;
      case 'compare':
        output =
          numA > numB
            ? `Số lớn hơn là: ${numA}`
            : numA < numB
            ? `Số lớn hơn là: ${numB}`
            : 'Hai số bằng nhau';
        break;
      default:
        output = 'Phép toán không hợp lệ';
    }
    setResult(output);
  };

  const operations = [
    { label: 'Cộng', value: 'add' },
    { label: 'Trừ', value: 'subtract' },
    { label: 'Nhân', value: 'multiply' },
    { label: 'Chia', value: 'divide' },
    { label: 'So sánh', value: 'compare' },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Máy tính với Radio Buttons</Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập số a"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={a}
            onChangeText={setA}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập số b"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            value={b}
            onChangeText={setB}
          />

          <Text style={styles.label}>Chọn phép toán:</Text>
          <View style={styles.radioGroup}>
            {operations.map((op) => (
              <TouchableOpacity
                key={op.value}
                style={styles.radioItem}
                onPress={() => {
                  setOperation(op.value);
                  handleCalculate(op.value);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.radioCircle}>
                  {operation === op.value && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>{op.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.calcButton} onPress={() => handleCalculate()} activeOpacity={0.8}>
            <Text style={styles.calcButtonText}>Tính</Text>
          </TouchableOpacity>

          {result ? <Text style={styles.result}>{result}</Text> : null}
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Calculator3;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
    color: '#000',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  radioGroup: {
    marginTop: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#334155',
  },
  calcButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  calcButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    color: 'green',
    textAlign: 'center',
    fontWeight: '600',
  },
});
