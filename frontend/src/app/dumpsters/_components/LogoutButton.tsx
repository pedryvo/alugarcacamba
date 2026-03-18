'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from '../../actions';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logoutAction()}
      className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sair
    </button>
  );
}
