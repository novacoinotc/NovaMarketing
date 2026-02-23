import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getAssetsByProject } from '@/lib/db/queries/design';
import { getTemplatesByProject, createTemplate } from '@/lib/db/queries/design';
import { z } from 'zod/v4';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const type = req.nextUrl.searchParams.get('type');

  if (type === 'templates') {
    const templates = await getTemplatesByProject(projectId);
    return NextResponse.json(templates);
  }

  const assets = await getAssetsByProject(projectId);
  return NextResponse.json(assets);
}

const templateSchema = z.object({
  name: z.string().min(1).max(100),
  htmlTemplate: z.string().min(1),
  variablesSchema: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();
  const parsed = templateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const template = await createTemplate({ projectId, ...parsed.data });
  return NextResponse.json(template, { status: 201 });
}
