import { FileText } from 'lucide-react';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Content Engine</h1>
          <p className="text-muted-foreground">Genera contenido para ads, redes, blogs y emails</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 1 MVP
      </div>
    </div>
  );
}
