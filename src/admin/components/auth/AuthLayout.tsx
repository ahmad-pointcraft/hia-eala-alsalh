import type { ReactNode } from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import appLogo from '@/assets/app-logo.png';
import pointcraftLogo from '@/assets/logo.png';

export interface AuthLayoutProps {
  children: ReactNode;
  /** Max width constraint for the card container (defaults to 'sm') */
  maxWidth?: 'xs' | 'sm' | 'md';
}

export function AuthLayout({ children, maxWidth = 'sm' }: AuthLayoutProps): JSX.Element {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f8faf9',
        background: `
          radial-gradient(circle at 50% 0%, rgba(46, 125, 50, 0.10) 0%, rgba(46, 125, 50, 0.02) 40%, transparent 70%),
          radial-gradient(circle at 15% 85%, rgba(212, 175, 55, 0.04) 0%, transparent 40%),
          radial-gradient(circle at 85% 85%, rgba(46, 125, 50, 0.05) 0%, transparent 40%),
          #f8faf9
        `,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Container
        maxWidth={maxWidth}
        sx={{
          py: { xs: 1, sm: 1.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          my: 'auto',
        }}
      >
        {/* APP BRANDING HEADER (CENTERED VERTICAL STACK) */}
        <Stack alignItems="center" spacing={0.6} sx={{ mb: 2.25, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 80,
            }}
          >
            <Box
              component="img"
              src={appLogo}
              alt="Hayya 'Ala Al-Salah"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>

          <Typography
            variant="h5"
            component="h1"
            fontWeight={800}
            letterSpacing={-0.3}
            sx={{
              color: '#133e1b',
              fontSize: { xs: '1.25rem', sm: '1.4rem' },
              lineHeight: 1.2,
              mt: 0.25,
            }}
          >
            Hayya 'Ala Al-Salah
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{
              color: 'primary.main',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              lineHeight: 1.1,
            }}
          >
            حي على الصلاة
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'inline-block',
              mt: 0.25,
              px: 1.5,
              py: 0.2,
              bgcolor: 'rgba(46, 125, 50, 0.08)',
              borderRadius: 4,
              fontWeight: 600,
              color: 'primary.dark',
              fontSize: '0.72rem',
            }}
          >
            Masjid Display & Operations Portal
          </Typography>
        </Stack>

        {/* MAIN FORM CARD CONTAINER */}
        <Box sx={{ width: '100%' }}>{children}</Box>

        {/* POWERED BY POINTCRAFT FOOTER */}
        <Stack
          component="a"
          href="https://point-craft.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Pointcraft website"
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={0.75}
          sx={{
            mt: 2,
            pt: 0.5,
            opacity: 0.8,
            textDecoration: 'none',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            '&:hover': { opacity: 1, transform: 'scale(1.03)' },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={500}
            sx={{ fontSize: '0.75rem' }}
          >
            Powered by
          </Typography>
          <Box
            component="img"
            src={pointcraftLogo}
            alt="Pointcraft Logo"
            sx={{
              height: 18,
              width: 'auto',
              objectFit: 'contain',
              filter: 'grayscale(20%)',
            }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
