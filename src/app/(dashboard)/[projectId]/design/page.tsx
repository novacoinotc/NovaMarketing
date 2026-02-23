import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getAssetsByProject, getTemplatesByProject } from '@/lib/db/queries/design';
import { Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DesignGenerator } from '@/components/dashboard/design-generator';
import { DesignAssetGrid } from '@/components/dashboard/design-asset-grid';
import { DesignTemplateList } from '@/components/dashboard/design-template-list';

export default async function DesignPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const [assets, templates] = await Promise.all([
    getAssetsByProject(projectId),
    getTemplatesByProject(projectId),
  ]);

  const brandKit = (project.brandKitJson as Record<string, unknown>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Design Engine</h1>
          <p className="text-muted-foreground">{project.name} — Creativos y assets visuales con IA</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generar creativos</TabsTrigger>
          <TabsTrigger value="assets">Assets ({assets.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <DesignGenerator projectId={projectId} brandKit={brandKit} />
        </TabsContent>

        <TabsContent value="assets">
          <DesignAssetGrid assets={assets} />
        </TabsContent>

        <TabsContent value="templates">
          <DesignTemplateList templates={templates} projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
