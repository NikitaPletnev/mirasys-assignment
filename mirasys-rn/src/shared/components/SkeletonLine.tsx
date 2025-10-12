import React from 'react';
import { View } from 'react-native';

export default function SkeletonLine({ width = '60%', height = 14, rounded = 8 }: { width?: number | string; height?: number; rounded?: number; }) {
  return <View style={{ width, height, borderRadius: rounded, backgroundColor: 'rgba(120,130,150,0.15)', overflow: 'hidden' }} />;
}
