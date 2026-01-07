const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  const method = event.httpMethod;

  try {
    if (method === 'GET') {
      const projects = await sql`SELECT * FROM projects ORDER BY created_at DESC`;
      return { statusCode: 200, body: JSON.stringify(projects) };
    }
    
    if (method === 'POST') {
      const { id, cube_id, title, budget } = JSON.parse(event.body);
      await sql`INSERT INTO projects (id, cube_id, title, budget) VALUES (${id}, ${cube_id}, ${title}, ${budget})`;
      return { statusCode: 201, body: JSON.stringify({ message: "Project Created" }) };
    }
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
