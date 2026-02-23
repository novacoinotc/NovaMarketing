'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const tones = [
  { value: 'formal', label: 'Formal — Profesional, corporativo' },
  { value: 'casual', label: 'Casual — Relajado, cercano' },
  { value: 'tecnico', label: 'Técnico — Experto, datos y precisión' },
  { value: 'amigable', label: 'Amigable — Cálido, conversacional' },
];

const languages = [
  { value: 'es-MX', label: 'Español (México)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
];

interface Props {
  projectId: string;
  initialData: Record<string, unknown>;
}

export function BrandKitForm({ projectId, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const colors = (initialData.colors as Record<string, string>) || {};
  const fonts = (initialData.fonts as Record<string, string>) || {};

  const [primaryColor, setPrimaryColor] = useState(colors.primary || '#000000');
  const [secondaryColor, setSecondaryColor] = useState(colors.secondary || '#666666');
  const [accentColor, setAccentColor] = useState(colors.accent || '#0066FF');
  const [headingFont, setHeadingFont] = useState(fonts.heading || '');
  const [bodyFont, setBodyFont] = useState(fonts.body || '');
  const [tone, setTone] = useState((initialData.tone as string) || '');
  const [language, setLanguage] = useState((initialData.language as string) || 'es-MX');
  const [logoUrl, setLogoUrl] = useState((initialData.logoUrl as string) || '');
  const [guidelines, setGuidelines] = useState((initialData.guidelines as string) || '');

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    try {
      const brandKitJson = {
        colors: { primary: primaryColor, secondary: secondaryColor, accent: accentColor },
        fonts: { heading: headingFont, body: bodyFont },
        tone,
        language,
        logoUrl,
        guidelines,
      };
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandKitJson }),
      });
      setSaved(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Kit</CardTitle>
        <CardDescription>
          Define la identidad visual y tono de comunicación. La IA usará estos datos para generar contenido consistente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Colors */}
        <div>
          <h3 className="text-sm font-medium mb-3">Colores de marca</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Primario</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Secundario</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
                <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Acento</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border" />
                <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="font-mono text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div>
          <h3 className="text-sm font-medium mb-3">Tipografías</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Títulos</Label>
              <Input value={headingFont} onChange={(e) => setHeadingFont(e.target.value)} placeholder="Ej: Inter, Montserrat" />
            </div>
            <div className="space-y-2">
              <Label>Cuerpo</Label>
              <Input value={bodyFont} onChange={(e) => setBodyFont(e.target.value)} placeholder="Ej: Inter, Open Sans" />
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-2">
          <Label>URL del logo</Label>
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
        </div>

        {/* Tone & Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tono de comunicación</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tono" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Idioma principal</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((l) => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Guidelines */}
        <div className="space-y-2">
          <Label>Lineamientos adicionales</Label>
          <Textarea
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            placeholder="Ej: Nunca usar emojis, siempre incluir CTA al final, evitar lenguaje técnico..."
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Brand Kit'}
          </Button>
          {saved && <span className="text-sm text-green-600">Guardado</span>}
        </div>
      </CardContent>
    </Card>
  );
}
