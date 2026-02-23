import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getCompetitors, getMarketReports } from '@/lib/db/queries/intelligence';
import { Brain } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompetitorTracker } from '@/components/dashboard/competitor-tracker';
import { MarketReportPanel } from '@/components/dashboard/market-report-panel';

export default async function IntelligencePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const [comps, reports] = await Promise.all([
    getCompetitors(projectId),
    getMarketReports(projectId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Market Intelligence</h1>
          <p className="text-muted-foreground">{project.name} — Análisis de mercado y competencia</p>
        </div>
      </div>

      <Tabs defaultValue="competitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="competitors">Competidores ({comps.length})</TabsTrigger>
          <TabsTrigger value="reports">Reportes ({reports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors">
          <CompetitorTracker projectId={projectId} competitors={comps} />
        </TabsContent>

        <TabsContent value="reports">
          <MarketReportPanel projectId={projectId} reports={reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
