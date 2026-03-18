import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js Router
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  })),
  usePathname: vi.fn(() => ''),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  redirect: vi.fn(),
}));

// Mock Next.js Headers/Cookies
vi.mock('next/headers', () => {
  return {
    cookies: vi.fn().mockImplementation(() => {
      return {
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      };
    }),
  };
});

// Mock Next.js Cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Global Fetch
global.fetch = vi.fn();
