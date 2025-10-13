import { setContext } from '@apollo/client/link/context';
import * as Keychain from 'react-native-keychain';

export const authLink = setContext(async (_, { headers }) => {
  const creds = await Keychain.getGenericPassword();
  const token = creds?.password;
  return { headers: { ...headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) } };
});
