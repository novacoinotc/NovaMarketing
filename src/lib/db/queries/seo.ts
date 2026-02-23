import { db } from '@/lib/db';
import { seoAudits, seoKeywords } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getAudits(projectId: string, limit = 10) {
  return db.select().from(seoAudits).where(eq(seoAudits.projectId, projectId)).orderBy(desc(seoAudits.auditedAt)).limit(limit);
}

export async function createAudit(data: {
  projectId: string;
  score?: number;
  issuesJson?: Record<string, unknown>;
  recommendationsJson?: Record<string, unknown>;
}) {
  const [audit] = await db.insert(seoAudits).values(data).returning();
  return audit;
}

export async function getKeywords(projectId: string) {
  return db.select().from(seoKeywords).where(eq(seoKeywords.projectId, projectId)).orderBy(seoKeywords.position);
}

export async function addKeyword(data: {
  projectId: string;
  keyword: string;
  position?: number;
  searchVolume?: number;
  difficulty?: number;
}) {
  const [kw] = await db.insert(seoKeywords).values(data).returning();
  return kw;
}

export async function deleteKeyword(id: string) {
  await db.delete(seoKeywords).where(eq(seoKeywords.id, id));
}
