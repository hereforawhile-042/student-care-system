import { createClient } from "@supabase/supabase-js";

// For Vite: use import.meta.env
const supabaseUrl = "https://kudmfyhrvirrnujfxvyu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ZG1meWhydmlycm51amZ4dnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMzMzNzMsImV4cCI6MjA2NzgwOTM3M30.6N43uR6WjB-BEWNrWGriFeq-rKzGUimO5ZJRSczGvso";

export const supabase = createClient(supabaseUrl, supabaseKey);
