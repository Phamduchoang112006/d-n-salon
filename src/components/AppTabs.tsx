import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackScreen from './HomeStackScreen';
import LoginSqlite from './dbSqlite/LoginSqlite';
import SignupSqlite from './dbSqlite/SignupSqlite';
import CartScreen from './CartScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import AdminDashboard from './admin/AdminDashboard';
import { useAppContext } from './AppContext';

export type BottomTabParamList = {
  HomeTab: undefined;
  SignupSqlite: undefined;
  LoginSqlite: undefined;
  Cart: undefined;
  OrderHistory: undefined;
  AdminDashboard: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const AppTabs = () => {
  const { user } = useAppContext();
  console.log('Rendering AppTabs component, user:', user?.username);

  // Helper function to render a beautiful tab icon with a Material-style active pill
  const renderTabIcon = (focused: boolean, emoji: string) => {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#fdf2f8' : 'transparent',
        width: 48,
        height: 32,
        borderRadius: 12,
        marginTop: 4,
      }}>
        <Text style={{ fontSize: focused ? 20 : 18, opacity: focused ? 1 : 0.65 }}>{emoji}</Text>
      </View>
    );
  };

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          elevation: 10,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        }
      }}
    >
      {/* Home tab is always visible */}
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }) => renderTabIcon(focused, '🏠'),
        }}
      />

      {user === null ? (
        // Guest Tabs
        <>
          <Tab.Screen
            name="SignupSqlite"
            component={SignupSqlite}
            options={{
              title: 'Đăng ký',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '➕'),
            }}
          />
          <Tab.Screen
            name="LoginSqlite"
            component={LoginSqlite}
            options={{
              title: 'Đăng nhập',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '🔒'),
            }}
          />
        </>
      ) : user.role === 'admin' ? (
        // Admin Tabs
        <>
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              title: 'Giỏ hàng',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '🛒'),
            }}
          />
          <Tab.Screen
            name="AdminDashboard"
            component={AdminDashboard}
            options={{
              title: 'Quản trị',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '⚙️'),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Cá nhân',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '👤'),
            }}
          />
        </>
      ) : (
        // Regular User Tabs
        <>
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              title: 'Giỏ hàng',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '🛒'),
            }}
          />
          <Tab.Screen
            name="OrderHistory"
            component={OrderHistoryScreen}
            options={{
              title: 'Lịch sử',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '📜'),
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: 'Cá nhân',
              tabBarIcon: ({ focused }) => renderTabIcon(focused, '👤'),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AppTabs;
