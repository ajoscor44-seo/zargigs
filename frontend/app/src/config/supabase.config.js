import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://itzqsxmjyjfgtbolfhmq.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_V8IR0JutvkHftxijA5hBgw_ZMflxDza";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Upload a file to Supabase storage bucket with progress callback simulation
 * @param {string} bucket - Bucket name: 'profile_pics', 'advertisements', 'proof_of_works'
 * @param {string} path - File path in the bucket
 * @param {File} file - File to upload
 * @param {function} onProgress - Optional callback for progress (percentage: number)
 * @returns {Promise<string>} - Returns the public download URL
 */
export const uploadFileToSupabase = async (bucket, path, file, onProgress) => {
  if (onProgress) {
    onProgress(30);
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw error;
  }

  if (onProgress) {
    onProgress(80);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (onProgress) {
    onProgress(100);
  }

  return publicUrlData.publicUrl;
};

export default supabase;
