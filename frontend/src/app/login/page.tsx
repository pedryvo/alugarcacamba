'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/schemas';
import { useAuth } from '@/context/AuthContext';
import { useState, useTransition } from 'react';
import { z } from 'zod';
import { Loader2, Lock, Mail, Recycle } from 'lucide-react';
import { loginAction } from '../actions';

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setError('');
    startTransition(async () => {
      const result = await loginAction(data);
      if (result.error) {
        setError(result.error);
      } else {
        login(''); // Update client state (redirects handled by action/router)
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-700 flex-col items-center justify-center p-12 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-white/20 rounded-2xl p-3">
            <Recycle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold">Recicla Entulhos</h1>
        </div>
        <p className="text-emerald-100 text-lg text-center max-w-sm leading-relaxed">
          Sistema de gerenciamento de caçambas. Controle total dos seus aluguéis em um só lugar.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-sm">
          {[
            { label: 'Caçambas', desc: 'Cadastradas' },
            { label: 'Aluguéis', desc: 'Gerenciados' },
            { label: 'Endereços', desc: 'Via ViaCEP' },
            { label: 'Histórico', desc: 'Completo' },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="font-semibold text-base">{item.label}</p>
              <p className="text-emerald-200 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <Recycle className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-700">Recicla Entulhos</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo!</h2>
          <p className="text-slate-500 mb-8">Entre com suas credenciais para continuar</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-slate-50"
                />
              </div>
              {errors.email?.message && <p className="text-red-500 text-xs mt-1.5">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-slate-50"
                />
              </div>
              {errors.password?.message && <p className="text-red-500 text-xs mt-1.5">{errors.password.message as string}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
