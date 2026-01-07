const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const result = await sql`SELECT now();`;
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Connected to Neon!", time: result[0].now }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
