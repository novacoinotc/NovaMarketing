import { db } from '@/lib/db';
import { contentPieces } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getContentByProject(projectId: string, limit = 50) {
  return db
    .select()
    .from(contentPieces)
    .where(eq(contentPieces.projectId, projectId))
    .orderBy(desc(contentPieces.createdAt))
    .limit(limit);
}

export async function getContentById(id: string) {
  const [piece] = await db
    .select()
    .from(contentPieces)
    .where(eq(contentPieces.id, id))
    .limit(1);
  return piece ?? null;
}

export async function createContent(data: {
  projectId: string;
  type: string;
  title?: string;
  content: string;
  platform?: string;
  aiPromptUsed?: string;
}) {
  const [piece] = await db.insert(contentPieces).values(data).returning();
  return piece;
}

export async function updateContentStatus(id: string, status: string) {
  const [piece] = await db
    .update(contentPieces)
    .set({ status, updatedAt: new Date() })
    .where(eq(contentPieces.id, id))
    .returning();
  return piece;
}

export async function deleteContent(id: string) {
  const [piece] = await db
    .update(contentPieces)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(contentPieces.id, id))
    .returning();
  return piece;
}
