import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../src/app/App';

describe('App Root', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('app-root')).toBeTruthy();
  });
});
