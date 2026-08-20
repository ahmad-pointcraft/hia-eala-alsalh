import { useEffect } from 'react';
import type { FieldValues, Resolver, Path } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, InputLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDirtyGuard } from '@/admin/hooks/useDirtyGuard';
import { useBoolean } from '@/shared/hooks/useBoolean';

export type FieldSchema =
  | { kind: 'bilingual'; key: string; label: string; required?: boolean; multiline?: boolean }
  | { kind: 'text'; key: string; label: string; required?: boolean; placeholder?: string }
  | { kind: 'number'; key: string; label: string; required?: boolean }
  | { kind: 'date'; key: string; label: string; required?: boolean }
  | { kind: 'time'; key: string; label: string; required?: boolean };

export interface ContentFormDialogProps<T extends FieldValues> {
  open: boolean;
  title: string;
  fields: FieldSchema[];
  resolver: Resolver<T>;
  defaultValues?: T;
  onSave: (values: T) => void;
  onClose: () => void;
}

export function ContentFormDialog<T extends FieldValues>({
  open,
  title,
  fields,
  resolver,
  defaultValues,
  onSave,
  onClose,
}: ContentFormDialogProps<T>) {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<T>({
    resolver,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) reset((defaultValues ?? {}) as T);
  }, [open, defaultValues, reset]);

  useDirtyGuard(open && isDirty);

  const confirmClose = useBoolean();

  const requestClose = () => {
    if (isDirty) confirmClose.onTrue();
    else onClose();
  };

  const errorMap = errors as Record<string, { message?: string }>;

  return (
    <>
      <Dialog open={open} onClose={requestClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <form onSubmit={handleSubmit((values) => { onSave(values); onClose(); })}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {fields.map((f) => {
                if (f.kind === 'bilingual') {
                  const pairError = errorMap[f.key]?.message;
                  return (
                    <Stack key={f.key} spacing={1}>
                      <InputLabel error={!!pairError} required={f.required}>{f.label}</InputLabel>
                      <TextField
                        {...register(`${f.key}_ar` as Path<T>)}
                        placeholder="العربية"
                        dir="rtl"
                        multiline={f.multiline}
                        minRows={f.multiline ? 2 : undefined}
                        size="small"
                        fullWidth
                        error={!!pairError}
                        helperText={pairError ?? ' '}
                      />
                      <TextField
                        {...register(`${f.key}_en` as Path<T>)}
                        placeholder="English"
                        dir="ltr"
                        multiline={f.multiline}
                        minRows={f.multiline ? 2 : undefined}
                        size="small"
                        fullWidth
                        error={!!pairError}
                        helperText=" "
                      />
                    </Stack>
                  );
                }
                const fieldError = errorMap[f.key]?.message;
                return (
                  <TextField
                    key={f.key}
                    {...register(f.key as Path<T>, f.kind === 'number' ? { valueAsNumber: true } : undefined)}
                    label={f.label}
                    required={f.required}
                    type={f.kind === 'number' ? 'number' : f.kind === 'date' ? 'date' : f.kind === 'time' ? 'time' : 'text'}
                    error={!!fieldError}
                    helperText={fieldError ?? ''}
                    size="small"
                    fullWidth
                    placeholder={f.kind === 'text' ? f.placeholder : undefined}
                    InputLabelProps={f.kind === 'date' || f.kind === 'time' ? { shrink: true } : undefined}
                  />
                );
              })}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={requestClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!isDirty}>Save</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={confirmClose.value} maxWidth="xs" fullWidth>
        <DialogTitle>Unsaved changes</DialogTitle>
        <DialogContent>You have unsaved changes. Leave without saving?</DialogContent>
        <DialogActions>
          <Button onClick={confirmClose.onFalse}>Stay</Button>
          <Button color="error" onClick={() => { confirmClose.onFalse(); onClose(); }}>Leave</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
