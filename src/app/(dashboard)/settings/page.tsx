import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrgSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajustes generales</h1>
        <p className="text-muted-foreground">Organización, equipo y facturación</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Organización</CardTitle>
            <CardDescription>Nombre, plan y datos de la organización</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>Gestiona usuarios y permisos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Facturación</CardTitle>
            <CardDescription>Plan actual, historial de pagos</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integraciones</CardTitle>
            <CardDescription>Conecta Google, Meta, TikTok y más</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">En desarrollo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
