import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getProjectsByOrgId, getProjectStats } from '@/lib/db/queries/projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Megaphone, Share2, BarChart3, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CreateProjectButton } from '@/components/dashboard/create-project-button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const orgId = session!.user.orgId;

  const [allProjects, stats] = await Promise.all([
    getProjectsByOrgId(orgId),
    getProjectStats(orgId),
  ]);

  const projects = allProjects.filter((p) => p.status !== 'deleted');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Bienvenido, {session?.user?.name || 'Usuario'}
          </h1>
          <p className="text-muted-foreground">
            Panel principal — Todos tus proyectos en un solo lugar
          </p>
        </div>
        <CreateProjectButton />
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Proyectos activos</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contenidos generados</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalContent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campañas activas</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Posts programados</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mb-2">No tienes proyectos aún</CardTitle>
            <CardDescription className="mb-4 text-center">
              Crea tu primer proyecto para empezar a generar contenido, gestionar ads y más.
            </CardDescription>
            <CreateProjectButton />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/${project.id}`}>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  {project.domain && (
                    <CardDescription className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {project.domain}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Activo' : 'Pausado'}
                    </Badge>
                    {project.industry && (
                      <Badge variant="outline">{project.industry}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
