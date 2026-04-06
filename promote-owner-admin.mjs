/**
 * Promote the owner user (OWNER_OPEN_ID) to admin role.
 * Run: node promote-owner-admin.mjs
 */

import { createConnection } from "mysql2/promise";
import { config } from "dotenv";

config();

const DATABASE_URL = process.env.DATABASE_URL;
const OWNER_OPEN_ID = process.env.OWNER_OPEN_ID;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not set");
  process.exit(1);
}

if (!OWNER_OPEN_ID) {
  console.error("❌ OWNER_OPEN_ID not set");
  process.exit(1);
}

console.log(`🔍 Promoting owner with openId: ${OWNER_OPEN_ID}`);

const conn = await createConnection(DATABASE_URL);

try {
  // Check if user exists
  const [rows] = await conn.execute(
    "SELECT id, name, email, role FROM users WHERE openId = ?",
    [OWNER_OPEN_ID]
  );

  if (!rows.length) {
    console.log("⚠️  User not found yet — they need to log in first to create their account.");
    console.log("   Once they log in, run this script again.");
    process.exit(0);
  }

  const user = rows[0];
  console.log(`👤 Found user: ${user.name || user.email || "(no name yet)"} — current role: ${user.role}`);

  if (user.role === "admin") {
    console.log("✅ User is already an admin!");
    process.exit(0);
  }

  // Promote to admin
  await conn.execute(
    "UPDATE users SET role = 'admin' WHERE openId = ?",
    [OWNER_OPEN_ID]
  );

  console.log("✅ Successfully promoted to admin!");

  // Verify
  const [updated] = await conn.execute(
    "SELECT id, name, email, role FROM users WHERE openId = ?",
    [OWNER_OPEN_ID]
  );
  console.log("   Verified role:", updated[0]?.role);

} finally {
  await conn.end();
}
