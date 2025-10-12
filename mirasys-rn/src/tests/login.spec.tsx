import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../features/auth/ui/LoginScreen';

// подменим глобальный fetch
const g: any = global;

afterEach(() => {
  g.fetch?.mockClear?.();
});

test('login success (201)', async () => {
  g.fetch = jest.fn().mockResolvedValueOnce({
    status: 201,
    json: async () => ({ data: { access_token: 'abc' } }),
  });

  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  fireEvent.changeText(getByPlaceholderText('Username'), 'test1');
  fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
  fireEvent.press(getByText('Login'));

  await waitFor(() => {
    // косвенно: кнопка станет опять 'Login' (загрузка завершена)
    expect(g.fetch).toHaveBeenCalled();
  });
});

test('mfa flow (200 -> verify)', async () => {
  g.fetch = jest
    .fn()
    // первый вызов — MFA setup
    .mockResolvedValueOnce({
      status: 200,
      json: async () => ({
        action: 'mfa-setup-required',
        mfa: { secret: { base32: 'ABC', otpauth_url: 'otpauth://...' } },
      }),
    })
    // второй вызов — успех
    .mockResolvedValueOnce({
      status: 201,
      json: async () => ({ data: { access_token: 'def' } }),
    });

  const { getByPlaceholderText, getByText } = render(<LoginScreen />);
  fireEvent.changeText(getByPlaceholderText('Username'), 'test1');
  fireEvent.changeText(getByPlaceholderText('Password'), 'pass');
  fireEvent.press(getByText('Login'));

  // теперь должен появиться one-time code
  const otpInput = await waitFor(() => getByPlaceholderText('One-time code'));
  fireEvent.changeText(otpInput, '123456');
  fireEvent.press(getByText('Verify & Sign in'));

  await waitFor(() => {
    expect(g.fetch).toHaveBeenCalledTimes(2);
  });
});
