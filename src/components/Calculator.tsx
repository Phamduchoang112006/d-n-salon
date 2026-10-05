import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Exercise1 from './Exercise1';
import Exercise2 from './Exercise2';
import Calculator3 from './Calculator3';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<'ex1' | 'ex2' | 'ex3'>('ex1');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Bài Tập Thực Hành React Native</Text>
        <Text style={styles.headerTitle}>Máy Tính Học Tập</Text>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ex1' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('ex1')}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ex1' && styles.tabTextActive,
              ]}
            >
              Bài 1 (Button)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ex2' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('ex2')}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ex2' && styles.tabTextActive,
              ]}
            >
              Bài 2 (Radio)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'ex3' && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab('ex3')}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ex3' && styles.tabTextActive,
              ]}
            >
              Radio Template
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Component Content */}
      <View style={styles.contentContainer}>
        {activeTab === 'ex1' ? (
          <Exercise1 />
        ) : activeTab === 'ex2' ? (
          <Exercise2 />
        ) : (
          <Calculator3 />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  tabContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabBackground: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 14,
    padding: 4,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#4f46e5',
  },
  contentContainer: {
    flex: 1,
  },
});
