'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Brain, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Competitor {
  id: string;
  name: string;
  domain: string | null;
  socialHandlesJson: unknown;
  notes: string | null;
}

export function CompetitorTracker({ projectId, competitors }: { projectId: string; competitors: Competitor[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), domain: domain.trim() || undefined, notes: notes.trim() || undefined }),
      });
      setOpen(false);
      setName(''); setDomain(''); setNotes('');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Agregar competidor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Agregar competidor</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Bitso" />
              </div>
              <div className="space-y-2">
                <Label>Dominio</Label>
                <Input value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="Ej: bitso.com" />
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Competidor directo en crypto MX" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleAdd} disabled={loading || !name.trim()}>
                {loading ? 'Agregando...' : 'Agregar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {competitors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Brain className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No hay competidores registrados.</p>
            <p className="text-sm">Agrega competidores para monitorear su actividad.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {competitors.map((comp) => (
            <Card key={comp.id}>
              <CardHeader>
                <CardTitle className="text-base">{comp.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {comp.domain && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                    <Globe className="h-3.5 w-3.5" />{comp.domain}
                  </p>
                )}
                {comp.notes && (
                  <p className="text-sm text-muted-foreground">{comp.notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
