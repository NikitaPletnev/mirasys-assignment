import React from 'react';
import { Text } from 'react-native';
export default function NodeIcon({ kind }:{ kind: string }) {
  if (kind === 'FOLDER') return <Text style={{ color:'#fff' }}>📁</Text>;
  if (kind === 'VIDEO_CHANNEL') return <Text style={{ color:'#fff' }}>🎥</Text>;
  if (kind === 'DIGITAL_INPUT' || kind === 'DIGITAL_OUTPUT') return <Text style={{ color:'#fff' }}>🔌</Text>;
  return <Text style={{ color:'#fff' }}>📄</Text>;
}
