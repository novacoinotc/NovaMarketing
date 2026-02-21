'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  Share2,
  Palette,
  Search,
  Video,
  BarChart3,
  Brain,
  Settings,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  projectId?: string;
  projectName?: string;
  projects?: { id: string; name: string }[];
}

const moduleLinks = [
  { href: '', label: 'Overview', icon: LayoutDashboard },
  { href: '/content', label: 'Contenido', icon: FileText },
  { href: '/ads', label: 'Publicidad', icon: Megaphone },
  { href: '/social', label: 'Redes Sociales', icon: Share2 },
  { href: '/design', label: 'Diseño', icon: Palette },
  { href: '/seo', label: 'SEO', icon: Search },
  { href: '/video', label: 'Video', icon: Video },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/intelligence', label: 'Inteligencia', icon: Brain },
  { href: '/settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ projectId, projectName, projects = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            N
          </div>
          <span className="text-lg font-semibold">Nova Marketing</span>
        </Link>
      </div>

      {/* Project Selector */}
      {projects.length > 0 && (
        <div className="border-b p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="truncate">{projectName || 'Seleccionar proyecto'}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {projects.map((project) => (
                <DropdownMenuItem key={project.id} asChild>
                  <Link href={`/${project.id}`}>{project.name}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {projectId ? (
            moduleLinks.map((link) => {
              const fullHref = `/${projectId}${link.href}`;
              const isActive = link.href === ''
                ? pathname === `/${projectId}`
                : pathname.startsWith(fullHref);

              return (
                <li key={link.href}>
                  <Link
                    href={fullHref}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              );
            })
          ) : (
            <li>
              <Link
                href="/"
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  pathname === '/'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Todos los proyectos
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          Ajustes generales
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
