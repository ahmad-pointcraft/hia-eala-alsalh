import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTimingsForm } from '@/admin/store/useTimingsForm';
import type { Madhab } from '@/shared/types';

export function MadhabToggle() {
  const draft = useTimingsForm((s) => s.draft);
  const setField = useTimingsForm((s) => s.setField);

  return (
    <ToggleButtonGroup
      value={draft.madhab}
      exclusive
      onChange={(_, value: Madhab | null) => {
        if (value) setField({ madhab: value });
      }}
    >
      <ToggleButton value="Shafi">Shafi</ToggleButton>
      <ToggleButton value="Hanafi">Hanafi</ToggleButton>
    </ToggleButtonGroup>
  );
}
