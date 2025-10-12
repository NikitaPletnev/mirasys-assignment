import React from 'react';
import { View, Text } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

export default function OfflineBanner() {
  const info = useNetInfo();
  if (info.isConnected ?? true) return null;
  return (
    <View style={{ padding: 8, backgroundColor: '#fff3cd', borderBottomWidth: 1, borderColor: '#ffe69c' }}>
      <Text style={{ color: '#7a5d00' }}>You are offline. Some data may be outdated.</Text>
    </View>
  );
}
