'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone } from 'lucide-react';

interface Campaign {
  id: string;
  platform: string;
  name: string;
  budget: number | null;
  status: string | null;
  objective: string | null;
  createdAt: string | Date | null;
}

const platformLabels: Record<string, string> = { google: 'Google Ads', meta: 'Meta Ads', tiktok: 'TikTok Ads' };
const platformColors: Record<string, string> = { google: 'bg-blue-100 text-blue-800', meta: 'bg-indigo-100 text-indigo-800', tiktok: 'bg-gray-100 text-gray-800' };
const statusLabels: Record<string, string> = { draft: 'Borrador', active: 'Activa', paused: 'Pausada', ended: 'Finalizada' };
const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = { draft: 'secondary', active: 'default', paused: 'outline', ended: 'secondary' };

export function CampaignList({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Megaphone className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>No hay campañas creadas.</p>
          <p className="text-sm">Crea tu primera campaña en la pestaña &quot;Crear campaña&quot;.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {campaigns.map((c) => (
        <Card key={c.id}>
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Badge className={platformColors[c.platform] || ''} variant="secondary">
                {platformLabels[c.platform] || c.platform}
              </Badge>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                {c.objective && <p className="text-xs text-muted-foreground capitalize">{c.objective}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {c.budget !== null && c.budget > 0 && (
                <span className="text-sm font-medium">${c.budget.toLocaleString()} MXN</span>
              )}
              <Badge variant={statusVariants[c.status || 'draft']}>
                {statusLabels[c.status || 'draft']}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
