'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface Audit {
  id: string;
  score: number | null;
  issuesJson: unknown;
  recommendationsJson: unknown;
  auditedAt: string | Date | null;
}

const severityIcons: Record<string, typeof CheckCircle> = {
  low: CheckCircle,
  medium: AlertTriangle,
  high: XCircle,
};

const severityColors: Record<string, string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

export function SeoAuditPanel({ projectId, audits }: { projectId: string; audits: Audit[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const latestAudit = audits[0];
  const issues = (latestAudit?.issuesJson as Array<{ severity: string; title: string; description: string }>) || [];
  const recommendations = (latestAudit?.recommendationsJson as Array<{ priority: string; title: string; description: string }>) || [];

  async function runAudit() {
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'audit' }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          {latestAudit && (
            <p className="text-sm text-muted-foreground">
              Última auditoría: {latestAudit.auditedAt ? new Date(latestAudit.auditedAt).toLocaleDateString('es-MX') : 'N/A'}
            </p>
          )}
        </div>
        <Button onClick={runAudit} disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analizando...</> : <><Search className="mr-2 h-4 w-4" />Ejecutar auditoría</>}
        </Button>
      </div>

      {latestAudit ? (
        <>
          {/* Score */}
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className={`text-6xl font-bold ${getScoreColor(latestAudit.score || 0)}`}>
                  {latestAudit.score || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Score SEO / 100</p>
              </div>
            </CardContent>
          </Card>

          {/* Issues */}
          {issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Problemas encontrados ({issues.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {issues.map((issue, i) => {
                  const Icon = severityIcons[issue.severity] || AlertTriangle;
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${severityColors[issue.severity] || ''}`} />
                      <div>
                        <p className="text-sm font-medium">{issue.title}</p>
                        <p className="text-xs text-muted-foreground">{issue.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0">{issue.severity}</Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recomendaciones ({recommendations.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                    <CheckCircle className="h-5 w-5 shrink-0 mt-0.5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{rec.title}</p>
                      <p className="text-xs text-muted-foreground">{rec.description}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0">{rec.priority}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Search className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No hay auditorías aún.</p>
            <p className="text-sm">Ejecuta tu primera auditoría SEO con el botón de arriba.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
