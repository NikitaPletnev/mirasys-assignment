import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ padding: 12, borderRadius: 12, backgroundColor: 'rgba(220,53,69,0.12)', borderWidth: 1, borderColor: 'rgba(220,53,69,0.35)', margin: 12 }}>
      <Text variant="bodyMedium" style={{ color: '#a50014' }}>⚠ {message}</Text>
      {onRetry ? <Button onPress={onRetry} compact>Retry</Button> : null}
    </View>
  );
}
