import { ImageSourcePropType } from 'react-native';
import { Product } from './database';

export interface Product1 {
  id: string;
  name: string;
  price: string;
  image: ImageSourcePropType;
  category: 'fashion' | 'accessory';
}

export type HomeStackParamList = {
  Home: undefined;
  Details: { product: Product };
  Accessory: undefined;
  Fashion: undefined;
  Categories: undefined;
  About: undefined;
  AdminDashboard: undefined;
  CategoryManagement: undefined;
  UserManagement: undefined;
  AddUser: undefined;
  EditUser: { userId: number };
  ProductManagement: { categoryId: number };
  Cart: undefined;
  Checkout: undefined;
  OrderHistory: undefined;
  AdminOrderManagement: undefined;
  Profile: undefined;
};

