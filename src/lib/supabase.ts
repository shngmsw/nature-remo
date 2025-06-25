import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// データベースの型定義
export interface SensorData {
  id?: number;
  device_id: string;
  device_name: string;
  temperature?: number;
  humidity?: number;
  illuminance?: number;
  movement?: number;
  created_at?: string;
}

export interface Device {
  id: string;
  name: string;
  newest_events: {
    te?: { val: number; created_at: string }; // temperature
    hu?: { val: number; created_at: string }; // humidity
    il?: { val: number; created_at: string }; // illuminance
    mo?: { val: number; created_at: string }; // movement
  };
} 