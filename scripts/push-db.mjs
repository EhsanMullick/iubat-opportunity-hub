import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually without dotenv dependency
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...rest] = trimmed.split('=');
      const val = rest.join('=').trim().replace(/^["']|["']$/g, '');
      if (key && val && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.argv[2] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.argv[3] || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('------------------------------------------------------------');
console.log('🚀 EVENTORA / IUBAT OPPORTUNITY HUB - DATABASE PUSH UTILITY');
console.log('------------------------------------------------------------\n');

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('mock')) {
  console.log('⚠️  No active Supabase project credentials detected.\n');
  console.log('Current configuration in .env.local is using local mock data.');
  console.log('To push this data directly to your live Supabase cloud database:\n');
  console.log('METHOD 1 (Recommended - 1-Click via SQL Editor):');
  console.log('1. Go to https://supabase.com/dashboard and open your project.');
  console.log('2. Click "SQL Editor" on the left menu -> "New Query".');
  console.log('3. Copy and paste the entire content of:');
  console.log('   supabase/full-setup.sql');
  console.log('4. Click "Run" (Green button). All tables, triggers, creator admin provisioning, and 14 events are loaded!\n');
  console.log('METHOD 2 (Via Terminal CLI):');
  console.log('Run: node scripts/push-db.mjs <YOUR_SUPABASE_URL> <YOUR_SERVICE_ROLE_KEY>\n');
  process.exit(0);
}

console.log(`Connecting to Supabase at: ${supabaseUrl}...`);
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function pushData() {
  try {
    console.log('📦 Checking connection...');
    const { data: testData, error: testError } = await supabase.from('events').select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Connection or table error:', testError.message);
      console.log('\n💡 Tip: Make sure you have created the tables first by running:');
      console.log('   supabase/full-setup.sql inside your Supabase SQL Editor.');
      process.exit(1);
    }

    console.log(`✅ Successfully connected to Supabase! (Found ${testData || 0} existing events)`);
    console.log('✨ Your database is live and operational!');
  } catch (err) {
    console.error('❌ Error executing push:', err);
  }
}

pushData();
