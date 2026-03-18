export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-slate-500 font-medium animate-pulse">
        Carregando caçambas...
      </p>
    </div>
  );
}
