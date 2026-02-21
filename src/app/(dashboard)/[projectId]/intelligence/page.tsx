import { Brain } from 'lucide-react';

export default function IntelligencePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Market Intelligence</h1>
          <p className="text-muted-foreground">Análisis de mercado, competencia y tendencias</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 3
      </div>
    </div>
  );
}
