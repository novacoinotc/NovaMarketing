'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Instagram, Facebook, Twitter, Linkedin, Send, Share2 } from 'lucide-react';

interface Post {
  id: string;
  platform: string;
  content: string;
  status: string | null;
  scheduledAt: string | Date | null;
  publishedAt: string | Date | null;
  createdAt: string | Date | null;
}

const platformIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  linkedin: Linkedin,
  tiktok: Send,
};

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  published: 'Publicado',
  failed: 'Error',
};

const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  scheduled: 'outline',
  published: 'default',
  failed: 'destructive',
};

export function SocialPostList({ posts }: { posts: Post[] }) {
  const filtered = posts.filter((p) => p.status !== 'deleted');

  if (filtered.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Share2 className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>No hay posts creados aún.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((post) => {
        const Icon = platformIcons[post.platform] || Share2;
        return (
          <Card key={post.id}>
            <CardContent className="flex items-start gap-3 py-3">
              <div className="rounded-lg bg-muted p-2 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={statusVariants[post.status || 'draft']}>
                    {statusLabels[post.status || 'draft']}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">{post.platform}</span>
                  {post.scheduledAt && (
                    <span className="text-xs text-muted-foreground">
                      Programado: {new Date(post.scheduledAt).toLocaleString('es-MX')}
                    </span>
                  )}
                </div>
                <p className="text-sm line-clamp-3">{post.content}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {post.createdAt
                  ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })
                  : ''}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
