import React from 'react';
import { View } from 'react-native';
export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => <View style={{ flex: 1 }}>{children}</View>;
