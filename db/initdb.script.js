#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        password TEXT,
        is_admin BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT,
        message TEXT,
        added TIMESTAMP
    );
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Done");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
  }
}

main();
