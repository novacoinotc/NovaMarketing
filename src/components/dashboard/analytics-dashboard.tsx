'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Eye,
  MousePointerClick,
  TrendingUp,
  AlertTriangle,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Snapshot {
  id: string;
  date: string | Date | null;
  source: string;
  metricsJson: unknown;
}

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: string | null;
  seen: boolean | null;
  createdAt: string | Date | null;
}

// Demo data for when there's no real data yet
const demoTrafficData = [
  { date: 'Lun', visitors: 420, pageViews: 1200, sessions: 580 },
  { date: 'Mar', visitors: 380, pageViews: 1100, sessions: 520 },
  { date: 'Mié', visitors: 510, pageViews: 1450, sessions: 670 },
  { date: 'Jue', visitors: 470, pageViews: 1300, sessions: 610 },
  { date: 'Vie', visitors: 590, pageViews: 1680, sessions: 750 },
  { date: 'Sáb', visitors: 340, pageViews: 980, sessions: 440 },
  { date: 'Dom', visitors: 280, pageViews: 820, sessions: 360 },
];

const demoChannelData = [
  { name: 'Orgánico', value: 42, color: '#22c55e' },
  { name: 'Ads Pagados', value: 28, color: '#f97316' },
  { name: 'Social', value: 18, color: '#ec4899' },
  { name: 'Directo', value: 8, color: '#6366f1' },
  { name: 'Referral', value: 4, color: '#06b6d4' },
];

const demoConversionData = [
  { date: 'Sem 1', leads: 24, conversions: 8 },
  { date: 'Sem 2', leads: 31, conversions: 12 },
  { date: 'Sem 3', leads: 28, conversions: 10 },
  { date: 'Sem 4', leads: 45, conversions: 18 },
];

interface Props {
  projectId: string;
  snapshots: Snapshot[];
  alerts: Alert[];
}

const severityIcons: Record<string, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const severityColors: Record<string, string> = {
  info: 'text-blue-500',
  warning: 'text-yellow-500',
  critical: 'text-red-500',
};

export function AnalyticsDashboard({ projectId, snapshots, alerts }: Props) {
  const hasRealData = snapshots.length > 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,990</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />+12.5% vs semana pasada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,530</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />+8.3% vs semana pasada
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">Tasa: 1.6%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Costo por lead</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$185 MXN</div>
            <p className="text-xs text-green-600">-5.2% vs mes pasado</p>
          </CardContent>
        </Card>
      </div>

      {!hasRealData && (
        <Card className="border-dashed border-cyan-500/30">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground text-center">
              Mostrando datos de demostración. Conecta Google Analytics en Configuración para ver métricas reales.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Tráfico</TabsTrigger>
          <TabsTrigger value="channels">Canales</TabsTrigger>
          <TabsTrigger value="conversions">Conversiones</TabsTrigger>
          <TabsTrigger value="alerts">Alertas ({alerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tráfico — Últimos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={demoTrafficData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="pageViews" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} name="Page Views" />
                  <Area type="monotone" dataKey="sessions" stackId="2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} name="Sesiones" />
                  <Area type="monotone" dataKey="visitors" stackId="3" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} name="Visitantes" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución por canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={demoChannelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                      {demoChannelData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tráfico por canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demoChannelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {demoChannelData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leads y conversiones — Último mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={demoConversionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#6366f1" radius={[4, 4, 0, 0]} name="Leads" />
                  <Bar dataKey="conversions" fill="#22c55e" radius={[4, 4, 0, 0]} name="Conversiones" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Info className="mx-auto mb-3 h-8 w-8 opacity-50" />
                <p>No hay alertas activas.</p>
                <p className="text-sm">Las alertas aparecerán automáticamente cuando se detecten cambios importantes.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => {
                const Icon = severityIcons[alert.severity || 'info'] || Info;
                const color = severityColors[alert.severity || 'info'];
                return (
                  <Card key={alert.id} className={alert.seen ? 'opacity-60' : ''}>
                    <CardContent className="flex items-center gap-3 py-3">
                      <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
