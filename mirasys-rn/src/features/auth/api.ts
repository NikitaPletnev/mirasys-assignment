import { IAM_BASE, LOGIN_PATH } from '@/core/config';

const AUTH_URL = `${IAM_BASE}${LOGIN_PATH}`;

type MfaAction = 'mfa-setup-required' | 'mfa-verification-required';

type LoginSuccess = {
  data: {
    access_token: string;
    refresh_token?: string;
    access_expires_in?: string;
    refresh_expires_in?: string;
  };
};
type LoginMfa =
  | { action: MfaAction; message?: string; mfa?: { secret?: { base32?: string; otpauth_url?: string } } };

export type LoginResponse = LoginSuccess | LoginMfa;

export async function loginRequest(args: { username: string; password: string; token?: string }): Promise<LoginResponse> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(args),
  });

  if (res.status === 200 || res.status === 201) return res.json();

  let detail: string | undefined;
  try {
    const problem = await res.json();
    detail = problem?.detail || problem?.title;
  } catch {}
  throw new Error(detail || `Login failed (${res.status})`);
}
