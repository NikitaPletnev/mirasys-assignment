import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/providers/AuthProvider';

export default function AccountScreen() {
  const { logout } = useAuth();
  return (
    <View style={{ flex:1, backgroundColor:'#000', padding:16 }}>
      <Text style={{ color:'#84f16a', fontSize:22, marginBottom:16 }}>Account</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor:'#111', padding:12, borderRadius:8, borderColor:'#333', borderWidth:1 }}>
        <Text style={{ color:'#fff' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
