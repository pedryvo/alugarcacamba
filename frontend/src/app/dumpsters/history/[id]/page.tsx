import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock } from 'lucide-react';
import { Dumpster, Rental } from '@/types';

async function getDumpster(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const res = await fetch(`${API_URL}/dumpsters/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

async function getRentalHistory(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const res = await fetch(`${API_URL}/rentals/dumpster/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 0 }, // Fresh data for history
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function RentalHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [dumpster, history] = await Promise.all([
    getDumpster(id),
    getRentalHistory(id),
  ]);

  if (!dumpster) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center gap-4">
        <Link href="/dumpsters">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Histórico de Locações</h1>
          <p className="text-xs text-slate-500">
            Caçamba: <span className="font-medium text-emerald-700">{dumpster?.serialNumber}</span>
            {dumpster?.color && ` · ${dumpster.color}`}
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Dumpster summary card */}
        <div className="bg-emerald-600 text-white rounded-2xl p-5 mb-6 flex items-center justify-between shadow-lg shadow-emerald-200">
          <div>
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">Caçamba</p>
            <h2 className="text-xl font-bold">{dumpster?.serialNumber}</h2>
            <p className="text-emerald-200 text-sm">{dumpster?.color}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">Total de Locações</p>
            <p className="text-3xl font-bold">{history.length}</p>
          </div>
        </div>

        {/* History list */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Nenhum registro de locação encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((rental: Rental, index: number) => (
              <div
                key={rental.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-400">Locação #{history.length - index}</span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${rental.endDate ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${rental.endDate ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                    {rental.endDate ? 'Finalizado' : 'Em andamento'}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium">Início</p>
                        <p className="font-semibold text-slate-700">{new Date(rental.startDate).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    {rental.endDate && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-medium">Término</p>
                          <p className="font-semibold text-slate-700">{new Date(rental.endDate).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">Endereço</p>
                      <p className="font-semibold text-slate-700">{rental.street}</p>
                      <p className="text-slate-500">{rental.neighborhood}</p>
                      <p className="text-slate-500">{rental.city} - {rental.state}</p>
                      <p className="text-slate-400 text-xs mt-1">CEP: {rental.cep}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
