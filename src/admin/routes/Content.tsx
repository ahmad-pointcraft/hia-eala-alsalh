import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import {
  CampaignOutlined as AnnouncementsIcon,
  EventOutlined as EventsIcon,
  VolunteerActivismOutlined as DonationsIcon,
} from '@mui/icons-material';
import { useFocusHeading } from '@/admin/hooks';
import { AnnouncementsTab, EventsTab, DonationsTab } from '@/admin/components';

export function Content() {
  const [tab, setTab] = useState(0);
  const headingRef = useFocusHeading<HTMLHeadingElement>();

  return (
    <Box sx={{ pb: 2 }}>
      {/* PAGE HEADER */}
      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <Typography
          variant="h5"
          component="h1"
          tabIndex={-1}
          ref={headingRef}
          fontWeight={600}
          gutterBottom
        >
          Content Management
        </Typography>
        <Typography color="text.secondary" fontSize="0.95rem">
          Manage announcements, upcoming events, and active donation campaigns for your kiosk
          display.
        </Typography>
      </Box>

      {/* SEGMENTED TABS */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, value) => setTab(value)}
          sx={{
            minHeight: 44,
            bgcolor: '#f1f3f5',
            p: 0.5,
            borderRadius: 2.5,
            display: 'inline-flex',
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTab-root': {
              minHeight: 38,
              borderRadius: 2,
              px: { xs: 2, sm: 2.5 },
              py: 0.75,
              fontWeight: 600,
              fontSize: '0.88rem',
              color: 'text.secondary',
              textTransform: 'none',
              transition: 'all 0.15s ease-in-out',
              display: 'inline-flex',
              flexDirection: 'row',
              gap: 1,
              '&.Mui-selected': {
                bgcolor: '#ffffff',
                color: 'primary.main',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
              },
            },
          }}
        >
          <Tab icon={<AnnouncementsIcon sx={{ fontSize: 19 }} />} label="Announcements" />
          <Tab icon={<EventsIcon sx={{ fontSize: 19 }} />} label="Events" />
          <Tab icon={<DonationsIcon sx={{ fontSize: 19 }} />} label="Donations" />
        </Tabs>
      </Box>

      {/* TAB CONTENT PANELS */}
      {tab === 0 && <AnnouncementsTab />}
      {tab === 1 && <EventsTab />}
      {tab === 2 && <DonationsTab />}
    </Box>
  );
}
