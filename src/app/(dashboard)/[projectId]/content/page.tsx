import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getContentByProject } from '@/lib/db/queries/content';
import { FileText } from 'lucide-react';
import { ContentGenerator } from '@/components/dashboard/content-generator';
import { ContentList } from '@/components/dashboard/content-list';

export default async function ContentPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project || project.status === 'deleted') {
    notFound();
  }

  const content = await getContentByProject(projectId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Engine</h1>
          <p className="text-muted-foreground">{project.name} — Genera contenido con IA</p>
        </div>
      </div>

      <ContentGenerator projectId={projectId} />
      <ContentList initialContent={content} projectId={projectId} />
    </div>
  );
}
