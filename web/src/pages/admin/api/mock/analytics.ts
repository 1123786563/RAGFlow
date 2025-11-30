export const OVERVIEW_DATA = {
  totalChats: [65, 85, 70, 90, 110, 105, 130],
  apiCosts: [5, 7, 6, 8, 12, 10, 15],
  systemLoad: [40, 45, 30, 60, 55, 70, 50],
};

export const KB_TYPE_DISTRIBUTION = [
  { label: 'PDF', value: 45, color: 'bg-rose-500' },
  { label: 'DOCX', value: 25, color: 'bg-blue-500' },
  { label: 'TXT', value: 15, color: 'bg-slate-500' },
  { label: 'WEB', value: 10, color: 'bg-indigo-500' },
];

export const KB_LIST = [
  {
    name: '迪士尼 (Disney)',
    docs: 44,
    vec: '450 MB',
    src: '1.2 GB',
    icon: '迪',
    color: 'bg-purple-500',
  },
  {
    name: 'Alpha 项目规范',
    docs: 12,
    vec: '120 MB',
    src: '340 MB',
    icon: 'A',
    color: 'bg-blue-500',
  },
  {
    name: '财务报告 2025',
    docs: 8,
    vec: '85 MB',
    src: '210 MB',
    icon: '财',
    color: 'bg-emerald-500',
  },
  {
    name: '法律合同',
    docs: 156,
    vec: '890 MB',
    src: '4.5 GB',
    icon: '法',
    color: 'bg-orange-500',
  },
];

export const DAILY_TOKEN_USAGE = [
  {
    label: '周一',
    series: [
      { value: 110000, color: 'bg-brand-500', label: 'Input' },
      { value: 40000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周二',
    series: [
      { value: 170000, color: 'bg-brand-500', label: 'Input' },
      { value: 60000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周三',
    series: [
      { value: 130000, color: 'bg-brand-500', label: 'Input' },
      { value: 50000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周四',
    series: [
      { value: 240000, color: 'bg-brand-500', label: 'Input' },
      { value: 80000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周五',
    series: [
      { value: 210000, color: 'bg-brand-500', label: 'Input' },
      { value: 80000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周六',
    series: [
      { value: 100000, color: 'bg-brand-500', label: 'Input' },
      { value: 40000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
  {
    label: '周日',
    series: [
      { value: 90000, color: 'bg-brand-500', label: 'Input' },
      { value: 30000, color: 'bg-emerald-500', label: 'Output' },
    ],
  },
];

export const MODEL_COSTS = [
  {
    name: 'GPT-4',
    tokens: '450K',
    cost: 78.5,
    width: '80%',
    color: 'bg-purple-600',
  },
  {
    name: 'Claude 3.5 Sonnet',
    tokens: '2.1M',
    cost: 32.4,
    width: '40%',
    color: 'bg-orange-500',
  },
  {
    name: 'Llama 3 (Local)',
    tokens: '1.5M',
    cost: 0.0,
    width: '1%',
    color: 'bg-slate-300',
  },
  {
    name: 'GPT-3.5 Turbo',
    tokens: '150K',
    cost: 17.5,
    width: '20%',
    color: 'bg-green-500',
  },
];

export const CHAT_ACTIVITY_HOURLY = [
  { label: '00h', value: 12 },
  { label: '04h', value: 5 },
  { label: '08h', value: 45 },
  { label: '12h', value: 120 },
  { label: '16h', value: 95 },
  { label: '20h', value: 60 },
];

export const POPULAR_TOPICS = [
  { topic: '产品规格', count: 450, trend: '+12%', color: 'w-full' },
  { topic: '价格咨询', count: 320, trend: '-5%', color: 'w-3/4' },
  { topic: '故障排查', count: 210, trend: '+8%', color: 'w-1/2' },
  { topic: 'HR 政策', count: 180, trend: '+2%', color: 'w-1/3' },
  { topic: 'API 文档', count: 150, trend: '+15%', color: 'w-1/4' },
];

export const LOW_CONFIDENCE_QUERIES = [
  'pricing structure 2024',
  'employee handbook v2',
  'api authentication error 503',
  'legacy db schema',
];

export const SLOWEST_DOCS = [
  'Annual_Report_Full.pdf',
  'Engineering_Spec_Draft.docx',
  'Q3_Financials_Raw.xlsx',
  'Product_Roadmap_2025.pptx',
];
