'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2, Video } from 'lucide-react';

const platformOptions = [
  { value: 'reels', label: 'Instagram Reels' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'shorts', label: 'YouTube Shorts' },
];

const durationOptions = [
  { value: '15', label: '15 segundos' },
  { value: '30', label: '30 segundos' },
  { value: '60', label: '60 segundos' },
];

export function VideoScriptGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('reels');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), duration: parseInt(duration), platform }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error');
      }

      const data = await res.json();
      setResult(data.script);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-red-500" />
            Generar script de video
          </CardTitle>
          <CardDescription>
            Crea scripts virales para Reels, TikTok y YouTube Shorts con hooks que enganchan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {platformOptions.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Duración</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {durationOptions.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Describe el video que necesitas</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Video explicando qué es Bitcoin en 30 segundos, estilo educativo y visual, con datos impactantes"
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando script...</> : <><Sparkles className="mr-2 h-4 w-4" />Generar script</>}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-red-500/30">
          <CardHeader><CardTitle className="text-base">Script generado</CardTitle></CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">{result}</div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(result)}>Copiar script</Button>
              <Button variant="outline" size="sm" onClick={() => { setResult(null); setPrompt(''); }}>Generar otro</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
