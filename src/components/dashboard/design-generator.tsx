'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';

const formatOptions = [
  { value: '1200x628', label: 'Facebook/Google Ad (1200x628)' },
  { value: '1080x1080', label: 'Instagram Post (1080x1080)' },
  { value: '1080x1920', label: 'Story/Reel (1080x1920)' },
  { value: '1200x1200', label: 'Cuadrado Grande (1200x1200)' },
  { value: '1280x720', label: 'YouTube Thumbnail (1280x720)' },
  { value: '820x312', label: 'Facebook Cover (820x312)' },
  { value: '1500x500', label: 'X/Twitter Header (1500x500)' },
];

const creativeTypes = [
  { value: 'ad_image', label: 'Imagen para Ad' },
  { value: 'social_post', label: 'Post para Redes' },
  { value: 'banner', label: 'Banner Web' },
  { value: 'carousel', label: 'Carrusel' },
  { value: 'thumbnail', label: 'Thumbnail' },
];

interface Props {
  projectId: string;
  brandKit: Record<string, unknown>;
}

export function DesignGenerator({ projectId, brandKit }: Props) {
  const router = useRouter();
  const [type, setType] = useState('ad_image');
  const [format, setFormat] = useState('1080x1080');
  const [prompt, setPrompt] = useState('');
  const [headline, setHeadline] = useState('');
  const [subline, setSubline] = useState('');
  const [cta, setCta] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const colors = (brandKit.colors as Record<string, string>) || {};
  const primaryColor = colors.primary || '#000000';
  const accentColor = colors.accent || '#0066FF';

  async function handleGenerate() {
    setLoading(true);
    setPreview(null);

    try {
      // Generate the creative using AI prompt for text + HTML template rendering
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'ad_copy',
          prompt: `Genera texto creativo para un visual de ${type} con formato ${format}.
Headline sugerido: "${headline || 'pendiente'}"
Subtítulo: "${subline || 'pendiente'}"
CTA: "${cta || 'pendiente'}"
Contexto: ${prompt}

Responde con un JSON con los campos: headline, subline, cta, backgroundDescription`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Build HTML preview
        const [w, h] = format.split('x').map(Number);
        const html = buildPreviewHtml({
          width: w,
          height: h,
          headline: headline || 'Tu headline aquí',
          subline: subline || '',
          cta: cta || 'Saber más',
          primaryColor,
          accentColor,
          description: prompt,
        });
        setPreview(html);
        router.refresh();
      }
    } catch {
      // Show preview anyway with user inputs
      const [w, h] = format.split('x').map(Number);
      const html = buildPreviewHtml({
        width: w,
        height: h,
        headline: headline || 'Tu headline aquí',
        subline: subline || '',
        cta: cta || 'Saber más',
        primaryColor,
        accentColor,
        description: prompt,
      });
      setPreview(html);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickPreview() {
    const [w, h] = format.split('x').map(Number);
    const html = buildPreviewHtml({
      width: w,
      height: h,
      headline: headline || 'Tu headline aquí',
      subline: subline || 'Subtítulo de ejemplo',
      cta: cta || 'Saber más',
      primaryColor,
      accentColor,
      description: prompt,
    });
    setPreview(html);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-purple-500" />
            Generar creativo
          </CardTitle>
          <CardDescription>
            Crea imágenes y creativos usando tus colores de marca. Los creativos se generan como HTML renderizable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de creativo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {creativeTypes.map((ct) => (
                    <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Formato / Dimensiones</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {formatOptions.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Headline</Label>
            <Input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Ej: Compra Bitcoin sin comisiones" />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo (opcional)</Label>
            <Input value={subline} onChange={(e) => setSubline(e.target.value)} placeholder="Ej: La forma más fácil de invertir en crypto" />
          </div>
          <div className="space-y-2">
            <Label>Call to Action</Label>
            <Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Ej: Empieza ahora" />
          </div>
          <div className="space-y-2">
            <Label>Descripción / contexto adicional</Label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ej: Promoción de Black Friday, estilo moderno y minimalista" rows={3} />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleQuickPreview} variant="outline">
              Vista previa rápida
            </Button>
            <Button onClick={handleGenerate} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando...</> : <><Sparkles className="mr-2 h-4 w-4" />Generar con IA</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-base">Vista previa del creativo ({format})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center overflow-auto rounded-lg border bg-gray-100 p-4">
              <div dangerouslySetInnerHTML={{ __html: preview }} style={{ maxWidth: '100%' }} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(preview)}>
                Copiar HTML
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function buildPreviewHtml(opts: {
  width: number;
  height: number;
  headline: string;
  subline: string;
  cta: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}): string {
  const scale = Math.min(600 / opts.width, 400 / opts.height, 1);
  const w = opts.width * scale;
  const h = opts.height * scale;

  return `<div style="width:${w}px;height:${h}px;background:linear-gradient(135deg,${opts.primaryColor},${opts.accentColor});display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;border-radius:12px;font-family:system-ui,sans-serif;text-align:center;color:white;position:relative;overflow:hidden;">
  <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.15);"></div>
  <div style="position:relative;z-index:1;">
    <h2 style="font-size:${Math.max(18, w * 0.045)}px;font-weight:800;margin:0 0 8px 0;line-height:1.2;text-shadow:0 2px 4px rgba(0,0,0,0.3);">${opts.headline}</h2>
    ${opts.subline ? `<p style="font-size:${Math.max(12, w * 0.028)}px;margin:0 0 20px 0;opacity:0.9;">${opts.subline}</p>` : ''}
    <div style="display:inline-block;background:white;color:${opts.primaryColor};padding:10px 28px;border-radius:50px;font-weight:700;font-size:${Math.max(12, w * 0.03)}px;cursor:pointer;">${opts.cta}</div>
  </div>
</div>`;
}
