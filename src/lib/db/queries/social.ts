import { db } from '@/lib/db';
import { socialPosts, socialAccounts } from '@/lib/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function getSocialPosts(projectId: string, limit = 100) {
  return db.select().from(socialPosts)
    .where(eq(socialPosts.projectId, projectId))
    .orderBy(desc(socialPosts.createdAt))
    .limit(limit);
}

export async function createSocialPost(data: {
  projectId: string;
  platform: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt?: Date;
  status?: string;
}) {
  const [post] = await db.insert(socialPosts).values({
    ...data,
    status: data.scheduledAt ? 'scheduled' : (data.status || 'draft'),
  }).returning();
  return post;
}

export async function updateSocialPost(id: string, data: Partial<{
  content: string;
  platform: string;
  scheduledAt: Date;
  status: string;
  mediaUrls: string[];
}>) {
  const [post] = await db.update(socialPosts).set(data).where(eq(socialPosts.id, id)).returning();
  return post;
}

export async function deleteSocialPost(id: string) {
  const [post] = await db.update(socialPosts).set({ status: 'deleted' }).where(eq(socialPosts.id, id)).returning();
  return post;
}

export async function getSocialAccounts(projectId: string) {
  return db.select().from(socialAccounts).where(eq(socialAccounts.projectId, projectId));
}

export async function getScheduledPosts(projectId: string, from: Date, to: Date) {
  return db.select().from(socialPosts)
    .where(and(
      eq(socialPosts.projectId, projectId),
      gte(socialPosts.scheduledAt, from),
      lte(socialPosts.scheduledAt, to),
    ))
    .orderBy(socialPosts.scheduledAt);
}
