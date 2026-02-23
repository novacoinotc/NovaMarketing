'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Target, MousePointerClick, Eye, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Campaign {
  id: string;
  platform: string;
  name: string;
  budget: number | null;
  status: string | null;
  metricsJson: unknown;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string | null;
  resolved: boolean | null;
}

const demoSpendData = [
  { name: 'Sem 1', google: 2400, meta: 1800, tiktok: 600 },
  { name: 'Sem 2', google: 2800, meta: 2100, tiktok: 800 },
  { name: 'Sem 3', google: 2200, meta: 1900, tiktok: 900 },
  { name: 'Sem 4', google: 3100, meta: 2400, tiktok: 1100 },
];

export function AdsOverview({ campaigns, alerts }: { campaigns: Campaign[]; alerts: Alert[] }) {
  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
  const unresolvedAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gasto total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()} MXN</div>
            <p className="text-xs text-muted-foreground">Presupuesto asignado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campañas activas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">de {campaigns.length} totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Clicks totales</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Conecta APIs para datos reales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Impresiones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Conecta APIs para datos reales</p>
          </CardContent>
        </Card>
      </div>

      {/* Spend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gasto por plataforma — Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demoSpendData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value} MXN`} />
              <Bar dataKey="google" fill="#4285f4" radius={[4, 4, 0, 0]} name="Google Ads" />
              <Bar dataKey="meta" fill="#1877f2" radius={[4, 4, 0, 0]} name="Meta Ads" />
              <Bar dataKey="tiktok" fill="#000000" radius={[4, 4, 0, 0]} name="TikTok Ads" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts */}
      {unresolvedAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Alertas ({unresolvedAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {unresolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 rounded-lg border p-3">
                <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                  {alert.severity}
                </Badge>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
