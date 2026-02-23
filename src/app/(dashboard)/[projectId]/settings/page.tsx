import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandKitForm } from '@/components/dashboard/brand-kit-form';
import { AudienceForm } from '@/components/dashboard/audience-form';
import { ProjectInfoForm } from '@/components/dashboard/project-info-form';

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project || project.status === 'deleted') {
    notFound();
  }

  const brandKit = (project.brandKitJson as Record<string, unknown>) || {};
  const audience = (project.targetAudienceJson as Record<string, unknown>) || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">{project.name} — Brand kit, audiencia y datos generales</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="brand">Brand Kit</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <ProjectInfoForm
            projectId={projectId}
            initialData={{
              name: project.name,
              domain: project.domain || '',
              industry: project.industry || '',
            }}
          />
        </TabsContent>

        <TabsContent value="brand">
          <BrandKitForm projectId={projectId} initialData={brandKit} />
        </TabsContent>

        <TabsContent value="audience">
          <AudienceForm projectId={projectId} initialData={audience} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
