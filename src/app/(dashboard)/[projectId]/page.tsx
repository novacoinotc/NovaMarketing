import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Megaphone,
  Share2,
  Palette,
  Search,
  Video,
  BarChart3,
  Brain,
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  { href: 'content', label: 'Contenido', description: 'Genera copy para ads, posts, blogs y emails', icon: FileText, color: 'text-blue-500' },
  { href: 'ads', label: 'Publicidad', description: 'Gestiona campañas en Google, Meta y TikTok', icon: Megaphone, color: 'text-orange-500' },
  { href: 'social', label: 'Redes Sociales', description: 'Programa y publica en todas tus redes', icon: Share2, color: 'text-pink-500' },
  { href: 'design', label: 'Diseño', description: 'Genera imágenes y creativos con IA', icon: Palette, color: 'text-purple-500' },
  { href: 'seo', label: 'SEO', description: 'Monitorea y mejora tu posicionamiento orgánico', icon: Search, color: 'text-green-500' },
  { href: 'video', label: 'Video', description: 'Crea Reels, TikToks y Shorts con IA', icon: Video, color: 'text-red-500' },
  { href: 'analytics', label: 'Analytics', description: 'Métricas unificadas de todos tus canales', icon: BarChart3, color: 'text-cyan-500' },
  { href: 'intelligence', label: 'Inteligencia', description: 'Análisis de mercado y competencia', icon: Brain, color: 'text-yellow-500' },
];

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  // TODO: Fetch project from DB
  const projectName = 'Proyecto';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{projectName}</h1>
        <p className="text-muted-foreground">Overview del proyecto — Accede a todos los módulos</p>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((mod) => (
          <Link key={mod.href} href={`/${projectId}/${mod.href}`}>
            <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg bg-muted p-2 ${mod.color}`}>
                    <mod.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{mod.label}</CardTitle>
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
