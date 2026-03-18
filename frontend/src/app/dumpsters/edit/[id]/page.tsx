import Link from 'next/link';
import { ArrowLeft, Clock, CalendarDays } from 'lucide-react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Dumpster } from '@/types';
import EditDumpsterForm from './_components/EditDumpsterForm';

async function getDumpster(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const API_URL = typeof window === 'undefined'
    ? process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const res = await fetch(`${API_URL}/dumpsters/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function EditDumpsterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dumpster: Dumpster | null = await getDumpster(id);

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
        <div className="flex-1">
          <h1 className="text-lg font-bold text-slate-800">Editar Caçamba</h1>
          <p className="text-xs text-slate-500">Série: {dumpster.serialNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${dumpster.isRented ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
          {dumpster.isRented ? 'Alugada' : 'Disponível'}
        </span>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          {!dumpster.isRented && (
            <Link href={`/dumpsters/rent/${id}`} className="block">
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-200">
                <CalendarDays className="w-4 h-4" />
                Alugar Agora
              </button>
            </Link>
          )}
          <Link href={`/dumpsters/history/${id}`} className={`block ${dumpster.isRented ? 'col-span-2' : ''}`}>
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-sm font-semibold rounded-xl transition-all">
              <Clock className="w-4 h-4" />
              Ver Histórico
            </button>
          </Link>
        </div>

        {/* Form card */}
        <EditDumpsterForm dumpster={dumpster} />
      </main>
    </div>
  );
}
