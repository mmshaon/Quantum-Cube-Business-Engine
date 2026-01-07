const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    // কোর টেবিল তৈরি (QCBE Module Tree অনুযায়ী)
    await sql`
      CREATE TABLE IF NOT EXISTS cubes (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        branding JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY,
        cube_id UUID REFERENCES cubes(id),
        title TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        budget DECIMAL,
        metadata JSONB
      );
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY,
        project_id UUID REFERENCES projects(id),
        amount DECIMAL NOT NULL,
        currency TEXT DEFAULT 'BDT',
        status TEXT DEFAULT 'pending'
      );
    `;
    return { statusCode: 200, body: JSON.stringify({ message: "Database Schema Initialized Successfully" }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
