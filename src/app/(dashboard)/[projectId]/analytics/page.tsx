import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getSnapshots, getAlerts } from '@/lib/db/queries/analytics';
import { BarChart3 } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const [snapshots, projectAlerts] = await Promise.all([
    getSnapshots(projectId),
    getAlerts(projectId, 10),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">{project.name} — Métricas unificadas</p>
        </div>
      </div>

      <AnalyticsDashboard
        projectId={projectId}
        snapshots={snapshots}
        alerts={projectAlerts}
      />
    </div>
  );
}
