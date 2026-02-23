import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getAudits, getKeywords } from '@/lib/db/queries/seo';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SeoAuditPanel } from '@/components/dashboard/seo-audit-panel';
import { SeoKeywordTracker } from '@/components/dashboard/seo-keyword-tracker';

export default async function SeoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const [audits, keywords] = await Promise.all([
    getAudits(projectId),
    getKeywords(projectId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">SEO Engine</h1>
          <p className="text-muted-foreground">{project.name} — Monitorea y mejora tu posicionamiento</p>
        </div>
      </div>

      <Tabs defaultValue="audit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="keywords">Keywords ({keywords.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="audit">
          <SeoAuditPanel projectId={projectId} audits={audits} />
        </TabsContent>

        <TabsContent value="keywords">
          <SeoKeywordTracker projectId={projectId} keywords={keywords} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
