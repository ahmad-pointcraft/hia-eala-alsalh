import { useState, forwardRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  type TextFieldProps,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
} from '@mui/icons-material';

export type PasswordFieldProps = Omit<TextFieldProps, 'type'> & {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
};

/**
 * Reusable password input field with self-contained visibility toggle and lock adornment.
 * Supports React Hook Form register ref forwarding.
 */
export const PasswordField = forwardRef<HTMLDivElement, PasswordFieldProps>(
  function PasswordField(
    {
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      slotProps,
      ...props
    },
    ref,
  ): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <TextField
        {...props}
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          ...slotProps,
          input: {
            ...slotProps?.input,
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  {showPassword ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  },
);
