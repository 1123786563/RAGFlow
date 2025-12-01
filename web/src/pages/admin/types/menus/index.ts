export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon: string;
  sortOrder: number;
  visible: boolean;
  // Hierarchical support
  children?: MenuItem[];
}
