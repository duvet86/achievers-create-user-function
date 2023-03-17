import fs from "fs";
import path from "path";

import type { Connection, ConnectionConfig } from "mysql";

import { createConnection } from "mysql";
import invariant from "tiny-invariant";

invariant(process.env.DATABASE_HOST);
invariant(process.env.DATABASE_USER);
invariant(process.env.DATABASE_PASSWORD);
invariant(process.env.DATABASE_NAME);

const config: ConnectionConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
  ssl: {
    ca: fs.readFileSync(
      path.join(__dirname, "BaltimoreCyberTrustRoot.crt.pem")
    ),
  },
};

const conn = createConnection(config);

export const getConnectionAsync = new Promise<Connection>((resolve, reject) => {
  conn.connect((err) => {
    if (err) {
      reject(err);
    } else {
      console.log("Connection established.");
      resolve(conn);
    }
  });
});

function createDbUsers() {
  conn.query("SELECT * FROM inventory", (err, results, fields) => {
    if (err) {
      throw err;
    } else {
      console.log(`Selected ${results.length} row(s).`);
    }

    for (let i = 0; i < results.length; i++) {
      console.log("Row: " + JSON.stringify(results[i]));
    }

    console.log("Done.");
  });

  conn.end(function (err) {
    if (err) {
      throw err;
    } else {
      console.log("Closing connection.");
    }
  });
}
