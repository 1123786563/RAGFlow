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
