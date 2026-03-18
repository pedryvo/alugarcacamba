'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalSchema } from '@/lib/schemas';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import { z } from 'zod';
import { MapPin, Loader2 } from 'lucide-react';
import { createRentalAction } from '../../../../actions';
import { Dumpster } from '@/types';

type RentalFormData = z.infer<typeof rentalSchema>;

export default function RentDumpsterForm({ dumpster }: { dumpster: Dumpster }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RentalFormData>({
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      dumpsterId: dumpster.id,
      cep: '',
      street: '',
      neighborhood: '',
      city: '',
      state: ''
    }
  });

  const cepValue = watch('cep');

  useEffect(() => {
    const cleanCep = cepValue?.replace(/\D/g, '');
    if (cleanCep?.length === 8) {
      axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`).then((res) => {
        if (!res.data.erro) {
          setValue('street', res.data.logradouro);
          setValue('neighborhood', res.data.bairro);
          setValue('city', res.data.localidade);
          setValue('state', res.data.uf);
        }
      }).catch(() => {});
    }
  }, [cepValue, setValue]);

  const onSubmit = (data: RentalFormData) => {
    setError('');
    startTransition(async () => {
      const result = await createRentalAction(data);
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/dumpsters');
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h2 className="text-base font-semibold text-slate-700">Endereço de Entrega</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* CEP */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">CEP</label>
          <input
            {...register('cep')}
            placeholder="00000-000"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all"
          />
          {errors.cep?.message && <p className="text-red-500 text-xs mt-1.5">{errors.cep.message}</p>}
          <p className="text-xs text-slate-400 mt-1">Digite o CEP para preencher o endereço automaticamente</p>
        </div>

        {/* Address fields auto-filled */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Logradouro</label>
          <input
            {...register('street')}
            readOnly
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Bairro</label>
          <input
            {...register('neighborhood')}
            readOnly
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cidade</label>
            <input
              {...register('city')}
              readOnly
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">UF</label>
            <input
              {...register('state')}
              readOnly
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-100 text-slate-600 cursor-not-allowed text-center"
            />
          </div>
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
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-emerald-200"
          >
            {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Confirmando...</> : 'Confirmar Locação'}
          </button>
        </div>
      </form>
    </div>
  );
}
