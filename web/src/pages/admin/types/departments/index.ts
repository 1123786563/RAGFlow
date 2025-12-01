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
