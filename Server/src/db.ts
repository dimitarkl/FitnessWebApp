import pkg from "pg";
import * as dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();
const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: Number(process.env.DBPORT),
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch((err: Error) => console.error("Connection error", err));

export default pool;
