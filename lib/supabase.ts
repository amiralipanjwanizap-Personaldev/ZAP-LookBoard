import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are missing');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

export type Profile = {
  id: string;
  full_name: string;
  avatar_url: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
};

export type Board = {
  id: string;
  project_id: string;
  name: string;
  type: 'moodboard' | 'lookboard' | 'shotlist';
  config: any;
};

export type BoardItem = {
  id: string;
  board_id: string;
  type: 'image' | 'text' | 'look_card' | 'shot_card' | 'connector';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  z_index: number;
  content: any;
};
