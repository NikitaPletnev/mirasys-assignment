import React, { PropsWithChildren } from 'react';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

const primary = 'rgb(63, 129, 255)';

const buildTheme = (scheme: 'light' | 'dark') => {
  const base = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary,
      secondary: '#7A8CFF',
      surfaceVariant: scheme === 'dark' ? '#1a1d22' : '#f6f7fb',
      outline: scheme === 'dark' ? '#343a40' : '#e3e5ea',
      elevation: { level1: scheme === 'dark' ? '#101216' : '#fff' } as any,
    },
  };
};

export function ThemeRoot({ children }: PropsWithChildren) {
  const scheme = useColorScheme() ?? 'light';
  return <PaperProvider theme={buildTheme(scheme)}>{children}</PaperProvider>;
}
