'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus } from 'lucide-react';

const platforms = [
  { value: 'google', label: 'Google Ads' },
  { value: 'meta', label: 'Meta Ads (Facebook/Instagram)' },
  { value: 'tiktok', label: 'TikTok Ads' },
];

const objectives = [
  { value: 'awareness', label: 'Awareness — Alcance y reconocimiento' },
  { value: 'traffic', label: 'Tráfico — Llevar visitas al sitio' },
  { value: 'engagement', label: 'Engagement — Interacción y comentarios' },
  { value: 'leads', label: 'Leads — Generar prospectos' },
  { value: 'sales', label: 'Ventas — Conversiones directas' },
];

export function CreateCampaignForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('google');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [objective, setObjective] = useState('leads');
  const [success, setSuccess] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          name: name.trim(),
          budget: budget ? parseInt(budget) : undefined,
          objective,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        setName('');
        setBudget('');
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear nueva campaña</CardTitle>
        <CardDescription>Configura los detalles básicos de tu campaña publicitaria.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Plataforma</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {platforms.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Objetivo</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {objectives.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nombre de la campaña</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Leads Q1 2026 — Bitcoin México" />
        </div>

        <div className="space-y-2">
          <Label>Presupuesto diario (MXN)</Label>
          <Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ej: 500" />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleCreate} disabled={loading || !name.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : <><Plus className="mr-2 h-4 w-4" />Crear campaña</>}
          </Button>
          {success && <span className="text-sm text-green-600">Campaña creada</span>}
        </div>
      </CardContent>
    </Card>
  );
}
