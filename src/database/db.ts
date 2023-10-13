import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const sql = postgres(`postgres://postgres@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`);

export const cleanDatabase = async () => {
  await sql.begin(async () => {
    await sql`DELETE FROM job_information`;
    await sql`DELETE FROM job_requirements`;
  });
};
