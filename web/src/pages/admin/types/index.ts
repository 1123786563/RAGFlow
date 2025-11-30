import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path: string;
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  fileCount: number;
  lastUpdated: string;
  iconChar: string;
  color: string;
}

export interface ChatSessionItem {
  id: string;
  title: string;
  lastMessage?: string;
  lastUpdated: string;
  iconChar: string;
  color: string;
  type: 'chat' | 'search' | 'agent';
}

export enum SectionType {
  KNOWLEDGE = 'KNOWLEDGE',
  CHAT = 'CHAT',
}

export enum ChatTab {
  CHAT = 'chat',
  SEARCH = 'search',
  AGENTS = 'agents',
}

// System Management Interfaces
export interface User {
  id: string;
  create_time?: number;
  create_date?: string;
  update_time?: number;
  update_date?: string;
  access_token?: string;
  nickname: string;
  password?: string;
  email: string;
  avatar?: string;
  language?: string;
  color_schema?: string;
  timezone?: string;
  last_login_time?: string;
  is_authenticated: string; // '1' | '0'
  is_active: string; // '1' | '0'
  is_anonymous: string; // '1' | '0'
  login_channel?: string;
  status?: string; // '1' | '0'
  is_superuser: boolean;

  // UI Display Helper (Optional/Joined)
  role?: string;
  department?: string;
}

export interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  userCount: number;
  status: 'active' | 'disabled';
  permissions?: string[]; // Array of Menu IDs
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  memberCount: number;
  location: string;
  // Hierarchical support
  children?: Department[];
}

export interface DepartmentWithQuota extends Department {
  tokenLimit: string;
  storageLimit: string;
  usage: number; // percentage
  children?: DepartmentWithQuota[];
}

export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
  // Hierarchical support
  children?: MenuItem[];
}

export interface Permission {
  id: string;
  role: string;
  resource: string; // Menu or KB Name
  accessLevel: 'Read' | 'Write' | 'Admin' | 'None';
  granularRights?: string[]; // e.g., ['Download', 'Parse', 'API']
}

// Log Interfaces
export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  module: 'User' | 'Role' | 'Dept' | 'KB' | 'Agent' | 'File' | 'System';
  action: string;
  target: string;
  ip: string;
  status: 'Success' | 'Failure';
  details?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  service: string;
  message: string;
  traceId?: string;
}

// New System Features Interfaces
export interface UserSession {
  id: string;
  user: string;
  ip: string;
  device: string;
  loginTime: string;
  lastActive: string;
}

export interface Session {
  id: string;
  user: string;
  ip: string;
  device: string;
  time: string;
}

export interface BackupItem {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'Full' | 'Incremental';
  status: 'Success' | 'Failed';
}

export interface Tenant {
  id: string;
  create_time?: number;
  create_date?: string;
  update_time?: number;
  update_date?: string;
  name: string;
  public_key?: string;
  llm_id: string;
  embd_id: string;
  asr_id: string;
  img2txt_id: string;
  rerank_id: string;
  tts_id?: string;
  parser_ids: string;
  credit: number;
  status: string; // '1' | '0'
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

export interface LLMProvider {
  id: string;
  name: string;
  type: 'OpenAI' | 'Azure' | 'Local' | 'Anthropic';
  baseUrl: string;
  status: 'active' | 'disabled';
  models: string[];
}

export interface Task {
  id: string;
  create_time?: number;
  create_date?: string;
  update_time?: number;
  update_date?: string;
  doc_id: string;
  from_page: number;
  to_page: number;
  task_type: string;
  priority: number;
  begin_at?: string;
  process_duration: number; // seconds
  progress: number; // 0.0 to 1.0
  progress_msg?: string;
  retry_count: number;
  digest?: string;
  chunk_ids?: string;
}

// --- EXTENSION INTERFACES ---

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

export interface HealthStatus {
  component: string;
  status: 'Healthy' | 'Degraded' | 'Down';
  latency: string;
  version: string;
  uptime: string;
}

export interface BillingInvoice {
  id: string;
  period: string;
  amount: number;
  status: 'Paid' | 'Pending';
  pdfUrl: string;
}

export interface I18nRecord {
  key: string;
  zh: string;
  en: string;
  module: string;
}

// --- PRODUCTIVITY EXTENSIONS ---

export interface AgentNode {
  id: string;
  type: 'start' | 'llm' | 'retrieval' | 'tool' | 'end';
  label: string;
  status: 'idle' | 'running' | 'success' | 'error';
  x: number;
  y: number;
}

export interface DataSource {
  id: string;
  type: 'Notion' | 'Slack' | 'Jira' | 'MySQL' | 'Web';
  name: string;
  status: 'Connected' | 'Error' | 'Syncing';
  lastSync: string;
  schedule: string;
}

export interface ReviewDoc {
  id: string;
  name: string;
  kb: string;
  uploader: string;
  uploadDate: string;
  status: 'Pending_Review' | 'Approved' | 'Rejected';
  chunks: number;
}

export interface EvalDataset {
  id: string;
  name: string;
  count: number;
  avgScore: number;
  lastRun: string;
}
