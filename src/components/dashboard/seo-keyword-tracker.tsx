'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Search } from 'lucide-react';

interface Keyword {
  id: string;
  keyword: string;
  position: number | null;
  searchVolume: number | null;
  difficulty: number | null;
}

function getDifficultyColor(d: number | null): string {
  if (!d) return '';
  if (d <= 30) return 'bg-green-100 text-green-800';
  if (d <= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export function SeoKeywordTracker({ projectId, keywords }: { projectId: string; keywords: Keyword[] }) {
  const router = useRouter();
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    if (!newKeyword.trim()) return;
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });
      setNewKeyword('');
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Add keyword */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Agregar keyword para monitorear..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={loading || !newKeyword.trim()}>
              <Plus className="mr-2 h-4 w-4" />Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keywords table */}
      {keywords.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Search className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No hay keywords monitoreadas.</p>
            <p className="text-sm">Agrega keywords para trackear su posición en Google.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keywords monitoreadas ({keywords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="text-center">Posición</TableHead>
                  <TableHead className="text-center">Volumen</TableHead>
                  <TableHead className="text-center">Dificultad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((kw) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell className="text-center">
                      {kw.position ? (
                        <Badge variant={kw.position <= 10 ? 'default' : 'secondary'}>#{kw.position}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {kw.searchVolume ? kw.searchVolume.toLocaleString() : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      {kw.difficulty !== null ? (
                        <Badge className={getDifficultyColor(kw.difficulty)} variant="secondary">{kw.difficulty}/100</Badge>
                      ) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
