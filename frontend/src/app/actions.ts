'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function loginAction(formData: Record<string, unknown>) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || 'Falha ao fazer login' };
  }

  const data = await response.json();
  const cookieStore = await cookies();
  cookieStore.set('token', data.access_token, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  redirect('/login');
}

export async function createDumpsterAction(data: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/dumpsters`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || 'Falha ao criar caçamba' };
  }

  revalidatePath('/dumpsters');
  return { success: true };
}

export async function updateDumpsterAction(id: number, data: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/dumpsters/${id}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || 'Falha ao atualizar caçamba' };
  }

  revalidatePath('/dumpsters');
  return { success: true };
}

export async function createRentalAction(data: Record<string, unknown>) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/rentals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || 'Falha ao registrar locação' };
  }

  revalidatePath('/dumpsters');
  return { success: true };
}
