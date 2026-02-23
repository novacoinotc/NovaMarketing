'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Report {
  id: string;
  type: string;
  insightsJson: unknown;
  generatedAt: string | Date | null;
}

export function MarketReportPanel({ projectId, reports }: { projectId: string; reports: Report[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function generateReport() {
    setLoading(true);
    try {
      await fetch(`/api/projects/${projectId}/intelligence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report' }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={generateReport} disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando reporte...</> : <><FileText className="mr-2 h-4 w-4" />Generar reporte de mercado</>}
        </Button>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="mx-auto mb-3 h-8 w-8 opacity-50" />
            <p>No hay reportes generados.</p>
            <p className="text-sm">Genera un reporte de inteligencia de mercado con IA.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const insights = report.insightsJson as Record<string, unknown> | null;
            const isExpanded = expanded === report.id;

            return (
              <Card key={report.id}>
                <CardHeader className="cursor-pointer" onClick={() => setExpanded(isExpanded ? null : report.id)}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Reporte de mercado</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {report.generatedAt ? formatDistanceToNow(new Date(report.generatedAt), { addSuffix: true, locale: es }) : ''}
                    </span>
                  </div>
                </CardHeader>
                {isExpanded && insights && (
                  <CardContent className="space-y-4">
                    {typeof insights.summary === 'string' && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Resumen</h4>
                        <p className="text-sm text-muted-foreground">{insights.summary}</p>
                      </div>
                    )}
                    {Array.isArray(insights.trends) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-green-500" />Tendencias</h4>
                        <ul className="space-y-1">{(insights.trends as string[]).map((t, i) => <li key={i} className="text-sm text-muted-foreground">• {t}</li>)}</ul>
                      </div>
                    )}
                    {Array.isArray(insights.opportunities) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-yellow-500" />Oportunidades</h4>
                        <ul className="space-y-1">{(insights.opportunities as string[]).map((o, i) => <li key={i} className="text-sm text-muted-foreground">• {o}</li>)}</ul>
                      </div>
                    )}
                    {Array.isArray(insights.threats) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 text-red-500" />Amenazas</h4>
                        <ul className="space-y-1">{(insights.threats as string[]).map((t, i) => <li key={i} className="text-sm text-muted-foreground">• {t}</li>)}</ul>
                      </div>
                    )}
                    {Array.isArray(insights.recommendations) && (
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-1.5"><Target className="h-4 w-4 text-blue-500" />Recomendaciones</h4>
                        <ul className="space-y-1">{(insights.recommendations as string[]).map((r, i) => <li key={i} className="text-sm text-muted-foreground">• {r}</li>)}</ul>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
