import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbmljwhzuivwmyihluv.supabase.co';
const supabaseAnonKey = 'sb_publishable_oQ1jjgumCO5IQXCfx3MTHw_GRTMSCOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
