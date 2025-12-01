export interface NotificationTemplate {
  id: string;
  event: string;
  channel: 'Email' | 'Webhook' | 'SMS';
  subject?: string;
  template: string;
  variables: string[];
  active: boolean;
}

export interface ApiKeyPolicy {
  keyId: string;
  name: string;
  prefix: string;
  scopes: string[];
  rateLimit: number; // RPM
  ipWhitelist: string[];
  lastUsed: string;
}

export interface ModelRouteRule {
  id: string;
  name: string;
  condition: 'File_Size' | 'Token_Count' | 'Keyword' | 'Default';
  threshold?: number;
  targetModel: string;
  fallbackModel: string;
  active: boolean;
}

export interface PluginItem {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  installed: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'Info' | 'Warning' | 'Maintenance';
  active: boolean;
  date: string;
}

export interface I18nRecord {
  key: string;
  zh: string;
  en: string;
  module: string;
}
