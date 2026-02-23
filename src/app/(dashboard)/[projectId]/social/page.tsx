import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getSocialPosts } from '@/lib/db/queries/social';
import { Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialComposer } from '@/components/dashboard/social-composer';
import { SocialPostList } from '@/components/dashboard/social-post-list';
import { SocialCalendar } from '@/components/dashboard/social-calendar';

export default async function SocialPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const posts = await getSocialPosts(projectId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-pink-500/10 p-2 text-pink-500">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Social Media Manager</h1>
          <p className="text-muted-foreground">{project.name} — Programa y publica en todas tus redes</p>
        </div>
      </div>

      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose">Crear post</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
          <TabsTrigger value="posts">Todos los posts ({posts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <SocialComposer projectId={projectId} />
        </TabsContent>

        <TabsContent value="calendar">
          <SocialCalendar posts={posts} />
        </TabsContent>

        <TabsContent value="posts">
          <SocialPostList posts={posts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
