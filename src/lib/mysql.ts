import mysql from "mysql2/promise";

// const dbConfig = {
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// };

// let cachedConnection: mysql.Connection | null = null;

// export async function getDBConnection() {
//   if (cachedConnection) return cachedConnection;

//   const connection = await mysql.createConnection(dbConfig);
//   cachedConnection = connection;

//   return connection;
// }

// if (!global.mysqlPool) {
//   global.mysqlPool = mysql.createPool(config);
// }

// let connection: mysql.Pool;

const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

export const connection = global.mysqlPool || mysql.createPool(config);

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = connection;
}

export default connection;
