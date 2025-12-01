export interface Role {
  id: string;
  name: string;
  key: string;
  description: string;
  userCount: number;
  status: 'active' | 'disabled';
  permissions?: string[]; // Array of Menu IDs
}

export interface Permission {
  id: string;
  role: string;
  resource: string; // Menu or KB Name
  accessLevel: 'Read' | 'Write' | 'Admin' | 'None';
  granularRights?: string[]; // e.g., ['Download', 'Parse', 'API']
}
