import { Search } from 'lucide-react';

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">SEO Engine</h1>
          <p className="text-muted-foreground">Monitorea y mejora tu posicionamiento orgánico</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 3
      </div>
    </div>
  );
}
