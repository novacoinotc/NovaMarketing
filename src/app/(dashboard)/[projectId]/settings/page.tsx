import { Settings } from 'lucide-react';

export default function ProjectSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configuración del proyecto</h1>
          <p className="text-muted-foreground">Brand kit, integraciones y ajustes generales</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Configuración en desarrollo — Fase 1 MVP
      </div>
    </div>
  );
}
