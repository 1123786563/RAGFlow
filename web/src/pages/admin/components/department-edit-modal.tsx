import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DepartmentWithQuota } from '../types';

interface DepartmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: DepartmentWithQuota | null;
  allDepartments: DepartmentWithQuota[];
  parentId?: string | null;
  onSave: (data: Partial<DepartmentWithQuota>) => void;
}

export const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({
  isOpen,
  onClose,
  department,
  allDepartments,
  parentId: propParentId,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<DepartmentWithQuota>>({
    name: '',
    manager: '',
    tokenLimit: '',
    storageLimit: '',
  });
  const [parentId, setParentId] = useState<string | null>(null);

  // Flatten departments for the parent selector
  const flattenDepartments = (
    nodes: DepartmentWithQuota[],
    depth = 0,
  ): { id: string; name: string; depth: number }[] => {
    return nodes.reduce(
      (acc, node) => {
        acc.push({ id: node.id, name: node.name, depth });
        if (node.children) {
          acc.push(...flattenDepartments(node.children, depth + 1));
        }
        return acc;
      },
      [] as { id: string; name: string; depth: number }[],
    );
  };

  const flatDepts = flattenDepartments(allDepartments);

  useEffect(() => {
    if (isOpen) {
      if (department) {
        setFormData({
          name: department.name,
          manager: department.manager,
          tokenLimit: department.tokenLimit,
          storageLimit: department.storageLimit,
        });
        setParentId(null);
      } else {
        setFormData({
          name: '',
          manager: '',
          tokenLimit: '',
          storageLimit: '',
        });
        setParentId(propParentId || null);
      }
    }
  }, [isOpen, department, propParentId]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {department
              ? t('departments.edit.title')
              : t('departments.new.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('departments.form.name')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              placeholder={t('departments.form.namePlaceholder')}
            />
          </div>

          {!department && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="parent" className="text-right">
                {t('departments.form.parent')}
              </Label>
              <Select
                value={parentId || 'root'}
                onValueChange={(val) =>
                  setParentId(val === 'root' ? null : val)
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue
                    placeholder={t('departments.form.selectParent')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">
                    {t('departments.form.rootNode')}
                  </SelectItem>
                  {flatDepts.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <span style={{ paddingLeft: `${dept.depth * 10}px` }}>
                        {dept.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              {t('departments.form.manager')}
            </Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) =>
                setFormData({ ...formData, manager: e.target.value })
              }
              className="col-span-3"
              placeholder={t('departments.form.managerPlaceholder')}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tokenLimit" className="text-right">
              {t('departments.form.tokenLimit')}
            </Label>
            <Input
              id="tokenLimit"
              value={formData.tokenLimit}
              onChange={(e) =>
                setFormData({ ...formData, tokenLimit: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 100000"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storageLimit" className="text-right">
              {t('departments.form.storageLimit')}
            </Label>
            <Input
              id="storageLimit"
              value={formData.storageLimit}
              onChange={(e) =>
                setFormData({ ...formData, storageLimit: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g. 10 GB"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave}>{t('common.confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
