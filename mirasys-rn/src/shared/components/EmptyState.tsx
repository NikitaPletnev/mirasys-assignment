import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function EmptyState({ title, subtitle, onRetry }: { title: string; subtitle?: string; onRetry?: () => void }) {
  return (
    <View style={{ alignItems: 'center', gap: 8, padding: 24 }}>
      <Text variant="titleMedium">{title}</Text>
      {subtitle ? <Text variant="bodyMedium" style={{ opacity: 0.7, textAlign: 'center' }}>{subtitle}</Text> : null}
      {onRetry ? <Button mode="contained-tonal" onPress={onRetry} style={{ marginTop: 8 }}>Retry</Button> : null}
    </View>
  );
}
