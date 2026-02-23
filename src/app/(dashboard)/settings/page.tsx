import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, CreditCard, Plug, Shield } from 'lucide-react';

const integrations = [
  { name: 'Google Analytics', description: 'Conecta GA4 para ver métricas de tráfico', platform: 'analytics', status: 'disponible' },
  { name: 'Google Ads', description: 'Gestiona campañas de búsqueda y display', platform: 'google_ads', status: 'disponible' },
  { name: 'Google Search Console', description: 'Datos de posicionamiento orgánico', platform: 'search_console', status: 'disponible' },
  { name: 'Meta Ads', description: 'Campañas en Facebook e Instagram', platform: 'meta_ads', status: 'disponible' },
  { name: 'Instagram', description: 'Publica y analiza contenido', platform: 'instagram', status: 'disponible' },
  { name: 'Facebook Pages', description: 'Gestiona tu página de Facebook', platform: 'facebook', status: 'disponible' },
  { name: 'TikTok Ads', description: 'Campañas publicitarias en TikTok', platform: 'tiktok_ads', status: 'próximamente' },
  { name: 'TikTok', description: 'Publica contenido en TikTok', platform: 'tiktok', status: 'próximamente' },
  { name: 'X (Twitter)', description: 'Publica y monitorea en X', platform: 'x', status: 'disponible' },
  { name: 'LinkedIn', description: 'Contenido profesional y B2B', platform: 'linkedin', status: 'disponible' },
  { name: 'YouTube', description: 'Gestiona tu canal de YouTube', platform: 'youtube', status: 'próximamente' },
  { name: 'Stripe', description: 'Facturación y suscripciones', platform: 'stripe', status: 'disponible' },
];

export default async function OrgSettingsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ajustes generales</h1>
          <p className="text-muted-foreground">Organización, equipo, integraciones y facturación</p>
        </div>
      </div>

      <Tabs defaultValue="org" className="space-y-4">
        <TabsList>
          <TabsTrigger value="org">Organización</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="integrations">Integraciones</TabsTrigger>
          <TabsTrigger value="billing">Facturación</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card>
            <CardHeader>
              <CardTitle>Organización</CardTitle>
              <CardDescription>Datos generales de tu organización</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm text-muted-foreground">Nahui Labs</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <Badge>Agency</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Admin</p>
                  <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rol</p>
                  <Badge variant="outline">{session?.user?.role}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><Users className="h-4 w-4" />Equipo</CardTitle>
                  <CardDescription>Gestiona los miembros de tu organización</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge><Shield className="mr-1 h-3 w-3" />{session?.user?.role}</Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground text-center">
                Los usuarios se crean desde el panel de admin. No hay registro público.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Plug className="h-4 w-4" />Integraciones</CardTitle>
              <CardDescription>Conecta tus cuentas para sincronizar datos automáticamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {integrations.map((int) => (
                  <div key={int.platform} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{int.name}</p>
                      <p className="text-xs text-muted-foreground">{int.description}</p>
                    </div>
                    <Badge variant={int.status === 'disponible' ? 'outline' : 'secondary'}>
                      {int.status === 'disponible' ? 'Conectar' : 'Próximamente'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" />Facturación</CardTitle>
              <CardDescription>Tu plan actual y métodos de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Plan Agency</h3>
                  <Badge>Activo</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Proyectos ilimitados, 2,000 contenidos/mes, todas las plataformas</p>
                <p className="text-2xl font-bold mt-2">$9,999 MXN<span className="text-sm font-normal text-muted-foreground">/mes</span></p>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                La facturación con Stripe se activará cuando el producto sea público.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
