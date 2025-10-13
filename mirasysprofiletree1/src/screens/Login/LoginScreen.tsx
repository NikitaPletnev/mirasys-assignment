import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';
import { useAuth } from '@/app/providers/AuthProvider';
import { generateToken } from '@/features/auth/api/iam.client';

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const onLogin = async () => {
    try {
      setBusy(true);
      const token = await generateToken(username, password);
      await Keychain.setGenericPassword('token', token);
      setToken(token);
    } catch (e) {
      console.warn('Login failed', e);
    } finally { setBusy(false); }
  };
  return (
    <View style={s.root}>
      <Text style={s.logo}>MIRASYS</Text>
      <TextInput style={s.input} placeholder="Username" placeholderTextColor="#666" onChangeText={setUsername} />
      <TextInput style={s.input} placeholder="Password" placeholderTextColor="#666" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={[s.btn, busy && { opacity: 0.7 }]} disabled={busy} onPress={onLogin}>
        <Text style={s.btnText}>{busy ? '...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#000', padding:24, justifyContent:'center' },
  logo:{ color:'#84f16a', fontSize:28, marginBottom:24, fontWeight:'700' },
  input:{ backgroundColor:'#111', color:'#fff', padding:12, borderRadius:8, marginBottom:12, borderWidth:1, borderColor:'#222' },
  btn:{ backgroundColor:'#84f16a', padding:14, borderRadius:8, alignItems:'center' },
  btnText:{ color:'#000', fontWeight:'700' }
});
