import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { getSocialPosts, createSocialPost } from '@/lib/db/queries/social';
import { z } from 'zod/v4';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const posts = await getSocialPosts(projectId);
  return NextResponse.json(posts);
}

const postSchema = z.object({
  platform: z.string().min(1),
  content: z.string().min(1).max(5000),
  scheduledAt: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { projectId } = await params;
  const body = await req.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const post = await createSocialPost({
    projectId,
    ...parsed.data,
    scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
  });

  return NextResponse.json(post, { status: 201 });
}
