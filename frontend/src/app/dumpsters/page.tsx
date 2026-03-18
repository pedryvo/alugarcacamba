import Link from 'next/link';
import { Search, Plus, Recycle, Trash2, PenLine } from 'lucide-react';
import { Dumpster } from '@/types';
import { cookies } from 'next/headers';
import LogoutButton from './_components/LogoutButton';
import FilterSection from './_components/FilterSection';

async function getDumpsters(serialNumber?: string, isRented?: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const params = new URLSearchParams();
  if (serialNumber) params.append('serialNumber', serialNumber);
  if (isRented && isRented !== 'all') params.append('isRented', isRented);

  const res = await fetch(`${API_URL}/dumpsters?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 0 }, // Ensure fresh data
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function DumpstersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const dumpsters: Dumpster[] = await getDumpsters(q, status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-600 rounded-lg p-1.5">
            <Recycle className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800">Recicla Entulhos</span>
        </div>
        <LogoutButton />
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Caçambas</h2>
            <p className="text-slate-500 text-sm mt-1">Gerencie todas as caçambas da sua frota</p>
          </div>
          <Link href="/dumpsters/create">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-200">
              <Plus className="w-4 h-4" />
              Nova Caçamba
            </button>
          </Link>
        </div>

        {/* Filters */}
        <FilterSection initialQuery={q} initialStatus={status} />

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: dumpsters.length, color: 'text-slate-700', bg: 'bg-slate-100' },
            { label: 'Disponíveis', value: dumpsters.filter(d => !d.isRented).length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Alugadas', value: dumpsters.filter(d => d.isRented).length, color: 'text-orange-700', bg: 'bg-orange-50' },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 border border-white`}>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {dumpsters.length === 0 ? (
            <div className="p-16 text-center">
              <Trash2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Nenhuma caçamba encontrada.</p>
              <Link href="/dumpsters/create">
                <button className="mt-4 text-sm text-emerald-600 hover:underline">Cadastrar nova caçamba →</button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Nº Série</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cor</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {dumpsters.map((dumpster: Dumpster) => (
                    <tr key={dumpster.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{dumpster.serialNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-slate-200"
                            style={{ backgroundColor: dumpster.color?.toLowerCase() === 'amarelo' ? '#fbbf24' : dumpster.color?.toLowerCase() === 'azul' ? '#3b82f6' : dumpster.color?.toLowerCase() === 'verde' ? '#22c55e' : dumpster.color?.toLowerCase() === 'vermelho' ? '#ef4444' : '#94a3b8' }}
                          />
                          {dumpster.color}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${dumpster.isRented ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dumpster.isRented ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                          {dumpster.isRented ? 'Alugada' : 'Disponível'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dumpsters/edit/${dumpster.id}`}>
                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                              <PenLine className="w-3.5 h-3.5" />
                              Editar
                            </button>
                          </Link>
                          {!dumpster.isRented && (
                            <Link href={`/dumpsters/rent/${dumpster.id}`}>
                              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                                Alugar
                              </button>
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
