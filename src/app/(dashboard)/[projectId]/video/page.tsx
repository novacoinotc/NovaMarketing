import { Video } from 'lucide-react';

export default function VideoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-red-500/10 p-2 text-red-500">
          <Video className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Video Engine</h1>
          <p className="text-muted-foreground">Crea Reels, TikToks y YouTube Shorts con IA</p>
        </div>
      </div>
      <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
        Módulo en desarrollo — Fase 4
      </div>
    </div>
  );
}
