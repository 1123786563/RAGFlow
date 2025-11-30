import {
  AgentNode,
  DataSource,
  EvalDataset,
  ReviewDoc,
} from '../../types/index';

export const AGENT_NODES: AgentNode[] = [
  {
    id: '1',
    type: 'start',
    label: 'User Input',
    status: 'success',
    x: 50,
    y: 150,
  },
  {
    id: '2',
    type: 'retrieval',
    label: 'KB Search (Hybrid)',
    status: 'success',
    x: 250,
    y: 150,
  },
  {
    id: '3',
    type: 'llm',
    label: 'Reasoning (GPT-4)',
    status: 'running',
    x: 450,
    y: 150,
  },
  {
    id: '4',
    type: 'tool',
    label: 'Google Search',
    status: 'idle',
    x: 450,
    y: 250,
  },
  { id: '5', type: 'end', label: 'Response', status: 'idle', x: 650, y: 150 },
];

export const DATA_SOURCES: DataSource[] = [
  {
    id: '1',
    type: 'Notion',
    name: 'Engineering Wiki',
    status: 'Connected',
    lastSync: '10 mins ago',
    schedule: 'Daily 02:00',
  },
  {
    id: '2',
    type: 'Slack',
    name: '#support-channel',
    status: 'Syncing',
    lastSync: 'Now',
    schedule: 'Hourly',
  },
  {
    id: '3',
    type: 'Web',
    name: 'Competitor News',
    status: 'Connected',
    lastSync: '1 hour ago',
    schedule: 'Every 6h',
  },
  {
    id: '4',
    type: 'Jira',
    name: 'Bug Tracker',
    status: 'Error',
    lastSync: '2 days ago',
    schedule: 'Daily 00:00',
  },
];

export const REVIEW_DOCS: ReviewDoc[] = [
  {
    id: '1',
    name: 'Q4_Investment_Strategy.pdf',
    kb: 'Finance',
    uploader: 'Bob Smith',
    uploadDate: '2025-11-29',
    status: 'Pending_Review',
    chunks: 145,
  },
  {
    id: '2',
    name: 'Employee_Contract_Template.docx',
    kb: 'Legal',
    uploader: 'Alice Chen',
    uploadDate: '2025-11-28',
    status: 'Approved',
    chunks: 24,
  },
  {
    id: '3',
    name: 'Secret_Project_X.txt',
    kb: 'R&D',
    uploader: 'Guest',
    uploadDate: '2025-11-29',
    status: 'Rejected',
    chunks: 5,
  },
];

export const EVAL_DATASETS: EvalDataset[] = [
  {
    id: '1',
    name: 'General QA Golden Set',
    count: 150,
    avgScore: 0.88,
    lastRun: 'Yesterday',
  },
  {
    id: '2',
    name: 'Legal Compliance Test',
    count: 45,
    avgScore: 0.92,
    lastRun: '2 days ago',
  },
  {
    id: '3',
    name: 'Hallucination Check',
    count: 200,
    avgScore: 0.75,
    lastRun: 'Today',
  },
];
