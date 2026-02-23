'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const industries = [
  'Fintech / Crypto', 'Fintech / Pagos', 'Software Development', 'E-commerce',
  'SaaS', 'Servicios profesionales', 'Restaurantes / Food', 'Salud / Bienestar',
  'Educación', 'Real Estate', 'Marketing / Agencia', 'Otro',
];

interface Props {
  projectId: string;
  initialData: { name: string; domain: string; industry: string };
}

export function ProjectInfoForm({ projectId, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData.name);
  const [domain, setDomain] = useState(initialData.domain);
  const [industry, setIndustry] = useState(initialData.industry);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setLoading(true);
    setSaved(false);
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, domain: domain || undefined, industry: industry || undefined }),
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
        <CardTitle>Información general</CardTitle>
        <CardDescription>Nombre, dominio e industria del proyecto</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre del proyecto</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Dominio</Label>
          <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="ejemplo.com" />
        </div>
        <div className="space-y-2">
          <Label>Industria</Label>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>{ind}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={loading || !name.trim()}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          {saved && <span className="text-sm text-green-600">Guardado</span>}
        </div>
      </CardContent>
    </Card>
  );
}
