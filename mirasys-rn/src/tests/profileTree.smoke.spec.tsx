import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileTreeScreen from '../features/profileTree/ui/ProfileTreeScreen';

test('ProfileTreeScreen renders', () => {
  const { toJSON } = render(<ProfileTreeScreen />);
  expect(toJSON()).toBeTruthy();
});
