import mariadb from "mariadb";
import * as dotenv from "dotenv";

dotenv.config();
let pool: mariadb.Pool;
export const connectToDb = async () => {
  try {
    pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT as string),
    });
    console.log("Connected to database");
  } catch (err) {
    console.log(err);
    throw err;
  }
};

process.on("exit", () => {
  pool.end();
});
export async function query(
  sqlStatement: string,
  params?: any[]
): Promise<any> {
  if (!pool) {
    await connectToDb();
  }
  let client;
  try {
    client = await pool.getConnection();
    const response = await client.query(sqlStatement, params);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    if (client) client.release();
  }
}
