import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getCampaigns, createCampaign } from '@/lib/db/queries/ads';
import { z } from 'zod/v4';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const campaigns = await getCampaigns(projectId);
  return NextResponse.json(campaigns);
}

const campaignSchema = z.object({
  platform: z.enum(['google', 'meta', 'tiktok']),
  name: z.string().min(1).max(200),
  budget: z.number().min(0).optional(),
  objective: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();
  const parsed = campaignSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const campaign = await createCampaign({ projectId, ...parsed.data });
  return NextResponse.json(campaign, { status: 201 });
}
