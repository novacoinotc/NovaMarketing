import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getProjectById, getProjectsByOrgId } from '@/lib/db/queries/projects';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const { projectId } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectById(projectId),
    getProjectsByOrgId(session.user.orgId),
  ]);

  if (!project || project.status === 'deleted') {
    notFound();
  }

  const projects = allProjects
    .filter((p) => p.status !== 'deleted')
    .map((p) => ({ id: p.id, name: p.name }));

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar projectId={projectId} projectName={project.name} projects={projects} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
