import postgres from "postgres";

export const sql = postgres({ host: "localhost", port: 6321, db: "postgres", username: "postgres" });
