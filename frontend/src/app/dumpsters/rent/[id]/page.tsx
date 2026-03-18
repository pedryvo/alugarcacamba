import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Dumpster } from '@/types';
import RentDumpsterForm from './_components/RentDumpsterForm';

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

export default async function RentDumpsterPage({
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
        <div>
          <h1 className="text-lg font-bold text-slate-800">Nova Locação</h1>
          <p className="text-xs text-slate-500">
            Caçamba: <span className="font-medium text-emerald-700">{dumpster?.serialNumber}</span>
            {dumpster?.color && ` · ${dumpster.color}`}
          </p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8">
        <RentDumpsterForm dumpster={dumpster} />
      </main>
    </div>
  );
}
