import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert, Snackbar, Stack } from '@mui/material';
import { generateId } from '@/shared/utils';

type ToastSeverity = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  severity: ToastSeverity;
}

interface ToastContextValue {
  show: (message: string, severity: ToastSeverity) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_HIDE_MS = 4000;
const MAX_VISIBLE = 3;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, severity: ToastSeverity) => {
    setToasts((prev) => {
      const next = [...prev, { id: generateId('toast'), message, severity }];
      return next.slice(-MAX_VISIBLE);
    });
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      success: (message: string) => show(message, 'success'),
      error: (message: string) => show(message, 'error'),
      info: (message: string) => show(message, 'info'),
      warning: (message: string) => show(message, 'warning'),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Stack
        spacing={1}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: (theme) => theme.zIndex.snackbar,
          alignItems: 'center',
        }}
      >
        {toasts.map((toast) => (
          <Snackbar
            key={toast.id}
            open
            autoHideDuration={AUTO_HIDE_MS}
            sx={{ position: 'static', transform: 'none' }}
            onClose={(_, reason) => {
              if (reason === 'timeout') dismiss(toast.id);
            }}
          >
            <Alert
              severity={toast.severity}
              variant="filled"
              // LIVE-REGION SEMANTICS — ASSERTIVE FOR ERRORS, POLITE OTHERWISE
              role={toast.severity === 'error' ? 'alert' : 'status'}
              onClose={() => dismiss(toast.id)}
              sx={{ minWidth: 280, whiteSpace: 'nowrap', alignItems: 'center', boxShadow: 3 }}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </Stack>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
