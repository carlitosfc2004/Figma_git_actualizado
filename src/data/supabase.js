import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://mubhgqlcxnxtvrmalrgm.supabase.co'
const SUPABASE_KEY = 'sb_publishable_7nifc3j1ku1PYCiUG0NHHQ_0bYx9I70'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)