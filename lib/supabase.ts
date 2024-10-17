import { createClient } from '@supabase/supabase-js';

// Your Supabase API URL and public key from your project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;



// Create a single Supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const uploadAudioToSupabase = async (fileName: string, fileBuffer: Buffer) => {
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(fileName, fileBuffer, {
      contentType: 'audio/mpeg',
    });

  if (error) {
    throw new Error(`Failed to upload audio to Supabase: ${error.message}`);
  }

  const publicUrl = supabase.storage.from('audio-files').getPublicUrl(fileName);
  return publicUrl.data.publicUrl;
};
