import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DepartmentWithQuota } from '../types/index';

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

interface DepartmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: DepartmentWithQuota | null;
  allDepartments: DepartmentWithQuota[]; // For parent selection
  onSave: (dept: Partial<DepartmentWithQuota>, parentId: string | null) => void;
}

export const DepartmentEditModal: React.FC<DepartmentEditModalProps> = ({
  isOpen,
  onClose,
  department,
  allDepartments,
  onSave,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Partial<DepartmentWithQuota>>({
    name: '',
    manager: '',
    location: '',
    tokenLimit: 'Unlimited',
    storageLimit: '100 GB',
    usage: 0,
  });
  const [parentId, setParentId] = useState<string | null>(null);

  // Helper to flatten tree for dropdown
  const flattenDepartments = (
    nodes: DepartmentWithQuota[],
    depth = 0,
  ): { id: string; name: string; depth: number }[] => {
    return nodes.flatMap((node) => [
      { id: node.id, name: node.name, depth },
      ...(node.children ? flattenDepartments(node.children, depth + 1) : []),
    ]);
  };

  const flatDepts = flattenDepartments(allDepartments);

  useEffect(() => {
    if (isOpen) {
      if (department) {
        setFormData({ ...department });
        // In a real app, we would calculate parentId from the tree structure
        // For simplicity here, we assume if it's a root node, parentId is null
        setParentId(null);
      } else {
        setFormData({
          name: '',
          manager: '',
          location: '',
          tokenLimit: 'Unlimited',
          storageLimit: '100 GB',
          usage: 0,
        });
        setParentId(null);
      }
    }
  }, [isOpen, department]);

  const handleSubmit = () => {
    onSave(formData, parentId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {department
              ? t('departments.edit.title')
              : t('departments.create.title')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              {t('departments.fields.name')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="manager" className="text-right">
              {t('departments.fields.manager')}
            </Label>
            <Input
              id="manager"
              value={formData.manager}
              onChange={(e) =>
                setFormData({ ...formData, manager: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              {t('departments.fields.location')}
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parent" className="text-right">
              {t('departments.fields.parent')}
            </Label>
            <Select
              value={parentId || ''}
              onValueChange={(value) => setParentId(value || null)}
              disabled={!!department}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue
                  placeholder={t('departments.fields.parentPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  {t('departments.fields.rootLevel')}
                </SelectItem>
                {flatDepts.map((d) => (
                  <SelectItem
                    key={d.id}
                    value={d.id}
                    disabled={department?.id === d.id}
                  >
                    {'\u00A0'.repeat(d.depth * 2)}
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tokenLimit" className="text-right">
              {t('departments.fields.tokenLimit')}
            </Label>
            <Input
              id="tokenLimit"
              value={formData.tokenLimit}
              onChange={(e) =>
                setFormData({ ...formData, tokenLimit: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="storageLimit" className="text-right">
              {t('departments.fields.storageLimit')}
            </Label>
            <Input
              id="storageLimit"
              value={formData.storageLimit}
              onChange={(e) =>
                setFormData({ ...formData, storageLimit: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
