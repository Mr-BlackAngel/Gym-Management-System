import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://ilymrsgbgdhzqnxypwcm.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseW1yc2diZ2RoenFueHlwd2NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwMzY2NzIsImV4cCI6MjA3ODYxMjY3Mn0.rs6FTM3SLgoz1pce0kc6E3hOefWm5rKHeg2HpWQ8OfE'; 

// Create Supabase client only if valid credentials are provided
// Otherwise, app will work in offline mode
const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');
const isValidKey = supabaseAnonKey && supabaseAnonKey.length > 30; // Supabase keys are long

export const supabase = isValidUrl && isValidKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is connected
export const isSupabaseConnected = supabase !== null;

// Database Types
export interface Member {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  plan: 'Basic' | 'Premium' | 'VIP';
  status: 'Active' | 'Expired';
  age: number;
  gender: string;
  address: string;
  joined_date: string;
  expiry_date: string;
}

export interface Trainer {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  experience: string;
  certification: string;
  clients: number;
  rating: number;
  salary: string;
  joined_date: string;
}

export interface OneDayPass {
  id: number;
  name: string;
  phone: string;
  email: string;
  booking_type: 'one_day_pass' | 'gym_tour';
  otp: string;
  payment_status: 'pending' | 'completed';
  amount: number;
  booking_date: string;
  qr_code: string;
}

// Helper function to generate OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to generate booking ID
export function generateBookingID(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `AKHADA${timestamp}${random}`;
}