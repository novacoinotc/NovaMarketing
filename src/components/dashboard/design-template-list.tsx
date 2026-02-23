'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Layout } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  htmlTemplate: string;
  previewUrl: string | null;
  createdAt: string | Date | null;
}

export function DesignTemplateList({ templates, projectId }: { templates: Template[]; projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim() || !html.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/design?type=templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, htmlTemplate: html }),
      });
      setOpen(false);
      setName('');
      setHtml('');
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
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" />Nuevo template</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear template HTML</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Ad template estándar" />
              </div>
              <div className="space-y-2">
                <Label>HTML Template</Label>
                <Textarea value={html} onChange={(e) => setHtml(e.target.value)} placeholder="<div>Tu HTML aquí...</div>" rows={12} className="font-mono text-sm" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleCreate} disabled={loading || !name.trim() || !html.trim()}>
                {loading ? 'Creando...' : 'Crear template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Layout className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No hay templates aún.</p>
            <p className="text-sm">Crea templates HTML reutilizables para tus creativos.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-base">{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="rounded bg-muted p-3 text-xs overflow-auto max-h-32">{t.htmlTemplate.slice(0, 200)}...</pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
