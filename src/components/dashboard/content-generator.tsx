'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';

const contentTypes = [
  { value: 'ad_copy', label: 'Copy para Ads', description: 'Headlines y descripciones para Google/Meta/TikTok Ads' },
  { value: 'social_post', label: 'Post para Redes', description: 'Posts para Instagram, Facebook, X, LinkedIn, TikTok' },
  { value: 'blog', label: 'Artículo de Blog', description: 'Artículos SEO-optimized de 800+ palabras' },
  { value: 'email', label: 'Email Marketing', description: 'Subject lines, cuerpo de email y CTA' },
  { value: 'script', label: 'Script de Video', description: 'Scripts para Reels, TikTok, YouTube Shorts' },
  { value: 'landing_page', label: 'Copy de Landing', description: 'Hero, beneficios, CTA y FAQ para landing pages' },
  { value: 'product_description', label: 'Descripción de Producto', description: 'Descripciones cortas y largas para productos/servicios' },
];

const platforms = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'tiktok', label: 'TikTok' },
];

const durations = [
  { value: '15 segundos', label: '15 segundos' },
  { value: '30 segundos', label: '30 segundos' },
  { value: '60 segundos', label: '60 segundos' },
];

export function ContentGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [type, setType] = useState('ad_copy');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [duration, setDuration] = useState('30 segundos');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type,
          prompt: prompt.trim(),
          platform: type === 'social_post' ? platform : undefined,
          duration: type === 'script' ? duration : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al generar');
      }

      const data = await res.json();
      setResult(data.content);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar contenido');
    } finally {
      setLoading(false);
    }
  }

  const selectedType = contentTypes.find((t) => t.value === type);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Generar contenido
          </CardTitle>
          <CardDescription>
            Describe qué necesitas y la IA generará contenido adaptado a tu marca.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Type */}
          <div className="space-y-2">
            <Label>Tipo de contenido</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((ct) => (
                  <SelectItem key={ct.value} value={ct.value}>
                    {ct.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedType && (
              <p className="text-xs text-muted-foreground">{selectedType.description}</p>
            )}
          </div>

          {/* Platform (only for social posts) */}
          {type === 'social_post' && (
            <div className="space-y-2">
              <Label>Plataforma</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Duration (only for scripts) */}
          {type === 'script' && (
            <div className="space-y-2">
              <Label>Duración del video</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Prompt */}
          <div className="space-y-2">
            <Label>Describe qué necesitas</Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                type === 'ad_copy'
                  ? 'Ej: Campaña para promocionar compra de Bitcoin con 0% comisión, enfocado en millennials mexicanos'
                  : type === 'social_post'
                  ? 'Ej: Post educativo sobre cómo funciona Bitcoin, tono accesible para principiantes'
                  : type === 'blog'
                  ? 'Ej: Artículo sobre las 5 mejores formas de invertir en crypto en México en 2026'
                  : type === 'email'
                  ? 'Ej: Email de bienvenida para nuevos usuarios que se registran en la plataforma'
                  : type === 'script'
                  ? 'Ej: Video explicando qué es Bitcoin en términos simples, estilo trending'
                  : 'Describe el contenido que necesitas...'
              }
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando con IA...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar contenido
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Result */}
      {result && (
        <Card className="border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base">Contenido generado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">
              {result}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(result)}
              >
                Copiar al portapapeles
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setResult(null);
                  setPrompt('');
                }}
              >
                Generar otro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
