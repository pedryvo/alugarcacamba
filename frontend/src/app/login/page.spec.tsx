import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './page';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loginAction } from '../actions';
import { useAuth } from '@/context/AuthContext';

vi.mock('../actions', () => ({
  loginAction: vi.fn(),
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('LoginPage Form', () => {
  const mockContextValue = {
    user: null,
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
  };

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(mockContextValue as unknown as ReturnType<typeof useAuth>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form with inputs and submit button', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show Zod validation errors if submitted empty', async () => {
    render(<LoginPage />);
    const button = screen.getByRole('button', { name: /entrar/i });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
      expect(screen.getByText(/Password must be at least/i)).toBeInTheDocument();
    });
  });

  it('should call loginAction and Context on successful submit', async () => {
    vi.mocked(loginAction).mockResolvedValueOnce({ success: true });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(loginAction).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(mockContextValue.login).toHaveBeenCalled();
    });
  });

  it('should display error message returned from action if auth fails', async () => {
    vi.mocked(loginAction).mockResolvedValueOnce({ error: 'Credenciais inválidas' });
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText(/seu@email.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'wrongpass' } });
    
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Credenciais inválidas/i)).toBeInTheDocument();
    });
  });
});
