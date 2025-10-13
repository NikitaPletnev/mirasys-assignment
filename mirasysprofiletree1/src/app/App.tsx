import React from 'react';
import { NavigationProvider } from './providers/NavigationProvider';
import { ApolloGraphQLProvider } from './providers/ApolloProvider';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ApolloGraphQLProvider>
            <NavigationProvider />
          </ApolloGraphQLProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
