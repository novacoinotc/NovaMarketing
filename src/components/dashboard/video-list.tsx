'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Video, Copy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface VideoItem {
  id: string;
  script: string | null;
  duration: number | null;
  format: string | null;
  status: string | null;
  platformTarget: string | null;
  createdAt: string | Date | null;
}

const statusLabels: Record<string, string> = { draft: 'Borrador', generating: 'Generando', ready: 'Listo', published: 'Publicado' };
const platformLabels: Record<string, string> = { reels: 'Reels', tiktok: 'TikTok', shorts: 'Shorts', youtube: 'YouTube' };

export function VideoList({ videos }: { videos: VideoItem[] }) {
  const [selected, setSelected] = useState<VideoItem | null>(null);

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Video className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>No hay videos generados.</p>
          <p className="text-sm">Genera tu primer script de video.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {videos.map((vid) => (
          <Card key={vid.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setSelected(vid)}>
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{platformLabels[vid.platformTarget || ''] || vid.platformTarget}</Badge>
                <span className="text-sm">{vid.duration}s — {vid.format}</span>
                <Badge variant={vid.status === 'ready' ? 'default' : 'secondary'}>
                  {statusLabels[vid.status || 'draft']}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {vid.createdAt ? formatDistanceToNow(new Date(vid.createdAt), { addSuffix: true, locale: es }) : ''}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Script de video — {selected?.platformTarget} ({selected?.duration}s)</DialogTitle>
          </DialogHeader>
          {selected?.script && (
            <div className="space-y-4">
              <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">{selected.script}</div>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(selected.script!)}>
                <Copy className="mr-2 h-3.5 w-3.5" />Copiar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
