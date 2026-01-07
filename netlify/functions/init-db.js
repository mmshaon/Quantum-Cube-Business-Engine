const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    // একে একে টেবিল তৈরি করা হচ্ছে (Production Safety)
    await sql`CREATE TABLE IF NOT EXISTS cubes (id UUID PRIMARY KEY, name TEXT NOT NULL, branding JSONB, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY, cube_id UUID, title TEXT NOT NULL, status TEXT DEFAULT 'active', budget DECIMAL, metadata JSONB, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY, project_id UUID, amount DECIMAL NOT NULL, currency TEXT DEFAULT 'BDT', status TEXT DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS yusra_logs (id SERIAL PRIMARY KEY, action TEXT, details JSONB, timestamp TIMESTAMP DEFAULT NOW())`;
    
    return { statusCode: 200, body: JSON.stringify({ message: "Quantum Cube Schema Fully Initialized!" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
