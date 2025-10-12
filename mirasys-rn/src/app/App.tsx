import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';

import { ApolloRoot } from './providers/apollo';
import { ThemeRoot } from './providers/theme';
import AuthGate from './components/AuthGate';

import { useAuthStore } from '../features/auth/model';
import LoginScreen from '../features/auth/ui/LoginScreen';
import ProfileTreeScreen from '../features/profileTree/ui/ProfileTreeScreen';
import AccountScreen from '../features/account/ui/AccountScreen';
import OfflineBanner from '../shared/components/OfflineBanner';

const Stack = createNativeStackNavigator();

function AppHeader({ navigation, back }: any) {
  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Mirasys Profile Tree" />
      {!back && <Appbar.Action icon="account" onPress={() => navigation.navigate('Account')} />}
    </Appbar.Header>
  );
}

export default function App() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return (
    <ThemeRoot>
      <ApolloRoot>
        <AuthGate>
          <View style={{ flex: 1 }}>
            <OfflineBanner />
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ header: (p) => <AppHeader {...p} /> }}>
                {accessToken ? (
                  <>
                    <Stack.Screen name="ProfileTree" component={ProfileTreeScreen} options={{ title: 'Profile Tree' }} />
                    <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Account' }} />
                  </>
                ) : (
                  <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in' }} />
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </AuthGate>
      </ApolloRoot>
    </ThemeRoot>
  );
}
