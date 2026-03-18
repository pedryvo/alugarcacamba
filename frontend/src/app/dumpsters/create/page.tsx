'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dumpsterSchema } from '@/lib/schemas';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { ArrowLeft, Hash, Palette, Loader2 } from 'lucide-react';
import { createDumpsterAction } from '../../actions';

type DumpsterFormData = z.infer<typeof dumpsterSchema>;

export default function CreateDumpsterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<DumpsterFormData>({
    resolver: zodResolver(dumpsterSchema),
  });

  const onSubmit = (data: DumpsterFormData) => {
    setError('');
    startTransition(async () => {
      const result = await createDumpsterAction(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dumpsters');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Cadastrar Nova Caçamba</h1>
          <p className="text-xs text-slate-500">Preencha os dados da nova caçamba</p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Número de Série
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('serialNumber')}
                  placeholder="Ex: CS-001"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all"
                />
              </div>
              {errors.serialNumber?.message && (
                <p className="text-red-500 text-xs mt-1.5">{errors.serialNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cor</label>
              <div className="relative">
                <Palette className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('color')}
                  placeholder="Ex: Amarelo"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all"
                />
              </div>
              {errors.color?.message && (
                <p className="text-red-500 text-xs mt-1.5">{errors.color.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-emerald-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
