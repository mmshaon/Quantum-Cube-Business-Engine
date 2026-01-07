const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    // ১. কোর ইউজার ও অথ টেবিল
    await sql`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY, username TEXT, role TEXT, metadata JSONB)`;
    
    // ২. কিউব ও মডিউল ম্যানেজমেন্ট
    await sql`CREATE TABLE IF NOT EXISTS cubes (id UUID PRIMARY KEY, name TEXT NOT NULL, branding JSONB, created_at TIMESTAMP DEFAULT NOW())`;
    
    // ৩. প্রজেক্ট ও টাস্ক মডিউল (Module 5 & 6)
    await sql`CREATE TABLE IF NOT EXISTS projects (id UUID PRIMARY KEY, cube_id UUID, title TEXT NOT NULL, status TEXT DEFAULT 'active', budget DECIMAL, created_at TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS tasks (id UUID PRIMARY KEY, project_id UUID, title TEXT, priority TEXT, due_date TIMESTAMP)`;
    
    // ৪. ফিন্যান্স ও ইনভয়েস (Module 7)
    await sql`CREATE TABLE IF NOT EXISTS invoices (id UUID PRIMARY KEY, project_id UUID, amount DECIMAL, currency TEXT DEFAULT 'BDT', status TEXT DEFAULT 'pending')`;
    
    // ৫. ইউসরা ইন্টেলিজেন্স ও লগ (Yusra Module 1.2 & 13)
    await sql`CREATE TABLE IF NOT EXISTS yusra_logs (id SERIAL PRIMARY KEY, action TEXT, details JSONB, timestamp TIMESTAMP DEFAULT NOW())`;
    await sql`CREATE TABLE IF NOT EXISTS executive_decisions (id UUID PRIMARY KEY, cube_id UUID, decision_text TEXT, impact_score DECIMAL)`;

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "SUCCESS: All QCBE & Yusra Modules Initialized in Neon DB!" }) 
    };
  } catch (err) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message, hint: "Check Neon Connection String" }) 
    };
  }
};
