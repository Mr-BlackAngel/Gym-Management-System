// SAFEST VERSION — cannot break UI
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ilymrsgbgdhzqnxypwcm.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseW1yc2diZ2RoenFueHlwd2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzY2NzIsImV4cCI6MjA3ODYxMjY3Mn0.rs6FTM3SLgoz1pce0kc6E3hOefWm5rKHeg2HpWQ8OfE';

// NEVER return null — prevents blank screen
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConnected = true;


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

// --- Member & analytics helpers (append to src/lib/supabase.ts) ---

/* PAYMENTS */
export async function fetchPayments(): Promise<any[]> {
  const client = await ensureClient();
  const { data, error } = await client.from('payments').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function insertPayment(payload: any) {
  const client = await ensureClient();
  const { data, error } = await client.from('payments').insert([payload]);
  if (error) throw error;
  return data;
}

/* CHECKINS */
export async function fetchCheckins(): Promise<any[]> {
  const client = await ensureClient();
  const { data, error } = await client.from('checkins').select('*').order('timestamp', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function insertCheckin(payload: any) {
  const client = await ensureClient();
  const { data, error } = await client.from('checkins').insert([payload]);
  if (error) throw error;
  return data;
}

/* CLASSES & ENROLLMENTS */
export async function fetchClasses(): Promise<any[]> {
  const client = await ensureClient();
  const { data, error } = await client.from('classes').select('*, trainers(name,email)').order('starts_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}
export async function enrollClass(member_id: number, class_id: number) {
  const client = await ensureClient();
  // Check capacity
  const { data: countData, error: countErr } = await client
    .from('enrollments')
    .select('id', { count: 'exact' })
    .eq('class_id', class_id)
    .eq('status', 'active');
  if (countErr) throw countErr;

  const { data: clsData, error: clsErr } = await client.from('classes').select('capacity').eq('id', class_id).single();
  if (clsErr) throw clsErr;

  const currentCount = (countData as any[]).length || 0;
  if (clsData && currentCount >= clsData.capacity) throw new Error('Class is full');

  const { data, error } = await client.from('enrollments').insert([{ member_id, class_id }]);
  if (error) throw error;
  return data;
}
export async function fetchEnrollments(member_id: number) {
  const client = await ensureClient();
  const { data, error } = await client.from('enrollments').select('*, classes(*)').eq('member_id', member_id).order('enrolled_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* BMI & WORKOUTS */
export async function insertBMI(member_id: number, weightKg: number, heightCm: number, bmi: number, category: string) {
  const client = await ensureClient();
  const { data, error } = await client.from('bmi_history').insert([{ member_id, weight_kg: weightKg, height_cm: heightCm, bmi, category }]);
  if (error) throw error;
  return data;
}
export async function fetchBMIHistory(member_id: number) {
  const client = await ensureClient();
  const { data, error } = await client.from('bmi_history').select('*').eq('member_id', member_id).order('recorded_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
export async function insertWorkoutLog(member_id: number, workoutObj: any) {
  const client = await ensureClient();
  const { data, error } = await client.from('workout_logs').insert([{ member_id, workout: workoutObj }]);
  if (error) throw error;
  return data;
}
export async function fetchWorkoutLogs(member_id: number) {
  const client = await ensureClient();
  const { data, error } = await client.from('workout_logs').select('*').eq('member_id', member_id).order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/* SIGNUP */
export async function signupMember(payload: Partial<Member>) {
  const client = await ensureClient();
  const { data, error } = await client.from('members').insert([payload]);
  if (error) throw error;
  return data;
}
