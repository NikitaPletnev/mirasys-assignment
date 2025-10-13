import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useAuth } from '../providers/AuthProvider';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { token } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? <Stack.Screen name="App" component={AppTabs} /> : <Stack.Screen name="Auth" component={AuthStack} />}
    </Stack.Navigator>
  );
}
