'use client';

import { Search } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

export default function FilterSection({
  initialQuery = '',
  initialStatus = 'all',
}: {
  initialQuery?: string;
  initialStatus?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(query: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleStatusChange(status: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (status !== 'all') {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por número de série..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50"
          defaultValue={initialQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div>
        <select
          className="w-full sm:w-44 px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 text-slate-700"
          defaultValue={initialStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="all">Todas as caçambas</option>
          <option value="true">Alugadas</option>
          <option value="false">Disponíveis</option>
        </select>
      </div>
    </div>
  );
}
