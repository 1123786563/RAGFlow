import { LLMProvider } from '../../types/index';

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: '1',
    name: 'OpenAI Main',
    type: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    status: 'active',
    models: ['gpt-4', 'gpt-3.5-turbo'],
  },
  {
    id: '2',
    name: 'Azure East US',
    type: 'Azure',
    baseUrl: 'https://ragflow-azure.openai.azure.com',
    status: 'active',
    models: ['gpt-4-32k'],
  },
  {
    id: '3',
    name: 'Local vLLM',
    type: 'Local',
    baseUrl: 'http://192.168.1.50:8000',
    status: 'disabled',
    models: ['llama-3-70b'],
  },
];
