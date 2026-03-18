import { vi, describe, it, expect, beforeEach } from 'vitest';
import { loginAction, logoutAction, createDumpsterAction } from './actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

describe('Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loginAction', () => {
    it('should set cookie and return success on valid login', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'fake-token' }),
      } as Response);

      const mockSet = vi.fn();
      vi.mocked(cookies).mockResolvedValueOnce({
        set: mockSet,
      } as unknown as ReturnType<typeof cookies> extends Promise<infer U> ? U : never);

      const result = await loginAction({ email: 'test@test.com', password: 'pass' });

      expect(result).toEqual({ success: true });
      expect(mockSet).toHaveBeenCalledWith('token', 'fake-token', expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: 'POST',
      }));
    });

    it('should return error from response on failed login', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid credentials' }),
      } as Response);

      const result = await loginAction({ email: 'test@test.com', password: 'wrong' });

      expect(result).toEqual({ error: 'Invalid credentials' });
    });
  });

  describe('logoutAction', () => {
    it('should delete token cookie and redirect', async () => {
      const mockDelete = vi.fn();
      vi.mocked(cookies).mockResolvedValueOnce({
        delete: mockDelete,
      } as unknown as ReturnType<typeof cookies> extends Promise<infer U> ? U : never);

      await logoutAction();

      expect(mockDelete).toHaveBeenCalledWith('token');
      expect(redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('createDumpsterAction', () => {
    it('should send auth header and revalidate path on success', async () => {
      vi.mocked(cookies).mockResolvedValueOnce({
        get: vi.fn().mockReturnValue({ value: 'token-123' }),
      } as unknown as ReturnType<typeof cookies> extends Promise<infer U> ? U : never);

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response);

      const result = await createDumpsterAction({ serialNumber: 'ABC', color: 'Verde' });

      expect(result).toEqual({ success: true });
      expect(global.fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token-123',
        },
      }));
      expect(revalidatePath).toHaveBeenCalledWith('/dumpsters');
    });
  });
});
