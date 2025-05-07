// import type { Pool } from "mysql2/promise";
// import type { Adapter } from "next-auth/adapters";

// export function MySQLAdapter(pool: Pool): Adapter {
//   return {
//     async createUser(user) {
//       const { name, email, emailVerified, image } = user;
//       const connection = await pool.getConnection();
//       try {
//         const [result] = await connection.execute(
//           "INSERT INTO users (name, email, email_verified, image) VALUES (?, ?, ?, ?)",
//           [
//             name,
//             email,
//             emailVerified
//               ? new Date(emailVerified)
//                   .toISOString()
//                   .slice(0, 19)
//                   .replace("T", " ")
//               : null,
//             image,
//           ]
//         );
//         const id = (result as any).insertId;
//         return { id: id.toString(), ...user };
//       } finally {
//         connection.release();
//       }
//     },
//     async getUser(id) {
//       const connection = await pool.getConnection();
//       try {
//         const [rows] = await connection.execute(
//           "SELECT id, name, email, email_verified, image FROM users WHERE id = ?",
//           [id]
//         );
//         const user = (rows as any)[0];
//         if (!user) return null;
//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//           emailVerified: user.email_verified
//             ? new Date(user.email_verified)
//             : null,
//           image: user.image,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async getUserByEmail(email) {
//       const connection = await pool.getConnection();
//       try {
//         const [rows] = await connection.execute(
//           "SELECT id, name, email, email_verified, image FROM users WHERE email = ?",
//           [email]
//         );
//         const user = (rows as any)[0];
//         if (!user) return null;
//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//           emailVerified: user.email_verified
//             ? new Date(user.email_verified)
//             : null,
//           image: user.image,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async getUserByAccount({ providerAccountId, provider }) {
//       const connection = await pool.getConnection();
//       try {
//         const [rows] = await connection.execute(
//           `SELECT u.id, u.name, u.email, u.email_verified, u.image
//            FROM users u
//            JOIN accounts a ON u.id = a.user_id
//            WHERE a.provider_id = ? AND a.provider_account_id = ?`,
//           [provider, providerAccountId]
//         );
//         const user = (rows as any)[0];
//         if (!user) return null;
//         return {
//           id: user.id.toString(),
//           name: user.name,
//           email: user.email,
//           emailVerified: user.email_verified
//             ? new Date(user.email_verified)
//             : null,
//           image: user.image,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async updateUser(user) {
//       const { id, name, email, emailVerified, image } = user;
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "UPDATE users SET name = ?, email = ?, email_verified = ?, image = ? WHERE id = ?",
//           [
//             name,
//             email,
//             emailVerified
//               ? new Date(emailVerified)
//                   .toISOString()
//                   .slice(0, 19)
//                   .replace("T", " ")
//               : null,
//             image,
//             id,
//           ]
//         );
//         return user;
//       } finally {
//         connection.release();
//       }
//     },
//     async deleteUser(userId) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
//       } finally {
//         connection.release();
//       }
//     },
//     async linkAccount(account) {
//       const {
//         userId,
//         provider,
//         type,
//         providerAccountId,
//         refresh_token,
//         access_token,
//         expires_at,
//         token_type,
//         scope,
//         id_token,
//         session_state,
//       } = account;
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           `INSERT INTO accounts
//            (user_id, provider_id, provider_type, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//             userId,
//             provider,
//             type,
//             providerAccountId,
//             refresh_token,
//             access_token,
//             expires_at,
//             token_type,
//             scope,
//             id_token,
//             session_state,
//           ]
//         );
//       } finally {
//         connection.release();
//       }
//       return account;
//     },
//     async unlinkAccount({ providerAccountId, provider }) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "DELETE FROM accounts WHERE provider_id = ? AND provider_account_id = ?",
//           [provider, providerAccountId]
//         );
//       } finally {
//         connection.release();
//       }
//     },
//     async createSession({ sessionToken, userId, expires }) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "INSERT INTO sessions (user_id, expires, session_token) VALUES (?, ?, ?)",
//           [
//             userId,
//             new Date(expires).toISOString().slice(0, 19).replace("T", " "),
//             sessionToken,
//           ]
//         );
//         return {
//           userId,
//           sessionToken,
//           expires,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async getSessionAndUser(sessionToken) {
//       const connection = await pool.getConnection();
//       try {
//         const [sessionRows] = await connection.execute(
//           "SELECT * FROM sessions WHERE session_token = ?",
//           [sessionToken]
//         );
//         const session = (sessionRows as any)[0];
//         if (!session) return null;

//         const [userRows] = await connection.execute(
//           "SELECT * FROM users WHERE id = ?",
//           [session.user_id]
//         );
//         const user = (userRows as any)[0];
//         if (!user) return null;

//         return {
//           session: {
//             userId: session.user_id.toString(),
//             expires: new Date(session.expires),
//             sessionToken: session.session_token,
//           },
//           user: {
//             id: user.id.toString(),
//             name: user.name,
//             email: user.email,
//             emailVerified: user.email_verified
//               ? new Date(user.email_verified)
//               : null,
//             image: user.image,
//           },
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async updateSession({ sessionToken, userId, expires }) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "UPDATE sessions SET expires = ? WHERE session_token = ?",
//           [
//             new Date(expires).toISOString().slice(0, 19).replace("T", " "),
//             sessionToken,
//           ]
//         );
//         return {
//           userId,
//           sessionToken,
//           expires,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async deleteSession(sessionToken) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "DELETE FROM sessions WHERE session_token = ?",
//           [sessionToken]
//         );
//       } finally {
//         connection.release();
//       }
//     },
//     async createVerificationToken({ identifier, expires, token }) {
//       const connection = await pool.getConnection();
//       try {
//         await connection.execute(
//           "INSERT INTO verification_tokens (identifier, token, expires) VALUES (?, ?, ?)",
//           [
//             identifier,
//             token,
//             new Date(expires).toISOString().slice(0, 19).replace("T", " "),
//           ]
//         );
//         return {
//           identifier,
//           token,
//           expires,
//         };
//       } finally {
//         connection.release();
//       }
//     },
//     async useVerificationToken({ identifier, token }) {
//       const connection = await pool.getConnection();
//       try {
//         const [rows] = await connection.execute(
//           "SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?",
//           [identifier, token]
//         );
//         const verificationToken = (rows as any)[0];
//         if (!verificationToken) return null;

//         await connection.execute(
//           "DELETE FROM verification_tokens WHERE identifier = ? AND token = ?",
//           [identifier, token]
//         );

//         return {
//           identifier: verificationToken.identifier,
//           token: verificationToken.token,
//           expires: new Date(verificationToken.expires),
//         };
//       } finally {
//         connection.release();
//       }
//     },
//   };
// }
