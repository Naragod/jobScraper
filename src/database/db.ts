import dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: `.env.${process.env.ENVIRONMENT}` });
const { DB_HOST, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD = "", DB_SSL } = process.env;
export const sql = postgres(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`, {
  ssl: <any>DB_SSL,
});

export const cleanDatabase = async () => {
  await sql.begin(async () => {
    await sql`DELETE FROM job_information`;
    await sql`DELETE FROM job_requirements`;
  });
};
