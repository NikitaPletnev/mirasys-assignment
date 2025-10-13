import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TreeScreen from '@/screens/Tree/TreeScreen';
import AccountScreen from '@/screens/Account/AccountScreen';
import { Text } from 'react-native';

const Tabs = createBottomTabNavigator();
export default function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff', tabBarStyle: { backgroundColor: '#000' }, tabBarActiveTintColor: '#84f16a', tabBarInactiveTintColor: '#aaa' }}>
      <Tabs.Screen name="Tree" component={TreeScreen} options={{ title: 'Profile Tree', tabBarIcon: () => <Text>🌿</Text> }} />
      <Tabs.Screen name="Account" component={AccountScreen} options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tabs.Navigator>
  );
}
