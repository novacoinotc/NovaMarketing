interface BrandContext {
  projectName: string;
  tone?: string;
  language?: string;
  industry?: string;
  audience?: {
    ageRange?: string;
    location?: string;
    interests?: string[];
    painPoints?: string[];
    desires?: string[];
    keywords?: string[];
  };
  guidelines?: string;
}

function buildBrandSystemPrompt(ctx: BrandContext): string {
  const parts = [
    `Eres un experto en marketing digital y copywriting. Generas contenido para "${ctx.projectName}".`,
  ];

  if (ctx.industry) parts.push(`Industria: ${ctx.industry}.`);
  if (ctx.tone) parts.push(`Tono de comunicación: ${ctx.tone}.`);
  if (ctx.language) parts.push(`Idioma: ${ctx.language}.`);
  if (ctx.guidelines) parts.push(`Lineamientos de marca: ${ctx.guidelines}`);

  if (ctx.audience) {
    const a = ctx.audience;
    const audienceParts: string[] = [];
    if (a.ageRange) audienceParts.push(`Edad: ${a.ageRange}`);
    if (a.location) audienceParts.push(`Ubicación: ${a.location}`);
    if (a.interests?.length) audienceParts.push(`Intereses: ${a.interests.join(', ')}`);
    if (a.painPoints?.length) audienceParts.push(`Puntos de dolor: ${a.painPoints.join(', ')}`);
    if (a.desires?.length) audienceParts.push(`Deseos: ${a.desires.join(', ')}`);
    if (a.keywords?.length) audienceParts.push(`Keywords: ${a.keywords.join(', ')}`);
    if (audienceParts.length) {
      parts.push(`\nAudiencia objetivo:\n${audienceParts.join('\n')}`);
    }
  }

  parts.push('\nReglas importantes:');
  parts.push('- Responde SOLO con el contenido solicitado, sin explicaciones adicionales.');
  parts.push('- No uses emojis a menos que el usuario lo pida explícitamente.');
  parts.push('- Adapta el lenguaje al tono de marca definido.');

  return parts.join('\n');
}

export function getAdCopyPrompt(ctx: BrandContext, userPrompt: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx),
    user: `Genera copy publicitario para anuncios digitales. ${userPrompt}

Formato de salida:
- 3 opciones de headline (máx 30 caracteres c/u)
- 3 opciones de descripción (máx 90 caracteres c/u)
- 1 CTA sugerido
- 1 variante larga (para Facebook/Instagram ads, máx 125 caracteres)`,
  };
}

export function getSocialPostPrompt(ctx: BrandContext, userPrompt: string, platform: string): { system: string; user: string } {
  const platformGuides: Record<string, string> = {
    instagram: 'Instagram: máximo 2200 caracteres, usa hashtags relevantes (5-10), escribe en párrafos cortos.',
    facebook: 'Facebook: texto engagement-friendly, puedes ser más largo, incluye un CTA claro.',
    x: 'X/Twitter: máximo 280 caracteres, directo y punchy.',
    linkedin: 'LinkedIn: tono más profesional, storytelling, incluye hashtags relevantes (3-5).',
    tiktok: 'TikTok: caption corto y catchy, usa hashtags trending, estilo Gen Z/millennial.',
  };

  return {
    system: buildBrandSystemPrompt(ctx),
    user: `Genera un post para ${platform}. ${platformGuides[platform] || ''}

${userPrompt}

Genera 3 variantes del post.`,
  };
}

export function getBlogPrompt(ctx: BrandContext, userPrompt: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx) + '\n\nEres experto en SEO y content marketing. Escribe artículos optimizados para buscadores.',
    user: `Escribe un artículo de blog optimizado para SEO.

${userPrompt}

Formato:
- Título SEO (máx 60 caracteres)
- Meta description (máx 155 caracteres)
- Artículo con H2s y H3s
- Mínimo 800 palabras
- Incluye keywords naturalmente en el texto`,
  };
}

export function getEmailPrompt(ctx: BrandContext, userPrompt: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx) + '\n\nEres experto en email marketing. Escribes emails con altas tasas de apertura y click.',
    user: `Genera un email de marketing.

${userPrompt}

Formato:
- Subject line (3 variantes)
- Preview text
- Cuerpo del email (con CTA claro)
- Texto alternativo corto (para mobile)`,
  };
}

export function getScriptPrompt(ctx: BrandContext, userPrompt: string, duration: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx) + '\n\nEres experto en contenido viral para video corto (Reels, TikTok, Shorts). Creas scripts que enganchan en los primeros 3 segundos.',
    user: `Escribe un script para video corto de ${duration}.

${userPrompt}

Formato:
- Hook (primeros 3 segundos — CRUCIAL para retención)
- Cuerpo del script (con timestamps)
- CTA final
- Sugerencia de música/audio
- Texto en pantalla sugerido`,
  };
}

export function getLandingCopyPrompt(ctx: BrandContext, userPrompt: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx) + '\n\nEres experto en conversion copywriting y landing pages de alto rendimiento.',
    user: `Genera copy para una landing page.

${userPrompt}

Formato:
- Hero headline
- Sub-headline
- 3 beneficios principales (con icono sugerido)
- Sección de social proof (testimonios placeholder)
- CTA principal
- FAQ sugerido (3-5 preguntas)`,
  };
}

export function getProductDescriptionPrompt(ctx: BrandContext, userPrompt: string): { system: string; user: string } {
  return {
    system: buildBrandSystemPrompt(ctx),
    user: `Genera una descripción de producto/servicio.

${userPrompt}

Formato:
- Título corto
- Descripción corta (1-2 líneas para catálogo)
- Descripción larga (para página de producto, 150-300 palabras)
- 5 bullet points de beneficios
- Keywords SEO sugeridas`,
  };
}

export type ContentTypeKey = 'ad_copy' | 'social_post' | 'blog' | 'email' | 'script' | 'landing_page' | 'product_description';

export function getPromptForType(
  type: ContentTypeKey,
  ctx: BrandContext,
  userPrompt: string,
  options: { platform?: string; duration?: string } = {}
): { system: string; user: string } {
  switch (type) {
    case 'ad_copy':
      return getAdCopyPrompt(ctx, userPrompt);
    case 'social_post':
      return getSocialPostPrompt(ctx, userPrompt, options.platform || 'instagram');
    case 'blog':
      return getBlogPrompt(ctx, userPrompt);
    case 'email':
      return getEmailPrompt(ctx, userPrompt);
    case 'script':
      return getScriptPrompt(ctx, userPrompt, options.duration || '30 segundos');
    case 'landing_page':
      return getLandingCopyPrompt(ctx, userPrompt);
    case 'product_description':
      return getProductDescriptionPrompt(ctx, userPrompt);
  }
}
