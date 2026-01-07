const { neon } = require('@neondatabase/serverless');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const sql = neon(process.env.DATABASE_URL);
  const data = JSON.parse(event.body);

  try {
    // Yusra-র অ্যাকশন ডাটাবেসে সেভ করা
    const logId = uuidv4();
    await sql`INSERT INTO yusra_logs (action, details) VALUES (${data.action}, ${JSON.stringify(data.context)})`;
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        status: "Executive Order Executed",
        yusra_response: "Understood. I have updated the cube logs, Maynul."
      }) 
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
