import * as dotenv from "dotenv";
import { ClientConfig, Pool } from 'pg';
dotenv.config();

const POSTGRES_DB = process.env.POSTGRES_DB as string;
const POSTGRES_HOST = process.env.POSTGRES_HOST as string;
const POSTGRES_PORT = process.env.POSTGRES_PORT as unknown as number;
const POSTGRES_USER = process.env.POSTGRES_USER as unknown as string;
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD as unknown as string;

export const pgConfig: ClientConfig = {
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_HOST,
    port: POSTGRES_PORT
};
export const pgPool = new Pool(pgConfig);
