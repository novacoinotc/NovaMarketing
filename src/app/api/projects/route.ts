import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { createProject, getProjectsByOrgId } from '@/lib/db/queries/projects';
import { z } from 'zod/v4';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido').max(100),
  domain: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const projects = await getProjectsByOrgId(session.user.orgId);
  return NextResponse.json(projects.filter((p) => p.status !== 'deleted'));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Datos inválidos' },
      { status: 400 }
    );
  }

  const project = await createProject({
    orgId: session.user.orgId,
    ...parsed.data,
  });

  return NextResponse.json(project, { status: 201 });
}
