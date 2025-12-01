import {
  Building,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { DeptApi } from './api/index';
import { DepartmentEditModal } from './components/department-edit-modal';
import { DepartmentWithQuota } from './types/index';

import { TableEmpty } from '@/components/table-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DepartmentsView: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [departments, setDepartments] = useState<DepartmentWithQuota[]>([]);
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);

  // Fetch initial data
  React.useEffect(() => {
    try {
      const data = DeptApi.list();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      toast.error(t('departments.errors.fetchFailed'));
    }
  }, [t]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentWithQuota | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<DepartmentWithQuota | null>(
    null,
  );

  // Get color based on usage percentage with boundary check
  const getUsageColor = useCallback((usage: number) => {
    const clampedUsage = Math.min(100, Math.max(0, usage));
    if (clampedUsage > 80) return 'bg-red-500';
    if (clampedUsage > 60) return 'bg-orange-500';
    return 'bg-brand-500';
  }, []);

  // Helper: Recursive Filter for Search (no side effects)
  const filterDepartments = useCallback(
    (nodes: DepartmentWithQuota[], term: string): DepartmentWithQuota[] => {
      return nodes.reduce((acc: DepartmentWithQuota[], node) => {
        const matches =
          node.name.toLowerCase().includes(term.toLowerCase()) ||
          node.manager.toLowerCase().includes(term.toLowerCase());

        const filteredChildren = node.children
          ? filterDepartments(node.children, term)
          : [];

        if (matches || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren,
          });
        }
        return acc;
      }, []);
    },
    [],
  );

  const filteredDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    return filterDepartments(departments, searchTerm);
  }, [departments, searchTerm, filterDepartments]);

  // Auto-expand matching parents
  React.useEffect(() => {
    if (!searchTerm) return;

    const expandMatchingParents = (nodes: DepartmentWithQuota[]) => {
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          const hasMatchingChildren = node.children.some(
            (child) =>
              child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              child.manager.toLowerCase().includes(searchTerm.toLowerCase()),
          );
          if (hasMatchingChildren) {
            setExpandedRowIds((prev) => new Set(prev).add(node.id));
            expandMatchingParents(node.children);
          }
        }
      });
    };

    expandMatchingParents(filteredDepartments);
  }, [searchTerm, filteredDepartments]);

  const visibleDepartments = filteredDepartments;

  // Actions
  const toggleExpand = useCallback((id: string) => {
    setExpandedRowIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleAdd = () => {
    setEditingDept(null);
    setIsModalOpen(true);
  };

  const handleEdit = useCallback((dept: DepartmentWithQuota) => {
    setEditingDept(dept);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((dept: DepartmentWithQuota) => {
    setDeptToDelete(dept);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    try {
      if (deptToDelete) {
        // Recursive delete function
        const deleteNode = (
          nodes: DepartmentWithQuota[],
        ): DepartmentWithQuota[] => {
          return nodes
            .filter((node) => node.id !== deptToDelete.id)
            .map((node) => ({
              ...node,
              children: node.children ? deleteNode(node.children) : [],
            }));
        };
        setDepartments(deleteNode(departments));
        setIsDeleteDialogOpen(false);
        setDeptToDelete(null);
        toast.success(t('departments.success.delete'));
      }
    } catch (error) {
      console.error('Failed to delete department:', error);
      toast.error(t('departments.errors.deleteFailed'));
    }
  }, [deptToDelete, departments, t]);

  const handleSave = useCallback(
    (deptData: Partial<DepartmentWithQuota>) => {
      try {
        if (editingDept) {
          // Update existing
          const updateNode = (
            nodes: DepartmentWithQuota[],
          ): DepartmentWithQuota[] => {
            return nodes.map((node) => {
              if (node.id === editingDept.id) {
                return { ...node, ...deptData } as DepartmentWithQuota;
              }
              if (node.children) {
                return { ...node, children: updateNode(node.children) };
              }
              return node;
            });
          };
          setDepartments(updateNode(departments));
          toast.success(t('departments.success.update'));
        } else {
          // Create new
          const newDept: DepartmentWithQuota = {
            id: uuidv4(),
            name: deptData.name || t('departments.new.defaultName'),
            manager: deptData.manager || '',
            memberCount: 0,
            location: deptData.location || '',
            tokenLimit: deptData.tokenLimit || 'Unlimited',
            storageLimit: deptData.storageLimit || '100 GB',
            usage: 0,
            children: [],
          };

          if (!parentId) {
            setDepartments([...departments, newDept]);
          } else {
            const appendNode = (
              nodes: DepartmentWithQuota[],
            ): DepartmentWithQuota[] => {
              return nodes.map((node) => {
                if (node.id === parentId) {
                  return {
                    ...node,
                    children: [...(node.children || []), newDept],
                  };
                }
                if (node.children) {
                  return { ...node, children: appendNode(node.children) };
                }
                return node;
              });
            };
            setDepartments(appendNode(departments));
            // Auto expand parent
            setExpandedRowIds((prev) => new Set(prev).add(parentId));
          }
          toast.success(t('departments.success.create'));
        }
      } catch (error) {
        console.error('Failed to save department:', error);
        toast.error(t('departments.errors.saveFailed'));
      }
    },
    [editingDept, departments, parentId, t],
  );

  // Render Row Recursive
  const renderRows = (
    nodes: DepartmentWithQuota[],
    depth: number = 0,
  ): JSX.Element[] => {
    return nodes.flatMap((dept) => {
      const hasChildren = dept.children && dept.children.length > 0;
      const isExpanded = expandedRowIds.has(dept.id);

      const row = (
        <TableRow
          key={dept.id}
          className="group/row hover:bg-accent/50 transition-colors border-b border-border"
        >
          <TableCell className="py-3">
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(dept.id)}
                  className="p-0.5 hover:bg-accent rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </button>
              ) : (
                <span className="w-5 inline-block"></span>
              )}
              <Building size={16} className="text-primary" />
              <span className="font-medium text-foreground">{dept.name}</span>
            </div>
          </TableCell>
          <TableCell className="py-3 text-muted-foreground">
            {dept.manager || '-'}
          </TableCell>
          <TableCell className="py-3 text-muted-foreground">
            {dept.memberCount}
          </TableCell>
          <TableCell className="py-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-sm font-mono">
              {dept.tokenLimit}
            </span>
          </TableCell>
          <TableCell className="py-3 text-muted-foreground font-mono text-sm">
            {dept.storageLimit}
          </TableCell>
          <TableCell className="py-3">
            <div className="w-28">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground font-medium">
                  {dept.usage}%
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getUsageColor(dept.usage)}`}
                  style={{
                    width: `${Math.min(100, Math.max(0, dept.usage))}%`,
                  }}
                ></div>
              </div>
            </div>
          </TableCell>
          <TableCell className="py-3 text-right">
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingDept(null);
                  setParentId(dept.id);
                  setIsModalOpen(true);
                }}
                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                title={t('departments.actions.addSubDepartment')}
              >
                <Plus size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(dept)}
                className="h-8 w-8 hover:bg-accent hover:text-accent-foreground"
                title={t('common.edit')}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(dept)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                title={t('common.delete')}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      );

      const childrenRows: JSX.Element[] =
        hasChildren && isExpanded ? renderRows(dept.children!, depth + 1) : [];
      return [row, ...childrenRows];
    });
  };

  return (
    <Card className="!shadow-none relative h-full bg-transparent overflow-hidden border-none">
      <CardHeader className="space-y-0 flex flex-row justify-between items-center px-6 py-4">
        <CardTitle>{t('departments.title')}</CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('departments.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('departments.actions.create')}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold text-muted-foreground pl-6">
                  {t('departments.headers.name')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground">
                  {t('departments.headers.manager')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground">
                  {t('departments.headers.memberCount')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground">
                  {t('departments.headers.tokenLimit')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground">
                  {t('departments.headers.storageLimit')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground">
                  {t('departments.headers.usage')}
                </TableHead>
                <TableHead className="font-semibold text-muted-foreground text-right pr-6">
                  {t('departments.headers.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleDepartments.length > 0 ? (
                renderRows(visibleDepartments)
              ) : (
                <TableEmpty columnsLength={7} />
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>

      <DepartmentEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDept(null);
          setParentId(null);
        }}
        department={editingDept}
        allDepartments={departments}
        parentId={parentId}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('departments.delete.title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              {t('departments.delete.confirm')}
            </p>
            {deptToDelete && (
              <p className="font-medium mt-2 text-foreground">
                {deptToDelete.name}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DepartmentsView;
