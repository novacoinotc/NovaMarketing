import { Palette } from 'lucide-react';

export default function DesignPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
          <Palette className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Design Engine</h1>
          <p className="text-muted-foreground">Genera imágenes y creativos con IA</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 1 MVP
      </div>
    </div>
  );
}
