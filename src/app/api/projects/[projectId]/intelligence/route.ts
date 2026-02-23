import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getCompetitors, addCompetitor, getMarketReports, createMarketReport, getAudienceSegments } from '@/lib/db/queries/intelligence';
import { getProjectById } from '@/lib/db/queries/projects';
import { generateWithClaude } from '@/lib/ai/claude';
import { z } from 'zod/v4';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const type = req.nextUrl.searchParams.get('type');

  if (type === 'competitors') return NextResponse.json(await getCompetitors(projectId));
  if (type === 'segments') return NextResponse.json(await getAudienceSegments(projectId));
  return NextResponse.json(await getMarketReports(projectId));
}

const competitorSchema = z.object({
  name: z.string().min(1).max(200),
  domain: z.string().max(255).optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();

  if (body.action === 'report') {
    const project = await getProjectById(projectId);
    if (!project) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });

    const comps = await getCompetitors(projectId);

    try {
      const result = await generateWithClaude(
        [{ role: 'user', content: `Genera un reporte de inteligencia de mercado para "${project.name}" (${project.industry || 'sin industria'}, dominio: ${project.domain || 'sin dominio'}).

Competidores conocidos: ${comps.map(c => c.name).join(', ') || 'ninguno registrado'}

Responde en JSON:
{
  "summary": "Resumen ejecutivo del mercado",
  "trends": ["tendencia 1", "tendencia 2", ...],
  "opportunities": ["oportunidad 1", "oportunidad 2", ...],
  "threats": ["amenaza 1", "amenaza 2", ...],
  "recommendations": ["recomendación 1", ...]
}` }],
        { system: 'Eres un analista de inteligencia de mercado. Responde SOLO con JSON válido.', maxTokens: 4096 }
      );

      let parsed;
      try { parsed = JSON.parse(result); } catch { parsed = { summary: result }; }

      const report = await createMarketReport({
        projectId,
        type: 'custom',
        insightsJson: parsed,
      });

      return NextResponse.json(report, { status: 201 });
    } catch {
      return NextResponse.json({ error: 'Error al generar reporte' }, { status: 500 });
    }
  }

  // Add competitor
  const parsed = competitorSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const competitor = await addCompetitor({ projectId, ...parsed.data });
  return NextResponse.json(competitor, { status: 201 });
}
