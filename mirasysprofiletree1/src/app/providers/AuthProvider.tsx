import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';

type AuthContextType = {
  token: string | null;
  setToken: (t: string | null) => void;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType>({ token: null, setToken: () => {}, logout: async () => {} });

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const creds = await Keychain.getGenericPassword();
      if (creds) setToken(creds.password);
    })();
  }, []);

  const logout = async () => {
    await Keychain.resetGenericPassword();
    setToken(null);
  };

  return <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
