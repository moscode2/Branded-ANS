import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rzjlwngoqgptmfgbowrh.supabase.co'
const supabaseKey = 'sb_publishable_wN47H_vCARG9BnChTUB55g_wdL9x_-s'

export const supabase = createClient(supabaseUrl, supabaseKey)