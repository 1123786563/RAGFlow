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
