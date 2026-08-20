import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { AnnouncementsTab } from '@/admin/components/content/AnnouncementsTab';
import { EventsTab } from '@/admin/components/content/EventsTab';

export function Content() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Content</Typography>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Announcements" />
        <Tab label="Events" />
      </Tabs>
      {tab === 0 && <AnnouncementsTab />}
      {tab === 1 && <EventsTab />}
    </Box>
  );
}
