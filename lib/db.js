import { neon } from '@neondatabase/serverless'

function getSQL() {
  return neon(process.env.DATABASE_URL)
}

export async function initDB() {
  const sql = getSQL()
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      crop TEXT NOT NULL,
      name TEXT NOT NULL,
      brand TEXT DEFAULT 'Pioneer',
      maturity TEXT,
      is_new BOOLEAN DEFAULT false,
      technologies TEXT[] DEFAULT '{}',
      selling_points TEXT,
      notes TEXT,
      scores JSONB DEFAULT '{}',
      placement JSONB DEFAULT '{}',
      entered_by TEXT,
      entered_by_role TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS crm_fields JSONB DEFAULT '{}'`
  await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS soy_traits JSONB DEFAULT '{}'`
  await sql`
    CREATE TABLE IF NOT EXISTS observations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      product_id UUID,
      date DATE NOT NULL,
      growth_stage TEXT,
      location TEXT,
      rating INTEGER DEFAULT 0,
      notes TEXT,
      photos TEXT[] DEFAULT '{}',
      entered_by TEXT,
      entered_by_role TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE observations ADD COLUMN IF NOT EXISTS gps JSONB DEFAULT NULL`
  await sql`
    CREATE TABLE IF NOT EXISTS plot_entries (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      type TEXT,
      field_name TEXT NOT NULL,
      date DATE NOT NULL,
      crop TEXT,
      growth_stage TEXT,
      location TEXT,
      field_notes TEXT,
      photos TEXT[] DEFAULT '{}',
      products_data JSONB DEFAULT '[]',
      entered_by TEXT,
      entered_by_role TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  await sql`ALTER TABLE plot_entries ADD COLUMN IF NOT EXISTS gps JSONB DEFAULT NULL`
}

export { getSQL }
