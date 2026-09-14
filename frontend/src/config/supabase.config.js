import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://itzqsxmjyjfgtbolfhmq.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_V8IR0JutvkHftxijA5hBgw_ZMflxDza";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
