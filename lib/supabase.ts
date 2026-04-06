import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://lbzfuhavenpxlqzxcnkt.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiemZ1aGF2ZW5weGxxenhjbmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDYzODUsImV4cCI6MjA5MTA4MjM4NX0.iseXJdMlnNM_A1nmrMyDgzkJ8Dvz8pfICzCDuew7E5s";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);