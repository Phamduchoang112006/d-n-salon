import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import { HomeStackParamList } from './types';
import FashionScreen from './FashionScreen';
import AccessoryScreen from './AccessoryScreen';
import CategoriesScreen from './CategoriesScreen';
import AboutScreen from './AboutScreen';
import AdminDashboard from './admin/AdminDashboard';
import CategoryManagement from './admin/categories/CategoryManagement';
import UserManagement from './admin/users/UserManagement';
import AddUser from './admin/users/AddUser';
import EditUser from './admin/users/EditUser';
import ProductManagement from './admin/products/ProductManagement';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import AdminOrderManagement from './admin/orders/AdminOrderManagement';

const Stack = createNativeStackNavigator<HomeStackParamList>();

console.log('HomeScreen:', HomeScreen);
console.log('DetailsScreen:', DetailsScreen);
console.log('FashionScreen:', FashionScreen);
console.log('AccessoryScreen:', AccessoryScreen);
console.log('CategoriesScreen:', CategoriesScreen);
console.log('AboutScreen:', AboutScreen);
console.log('AdminDashboard:', AdminDashboard);
console.log('CategoryManagement:', CategoryManagement);
console.log('UserManagement:', UserManagement);
console.log('ProductManagement:', ProductManagement);
console.log('AddUser:', AddUser);
console.log('EditUser:', EditUser);
console.log('CartScreen:', CartScreen);
console.log('CheckoutScreen:', CheckoutScreen);
console.log('OrderHistoryScreen:', OrderHistoryScreen);
console.log('ProfileScreen:', ProfileScreen);
console.log('AdminOrderManagement:', AdminOrderManagement);

const HomeStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Fashion" component={FashionScreen} />
      <Stack.Screen name="Accessory" component={AccessoryScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagement} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      <Stack.Screen name="ProductManagement" component={ProductManagement} />
      <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="EditUser" component={EditUser} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AdminOrderManagement" component={AdminOrderManagement as any} />
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
