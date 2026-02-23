import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Megaphone,
  Share2,
  Palette,
  Search,
  Video,
  BarChart3,
  Brain,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  { href: 'content', label: 'Contenido', description: 'Genera copy para ads, posts, blogs y emails', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10', phase: 1 },
  { href: 'ads', label: 'Publicidad', description: 'Gestiona campañas en Google, Meta y TikTok', icon: Megaphone, color: 'text-orange-500', bg: 'bg-orange-500/10', phase: 2 },
  { href: 'social', label: 'Redes Sociales', description: 'Programa y publica en todas tus redes', icon: Share2, color: 'text-pink-500', bg: 'bg-pink-500/10', phase: 2 },
  { href: 'design', label: 'Diseño', description: 'Genera imágenes y creativos con IA', icon: Palette, color: 'text-purple-500', bg: 'bg-purple-500/10', phase: 1 },
  { href: 'seo', label: 'SEO', description: 'Monitorea tu posicionamiento orgánico', icon: Search, color: 'text-green-500', bg: 'bg-green-500/10', phase: 3 },
  { href: 'video', label: 'Video', description: 'Crea Reels, TikToks y Shorts con IA', icon: Video, color: 'text-red-500', bg: 'bg-red-500/10', phase: 4 },
  { href: 'analytics', label: 'Analytics', description: 'Métricas unificadas de todos tus canales', icon: BarChart3, color: 'text-cyan-500', bg: 'bg-cyan-500/10', phase: 1 },
  { href: 'intelligence', label: 'Inteligencia', description: 'Análisis de mercado y competencia', icon: Brain, color: 'text-yellow-500', bg: 'bg-yellow-500/10', phase: 3 },
];

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project || project.status === 'deleted') {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status === 'active' ? 'Activo' : 'Pausado'}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-muted-foreground">
          {project.domain && (
            <span className="flex items-center gap-1.5 text-sm">
              <Globe className="h-3.5 w-3.5" />
              {project.domain}
            </span>
          )}
          {project.industry && (
            <Badge variant="outline">{project.industry}</Badge>
          )}
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => (
          <Link key={mod.href} href={`/${projectId}/${mod.href}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${mod.bg} ${mod.color}`}>
                      <mod.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{mod.label}</CardTitle>
                  </div>
                  {mod.phase > 1 && (
                    <Badge variant="outline" className="text-xs">
                      Fase {mod.phase}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{mod.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
