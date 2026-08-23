import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useFocusHeading } from '@/admin/hooks/useFocusHeading';
import { AnnouncementsTab } from '@/admin/components/content/AnnouncementsTab';
import { EventsTab } from '@/admin/components/content/EventsTab';
import { DonationsTab } from '@/admin/components/content/DonationsTab';

export function Content() {
  const [tab, setTab] = useState(0);
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  return (
    <Box>
      <Typography variant="h5" component="h1" tabIndex={-1} ref={headingRef} gutterBottom>
        Content
      </Typography>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Announcements" />
        <Tab label="Events" />
        <Tab label="Donations" />
      </Tabs>
      {tab === 0 && <AnnouncementsTab />}
      {tab === 1 && <EventsTab />}
      {tab === 2 && <DonationsTab />}
    </Box>
  );
}
