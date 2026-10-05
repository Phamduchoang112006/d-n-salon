import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import React, { useState } from 'react';

// Component Con (Child)
interface ChildProps {
  nameFromParent: string;
  ageFromParent: string;
  onUpdateParent: (newName: string, newAge: string) => void;
}

const ChildComponent: React.FC<ChildProps> = ({ nameFromParent, ageFromParent, onUpdateParent }) => {
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  const handleUpdate = () => {
    // Call parent handler to update states
    onUpdateParent(newName, newAge);

    // Print output to the Node terminal window
    console.log('--- TRUYỀN DỮ LIỆU TỪ CON LÊN CHA ---');
    console.log('Tên mới gửi lên:', newName);
    console.log('Tuổi mới gửi lên:', newAge);
    console.log('------------------------------------');
  };

  return (
    <View style={styles.childBox}>
      <Text style={styles.childTitle}>Con:</Text>

      {/* Display received data */}
      <View style={styles.receivedDisplay}>
        <Text style={styles.receivedText}>
          Name nhận từ cha: <Text style={styles.highlightText}>{nameFromParent}</Text>
        </Text>
      </View>

      <View style={styles.receivedDisplay}>
        <Text style={styles.receivedText}>
          Age nhận từ cha: <Text style={styles.highlightText}>{ageFromParent}</Text>
        </Text>
      </View>

      {/* Input new values for parent */}
      <TextInput
        style={styles.textInput}
        placeholder="Nhập tên mới cho cha"
        placeholderTextColor="#aaaaaa"
        value={newName}
        onChangeText={setNewName}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Nhập tuổi mới cho cha"
        placeholderTextColor="#aaaaaa"
        value={newAge}
        onChangeText={setNewAge}
        keyboardType="numeric"
      />

      {/* Update Button */}
      <TouchableOpacity style={styles.containerButton} onPress={handleUpdate}>
        <Text style={styles.button}>Truyền dữ liệu lên cha</Text>
      </TouchableOpacity>
    </View>
  );
};

// Component Cha (Parent)
const HelloState = () => {
  const [name, setName] = useState('khai');
  const [age, setAge] = useState('20');

  const handlePrint = () => {
    // Print output to the Node terminal window (Metro server)
    console.log('--- KẾT QUẢ IN ---');
    console.log('Tên:', name);
    console.log('Tuổi:', age);
    console.log('------------------');
  };

  const handleUpdateFromChild = (newName: string, newAge: string) => {
    if (newName.trim() !== '') {
      setName(newName);
    }
    if (newAge.trim() !== '') {
      setAge(newAge);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* Parent Title */}
          <View style={styles.containerText}>
            <Text style={styles.helloText}>Cha</Text>
          </View>

          {/* Parent Inputs */}
          <View style={styles.containerInput}>
            <TextInput
              style={styles.textInput}
              placeholder="nhập tên của bạn"
              placeholderTextColor="#aaaaaa"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.textInput}
              placeholder="nhập tuổi của bạn"
              placeholderTextColor="#aaaaaa"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* Print button */}
          <TouchableOpacity style={styles.containerButton} onPress={handlePrint}>
            <Text style={styles.button}>in kết quả</Text>
          </TouchableOpacity>

          {/* Child component */}
          <ChildComponent
            nameFromParent={name}
            ageFromParent={age}
            onUpdateParent={handleUpdateFromChild}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelloState;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  containerText: {
    alignItems: 'center',
    marginBottom: 10,
  },
  containerInput: {
    marginBottom: 15,
  },
  helloText: {
    color: '#9c27b0', // Purple/blue tone for "Cha" title
    fontSize: 40,
    fontWeight: 'bold',
  },
  textInput: {
    color: '#079cf9', // Blue color for input text from user code
    fontSize: 30,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#f305e3', // Pink border from user code
    marginTop: 10,
    width: 360,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
  },
  containerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18bfe0', // Cyan background color from user code
    width: 360,
    height: 60,
    borderRadius: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  button: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Child styles (Yellow container box)
  childBox: {
    backgroundColor: '#ffff00', // Solid yellow background matching the reference
    width: 360,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#f305e3',
    alignItems: 'center',
    marginTop: 20,
  },
  childTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#0050b3',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  receivedDisplay: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#f305e3',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffcc', // Light yellow container inside child
    marginBottom: 10,
  },
  receivedText: {
    fontSize: 20,
    color: '#333333',
    fontWeight: '500',
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#079cf9', // Matches parent text input color
  },
});
