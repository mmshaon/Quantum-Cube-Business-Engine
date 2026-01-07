const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    // একে একে সব টেবিল তৈরি করা হচ্ছে (Module Tree অনুযায়ী)
    await sql`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, username TEXT, role TEXT, metadata JSONB, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS cubes (id UUID PRIMARY KEY, name TEXT NOT NULL, branding JSONB, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY, cube_id UUID, title TEXT NOT NULL, status TEXT DEFAULT 'active', budget DECIMAL, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY, project_id UUID, title TEXT, priority TEXT, due_date TIMESTAMP)`;
    await sql`CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY, project_id UUID, amount DECIMAL, currency TEXT DEFAULT 'BDT', status TEXT DEFAULT 'pending')`;
    await sql`CREATE TABLE IF NOT EXISTS yusra_logs (id SERIAL PRIMARY KEY, action TEXT, details JSONB, timestamp TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS executive_decisions (id UUID PRIMARY KEY, cube_id UUID, decision_text TEXT, impact_score DECIMAL)`;

    return { 
      statusCode: 200, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ status: "SUCCESS", message: "QCBE & Yusra Tables are LIVE!" }) 
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
