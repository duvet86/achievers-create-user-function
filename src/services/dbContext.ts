import type { Connection } from "mysql2/promise";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createConnection } from "mysql2/promise";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_HOST);
invariant(process.env.DATABASE_USER);
invariant(process.env.DATABASE_PASSWORD);
invariant(process.env.DATABASE_NAME);

export async function getConnectionAsync(): Promise<Connection> {
  const connection = await createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: true,
            ca: readFileSync(
              resolve(process.cwd(), "DigiCertGlobalRootCA.crt.pem"),
              "utf8",
            ),
          }
        : undefined,
  });

  return connection;
}
