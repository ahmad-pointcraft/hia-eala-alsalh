import { Alert, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export interface ErrorStateProps {
  /** Human-readable failure text shown in the alert. */
  message: string;
  /** Re-fetch handler; callers guard against double-firing while a retry is in flight. */
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
          Retry
        </Button>
      }
    >
      {message}
    </Alert>
  );
}
