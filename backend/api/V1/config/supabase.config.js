import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://itzqsxmjyjfgtbolfhmq.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_V8IR0JutvkHftxijA5hBgw_ZMflxDza";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Upload a file to a Supabase storage bucket
 * @param {string} bucketName
 * @param {string} filePath
 * @param {Buffer|Blob|File} fileData
 * @param {string} contentType
 * @returns {Promise<{publicUrl: string, path: string}>}
 */
export const uploadToSupabaseStorage = async (
  bucketName,
  filePath,
  fileData,
  contentType = "image/jpeg"
) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileData, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    publicUrl: publicUrlData.publicUrl,
  };
};

/**
 * Delete a file from Supabase storage by URL or path
 * @param {string} bucketName
 * @param {string} fileUrlOrPath
 */
export const deleteFromSupabaseStorage = async (bucketName, fileUrlOrPath) => {
  try {
    let filePath = fileUrlOrPath;
    if (fileUrlOrPath.includes("/storage/v1/object/public/")) {
      filePath = fileUrlOrPath.split(`/storage/v1/object/public/${bucketName}/`)[1];
    }
    if (!filePath) return;
    const { error } = await supabase.storage.from(bucketName).remove([filePath]);
    if (error) {
      console.error(`Error deleting file from Supabase Storage (${bucketName}):`, error);
    } else {
      console.log(`File ${filePath} deleted from Supabase Storage (${bucketName})`);
    }
  } catch (err) {
    console.error("Supabase storage delete error:", err);
  }
};

export default supabase;
