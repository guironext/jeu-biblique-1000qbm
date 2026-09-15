import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@1000qbm.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "Admin1234";

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    if (existing.role !== "ADMIN") {
      await db.update(users).set({ role: "ADMIN" }).where(eq(users.id, existing.id));
      console.log(`Existing user promoted to ADMIN: ${email}`);
      return;
    }
    console.log(`Admin already exists: ${email}`);
    return;
  }

  await db.insert(users).values({
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: "ADMIN",
  });

  console.log(`Admin created: ${email}`);
}

seedAdmin()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
