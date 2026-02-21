// Brand Kit
export interface BrandKit {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  logoUrl: string;
  tone: 'formal' | 'casual' | 'tecnico' | 'amigable';
  language: string;
}

// Target Audience
export interface TargetAudience {
  ageRange: string;
  interests: string[];
  painPoints: string[];
  desires: string[];
  location: string;
}

// Content Types
export type ContentType =
  | 'ad_copy'
  | 'social_post'
  | 'blog'
  | 'email'
  | 'script'
  | 'landing_page'
  | 'product_description';

export type ContentStatus = 'draft' | 'approved' | 'published' | 'archived';

export type Platform =
  | 'google'
  | 'meta'
  | 'tiktok'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'youtube';

// Ad Campaign
export type AdPlatform = 'google' | 'meta' | 'tiktok';
export type CampaignObjective = 'awareness' | 'traffic' | 'engagement' | 'leads' | 'sales';

// User Roles
export type UserRole = 'admin' | 'manager' | 'member';

// Organization Plans
export type OrgPlan = 'starter' | 'pro' | 'agency' | 'enterprise';

// Alert Severity
export type AlertSeverity = 'info' | 'warning' | 'critical';
