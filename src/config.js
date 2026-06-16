// ═══════════════════════════════════════════════════
// LeadFlow Pro — Configuration
// ═══════════════════════════════════════════════════

export const CONFIG = {
  // N8N Webhook URL
  // For testing (workflow must be in test mode): webhook-test/...
  // For production (workflow activated): webhook/...
  WEBHOOK_URL: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://kaddourn8n.online/webhook/leadflow-search',

  // Set to false to use live N8N webhook
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || false,

  // Default language: 'en' or 'ar'
  DEFAULT_LANG: 'en',

  // Table settings
  ITEMS_PER_PAGE: 15,

  // App info
  APP_NAME: 'LeadFlow Pro',
  APP_VERSION: '1.0.0'
};
