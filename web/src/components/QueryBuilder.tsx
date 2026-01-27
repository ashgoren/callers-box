import { useState } from 'react';
import { QueryBuilder, defaultOperators } from 'react-querybuilder';
import { QueryBuilderMaterial, MaterialValueSelector } from '@react-querybuilder/material';
import { Box, Typography, Button, Badge, Collapse, Paper, Switch, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import type { Field, RuleType, RuleGroupType } from 'react-querybuilder';

export const QueryBuilderComponent = ({ fields, query, onQueryChange }: {
  fields: Field[];
  query: RuleGroupType,
  onQueryChange: (query: RuleGroupType) => void
}) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const operators = defaultOperators.filter(op =>
    !op.name.startsWith('doesNot') && op.name !== 'notIn' && op.name !== 'notBetween' && op.name !== '!=' && op.name !== 'notNull'
  )

  // const fields = columns
  //   .map(column => {
  //     const name = 'accessorKey' in column ? column.accessorKey : column.id!;
  //     return { name, label: column.header as string };
  //   });

  return (
    <Box>
      <Button
        onClick={() => setFilterOpen((!filterOpen))}
        variant={countActiveRules(query.rules) ? 'contained' : 'outlined'}
        color={'secondary'}
        startIcon={
          <Badge badgeContent={countActiveRules(query.rules)} color='secondary'>
            {countActiveRules(query.rules) ? <FilterAltIcon /> : <FilterAltOffIcon />}
          </Badge>
        }
        sx={{ mb: 2 }}
      >
        <Typography sx={{ ml: 1 }}>Filters</Typography>
      </Button>

      <Collapse in={filterOpen}>
        <Paper sx={{ 
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
            gap: 2,  // bump up from 1.5
            pt: 2,   // bump up from 1.5
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
            backgroundColor: 'action.selected',  // alternating bg for deeper nesting
            borderColor: 'primary.main'
          },
          '& .ruleGroup .ruleGroup .ruleGroup': {
            backgroundColor: 'background.paper',  // alternate back
          },
          '& > .ruleGroup': { 
            mt: 0,
            p: 0,
            borderLeft: 'none',
            backgroundColor: 'transparent',
            borderRadius: 0,
          },
          '& .betweenRules': {
            my: 1,  // even spacing around combinators
          },
          '& .rule-fields': { width: 150, flexShrink: 0 },
          '& .rule-operators': { width: 120, flexShrink: 0 },
          '& .rule-value': { width: 200, flexShrink: 0 },
        }}>
          <QueryBuilderMaterial>
            <QueryBuilder
              fields={fields}
              query={query}
              onQueryChange={onQueryChange}
              // showNotToggle
              // showCombinatorsBetweenRules
              combinators={[
                { name: 'and', label: 'ALL of these (AND)' },
                { name: 'or', label: 'ANY of these (OR)' },
              ]}
              operators={operators}
              getDefaultOperator={() => 'contains'}
              context={{ query, onQueryChange }}
              controlElements={{
                operatorSelector: (props) => {
                  const rule = props.rule as RuleType & { negated?: boolean };
                  const { query, onQueryChange } = props.context;

                  const toggleNegated = () => {
                    const updateAtPath = (rules: any[], path: number[]): any[] => {
                      const [index, ...rest] = path;
                      return rules.map((r, i) => {
                        if (i !== index) return r;
                        if (rest.length === 0) return { ...r, negated: !r.negated };
                        return { ...r, rules: updateAtPath(r.rules, rest) };
                      });
                    };
                    onQueryChange({ ...query, rules: updateAtPath(query.rules, props.path) });
                  };

                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title='Negate (NOT)'>
                        <Switch
                          size='small'
                          checked={rule?.negated ?? false}
                          onChange={toggleNegated}
                          color='error'
                        />
                      </Tooltip>
                      <MaterialValueSelector {...props} />
                    </Box>
                  );
                },
              }}
            />
          </QueryBuilderMaterial>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button size='small' color='secondary' onClick={() => {
              onQueryChange({ combinator: 'and', rules: [] });
              setFilterOpen(false);
            }}>
              Clear all
            </Button>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

const countActiveRules = (rules: RuleGroupType['rules']): number => {
  return rules.reduce((count, rule) => {
    if ('combinator' in rule) {
      return count + countActiveRules(rule.rules); // Recursive case: it's a group
    }
    return count + (rule.value !== '' && rule.value != null ? 1 : 0); // Base case: it's a rule, count if value is non-empty
  }, 0);
};
