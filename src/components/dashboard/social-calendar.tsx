'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';

interface Post {
  id: string;
  platform: string;
  content: string;
  status: string | null;
  scheduledAt: string | Date | null;
  createdAt: string | Date | null;
}

const platformColors: Record<string, string> = {
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-600',
  x: 'bg-black',
  linkedin: 'bg-blue-700',
  tiktok: 'bg-gray-900',
};

export function SocialCalendar({ posts }: { posts: Post[] }) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const postsByDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const date = post.scheduledAt || post.createdAt;
      if (!date) continue;
      const key = format(new Date(date), 'yyyy-MM-dd');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(post);
    }
    return map;
  }, [posts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Calendario — Semana actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayPosts = postsByDay.get(key) || [];
            const isToday = isSameDay(day, today);

            return (
              <div
                key={key}
                className={`min-h-[140px] rounded-lg border p-2 ${
                  isToday ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="text-xs font-medium mb-1.5">
                  <span className="capitalize">{format(day, 'EEE', { locale: es })}</span>
                  <span className={`ml-1 ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className="rounded p-1.5 bg-muted text-xs"
                      title={post.content}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <div className={`h-2 w-2 rounded-full ${platformColors[post.platform] || 'bg-gray-400'}`} />
                        <span className="capitalize font-medium">{post.platform}</span>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground">{post.content}</p>
                    </div>
                  ))}
                  {dayPosts.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">+{dayPosts.length - 3} más</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
