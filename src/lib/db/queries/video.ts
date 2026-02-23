import { db } from '@/lib/db';
import { videos, videoTemplates } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getVideos(projectId: string, limit = 50) {
  return db.select().from(videos).where(eq(videos.projectId, projectId)).orderBy(desc(videos.createdAt)).limit(limit);
}

export async function createVideo(data: {
  projectId: string;
  script?: string;
  duration?: number;
  format?: string;
  platformTarget?: string;
  status?: string;
}) {
  const [video] = await db.insert(videos).values(data).returning();
  return video;
}

export async function updateVideo(id: string, data: Partial<{
  script: string;
  videoUrl: string;
  voiceoverUrl: string;
  status: string;
}>) {
  const [video] = await db.update(videos).set(data).where(eq(videos.id, id)).returning();
  return video;
}

export async function getVideoTemplates(projectId: string) {
  return db.select().from(videoTemplates).where(eq(videoTemplates.projectId, projectId));
}
