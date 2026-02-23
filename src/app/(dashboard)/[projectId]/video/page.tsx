import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getVideos } from '@/lib/db/queries/video';
import { Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoScriptGenerator } from '@/components/dashboard/video-script-generator';
import { VideoList } from '@/components/dashboard/video-list';

export default async function VideoPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const vids = await getVideos(projectId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
          <Video className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Video Engine</h1>
          <p className="text-muted-foreground">{project.name} — Crea Reels, TikToks y Shorts con IA</p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generar script</TabsTrigger>
          <TabsTrigger value="videos">Videos ({vids.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <VideoScriptGenerator projectId={projectId} />
        </TabsContent>

        <TabsContent value="videos">
          <VideoList videos={vids} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
