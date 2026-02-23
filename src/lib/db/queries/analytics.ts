import { db } from '@/lib/db';
import { analyticsSnapshots, reports, alerts } from '@/lib/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';

export async function getSnapshots(projectId: string, source?: string, limit = 90) {
  const conditions = [eq(analyticsSnapshots.projectId, projectId)];
  if (source) conditions.push(eq(analyticsSnapshots.source, source));

  return db.select().from(analyticsSnapshots)
    .where(and(...conditions))
    .orderBy(desc(analyticsSnapshots.date))
    .limit(limit);
}

export async function createSnapshot(data: {
  projectId: string;
  date: Date;
  source: string;
  metricsJson: Record<string, unknown>;
}) {
  const [snapshot] = await db.insert(analyticsSnapshots).values(data).returning();
  return snapshot;
}

export async function getReports(projectId: string, limit = 20) {
  return db.select().from(reports)
    .where(eq(reports.projectId, projectId))
    .orderBy(desc(reports.generatedAt))
    .limit(limit);
}

export async function createReport(data: {
  projectId: string;
  type: string;
  periodStart?: Date;
  periodEnd?: Date;
  dataJson?: Record<string, unknown>;
}) {
  const [report] = await db.insert(reports).values(data).returning();
  return report;
}

export async function getAlerts(projectId: string, limit = 50) {
  return db.select().from(alerts)
    .where(eq(alerts.projectId, projectId))
    .orderBy(desc(alerts.createdAt))
    .limit(limit);
}

export async function createAlert(data: {
  projectId: string;
  type: string;
  message: string;
  severity?: string;
  dataJson?: Record<string, unknown>;
}) {
  const [alert] = await db.insert(alerts).values(data).returning();
  return alert;
}

export async function markAlertSeen(id: string) {
  const [alert] = await db.update(alerts).set({ seen: true }).where(eq(alerts.id, id)).returning();
  return alert;
}
