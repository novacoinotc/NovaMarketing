import { db } from '@/lib/db';
import { competitors, marketReports, audienceSegments } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getCompetitors(projectId: string) {
  return db.select().from(competitors).where(eq(competitors.projectId, projectId)).orderBy(competitors.name);
}

export async function addCompetitor(data: {
  projectId: string;
  name: string;
  domain?: string;
  socialHandlesJson?: Record<string, unknown>;
  notes?: string;
}) {
  const [comp] = await db.insert(competitors).values(data).returning();
  return comp;
}

export async function deleteCompetitor(id: string) {
  await db.delete(competitors).where(eq(competitors.id, id));
}

export async function getMarketReports(projectId: string, limit = 10) {
  return db.select().from(marketReports).where(eq(marketReports.projectId, projectId)).orderBy(desc(marketReports.generatedAt)).limit(limit);
}

export async function createMarketReport(data: {
  projectId: string;
  type: string;
  dataJson?: Record<string, unknown>;
  insightsJson?: Record<string, unknown>;
}) {
  const [report] = await db.insert(marketReports).values(data).returning();
  return report;
}

export async function getAudienceSegments(projectId: string) {
  return db.select().from(audienceSegments).where(eq(audienceSegments.projectId, projectId));
}

export async function createAudienceSegment(data: {
  projectId: string;
  name: string;
  demographicsJson?: Record<string, unknown>;
  interestsJson?: Record<string, unknown>;
  painPoints?: string;
  sizeEstimate?: number;
}) {
  const [segment] = await db.insert(audienceSegments).values(data).returning();
  return segment;
}
