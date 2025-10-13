import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from '../navigation/RootNavigator';

const DarkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#000', card: '#000', text: '#fff', primary: '#84f16a' }
};

export const NavigationProvider = () => (
  <NavigationContainer theme={DarkTheme}>
    <RootNavigator />
  </NavigationContainer>
);
export default NavigationProvider;
