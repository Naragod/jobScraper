import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD = "" } = process.env;

const getSQLConnection = () => {
  if (process.env.ENVIRONMENT == "prod")
    return postgres(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, { ssl: true });
  return postgres(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);
};
export const sql = getSQLConnection();

export const cleanDatabase = async () => {
  await sql.begin(async () => {
    await sql`DELETE FROM job_information`;
    await sql`DELETE FROM job_requirements`;
  });
};
