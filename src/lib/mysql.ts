import mysql from "mysql2/promise";

const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
  maxIdle: 2,
  idleTimeout: 60000,
  enableKeepAlive: false,
  keepAliveInitialDelay: 0,
};

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

export const connection = global.mysqlPool || mysql.createPool(config);

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = connection;
}

export default connection;
