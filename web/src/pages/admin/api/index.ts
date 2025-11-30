import * as AnalyticsData from './mock/analytics';
import { CHAT_SESSIONS } from './mock/chat';
import { DEPTS } from './mock/depts';
import { KNOWLEDGE_BASES } from './mock/knowledge';
import { AUDIT_LOGS, SYSTEM_LOGS } from './mock/logs';
import { MENUS } from './mock/menus';
import { LLM_PROVIDERS } from './mock/models';
import { KB_PERMISSIONS, MENU_PERMISSIONS } from './mock/permissions';
import * as ProdData from './mock/productivity';
import { ROLES } from './mock/roles';
import { SESSIONS } from './mock/security';
import * as ExtData from './mock/system_extensions';
import { TASKS } from './mock/tasks';
import { TENANTS } from './mock/tenants';
import { USERS } from './mock/users';

// System Management APIs
export const UserApi = {
  list: () => USERS,
  get: (id: string) => USERS.find((u) => u.id === id),
};

export const RoleApi = {
  list: () => ROLES,
};

export const DeptApi = {
  list: () => DEPTS,
};

export const MenuApi = {
  list: () => MENUS,
  permissions: () => MENU_PERMISSIONS,
};

export const KbApi = {
  list: () => KNOWLEDGE_BASES,
  permissions: () => KB_PERMISSIONS,
};

export const ChatApi = {
  sessions: () => CHAT_SESSIONS,
};

// System Operations & Logs
export const LogApi = {
  audit: () => AUDIT_LOGS,
  system: () => SYSTEM_LOGS,
};

export const TenantApi = {
  list: () => TENANTS,
};

export const SecurityApi = {
  sessions: () => SESSIONS,
};

export const ModelApi = {
  providers: () => LLM_PROVIDERS,
};

export const TaskApi = {
  list: () => TASKS,
};

// Analytics API
export const AnalyticsApi = {
  overview: () => AnalyticsData.OVERVIEW_DATA,
  kbDistribution: () => AnalyticsData.KB_TYPE_DISTRIBUTION,
  kbList: () => AnalyticsData.KB_LIST,
  tokenUsage: () => AnalyticsData.DAILY_TOKEN_USAGE,
  modelCosts: () => AnalyticsData.MODEL_COSTS,
  chatActivity: () => AnalyticsData.CHAT_ACTIVITY_HOURLY,
  topics: () => AnalyticsData.POPULAR_TOPICS,
  lowConfidence: () => AnalyticsData.LOW_CONFIDENCE_QUERIES,
  slowDocs: () => AnalyticsData.SLOWEST_DOCS,
};

// System Extensions API
export const SysExtApi = {
  notificationTemplates: () => ExtData.NOTIFICATION_TEMPLATES,
  apiKeys: () => ExtData.API_KEY_POLICIES,
  modelRoutes: () => ExtData.MODEL_ROUTES,
  health: () => ExtData.HEALTH_STATUS,
  invoices: () => ExtData.INVOICES,
  i18n: () => ExtData.I18N_RECORDS,
};

// Productivity API
export const ProdApi = {
  agentNodes: () => ProdData.AGENT_NODES,
  dataSources: () => ProdData.DATA_SOURCES,
  reviewDocs: () => ProdData.REVIEW_DOCS,
  evalDatasets: () => ProdData.EVAL_DATASETS,
};
