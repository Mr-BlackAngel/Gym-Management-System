// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Configuration
 * - For development you can keep the keys (as you had).
 * - For production: move these into environment variables (VITE_ or server-only).
 */
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ilymrsgbgdhzqnxypwcm.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseW1yc2diZ2RoenFueHlwd2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzY2NzIsImV4cCI6MjA3ODYxMjY3Mn0.rs6FTM3SLgoz1pce0kc6E3hOefWm5rKHeg2HpWQ8OfE';

/* Basic validation so app can gracefully run offline if keys missing */
const hasUrl = typeof SUPABASE_URL === 'string' && SUPABASE_URL.startsWith('http');
const hasKey = typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 30;

export const supabase: SupabaseClient | null = hasUrl && hasKey ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
export const isSupabaseConnected = supabase !== null;

/* -------------------------
   Types (match your SQL DDL)
   ------------------------- */
export interface Member {
  id?: number;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  plan?: string | null;
  status?: string | null;
  age?: number | null;
  gender?: string | null;
  address?: string | null;
  joined_date?: string | null;
  expiry_date?: string | null;
}

export interface Trainer {
  id?: number;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  phone?: string | null;
  specialization?: string | null;
  experience?: string | null;
  certification?: string | null;
  clients?: number | null;
  rating?: number | null;
  salary?: string | null;
  joined_date?: string | null;
}

export interface OneDayPass {
  id?: number;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  booking_type?: 'one_day_pass' | 'gym_tour';
  otp?: string | null;
  payment_status?: 'pending' | 'completed';
  amount?: number | null;
  booking_date?: string | null;
  qr_code?: string | null;
}

/* -------------------------
   Helpers
   ------------------------- */

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateBookingID(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `AKHADA${timestamp}${random}`;
}

/* -------------------------
   DB helpers (use from components)
   - Each returns { data, error } or throws (caller can handle)
   ------------------------- */

async function ensureClient() {
  if (!supabase) throw new Error('Supabase client not initialized. Check keys / env variables.');
  return supabase;
}

/* MEMBERS */
export async function fetchMembers(): Promise<Member[]> {
  const client = await ensureClient();
  const { data, error } = await client.from<Member>('members').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function insertMember(payload: Partial<Member>) {
  const client = await ensureClient();
  const { data, error } = await client.from('members').insert([payload]);
  if (error) throw error;
  return data;
}

export async function updateMember(id: number, payload: Partial<Member>) {
  const client = await ensureClient();
  const { data, error } = await client.from('members').update(payload).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteMember(id: number) {
  const client = await ensureClient();
  const { data, error } = await client.from('members').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/* TRAINERS */
export async function fetchTrainers(): Promise<Trainer[]> {
  const client = await ensureClient();
  const { data, error } = await client.from<Trainer>('trainers').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function insertTrainer(payload: Partial<Trainer>) {
  const client = await ensureClient();
  const { data, error } = await client.from('trainers').insert([payload]);
  if (error) throw error;
  return data;
}

export async function updateTrainer(id: number, payload: Partial<Trainer>) {
  const client = await ensureClient();
  const { data, error } = await client.from('trainers').update(payload).eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteTrainer(id: number) {
  const client = await ensureClient();
  const { data, error } = await client.from('trainers').delete().eq('id', id);
  if (error) throw error;
  return data;
}

/* ONE DAY PASS */
export async function insertOneDayPass(payload: Partial<OneDayPass>) {
  const client = await ensureClient();
  const { data, error } = await client.from('one_day_passes').insert([payload]);
  if (error) throw error;
  return data;
}
