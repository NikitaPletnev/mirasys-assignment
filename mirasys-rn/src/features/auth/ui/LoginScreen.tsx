import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText, ActivityIndicator, Card, useTheme } from 'react-native-paper';
import { useAuthStore } from '../model';
import { loginRequest, LoginResponse } from '../api';

export default function LoginScreen() {
  const theme = useTheme();
  const setTokens = useAuthStore((s) => s.setTokens);
  const setCreds = useAuthStore((s) => s.setCreds);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reveal, setReveal] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'login' | 'mfa-verify'>('login');
  const [mfa, setMfa] = useState<{ base32?: string; otpauth_url?: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const userErr = !!username && username.trim().length < 3;
  const passErr = !!password && password.length < 3;

  async function handleSubmit() {
    setErr(null);
    setLoading(true);
    try {
      const body = step === 'mfa-verify' ? { username, password, token: otp } : { username, password };
      const r: LoginResponse = await loginRequest(body as any);

      if ('data' in r && r.data?.access_token) {
        setTokens({ accessToken: r.data.access_token });
        setCreds({ username, password });
        return;
      }
      if ('action' in r) {
        setStep('mfa-verify');
        setMfa({ base32: r.mfa?.secret?.base32, otpauth_url: r.mfa?.secret?.otpauth_url });
      }
    } catch (e: any) {
      setErr(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !username || !password || userErr || passErr || (step === 'mfa-verify' && !otp);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Card mode="elevated" style={{ borderRadius: 16 }}>
        <Card.Title title="Sign in" />
        <Card.Content style={{ gap: 12 }}>
          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            error={userErr}
          />
          {userErr && <HelperText type="error">Minimum 3 characters</HelperText>}

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!reveal}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon icon={reveal ? 'eye-off' : 'eye'} onPress={() => setReveal((v) => !v)} />}
            error={passErr}
          />
          {passErr && <HelperText type="error">Minimum 3 characters</HelperText>}

          {step === 'mfa-verify' && (
            <>
              <TextInput
                label="One-time code"
                value={otp}
                onChangeText={setOtp}
                mode="outlined"
                keyboardType="number-pad"
                left={<TextInput.Icon icon="shield-key" />}
              />
              {mfa?.base32 && (
                <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                  MFA secret: {mfa.base32}
                </Text>
              )}
            </>
          )}

          {err && <Text style={{ color: theme.colors.error }}>⚠ {err}</Text>}
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSubmit} disabled={disabled} icon={step === 'login' ? 'login' : 'check'}>
            {loading ? <ActivityIndicator animating color="white" /> : step === 'login' ? 'Login' : 'Verify & Sign in'}
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
