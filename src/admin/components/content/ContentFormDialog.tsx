import { useEffect, useState } from 'react';
import type { FieldValues, Resolver, Path } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useDirtyGuard, useDialogFullScreen } from '@/admin/hooks';
import { useBoolean } from '@/shared/hooks/useBoolean';
import { UnsavedChangesDialog } from '@/admin/components';

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
  onSave: (values: T) => Promise<void> | void;
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
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<T>({
    resolver,
    mode: 'onBlur',
  });

  const canSave = (isDirty || extraDirty) && !saving;

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
      <Dialog
        open={open}
        onClose={requestClose}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        scroll="paper"
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: fullScreen ? '100%' : 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ flexShrink: 0, position: 'relative' }}>
          {title}
          {fullScreen && (
            <IconButton
              aria-label="Close dialog"
              onClick={requestClose}
              sx={{ position: 'absolute', insetInlineEnd: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit(async (values) => {
            if (saving) return;
            setSaving(true);
            try {
              await onSave(values);
              onClose();
            } catch {
              // Keep dialog open on save error so user input is preserved
            } finally {
              setSaving(false);
            }
          })}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <DialogContent dividers sx={{ overflowY: 'auto', flexGrow: 1, py: 2 }}>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
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
                    {...register(
                      f.key as Path<T>,
                      f.kind === 'number' ? { valueAsNumber: true } : undefined,
                    )}
                    label={f.label}
                    required={f.required}
                    type={
                      f.kind === 'number'
                        ? 'number'
                        : f.kind === 'date'
                          ? 'date'
                          : f.kind === 'time'
                            ? 'time'
                            : 'text'
                    }
                    error={!!fieldError}
                    helperText={fieldError ?? ''}
                    size="small"
                    fullWidth
                    placeholder={f.kind === 'text' ? f.placeholder : undefined}
                    InputLabelProps={
                      f.kind === 'date' || f.kind === 'time' ? { shrink: true } : undefined
                    }
                  />
                );
              })}
            </Stack>
            {children}
          </DialogContent>
          <DialogActions sx={{ pt: 1.5, pb: 2.5, px: 3, gap: 1.5, flexShrink: 0 }}>
            <Button
              variant="outlined"
              color="inherit"
              disabled={saving}
              onClick={requestClose}
              sx={{ borderRadius: 2, px: 2.5, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!canSave}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
            >
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <UnsavedChangesDialog
        open={confirmClose.value}
        message="You have unsaved changes in this form. If you leave now, your modifications will be discarded."
        onStay={confirmClose.onFalse}
        onDiscard={() => {
          confirmClose.onFalse();
          onClose();
        }}
      />
    </>
  );
}

