import { notFound } from 'next/navigation';
import { getProjectById } from '@/lib/db/queries/projects';
import { getCampaigns, getAdAlerts } from '@/lib/db/queries/ads';
import { Megaphone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdsOverview } from '@/components/dashboard/ads-overview';
import { CampaignList } from '@/components/dashboard/campaign-list';
import { CreateCampaignForm } from '@/components/dashboard/create-campaign-form';

export default async function AdsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);
  if (!project || project.status === 'deleted') notFound();

  const [campaigns, adsAlerts] = await Promise.all([
    getCampaigns(projectId),
    getAdAlerts(projectId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ads Manager</h1>
          <p className="text-muted-foreground">{project.name} — Gestiona campañas en Google, Meta y TikTok</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="create">Crear campaña</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdsOverview campaigns={campaigns} alerts={adsAlerts} />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignList campaigns={campaigns} />
        </TabsContent>

        <TabsContent value="create">
          <CreateCampaignForm projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
