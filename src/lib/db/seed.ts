import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import bcrypt from 'bcryptjs';
import { organizations, users, projects } from './schema';

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Seeding database...');

  // Create Nahui Labs organization
  const [org] = await db
    .insert(organizations)
    .values({
      name: 'Nahui Labs',
      slug: 'nahui-labs',
      plan: 'agency',
    })
    .returning();

  console.log('Created organization:', org.name);

  // Create admin user (password: admin123 — change in production!)
  const passwordHash = await bcrypt.hash('admin123', 12);
  const [admin] = await db
    .insert(users)
    .values({
      orgId: org.id,
      email: 'hola@nahuilabs.com',
      name: 'Issac',
      passwordHash,
      role: 'admin',
    })
    .returning();

  console.log('Created admin user:', admin.email);

  // Create initial projects
  const projectsData = [
    {
      orgId: org.id,
      name: 'NovaCoin.mx',
      domain: 'novacoin.mx',
      industry: 'Fintech / Crypto',
      status: 'active',
    },
    {
      orgId: org.id,
      name: 'QuantumCash.mx',
      domain: 'quantumcash.mx',
      industry: 'Fintech / Pagos',
      status: 'active',
    },
    {
      orgId: org.id,
      name: 'Nahui Labs',
      domain: 'nahuilabs.com',
      industry: 'Software Development',
      status: 'active',
    },
  ];

  const createdProjects = await db.insert(projects).values(projectsData).returning();
  console.log('Created projects:', createdProjects.map((p) => p.name).join(', '));

  console.log('\nSeed completed!');
  console.log('Login with: hola@nahuilabs.com / admin123');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
