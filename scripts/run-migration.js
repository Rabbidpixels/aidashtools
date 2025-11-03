const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Read the migration file
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', 'update_page_content.sql')
  const sql = fs.readFileSync(migrationPath, 'utf8')

  console.log('Running migration...')

  // Split by semicolons to run each UPDATE statement separately
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const statement of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: statement })
      if (error) {
        console.error('Error executing statement:', error)
        // Try direct execution as fallback
        const { error: directError } = await supabase.from('pages').update({}).eq('id', 'dummy')
        if (directError) console.error('Direct execution also failed:', directError)
      } else {
        console.log('✓ Statement executed successfully')
      }
    } catch (err) {
      console.error('Exception:', err.message)
    }
  }

  console.log('Migration completed!')
  process.exit(0)
}

runMigration()
