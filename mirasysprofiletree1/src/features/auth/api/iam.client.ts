import { IAM_URL, IAM_CLIENT_ID, IAM_CLIENT_SECRET } from '@/lib/network/endpoints';

export async function generateToken(username: string, password: string): Promise<string> {
  const url = `${IAM_URL}/auth/generate-token`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password, clientId: IAM_CLIENT_ID, clientSecret: IAM_CLIENT_SECRET })
  });
  if (!res.ok) throw new Error(`IAM ${res.status}`);
  const data = await res.json();
  return data.accessToken ?? data.token ?? '';
}
