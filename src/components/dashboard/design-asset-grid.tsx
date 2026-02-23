'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon } from 'lucide-react';

interface Asset {
  id: string;
  type: string;
  url: string;
  format: string | null;
  dimensions: string | null;
  createdAt: string | Date | null;
}

const typeLabels: Record<string, string> = {
  ad_image: 'Ad',
  social_post: 'Social',
  banner: 'Banner',
  carousel: 'Carrusel',
  thumbnail: 'Thumbnail',
};

export function DesignAssetGrid({ assets }: { assets: Asset[] }) {
  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <ImageIcon className="mx-auto mb-3 h-8 w-8 opacity-50" />
          <p>No hay assets generados aún.</p>
          <p className="text-sm">Genera tu primer creativo en la pestaña &quot;Generar creativos&quot;.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden">
          <div className="aspect-video bg-muted flex items-center justify-center">
            {asset.url.startsWith('http') ? (
              <img src={asset.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
            )}
          </div>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{typeLabels[asset.type] || asset.type}</Badge>
              {asset.dimensions && <span className="text-xs text-muted-foreground">{asset.dimensions}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
