import dotenv from "dotenv"
import postgres from "postgres";

dotenv.config({path: `.env.${process.env.ENVIRONMENT}`})
export const sql = postgres(`postgres://postgres@${process.env.DB_HOST}:${process.env.DB_PORT}/postgres`);
