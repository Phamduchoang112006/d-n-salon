import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector = ({ selectedCategory, onSelectCategory }: CategorySelectorProps) => {
  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🛍️' },
    { id: 'fashion', name: 'Thời trang', icon: '👕' },
    { id: 'accessory', name: 'Phụ kiện', icon: '🎒' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Chọn Danh Mục</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryBtn, isSelected && styles.categoryBtnActive]}
              onPress={() => onSelectCategory(cat.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>
                {cat.icon} {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  scrollContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  categoryBtnActive: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  categoryText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
});

export default CategorySelector;
