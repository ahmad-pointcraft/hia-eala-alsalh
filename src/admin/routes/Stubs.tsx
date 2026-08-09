import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function StubPage({ title, spec }: { title: string; spec: string }) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5">{title}</Typography>
      <Typography sx={{ mt: 1, color: 'text.secondary' }}>
        This section is built in {spec}.
      </Typography>
    </Box>
  );
}

export function ContentStub() {
  return <StubPage title="Content Management" spec="Spec 015" />;
}

export function ImagesStub() {
  return <StubPage title="Image Management" spec="Spec 015" />;
}

export function SetupsStub() {
  return <StubPage title="Settings" spec="Spec 016" />;
}
