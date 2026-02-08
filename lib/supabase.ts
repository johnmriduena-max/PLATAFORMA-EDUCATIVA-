
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dscbxulajupursvvsdhw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzY2J4dWxhanVwdXJzdnZzZGh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NzU2NTIsImV4cCI6MjA4NjE1MTY1Mn0.LWXpj0WEPWEsRg4RdoNi_23059-qW-cuetNbHkBtDpA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
