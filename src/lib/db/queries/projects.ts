import { db } from '@/lib/db';
import { projects, organizations, contentPieces, adCampaigns, socialPosts } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';

export async function getProjectsByOrgId(orgId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.orgId, orgId))
    .orderBy(projects.createdAt);
}

export async function getProjectById(projectId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);
  return project ?? null;
}

export async function getProjectStats(orgId: string) {
  const activeProjects = await db
    .select({ count: count() })
    .from(projects)
    .where(and(eq(projects.orgId, orgId), eq(projects.status, 'active')));

  const totalContent = await db
    .select({ count: count() })
    .from(contentPieces)
    .innerJoin(projects, eq(contentPieces.projectId, projects.id))
    .where(eq(projects.orgId, orgId));

  const activeCampaigns = await db
    .select({ count: count() })
    .from(adCampaigns)
    .innerJoin(projects, eq(adCampaigns.projectId, projects.id))
    .where(and(eq(projects.orgId, orgId), eq(adCampaigns.status, 'active')));

  const scheduledPosts = await db
    .select({ count: count() })
    .from(socialPosts)
    .innerJoin(projects, eq(socialPosts.projectId, projects.id))
    .where(and(eq(projects.orgId, orgId), eq(socialPosts.status, 'scheduled')));

  return {
    activeProjects: activeProjects[0]?.count ?? 0,
    totalContent: totalContent[0]?.count ?? 0,
    activeCampaigns: activeCampaigns[0]?.count ?? 0,
    scheduledPosts: scheduledPosts[0]?.count ?? 0,
  };
}

export async function createProject(data: {
  orgId: string;
  name: string;
  domain?: string;
  industry?: string;
  brandKitJson?: Record<string, unknown>;
  targetAudienceJson?: Record<string, unknown>;
}) {
  const [project] = await db.insert(projects).values(data).returning();
  return project;
}

export async function updateProject(
  projectId: string,
  data: Partial<{
    name: string;
    domain: string;
    industry: string;
    status: string;
    brandKitJson: Record<string, unknown>;
    targetAudienceJson: Record<string, unknown>;
    competitorsJson: Record<string, unknown>;
  }>
) {
  const [project] = await db
    .update(projects)
    .set(data)
    .where(eq(projects.id, projectId))
    .returning();
  return project;
}

export async function deleteProject(projectId: string) {
  const [project] = await db
    .update(projects)
    .set({ status: 'deleted' })
    .where(eq(projects.id, projectId))
    .returning();
  return project;
}
