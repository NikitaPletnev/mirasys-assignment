import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/features/auth/model';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const hydrated = useAuthStore((s) => s._hydrated);
  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }
  return <>{children}</>;
}
