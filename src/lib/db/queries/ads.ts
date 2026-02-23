import { db } from '@/lib/db';
import { adCampaigns, adCreatives, adKeywords, adAlerts } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function getCampaigns(projectId: string) {
  return db.select().from(adCampaigns).where(eq(adCampaigns.projectId, projectId)).orderBy(desc(adCampaigns.createdAt));
}

export async function getCampaignById(id: string) {
  const [campaign] = await db.select().from(adCampaigns).where(eq(adCampaigns.id, id)).limit(1);
  return campaign ?? null;
}

export async function createCampaign(data: {
  projectId: string;
  platform: string;
  name: string;
  budget?: number;
  objective?: string;
}) {
  const [campaign] = await db.insert(adCampaigns).values(data).returning();
  return campaign;
}

export async function updateCampaign(id: string, data: Partial<{
  name: string;
  budget: number;
  status: string;
  objective: string;
  metricsJson: Record<string, unknown>;
}>) {
  const [campaign] = await db.update(adCampaigns).set(data).where(eq(adCampaigns.id, id)).returning();
  return campaign;
}

export async function getCreatives(campaignId: string) {
  return db.select().from(adCreatives).where(eq(adCreatives.campaignId, campaignId));
}

export async function createCreative(data: {
  campaignId: string;
  headline?: string;
  description?: string;
  imageUrl?: string;
  cta?: string;
}) {
  const [creative] = await db.insert(adCreatives).values(data).returning();
  return creative;
}

export async function getKeywords(campaignId: string) {
  return db.select().from(adKeywords).where(eq(adKeywords.campaignId, campaignId));
}

export async function createKeyword(data: {
  campaignId: string;
  keyword: string;
  matchType?: string;
  bid?: number;
}) {
  const [kw] = await db.insert(adKeywords).values(data).returning();
  return kw;
}

export async function getAdAlerts(projectId: string, limit = 20) {
  return db.select().from(adAlerts).where(eq(adAlerts.projectId, projectId)).orderBy(desc(adAlerts.createdAt)).limit(limit);
}

export async function createAdAlert(data: {
  projectId: string;
  type: string;
  message: string;
  severity?: string;
}) {
  const [alert] = await db.insert(adAlerts).values(data).returning();
  return alert;
}
