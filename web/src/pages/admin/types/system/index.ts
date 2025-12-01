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

export interface LLMProvider {
  id: string;
  name: string;
  type: 'OpenAI' | 'Azure' | 'Local' | 'Anthropic';
  baseUrl: string;
  status: 'active' | 'disabled';
  models: string[];
}

export interface BackupItem {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'Full' | 'Incremental';
  status: 'Success' | 'Failed';
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
