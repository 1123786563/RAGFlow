import {
  ApiKeyPolicy,
  BillingInvoice,
  HealthStatus,
  I18nRecord,
  ModelRouteRule,
  NotificationTemplate,
} from '../../types/index';

export const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    event: 'Password Reset',
    channel: 'Email',
    subject: 'Reset Your Password - RAGFlow',
    template: 'Hi {{user_name}}, click here to reset...',
    variables: ['user_name', 'link'],
    active: true,
  },
  {
    id: '2',
    event: 'Task Failed',
    channel: 'Webhook',
    template: '{"text": "Task {{task_id}} failed: {{error_msg}}"}',
    variables: ['task_id', 'error_msg'],
    active: true,
  },
  {
    id: '3',
    event: 'Quota Warning',
    channel: 'Email',
    subject: 'Resource Usage Alert',
    template: 'You have used {{usage}}% of your quota.',
    variables: ['usage'],
    active: true,
  },
];

export const API_KEY_POLICIES: ApiKeyPolicy[] = [
  {
    keyId: '1',
    name: 'Backend Service',
    prefix: 'sk-rag...',
    scopes: ['Chat:Write', 'KB:Read'],
    rateLimit: 600,
    ipWhitelist: ['192.168.1.0/24'],
    lastUsed: '2 mins ago',
  },
  {
    keyId: '2',
    name: 'Mobile App',
    prefix: 'sk-mob...',
    scopes: ['Chat:Write'],
    rateLimit: 60,
    ipWhitelist: [],
    lastUsed: '1 day ago',
  },
];

export const MODEL_ROUTES: ModelRouteRule[] = [
  {
    id: '1',
    name: 'Heavy Lifting',
    condition: 'Token_Count',
    threshold: 4000,
    targetModel: 'gpt-4',
    fallbackModel: 'gpt-3.5-turbo',
    active: true,
  },
  {
    id: '2',
    name: 'Simple Chat',
    condition: 'Default',
    targetModel: 'gpt-3.5-turbo',
    fallbackModel: 'llama-3-70b',
    active: true,
  },
];

export const HEALTH_STATUS: HealthStatus[] = [
  {
    component: 'PostgreSQL',
    status: 'Healthy',
    latency: '2ms',
    version: '15.4',
    uptime: '45d 12h',
  },
  {
    component: 'Redis Cache',
    status: 'Healthy',
    latency: '0.5ms',
    version: '7.0',
    uptime: '45d 12h',
  },
  {
    component: 'Vector DB (Milvus)',
    status: 'Degraded',
    latency: '450ms',
    version: '2.3',
    uptime: '12d 4h',
  },
  {
    component: 'OCR Service',
    status: 'Healthy',
    latency: '120ms',
    version: 'v2.1',
    uptime: '45d 12h',
  },
];

export const INVOICES: BillingInvoice[] = [
  {
    id: 'INV-2025-001',
    period: 'Oct 2025',
    amount: 124.5,
    status: 'Paid',
    pdfUrl: '#',
  },
  {
    id: 'INV-2025-002',
    period: 'Nov 2025',
    amount: 145.2,
    status: 'Pending',
    pdfUrl: '#',
  },
];

export const I18N_RECORDS: I18nRecord[] = [
  {
    key: 'welcome_msg',
    zh: '欢迎使用 RAGFlow',
    en: 'Welcome to RAGFlow',
    module: 'Home',
  },
  {
    key: 'btn_save',
    zh: '保存配置',
    en: 'Save Configuration',
    module: 'Common',
  },
  {
    key: 'err_network',
    zh: '网络连接失败',
    en: 'Network connection failed',
    module: 'Error',
  },
];
