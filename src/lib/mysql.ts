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


const config = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
};

let connection: mysql.Pool;

declare global {
  // prevent multiple pools in dev
  var mysqlPool: mysql.Pool | undefined;
}

if (!global.mysqlPool) {
  global.mysqlPool = mysql.createPool(config);
}

connection = global.mysqlPool;

export default connection;

