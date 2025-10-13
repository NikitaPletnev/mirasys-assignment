import React from 'react';
import { render } from '@testing-library/react-native';
import TreeScreen from './TreeScreen';
test('renders tree screen container', () => {
  const { toJSON } = render(<TreeScreen />);
  expect(toJSON()).toBeTruthy();
});
