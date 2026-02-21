import { Share2 } from 'lucide-react';

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-pink-500/10 p-2 text-pink-500">
          <Share2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Social Media Manager</h1>
          <p className="text-muted-foreground">Programa y publica en todas tus redes sociales</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 2
      </div>
    </div>
  );
}
