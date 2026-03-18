import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterSection from './FilterSection';
import { useRouter } from 'next/navigation';
import { describe, it, expect, vi } from 'vitest';

describe('FilterSection UI Component', () => {
  it('should render the search input and select dropdown', () => {
    render(<FilterSection />);
    expect(screen.getByPlaceholderText(/Buscar por número de série/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should push updated text query to Next router on input change', async () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock } as unknown as ReturnType<typeof useRouter>);

    render(<FilterSection />);
    const input = screen.getByPlaceholderText(/Buscar por número de série/i);
    
    fireEvent.change(input, { target: { value: '123' } });
    
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('?q=123');
    });
  });

  it('should push updated status query to Next router on select change', async () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({ push: pushMock } as unknown as ReturnType<typeof useRouter>);

    render(<FilterSection />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'true' } });
    
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('?status=true');
    });
  });
});
