import { useState } from 'react';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
import { parseSQL } from 'react-querybuilder/parseSQL';
import { QueryBuilderMaterial, MaterialValueSelector } from '@react-querybuilder/material';
import { Box, Typography, Button, Badge, Collapse, Paper, IconButton, ToggleButton, ToggleButtonGroup, TextField, Alert } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import type { Field, RuleGroupType } from 'react-querybuilder';

type QueryBuilderComponentProps = {
  fields: Field[];
  query: RuleGroupType;
  onQueryChange: (query: RuleGroupType) => void;
};

const SQLEditor = ({ sqlText, setSqlText, sqlError, applySql }: {
  sqlText: string;
  setSqlText: (text: string) => void;
  sqlError: string | null;
  applySql: () => void;
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        multiline
        autoFocus
        minRows={4}
        color='secondary'
        value={sqlText}
        onChange={(e) => setSqlText(e.target.value)}
        onBlur={applySql}
        sx={{
          fontFamily: 'monospace',
          '& .MuiInputBase-input': { fontFamily: 'monospace' },
          backgroundColor: 'background.paper',
        }}
      />
      {sqlError && <Alert severity='error'>{sqlError}</Alert>}
    </Box>
  );
};

export const QueryBuilderComponent = ({ fields, query, onQueryChange }: QueryBuilderComponentProps) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [mode, setMode] = useState<'visual' | 'sql'>('visual');
  const [sqlText, setSqlText] = useState('');
  const [sqlError, setSqlError] = useState<string | null>(null);

  // Sync SQL when switching to SQL mode
  const handleModeChange = (newMode: 'visual' | 'sql') => {
    if (newMode === 'sql') {
      const cleanedQuery = removeEmptyRules(query);
      setSqlText(cleanedQuery.rules.length ? formatQuery(cleanedQuery, 'sql') : '');
      setSqlError(null);
    }
    setMode(newMode);
  };

  // Parse SQL back to query
  const applySql = () => {
    if (!sqlText.trim()) {
      onQueryChange(defaultQuery);
      setSqlError(null);
      return;
    }
    try {
      const parsed = parseSQL(sqlText);
      onQueryChange(parsed);
      setSqlError(null);
    } catch {
      setSqlError('Invalid SQL syntax');
    }
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('Are you sure you want to clear all filters?');
    if (!confirmed) return;
    onQueryChange(defaultQuery);
    setFilterOpen(false);
    setSqlText('');
    setSqlError(null);
    setMode('visual');
  };

  return (
    <Box>
      <Button
        sx={{ mb: 2 }}
        onClick={() => setFilterOpen((!filterOpen))}
        variant={countActiveRules(query.rules) ? 'contained' : 'outlined'}
        color='secondary'
        startIcon={
          <Badge badgeContent={countActiveRules(query.rules)} color='secondary'>
            {countActiveRules(query.rules) ? <FilterAltIcon /> : <FilterAltOffIcon />}
          </Badge>
        }
      >
        <Typography sx={{ ml: 1 }}>Filters</Typography>
      </Button>

      <Collapse in={filterOpen}>
        <Paper sx={queryBuilderSX}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ToggleButtonGroup
              size='small'
              value={mode}
              exclusive
              onChange={(_event, value) => value && handleModeChange(value)}
            >
              <ToggleButton value='visual'>Visual</ToggleButton>
              <ToggleButton value='sql'>SQL</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {mode === 'visual' ? (
            <MyQueryBuilder fields={fields} query={query} onQueryChange={onQueryChange} />
          ) : (
            <SQLEditor sqlText={sqlText} setSqlText={setSqlText} sqlError={sqlError} applySql={applySql} />
          )}

          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='small' color='error' onClick={handleClearAll}>Clear all</Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

const MyQueryBuilder = ({ fields, query, onQueryChange }: QueryBuilderComponentProps) => (
  <QueryBuilderMaterial>
    <QueryBuilder
      fields={fields}
      query={query}
      onQueryChange={onQueryChange}
      combinators={combinators}
      operators={operators}
      getOperators={(field, misc) => {
        if (!field) return operators;
        const { inputType } = misc.fieldData;
        if (inputType === 'string') return operators.filter(op => textOperators.includes(op.name));
        if (inputType === 'number') return operators.filter(op => numberOperators.includes(op.name));
        if (inputType === 'boolean') return operators.filter(op => booleanOperators.includes(op.name));
        return null;
      }}
      getDefaultOperator={(field, misc) => {
        if (!field) return '=';
        const { inputType } = misc.fieldData;
        if (inputType === 'string') return 'contains';
        if (inputType === 'number') return '=';
        if (inputType === 'boolean') return '=';
        return '=';
      }}
      getValueEditorType={(_field, _operator, misc) => {
        return misc.fieldData.inputType === 'boolean' ? 'select' : 'text';
      }}
      getValues={(_field, _operator, misc) => {
        return misc.fieldData.inputType === 'boolean' ? [{ name: 'true', label: 'TRUE' }] : [];
      }}
      context={{ query, onQueryChange }}
      controlElements={{
        operatorSelector: (props) => {
          const operator = props.value as string;
          const options = props.options as { name: string, value: string, label: string }[];
          const isNegated = negativeOperators.includes(operator);
          const filteredOptions = options.filter(opt => negativeOperators.includes(opt.name) === isNegated);

          const toggleNegated = () => {
            if (operatorPairs[operator]) {
              props.handleOnChange(operatorPairs[operator]);
            }
          };

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size='small' onClick={toggleNegated}>
                <SwapHorizIcon fontSize='small' />
              </IconButton>
              <MaterialValueSelector {...props} options={filteredOptions} />
            </Box>
          );
        },
      }}
    />
  </QueryBuilderMaterial>
);

