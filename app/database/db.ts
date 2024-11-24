import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL);
export const db = client.db(process.env.MONGO_DB_NAME);
