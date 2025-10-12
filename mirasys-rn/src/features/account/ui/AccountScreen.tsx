import React from 'react';
import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useAuthStore } from '../../auth/model';

export default function AccountScreen() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Card mode="elevated" style={{ borderRadius: 16 }}>
        <Card.Title title="Account" />
        <Card.Content>
          <Text variant="bodyMedium">You are signed in.</Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={logout} icon="logout">Logout</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