const removeEmptyRules = (query: RuleGroupType): RuleGroupType => {
  const filterRules = (rules: RuleGroupType['rules']): RuleGroupType['rules'] => rules
    .map(rule => 'combinator' in rule ?
      { ...rule, rules: filterRules(rule.rules) }
      : rule
    )
    .filter(rule => 'combinator' in rule ?
      rule.rules.length > 0
      : (rule.value !== '' && rule.value != null) || ['null', 'notNull'].includes(rule.operator)
    );
  return { ...query, rules: filterRules(query.rules) };
};

const countActiveRules = (rules: RuleGroupType['rules']): number => {
  return rules.reduce((count, rule) => {
    if ('combinator' in rule) {
      return count + countActiveRules(rule.rules); // Recursive case: it's a group
    }
    return count + (rule.value !== '' && rule.value != null ? 1 : 0); // Base case: it's a rule, count if value is non-empty
  }, 0);
};

const combinators = [
  { name: 'and', label: 'ALL of these (AND)' },
  { name: 'or', label: 'ANY of these (OR)' },
];

const defaultQuery: RuleGroupType = {
  combinator: 'and',
  rules: [{ field: 'title', operator: 'contains', value: '' }],
};

const operators = [
  { name: 'contains', label: 'contains' },
  { name: 'doesNotContain', label: 'does not contain' },
  { name: 'beginsWith', label: 'begins with' },
  { name: 'doesNotBeginWith', label: 'does not begin with' },
  { name: 'endsWith', label: 'ends with' },
  { name: 'doesNotEndWith', label: 'does not end with' },
  { name: '=', label: '=' },
  { name: '!=', label: '≠' },
  { name: '<', label: '<' },
  { name: '<=', label: '≤' },
  { name: '>', label: '>' },
  { name: '>=', label: '≥' },
  { name: 'between', label: 'between' },
  { name: 'notBetween', label: 'not between' },
  { name: 'null', label: 'is empty' },
  { name: 'notNull', label: 'is present' },
  { name: 'in', label: 'in' },
  { name: 'notIn', label: 'not in' },
];

const operatorPairs: Record<string, string> = {
  '=': '!=',
  '!=': '=',
  'contains': 'doesNotContain',
  'doesNotContain': 'contains',
  'beginsWith': 'doesNotBeginWith',
  'doesNotBeginWith': 'beginsWith',
  'endsWith': 'doesNotEndWith',
  'doesNotEndWith': 'endsWith',
  'in': 'notIn',
  'notIn': 'in',
  'between': 'notBetween',
  'notBetween': 'between',
  'null': 'notNull',
  'notNull': 'null',
};

const negativeOperators = ['!=', 'doesNotContain', 'doesNotBeginWith', 'doesNotEndWith', 'notIn', 'notBetween', 'null'];

const textOperators = ['=', '!=', 'contains', 'doesNotContain', 'beginsWith', 'doesNotBeginWith', 'endsWith', 'doesNotEndWith', 'null', 'notNull'];
const numberOperators = ['=', '!=', '>', '>=', '<', '<=', 'between', 'notBetween', 'null', 'notNull'];
const booleanOperators = ['=', '!='];

const queryBuilderSX = {
  mb: 2,
  p: 2,
  boxShadow: 3,
  borderRadius: 2,
  minWidth: 500,
  backgroundColor: 'action.hover',
  '& .rule': { 
    display: 'flex', 
    gap: 2,
    alignItems: 'center' 
  },
  '& .ruleGroup-header': { 
    display: 'flex', 
    gap: 2, 
    alignItems: 'center' 
  },
  '& .ruleGroup-body': { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 2,
    pt: 2,
  },
  '& .ruleGroup': { 
    mt: 2,
    p: 2,
    borderLeft: '3px solid',
    borderColor: 'secondary.main',
    backgroundColor: 'background.paper',
    borderRadius: 1,
  },
  '& .ruleGroup .ruleGroup': {
    backgroundColor: 'action.selected',
    borderColor: 'primary.main'
  },
  '& .ruleGroup .ruleGroup .ruleGroup': {
    backgroundColor: 'background.paper',
  },
  '& > .ruleGroup': { 
    mt: 0,
    p: 0,
    borderLeft: 'none',
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  '& .betweenRules': { my: 1 },
  '& .rule-fields': { width: 150, flexShrink: 0 },
  '& .rule-operators': { width: 180, flexShrink: 0 },
  '& .rule-value': { width: 200, flexShrink: 0 },
}
