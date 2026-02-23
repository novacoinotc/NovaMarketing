'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Clock, Loader2, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

const platforms = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500', maxLength: 2200 },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600', maxLength: 63206 },
  { id: 'x', label: 'X', icon: Twitter, color: 'bg-black', maxLength: 280 },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700', maxLength: 3000 },
  { id: 'tiktok', label: 'TikTok', icon: Send, color: 'bg-black', maxLength: 2200 },
];

export function SocialComposer({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  async function handleGenerateWithAI() {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const platform = selectedPlatforms[0] || 'instagram';
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          type: 'social_post',
          prompt: aiPrompt,
          platform,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setContent(data.content);
      }
    } finally {
      setAiLoading(false);
    }
  }

  async function handlePublish(asDraft: boolean) {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    setLoading(true);
    try {
      for (const platform of selectedPlatforms) {
        await fetch(`/api/projects/${projectId}/social`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            content: content.trim(),
            scheduledAt: !asDraft && scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
          }),
        });
      }
      setContent('');
      setScheduledAt('');
      setAiPrompt('');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* AI Assistant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pink-500" />
            Generar con IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ej: Post sobre los beneficios de invertir en Bitcoin para principiantes"
              className="flex-1"
            />
            <Button onClick={handleGenerateWithAI} disabled={aiLoading || !aiPrompt.trim()} variant="outline">
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Crear post</CardTitle>
          <CardDescription>Escribe o genera contenido y selecciona las plataformas donde publicar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platform selector */}
          <div className="space-y-2">
            <Label>Plataformas</Label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => {
                const selected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition-colors ${
                      selected ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                    }`}
                  >
                    <p.icon className="h-3.5 w-3.5" />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Contenido</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu post aquí..."
              rows={6}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{content.length} caracteres</span>
              {selectedPlatforms.map((p) => {
                const plat = platforms.find((x) => x.id === p);
                if (!plat) return null;
                const over = content.length > plat.maxLength;
                return (
                  <span key={p} className={over ? 'text-destructive' : ''}>
                    {p}: {content.length}/{plat.maxLength}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label>Programar para (opcional)</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handlePublish(true)} disabled={loading || !content.trim()}>
              Guardar borrador
            </Button>
            <Button onClick={() => handlePublish(false)} disabled={loading || !content.trim() || selectedPlatforms.length === 0}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
              ) : scheduledAt ? (
                <><Clock className="mr-2 h-4 w-4" />Programar</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />Publicar ahora</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
