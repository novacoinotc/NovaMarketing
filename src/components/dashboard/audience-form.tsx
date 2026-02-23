'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  projectId: string;
  initialData: Record<string, unknown>;
}

export function AudienceForm({ projectId, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [ageRange, setAgeRange] = useState((initialData.ageRange as string) || '');
  const [location, setLocation] = useState((initialData.location as string) || '');
  const [interests, setInterests] = useState(
    Array.isArray(initialData.interests) ? (initialData.interests as string[]).join(', ') : ''
  );
  const [painPoints, setPainPoints] = useState(
    Array.isArray(initialData.painPoints) ? (initialData.painPoints as string[]).join(', ') : ''
  );
  const [desires, setDesires] = useState(
    Array.isArray(initialData.desires) ? (initialData.desires as string[]).join(', ') : ''
  );
  const [keywords, setKeywords] = useState(
    Array.isArray(initialData.keywords) ? (initialData.keywords as string[]).join(', ') : ''
  );

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    try {
      const splitComma = (s: string) => s.split(',').map((v) => v.trim()).filter(Boolean);
      const targetAudienceJson = {
        ageRange,
        location,
        interests: splitComma(interests),
        painPoints: splitComma(painPoints),
        desires: splitComma(desires),
        keywords: splitComma(keywords),
      };
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAudienceJson }),
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
        <CardTitle>Audiencia objetivo</CardTitle>
        <CardDescription>
          Define a quién le hablas. La IA personaliza el contenido según estos datos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Rango de edad</Label>
            <Input value={ageRange} onChange={(e) => setAgeRange(e.target.value)} placeholder="Ej: 25-45 años" />
          </div>
          <div className="space-y-2">
            <Label>Ubicación</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ej: México, LATAM" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Intereses (separados por coma)</Label>
          <Textarea
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="Ej: tecnología, inversiones, crypto, finanzas personales"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Puntos de dolor (separados por coma)</Label>
          <Textarea
            value={painPoints}
            onChange={(e) => setPainPoints(e.target.value)}
            placeholder="Ej: no saben cómo invertir, desconfían de crypto, quieren independencia financiera"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Deseos / aspiraciones (separados por coma)</Label>
          <Textarea
            value={desires}
            onChange={(e) => setDesires(e.target.value)}
            placeholder="Ej: libertad financiera, ingresos pasivos, estar a la vanguardia"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Keywords principales (separados por coma)</Label>
          <Textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ej: comprar bitcoin, invertir en crypto, pagos digitales"
            rows={2}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar audiencia'}
          </Button>
          {saved && <span className="text-sm text-green-600">Guardado</span>}
        </div>
      </CardContent>
    </Card>
  );
}
