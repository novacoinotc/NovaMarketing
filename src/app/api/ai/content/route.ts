import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getProjectById } from '@/lib/db/queries/projects';
import { createContent } from '@/lib/db/queries/content';
import { generateWithClaude } from '@/lib/ai/claude';
import { getPromptForType, type ContentTypeKey } from '@/lib/ai/prompts/content';
import { z } from 'zod/v4';

const generateSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['ad_copy', 'social_post', 'blog', 'email', 'script', 'landing_page', 'product_description']),
  prompt: z.string().min(1, 'El prompt es requerido').max(2000),
  platform: z.string().optional(),
  duration: z.string().optional(),
  title: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = generateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || 'Datos inválidos' },
      { status: 400 }
    );
  }

  const { projectId, type, prompt, platform, duration, title } = parsed.data;

  // Fetch project with brand data
  const project = await getProjectById(projectId);
  if (!project) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
  }

  const brandKit = (project.brandKitJson as Record<string, unknown>) || {};
  const audience = (project.targetAudienceJson as Record<string, unknown>) || {};

  // Build context for AI
  const brandContext = {
    projectName: project.name,
    tone: (brandKit.tone as string) || undefined,
    language: (brandKit.language as string) || 'es-MX',
    industry: project.industry || undefined,
    audience: {
      ageRange: (audience.ageRange as string) || undefined,
      location: (audience.location as string) || undefined,
      interests: (audience.interests as string[]) || undefined,
      painPoints: (audience.painPoints as string[]) || undefined,
      desires: (audience.desires as string[]) || undefined,
      keywords: (audience.keywords as string[]) || undefined,
    },
    guidelines: (brandKit.guidelines as string) || undefined,
  };

  // Get the appropriate prompt
  const { system, user } = getPromptForType(type as ContentTypeKey, brandContext, prompt, { platform, duration });

  try {
    // Generate with Claude
    const generatedContent = await generateWithClaude(
      [{ role: 'user', content: user }],
      { system, maxTokens: type === 'blog' ? 8192 : 4096 }
    );

    // Save to database
    const contentPiece = await createContent({
      projectId,
      type,
      title: title || `${type} — ${new Date().toLocaleDateString('es-MX')}`,
      content: generatedContent,
      platform,
      aiPromptUsed: prompt,
    });

    return NextResponse.json(contentPiece, { status: 201 });
  } catch (err) {
    console.error('AI generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al generar contenido' },
      { status: 500 }
    );
  }
}
