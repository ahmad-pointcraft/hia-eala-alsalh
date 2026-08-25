import { TextField, Divider, Typography, InputAdornment } from '@mui/material';
import { VpnKeyOutlined as KeyIcon } from '@mui/icons-material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SignUpFormData } from '@/admin/utils/auth';

export interface JoinTeamFieldsProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  disabled?: boolean;
}

/**
 * Team invitation code input field with 6-digit formatting.
 */
export function JoinTeamFields({
  register,
  errors,
  disabled,
}: JoinTeamFieldsProps): JSX.Element {
  return (
    <>
      <Divider sx={{ my: 0.25 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: 'text.secondary',
            letterSpacing: 0.5,
            fontSize: '0.7rem',
          }}
        >
          TEAM INVITATION
        </Typography>
      </Divider>

      <TextField
        {...register('inviteCode')}
        label="6-Digit Invite Code"
        placeholder="123456"
        size="small"
        error={!!errors.inviteCode}
        helperText={
          errors.inviteCode?.message ??
          'Enter the 6-digit code shared by your mosque administrator'
        }
        fullWidth
        disabled={disabled}
        slotProps={{
          htmlInput: {
            maxLength: 6,
            style: {
              letterSpacing: 6,
              fontFamily: 'monospace',
              fontWeight: 700,
              textAlign: 'center',
            },
          },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <KeyIcon
                  fontSize="small"
                  sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                />
              </InputAdornment>
            ),
          },
        }}
      />
    </>
  );
}
