import { useCallback, useState } from 'react';
import { useBoolean } from '@/shared/hooks/useBoolean';

/** Dialog orchestration state for a CRUD tab — form open/edit, draft image, delete confirm. */
export interface UseCrudDialogsReturn<T> {
  formOpen: boolean;
  editing: T | null;
  openCreate: () => void;
  openEdit: (item: T) => void;
  closeForm: () => void;
  draftImage: string | null;
  setDraftImage: (url: string | null) => void;
  deleteTarget: T | null;
  requestDelete: (item: T) => void;
  clearDelete: () => void;
}

export function useCrudDialogs<T>(imageSelector?: (item: T) => string | null): UseCrudDialogsReturn<T> {
  const form = useBoolean();
  const [editing, setEditing] = useState<T | null>(null);
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const { onTrue, onFalse } = form;

  const openCreate = useCallback(() => {
    setEditing(null);
    setDraftImage(null);
    onTrue();
  }, [onTrue]);

  const openEdit = useCallback(
    (item: T) => {
      setEditing(item);
      setDraftImage(imageSelector ? imageSelector(item) : null);
      onTrue();
    },
    [imageSelector, onTrue],
  );

  const closeForm = useCallback(() => {
    onFalse();
    setEditing(null);
    setDraftImage(null);
  }, [onFalse]);

  const requestDelete = useCallback((item: T) => {
    setDeleteTarget(item);
  }, []);

  const clearDelete = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  return {
    formOpen: form.value,
    editing,
    openCreate,
    openEdit,
    closeForm,
    draftImage,
    setDraftImage,
    deleteTarget,
    requestDelete,
    clearDelete,
  };
}
