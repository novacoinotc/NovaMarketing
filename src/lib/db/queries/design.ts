import { db } from '@/lib/db';
import { designAssets, designTemplates, brandKits } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getAssetsByProject(projectId: string, limit = 50) {
  return db.select().from(designAssets).where(eq(designAssets.projectId, projectId)).orderBy(desc(designAssets.createdAt)).limit(limit);
}

export async function createAsset(data: {
  projectId: string;
  type: string;
  url: string;
  format?: string;
  dimensions?: string;
  aiPrompt?: string;
}) {
  const [asset] = await db.insert(designAssets).values(data).returning();
  return asset;
}

export async function getTemplatesByProject(projectId: string) {
  return db.select().from(designTemplates).where(eq(designTemplates.projectId, projectId)).orderBy(desc(designTemplates.createdAt));
}

export async function createTemplate(data: {
  projectId: string;
  name: string;
  htmlTemplate: string;
  variablesSchema?: Record<string, unknown>;
}) {
  const [template] = await db.insert(designTemplates).values(data).returning();
  return template;
}

export async function getTemplateById(id: string) {
  const [template] = await db.select().from(designTemplates).where(eq(designTemplates.id, id)).limit(1);
  return template ?? null;
}

export async function getBrandKit(projectId: string) {
  const [kit] = await db.select().from(brandKits).where(eq(brandKits.projectId, projectId)).limit(1);
  return kit ?? null;
}
