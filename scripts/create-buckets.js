// Quick script to create storage buckets — reads .env.local manually
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val.length) env[key.trim()] = val.join('=').trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createBuckets() {
  const { data: existing } = await supabase.storage.listBuckets();
  console.log('Existing buckets:', existing?.map(b => b.name));

  for (const name of ['packing-slips', 'dispatch-photos']) {
    const { data, error } = await supabase.storage.createBucket(name, {
      public: true,
      fileSizeLimit: 10485760,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
    });
    if (error) {
      console.log(error.message?.includes('already exists') ? `✅ ${name} already exists` : `❌ ${name}: ${error.message}`);
    } else {
      console.log(`✅ Created ${name}`, data);
    }
  }
}

createBuckets();
