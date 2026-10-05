import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// Define the shape of each console log entry
interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INFO' | 'PARENT' | 'CHILD';
  message: string;
}

// Child Component ("Con")
interface ChildProps {
  parentName: string;
  parentAge: string;
  onUpdateParent: (newName: string, newAge: string) => void;
  addLog: (type: 'INFO' | 'PARENT' | 'CHILD', message: string) => void;
}

const ChildComponent: React.FC<ChildProps> = ({
  parentName,
  parentAge,
  onUpdateParent,
  addLog,
}) => {
  const [childName, setChildName] = useState<string>('');
  const [childAge, setChildAge] = useState<string>('');

  const handleSendToParent = () => {
    if (!childName.trim() && !childAge.trim()) {
      addLog('CHILD', '⚠️ Lỗi: Không thể gửi dữ liệu rỗng lên Cha!');
      return;
    }

    // Call parent callback
    onUpdateParent(childName, childAge);
    addLog('CHILD', `📤 Đã truyền dữ liệu lên Cha: { Tên mới: "${childName}", Tuổi mới: "${childAge}" }`);
    
    // Optional: clear input after sending
    // setChildName('');
    // setChildAge('');
  };

  return (
    <View style={styles.childContainer}>
      <Text style={styles.childTitle}>Con:</Text>

      {/* Received Info Display */}
      <View style={styles.receivedInfoBox}>
        <Text style={styles.receivedText}>
          Name nhận từ cha: <Text style={styles.boldHighlight}>{parentName || '(Trống)'}</Text>
        </Text>
      </View>

      <View style={styles.receivedInfoBox}>
        <Text style={styles.receivedText}>
          Age nhận từ cha: <Text style={styles.boldHighlight}>{parentAge || '(Trống)'}</Text>
        </Text>
      </View>

      {/* Input controls to send to Parent */}
      <View style={styles.childInputGroup}>
        <TextInput
          style={styles.childInput}
          placeholder="Nhập tên mới cho cha"
          placeholderTextColor="#7f8c8d"
          value={childName}
          onChangeText={setChildName}
        />
        <TextInput
          style={styles.childInput}
          placeholder="Nhập tuổi mới cho cha"
          placeholderTextColor="#7f8c8d"
          value={childAge}
          onChangeText={setChildAge}
          keyboardType="numeric"
        />
      </View>

      {/* Send Button */}
      <TouchableOpacity
        style={styles.childButton}
        onPress={handleSendToParent}
        activeOpacity={0.8}
      >
        <Text style={styles.childButtonText}>Truyền dữ liệu lên cha</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Parent Component
const ParentChildConsole = () => {
  const [parentName, setParentName] = useState<string>('khai');
  const [parentAge, setParentAge] = useState<string>('20');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  const scrollViewRef = useRef<ScrollView>(null);

  // Helper to add logs to both simulated screen console and Metro terminal console
  const addLog = (type: 'INFO' | 'PARENT' | 'CHILD', message: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0]; // HH:MM:SS
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      type,
      message,
    };
    
    // Also print to actual node console
    console.log(`[${timeStr}] [${type}] ${message}`);

    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  // Add initial log on load
  useEffect(() => {
    addLog('INFO', '🚀 Hệ thống đã khởi tạo. Sẵn sàng truyền nhận dữ liệu.');
  }, []);

  // Scroll terminal to end when logs change
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [logs]);

  const handlePrintResult = () => {
    addLog('PARENT', `📥 Nhấn [In kết quả]: { Tên hiện tại: "${parentName}", Tuổi hiện tại: "${parentAge}" }`);
  };

  const handleUpdateFromChild = (newName: string, newAge: string) => {
    if (newName.trim()) {
      setParentName(newName);
    }
    if (newAge.trim()) {
      setParentAge(newAge);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
    console.log('--- Đã xoá bản logs ---');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e24" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Truyền Dữ Liệu Cha & Con</Text>
            <Text style={styles.headerSubtitle}>Kiểm Tra Dữ Liệu Tức Thời</Text>
          </View>

          {/* Parent Component UI ("Cha") */}
          <View style={styles.parentCard}>
            <Text style={styles.parentTitle}>Cha</Text>

            {/* Input Fields with pink borders */}
            <TextInput
              style={styles.parentInput}
              placeholder="Nhập tên của cha"
              placeholderTextColor="#a0a0a0"
              value={parentName}
              onChangeText={(text) => {
                setParentName(text);
                addLog('PARENT', `✍️ Thay đổi Tên cha thành: "${text}"`);
              }}
            />

            <TextInput
              style={styles.parentInput}
              placeholder="Nhập tuổi của cha"
              placeholderTextColor="#a0a0a0"
              value={parentAge}
              onChangeText={(text) => {
                setParentAge(text);
                addLog('PARENT', `✍️ Thay đổi Tuổi cha thành: "${text}"`);
              }}
              keyboardType="numeric"
            />

            {/* Print Button */}
            <TouchableOpacity
              style={styles.parentButton}
              onPress={handlePrintResult}
              activeOpacity={0.8}
            >
              <Text style={styles.parentButtonText}>In kết quả</Text>
            </TouchableOpacity>

            {/* Nest Child Component */}
            <ChildComponent
              parentName={parentName}
              parentAge={parentAge}
              onUpdateParent={handleUpdateFromChild}
              addLog={addLog}
            />
          </View>

          {/* Node.js Terminal Console Logs Display */}
          <View style={styles.terminalContainer}>
            <View style={styles.terminalHeader}>
              <View style={styles.terminalHeaderLeft}>
                <View style={styles.dotRed} />
                <View style={styles.dotYellow} />
                <View style={styles.dotGreen} />
                <Text style={styles.terminalTitle}>💻 Node Terminal Console</Text>
              </View>
              <TouchableOpacity onPress={handleClearLogs} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.terminalBody}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.terminalScroll}
                nestedScrollEnabled={true}
              >
                {logs.length === 0 ? (
                  <Text style={styles.terminalEmptyText}>
                    Console is clear. Actions will be logged here...
                  </Text>
                ) : (
                  logs.map((log) => {
                    let logColor = '#00ff66'; // Green for standard info
                    if (log.type === 'PARENT') {
                      logColor = '#38bdf8'; // Blue for Parent actions
                    } else if (log.type === 'CHILD') {
                      logColor = '#facc15'; // Yellow for Child actions
                    }

                    return (
                      <View key={log.id} style={styles.logLine}>
                        <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
                        <Text style={[styles.logText, { color: logColor }]}>
                          {' '}[{log.type}] {log.message}
                        </Text>
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ParentChildConsole;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121214',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8b8e9f',
    marginTop: 4,
    textAlign: 'center',
  },
  parentCard: {
    backgroundColor: '#1e1e24',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2e2e38',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  parentTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  parentInput: {
    height: 60,
    fontSize: 26,
    color: '#079cf9',
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#f305e3', // Pink border from user screenshot
    marginBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#121214',
  },
  parentButton: {
    backgroundColor: '#18bfe0', // Cyan background from user screenshot
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  parentButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  
  // Child component styles (Yellow box)
  childContainer: {
    backgroundColor: '#ffff00', // Yellow background from screenshot
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#d4b200',
  },
  childTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  receivedInfoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1.5,
    borderColor: '#f305e3',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  receivedText: {
    fontSize: 20,
    color: '#3b3b3b',
  },
  boldHighlight: {
    fontWeight: 'bold',
    color: '#079cf9',
  },
  childInputGroup: {
    marginTop: 10,
    gap: 8,
  },
  childInput: {
    height: 50,
    fontSize: 18,
    color: '#000000',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#f305e3',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  childButton: {
    backgroundColor: '#18bfe0', // Cyan background
    borderRadius: 8,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  childButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Simulated Terminal Window styles
  terminalContainer: {
    backgroundColor: '#000000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  terminalHeader: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
  },
  terminalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff5f56',
    marginRight: 6,
  },
  dotYellow: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffbd2e',
    marginRight: 6,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27c93f',
    marginRight: 10,
  },
  terminalTitle: {
    color: '#aaaaaa',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  clearButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#cccccc',
    fontSize: 11,
    fontWeight: '500',
  },
  terminalBody: {
    padding: 12,
    height: 180,
  },
  terminalScroll: {
    flex: 1,
  },
  terminalEmptyText: {
    color: '#666666',
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  logLine: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  logTimestamp: {
    color: '#888888',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    flexWrap: 'wrap',
  },
});
