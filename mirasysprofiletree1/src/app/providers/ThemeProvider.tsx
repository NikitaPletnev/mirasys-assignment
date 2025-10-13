import React from 'react';
import { StatusBar } from 'react-native';
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <>
    <StatusBar barStyle="light-content" backgroundColor="#000" />
    {children}
  </>;
};
