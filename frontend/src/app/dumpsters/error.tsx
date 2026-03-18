'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ops! Algo deu errado</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Ocorreu um erro ao carregar as informações. Isso pode ser um problema temporário de conexão.
        </p>
        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
