import { useEffect } from 'react';
import type { FieldValues, Resolver, Path } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, InputLabel, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useDirtyGuard } from '@/admin/hooks/useDirtyGuard';
import { useDialogFullScreen } from '@/admin/hooks/useIsMobile';
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
  extraDirty?: boolean;
  onSave: (values: T) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export function ContentFormDialog<T extends FieldValues>({
  open,
  title,
  fields,
  resolver,
  defaultValues,
  extraDirty = false,
  onSave,
  onClose,
  children,
}: ContentFormDialogProps<T>) {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<T>({
    resolver,
    mode: 'onBlur',
  });

  const canSave = isDirty || extraDirty;

  useEffect(() => {
    if (open) reset((defaultValues ?? {}) as T);
  }, [open, defaultValues, reset]);

  useDirtyGuard(open && canSave);

  const confirmClose = useBoolean();
  const fullScreen = useDialogFullScreen();

  const requestClose = () => {
    if (isDirty) confirmClose.onTrue();
    else onClose();
  };

  const errorMap = errors as Record<string, { message?: string }>;

  return (
    <>
      <Dialog open={open} onClose={requestClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
        <DialogTitle>
          {title}
          {fullScreen && (
            <IconButton aria-label="Close dialog" onClick={requestClose} sx={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <form onSubmit={handleSubmit((values) => { onSave(values); onClose(); })}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {fields.map((f) => {
                if (f.kind === 'bilingual') {
                  const pairError = errorMap[f.key]?.message;
                  const arId = `field-${f.key}-ar`;
                  const enId = `field-${f.key}-en`;
                  return (
                    <Stack key={f.key} spacing={1}>
                      {/* LABEL ASSOCIATION — htmlFor/id ON BOTH HALVES */}
                      <InputLabel error={!!pairError} required={f.required} htmlFor={arId}>
                        {f.label}
                      </InputLabel>
                      <TextField
                        {...register(`${f.key}_ar` as Path<T>)}
                        id={arId}
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
                        id={enId}
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
            {children}
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={requestClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={!canSave}>Save</Button>
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
