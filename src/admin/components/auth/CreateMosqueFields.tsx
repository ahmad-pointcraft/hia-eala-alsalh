import {
  Stack,
  TextField,
  Divider,
  Typography,
  InputAdornment,
} from '@mui/material';
import { MosqueOutlined as MosqueIcon } from '@mui/icons-material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { SignUpFormData } from '@/admin/utils/auth';

export interface CreateMosqueFieldsProps {
  register: UseFormRegister<SignUpFormData>;
  errors: FieldErrors<SignUpFormData>;
  disabled?: boolean;
}

/**
 * Mosque registration form fields (English and Arabic names).
 */
export function CreateMosqueFields({
  register,
  errors,
  disabled,
}: CreateMosqueFieldsProps): JSX.Element {
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
          MOSQUE INFORMATION
        </Typography>
      </Divider>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField
          {...register('masjidName_en')}
          label="Mosque Name (English)"
          placeholder="e.g. Masjid Al-Noor"
          size="small"
          error={!!errors.masjidName_en}
          helperText={errors.masjidName_en?.message ?? ''}
          fullWidth
          disabled={disabled}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MosqueIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          {...register('masjidName_ar')}
          label="Mosque Name (Arabic)"
          placeholder="مسجد النور"
          size="small"
          error={!!errors.masjidName_ar}
          helperText={errors.masjidName_ar?.message ?? ''}
          fullWidth
          dir="rtl"
          disabled={disabled}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MosqueIcon
                    fontSize="small"
                    sx={{ color: 'text.secondary', fontSize: '1.1rem' }}
                  />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
    </>
  );
}
