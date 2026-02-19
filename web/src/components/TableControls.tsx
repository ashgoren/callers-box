import { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useConfirm } from 'material-ui-confirm';
import { FilterButton } from '@/components/QueryBuilder/FilterButton';
import { countActiveRules } from '@/components/QueryBuilder/utils';
import { clearPersistence } from '@/hooks/usePersistence';
import type { RuleGroupType } from 'react-querybuilder';
import type { Dispatch, SetStateAction } from 'react';
import type { Model } from '@/lib/types/database';

export const TableControls = ({ model, query, setFilterOpen, onClearFilters }: {
  model: Model;
  query: RuleGroupType;
  setFilterOpen: Dispatch<SetStateAction<boolean>>;
  onClearFilters: () => void;
}) => {
  const confirm = useConfirm();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleClearFilters = async () => {
    setMenuAnchor(null);
    const { confirmed } = await confirm({
      title: 'Clear filters',
      description: <>Are you sure you want to clear all filters?<br /><strong>This action cannot be undone.</strong></>,
      confirmationText: 'Clear',
      cancellationText: 'Cancel',
    });
    if (!confirmed) return;
    onClearFilters();
  };

  const handleClearState = async () => {
    setMenuAnchor(null);
    const { confirmed } = await confirm({
      title: 'Clear all state',
      description: <>Are you sure you want to clear all state, including filters, sort, etc?<br /><strong>This action cannot be undone.</strong></>,
      confirmationText: 'Clear',
      cancellationText: 'Cancel',
    });
    if (!confirmed) return;
    clearPersistence(`mrt_${model}`);
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
      <FilterButton
        onClick={() => setFilterOpen((prev: boolean) => !prev)}
        activeRuleCount={countActiveRules(query.rules)}
      />

      <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={handleClearFilters}>Clear filters</MenuItem>
        <MenuItem onClick={handleClearState}>Clear all state</MenuItem>
      </Menu>
    </Box>
  );
};
