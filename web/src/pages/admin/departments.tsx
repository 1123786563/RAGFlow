import {
  Building,
  ChevronDown,
  ChevronRight,
  Edit,
  Plus,
  Trash2,
} from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeptApi } from './api/index';
import { DepartmentEditModal } from './components/department-edit-modal';
import { DepartmentWithQuota } from './types/index';

import Spotlight from '@/components/spotlight';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const DepartmentsView: React.FC = () => {
  const { t } = useTranslation();

  // State
  const [departments, setDepartments] = useState<DepartmentWithQuota[]>(
    DeptApi.list(),
  );
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    new Set(['1', '1-1']),
  );
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentWithQuota | null>(
    null,
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<DepartmentWithQuota | null>(
    null,
  );

  // Get color based on usage percentage
  const getUsageColor = useCallback((usage: number) => {
    if (usage > 80) return 'bg-red-500';
    if (usage > 60) return 'bg-orange-500';
    return 'bg-brand-500';
  }, []);

  // Helper: Recursive Filter for Search
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
          // If searching, auto-expand parents
          if (term && filteredChildren.length > 0) {
            setExpandedRowIds((prev) => {
              const next = new Set(prev);
              next.add(node.id);
              return next;
            });
          }

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

  const visibleDepartments = useMemo(() => {
    if (!searchTerm) return departments;
    return filterDepartments(departments, searchTerm);
  }, [departments, searchTerm, filterDepartments]);

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
    }
  }, [deptToDelete, departments]);

  const handleSave = useCallback(
    (deptData: Partial<DepartmentWithQuota>, parentId: string | null) => {
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
      } else {
        // Create new
        const newDept: DepartmentWithQuota = {
          id: Date.now().toString(),
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
      }
    },
    [editingDept, departments, t],
  );

  // Render Row Recursive
  const renderRows = (nodes: DepartmentWithQuota[], depth: number = 0) => {
    return nodes.flatMap((dept) => {
      const hasChildren = dept.children && dept.children.length > 0;
      const isExpanded = expandedRowIds.has(dept.id);

      const row = (
        <TableRow
          key={dept.id}
          className="hover:bg-slate-50 transition-colors group"
        >
          <TableCell className="font-medium">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpand(dept.id)}
                  className="p-0.5 mr-2 h-6 w-6"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </Button>
              ) : (
                <span className="w-6 mr-2 inline-block"></span>
              )}
              <Building size={14} className="text-brand-500 mr-2 opacity-70" />
              {dept.name}
            </div>
          </TableCell>
          <TableCell>{dept.manager || '-'}</TableCell>
          <TableCell>{dept.memberCount}</TableCell>
          <TableCell className="font-mono bg-slate-50 rounded px-2 w-fit">
            {dept.tokenLimit}
          </TableCell>
          <TableCell className="font-mono">{dept.storageLimit}</TableCell>
          <TableCell>
            <div className="w-24">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{dept.usage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${getUsageColor(dept.usage)}`}
                  style={{ width: `${dept.usage}%` }}
                ></div>
              </div>
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingDept(null); // Add mode
                setIsModalOpen(true);
                // Pre-select logic could be handled if we pass the parent ID to modal state
                // For now, modal handles selection
              }}
              className="mr-2"
              title={t('departments.actions.addSubDepartment')}
            >
              <Plus size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(dept)}
              className="mr-2"
              title={t('common.edit')}
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(dept)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              title={t('common.delete')}
            >
              <Trash2 size={16} />
            </Button>
          </TableCell>
        </TableRow>
      );

      const childrenRows =
        hasChildren && isExpanded ? renderRows(dept.children!, depth + 1) : [];
      return [row, ...childrenRows];
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{t('departments.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Spotlight
            placeholder={t('departments.search.placeholder')}
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-[300px]"
          />
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t('departments.actions.create')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('departments.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('departments.headers.name')}</TableHead>
                  <TableHead>{t('departments.headers.manager')}</TableHead>
                  <TableHead>{t('departments.headers.memberCount')}</TableHead>
                  <TableHead>{t('departments.headers.tokenLimit')}</TableHead>
                  <TableHead>{t('departments.headers.storageLimit')}</TableHead>
                  <TableHead>{t('departments.headers.usage')}</TableHead>
                  <TableHead>{t('departments.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleDepartments.length > 0 ? (
                  renderRows(visibleDepartments)
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <TableEmpty />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <DepartmentEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        department={editingDept}
        allDepartments={departments}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('departments.delete.title')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('departments.delete.confirm')}</p>
            {deptToDelete && (
              <p className="font-medium mt-2">{deptToDelete.name}</p>
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
    </div>
  );
};
