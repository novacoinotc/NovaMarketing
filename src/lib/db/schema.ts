import { pgTable, uuid, text, timestamp, jsonb, boolean, integer } from 'drizzle-orm/pg-core';

// ==========================================
// CORE TABLES — Multi-tenant
// ==========================================

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: text('plan').default('starter'), // starter, pro, agency, enterprise
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  email: text('email').unique().notNull(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('member'), // admin, manager, member
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id).notNull(),
  name: text('name').notNull(),
  domain: text('domain'),
  brandKitJson: jsonb('brand_kit_json'), // {colors, fonts, logo_url, tone, language}
  targetAudienceJson: jsonb('target_audience_json'), // {age, interests, pain_points, location}
  competitorsJson: jsonb('competitors_json'),
  industry: text('industry'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const integrations = pgTable('integrations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  platform: text('platform').notNull(), // google_ads, meta_ads, tiktok_ads, instagram, facebook, x, analytics, search_console
  credentialsEncrypted: jsonb('credentials_encrypted').notNull(),
  accountId: text('account_id'),
  status: text('status').default('connected'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// CONTENT ENGINE
// ==========================================

export const contentPieces = pgTable('content_pieces', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(), // ad_copy, social_post, blog, email, script, landing_page, product_description
  title: text('title'),
  content: text('content').notNull(),
  status: text('status').default('draft'), // draft, approved, published, archived
  platform: text('platform'), // google, meta, tiktok, instagram, facebook, x, linkedin, youtube
  performanceMetrics: jsonb('performance_metrics'),
  aiPromptUsed: text('ai_prompt_used'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const contentTemplates = pgTable('content_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(),
  name: text('name').notNull(),
  template: text('template').notNull(),
  variables: jsonb('variables'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const abTests = pgTable('ab_tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  contentAId: uuid('content_a_id').references(() => contentPieces.id),
  contentBId: uuid('content_b_id').references(() => contentPieces.id),
  metric: text('metric'), // ctr, conversions, engagement
  winnerId: uuid('winner_id'),
  status: text('status').default('running'), // running, completed
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
});

// ==========================================
// ADS MANAGER
// ==========================================

export const adCampaigns = pgTable('ad_campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  platform: text('platform').notNull(), // google, meta, tiktok
  campaignIdExternal: text('campaign_id_external'),
  name: text('name').notNull(),
  budget: integer('budget'),
  status: text('status').default('draft'),
  objective: text('objective'),
  metricsJson: jsonb('metrics_json'),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const adCreatives = pgTable('ad_creatives', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => adCampaigns.id).notNull(),
  headline: text('headline'),
  description: text('description'),
  imageUrl: text('image_url'),
  cta: text('cta'),
  performanceJson: jsonb('performance_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const adKeywords = pgTable('ad_keywords', {
  id: uuid('id').primaryKey().defaultRandom(),
  campaignId: uuid('campaign_id').references(() => adCampaigns.id).notNull(),
  keyword: text('keyword').notNull(),
  matchType: text('match_type'), // broad, phrase, exact
  bid: integer('bid'),
  qualityScore: integer('quality_score'),
  performanceJson: jsonb('performance_json'),
});

export const adAlerts = pgTable('ad_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  severity: text('severity').default('info'), // info, warning, critical
  resolved: boolean('resolved').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// SOCIAL MEDIA MANAGER
// ==========================================

export const socialAccounts = pgTable('social_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  platform: text('platform').notNull(), // instagram, facebook, tiktok, x, linkedin, youtube
  accountId: text('account_id'),
  accessTokenEncrypted: text('access_token_encrypted'),
  refreshTokenEncrypted: text('refresh_token_encrypted'),
  connectedAt: timestamp('connected_at', { withTimezone: true }).defaultNow(),
});

export const socialPosts = pgTable('social_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  platform: text('platform').notNull(),
  content: text('content').notNull(),
  mediaUrls: jsonb('media_urls'), // string[]
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  status: text('status').default('draft'), // draft, scheduled, published, failed
  metricsJson: jsonb('metrics_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// DESIGN ENGINE
// ==========================================

export const designAssets = pgTable('design_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(), // ad_image, social_post, banner, carousel, thumbnail
  url: text('url').notNull(),
  format: text('format'), // png, jpg, webp
  dimensions: text('dimensions'), // "1200x628"
  aiPrompt: text('ai_prompt'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const brandKits = pgTable('brand_kits', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  logoUrl: text('logo_url'),
  colorsJson: jsonb('colors_json'), // {primary, secondary, accent, background, text}
  fontsJson: jsonb('fonts_json'), // {heading, body}
  styleGuidelines: text('style_guidelines'),
  tone: text('tone'), // formal, casual, tecnico, amigable
});

export const designTemplates = pgTable('design_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  htmlTemplate: text('html_template').notNull(),
  variablesSchema: jsonb('variables_schema'),
  previewUrl: text('preview_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// SEO ENGINE
// ==========================================

export const seoAudits = pgTable('seo_audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  score: integer('score'),
  issuesJson: jsonb('issues_json'),
  recommendationsJson: jsonb('recommendations_json'),
  auditedAt: timestamp('audited_at', { withTimezone: true }).defaultNow(),
});

export const seoKeywords = pgTable('seo_keywords', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  keyword: text('keyword').notNull(),
  position: integer('position'),
  searchVolume: integer('search_volume'),
  difficulty: integer('difficulty'),
  trackedSince: timestamp('tracked_since', { withTimezone: true }).defaultNow(),
  historyJson: jsonb('history_json'),
});

// ==========================================
// ANALYTICS & REPORTING
// ==========================================

export const analyticsSnapshots = pgTable('analytics_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  date: timestamp('date', { withTimezone: true }).notNull(),
  source: text('source').notNull(), // ga4, ads, social, seo
  metricsJson: jsonb('metrics_json').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const reports = pgTable('reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(), // daily, weekly, monthly, custom
  periodStart: timestamp('period_start', { withTimezone: true }),
  periodEnd: timestamp('period_end', { withTimezone: true }),
  dataJson: jsonb('data_json'),
  pdfUrl: text('pdf_url'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
});

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(),
  message: text('message').notNull(),
  severity: text('severity').default('info'), // info, warning, critical
  dataJson: jsonb('data_json'),
  seen: boolean('seen').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// MARKET INTELLIGENCE
// ==========================================

export const competitors = pgTable('competitors', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  domain: text('domain'),
  socialHandlesJson: jsonb('social_handles_json'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const marketReports = pgTable('market_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  type: text('type').notNull(), // weekly, monthly, custom
  dataJson: jsonb('data_json'),
  insightsJson: jsonb('insights_json'),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow(),
});

export const audienceSegments = pgTable('audience_segments', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  demographicsJson: jsonb('demographics_json'),
  interestsJson: jsonb('interests_json'),
  painPoints: text('pain_points'),
  sizeEstimate: integer('size_estimate'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ==========================================
// VIDEO ENGINE
// ==========================================

export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  script: text('script'),
  voiceoverUrl: text('voiceover_url'),
  videoUrl: text('video_url'),
  subtitlesJson: jsonb('subtitles_json'),
  duration: integer('duration'), // seconds
  format: text('format'), // vertical, square, horizontal
  status: text('status').default('draft'), // draft, generating, ready, published
  platformTarget: text('platform_target'), // reels, tiktok, shorts, youtube
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const videoTemplates = pgTable('video_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  name: text('name').notNull(),
  structureJson: jsonb('structure_json'),
  exampleUrl: text('example_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
