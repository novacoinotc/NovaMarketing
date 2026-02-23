import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getAudits, getKeywords, addKeyword, createAudit } from '@/lib/db/queries/seo';
import { generateWithClaude } from '@/lib/ai/claude';
import { getProjectById } from '@/lib/db/queries/projects';
import { z } from 'zod/v4';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const type = req.nextUrl.searchParams.get('type');

  if (type === 'keywords') {
    const keywords = await getKeywords(projectId);
    return NextResponse.json(keywords);
  }

  const audits = await getAudits(projectId);
  return NextResponse.json(audits);
}

const keywordSchema = z.object({
  keyword: z.string().min(1).max(200),
  position: z.number().optional(),
  searchVolume: z.number().optional(),
  difficulty: z.number().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();
  const action = body.action;

  if (action === 'audit') {
    // Run AI-powered SEO audit
    const project = await getProjectById(projectId);
    if (!project) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });

    try {
      const auditResult = await generateWithClaude(
        [{ role: 'user', content: `Haz una auditoría SEO para el sitio "${project.domain || project.name}". Industria: ${project.industry || 'no especificada'}.

Responde en JSON con este formato exacto:
{
  "score": <número del 0 al 100>,
  "issues": [{"severity": "high|medium|low", "title": "...", "description": "..."}],
  "recommendations": [{"priority": "high|medium|low", "title": "...", "description": "..."}]
}

Genera una auditoría realista basada en las mejores prácticas SEO.` }],
        { system: 'Eres un experto en SEO técnico. Responde SOLO con JSON válido, sin markdown ni explicaciones.', maxTokens: 4096 }
      );

      let parsed;
      try {
        parsed = JSON.parse(auditResult);
      } catch {
        parsed = { score: 65, issues: [], recommendations: [] };
      }

      const audit = await createAudit({
        projectId,
        score: parsed.score || 65,
        issuesJson: parsed.issues || [],
        recommendationsJson: parsed.recommendations || [],
      });

      return NextResponse.json(audit, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: 'Error al ejecutar auditoría' }, { status: 500 });
    }
  }

  // Add keyword
  const parsed = keywordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const keyword = await addKeyword({ projectId, ...parsed.data });
  return NextResponse.json(keyword, { status: 201 });
}
