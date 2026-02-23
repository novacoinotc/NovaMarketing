import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getVideos, createVideo } from '@/lib/db/queries/video';
import { getProjectById } from '@/lib/db/queries/projects';
import { generateWithClaude } from '@/lib/ai/claude';
import { z } from 'zod/v4';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  return NextResponse.json(await getVideos(projectId));
}

const videoSchema = z.object({
  prompt: z.string().min(1).max(2000),
  duration: z.number().min(15).max(60).optional(),
  platform: z.string().optional(),
  format: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();
  const parsed = videoSchema.safeParse(body);

  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });

  const project = await getProjectById(projectId);
  if (!project) return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });

  const brandKit = (project.brandKitJson as Record<string, unknown>) || {};

  try {
    const script = await generateWithClaude(
      [{ role: 'user', content: `Escribe un script para video corto de ${parsed.data.duration || 30} segundos para ${parsed.data.platform || 'Reels/TikTok'}.

Marca: ${project.name}
Industria: ${project.industry || 'no especificada'}
Tono: ${(brandKit.tone as string) || 'casual'}

${parsed.data.prompt}

Formato del script:
- HOOK (0-3s): [texto que engancha]
- CUERPO (3-${(parsed.data.duration || 30) - 5}s): [contenido principal con timestamps]
- CTA (últimos 5s): [llamada a la acción]
- TEXTO EN PANTALLA: [sugerencias de texto overlay]
- AUDIO: [sugerencia de música/sonido]` }],
      { system: 'Eres un experto en contenido viral para Reels, TikTok y YouTube Shorts. Creas scripts con hooks irresistibles.', maxTokens: 4096 }
    );

    const video = await createVideo({
      projectId,
      script,
      duration: parsed.data.duration || 30,
      format: parsed.data.format || 'vertical',
      platformTarget: parsed.data.platform || 'reels',
      status: 'draft',
    });

    return NextResponse.json(video, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al generar script' }, { status: 500 });
  }
}
