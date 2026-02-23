'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Copy, Trash2 } from 'lucide-react';

interface ContentPiece {
  id: string;
  type: string;
  title: string | null;
  content: string;
  status: string | null;
  platform: string | null;
  createdAt: string | Date | null;
}

const typeLabels: Record<string, string> = {
  ad_copy: 'Ad Copy',
  social_post: 'Post Social',
  blog: 'Blog',
  email: 'Email',
  script: 'Script',
  landing_page: 'Landing',
  product_description: 'Producto',
};

const typeColors: Record<string, string> = {
  ad_copy: 'bg-orange-100 text-orange-800',
  social_post: 'bg-pink-100 text-pink-800',
  blog: 'bg-green-100 text-green-800',
  email: 'bg-blue-100 text-blue-800',
  script: 'bg-red-100 text-red-800',
  landing_page: 'bg-purple-100 text-purple-800',
  product_description: 'bg-cyan-100 text-cyan-800',
};

export function ContentList({ initialContent, projectId }: { initialContent: ContentPiece[]; projectId: string }) {
  const [selected, setSelected] = useState<ContentPiece | null>(null);

  const content = initialContent.filter((c) => c.status !== 'archived');

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>Aún no has generado contenido para este proyecto.</p>
          <p className="text-sm">Usa el generador de arriba para crear tu primer contenido.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de contenido ({content.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {content.map((piece) => (
              <button
                key={piece.id}
                onClick={() => setSelected(piece)}
                className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge className={typeColors[piece.type] || ''} variant="secondary">
                    {typeLabels[piece.type] || piece.type}
                  </Badge>
                  <span className="truncate text-sm font-medium">
                    {piece.title || 'Sin título'}
                  </span>
                  {piece.platform && (
                    <Badge variant="outline" className="text-xs shrink-0">
                      {piece.platform}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {piece.createdAt
                    ? formatDistanceToNow(new Date(piece.createdAt), { addSuffix: true, locale: es })
                    : ''}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selected && (
                <Badge className={typeColors[selected.type] || ''} variant="secondary">
                  {typeLabels[selected.type] || selected.type}
                </Badge>
              )}
              {selected?.title || 'Contenido generado'}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">
                {selected.content}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(selected.content)}
                >
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Copiar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
