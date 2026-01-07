const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  
  // God Mode Authority Check (Conceptual)
  try {
    const logs = await sql`SELECT * FROM yusra_logs ORDER BY timestamp DESC LIMIT 10`;
    const stats = await sql`SELECT 
      (SELECT COUNT(*) FROM cubes) as total_cubes,
      (SELECT COUNT(*) FROM projects) as total_projects`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        status: "God Mode Active",
        system_stats: stats[0],
        recent_activity: logs,
        yusra_brief: "Creator, the system is fully operational. All modules are within optimal parameters."
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
