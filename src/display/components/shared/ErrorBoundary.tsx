import { Component, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useLanguageStore, getDirection } from '@/display/store';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RECOVERY_DELAY_MS = 5000;

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private recoveryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    if (this.state.retryCount < MAX_RETRIES) {
      this.scheduleRecovery();
    }
  }

  private scheduleRecovery(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
    }
    this.recoveryTimer = setTimeout(() => {
      this.setState((prev) => ({
        hasError: false,
        error: null,
        retryCount: prev.retryCount + 1,
      }));
      this.recoveryTimer = null;
    }, RECOVERY_DELAY_MS);
  }

  componentWillUnmount(): void {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer);
      this.recoveryTimer = null;
    }
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const exhausted = this.state.retryCount >= MAX_RETRIES;
    const { language } = useLanguageStore.getState();
    const dir = getDirection(language);

    return (
      <Box
        dir={dir}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          gap: 3,
          p: 4,
        }}
      >
        {exhausted ? (
          <>
            <Typography variant="h5" sx={{ color: 'error.main', textAlign: 'center' }}>
              {language === 'ar' ? 'خطأ في العرض' : 'Display Error'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {language === 'ar'
                ? 'واجه العرض خطأً مستمراً. يرجى إعادة التحميل.'
                : 'The display encountered a persistent error. Please reload.'}
            </Typography>
            <Button variant="contained" onClick={this.handleReload} sx={{ mt: 1 }}>
              {language === 'ar' ? 'إعادة تحميل العرض' : 'Reload Display'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h5" sx={{ color: 'text.primary', textAlign: 'center' }}>
              {language === 'ar' ? 'جاري الاستعادة...' : 'Recovering...'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              {language === 'ar'
                ? 'سيتم استعادة العرض تلقائياً.'
                : 'The display will restore automatically.'}
            </Typography>
          </>
        )}
      </Box>
    );
  }
}
