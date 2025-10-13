import { generateToken } from '../src/shared/services/authService';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ accessToken: 'fake_token' }),
  })
) as jest.Mock;

describe('Auth Service', () => {
  it('returns access token on successful login', async () => {
    const token = await generateToken('test1', '54531d91cbf334fc4922b150cb25ea4b');
    expect(token).toBe('fake_token');
  });
  
  it('throws error on invalid response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({}),
    });
    await expect(generateToken('x', 'y')).rejects.toThrow('Token not found');
  });
});
