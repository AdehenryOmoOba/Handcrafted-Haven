import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require', max: 1 });

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Ensure users table exists (safe to run even if seed was used)
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Check for existing user
    const existing = await sql<{ id: string }[]>`SELECT id FROM users WHERE email=${email}`;
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashed});
    `;

    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), { status: 500 });
  }
}
