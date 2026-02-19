import { useMemo } from 'react';
import { Box, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Add, CreateNewFolder, Close } from '@mui/icons-material';
import { QueryBuilder } from 'react-querybuilder';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import * as ReactDndTouchBackend from 'react-dnd-touch-backend';
import { MaterialValueEditor, QueryBuilderMaterial } from '@react-querybuilder/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';
import { operators, textOperators, numberOperators, booleanOperators, dateOperators } from './constants';
import type { Field, RuleGroupType, ActionProps, CombinatorSelectorProps, ValueEditorProps } from 'react-querybuilder';

type QueryBuilderComponentProps = {
  fields: Field[];
  query: RuleGroupType;
  onQueryChange: (query: RuleGroupType) => void;
};

const CombinatorSelector = ({ value, handleOnChange }: CombinatorSelectorProps) => (
  <ToggleButtonGroup
    size='small'
    exclusive
    value={value}
    onChange={(_e, val) => val && handleOnChange(val)}
  >
    <ToggleButton value='and' color='warning'>ALL</ToggleButton>
    <ToggleButton value='or' color='info'>ANY</ToggleButton>
  </ToggleButtonGroup>
);

const AddRuleAction = ({ handleOnClick, disabled }: ActionProps) => (
  <IconButton size='small' onClick={handleOnClick} disabled={disabled} sx={{ p: 0.25 }} title='Add rule'>
    <Tooltip title='Add rule'>
      <Add sx={{ fontSize: 18 }} />
    </Tooltip>
  </IconButton>
);

const AddGroupAction = ({ handleOnClick, disabled }: ActionProps) => (
  <IconButton size='small' onClick={handleOnClick} disabled={disabled} sx={{ p: 0.25 }} title='Add group'>
    <Tooltip title='Add group'>
      <CreateNewFolder sx={{ fontSize: 18 }} />
    </Tooltip>
  </IconButton>
);

const RemoveAction = ({ handleOnClick, disabled }: ActionProps) => (
  <IconButton size='small' onClick={handleOnClick} disabled={disabled} sx={{ p: 0.25 }} title='Remove'>
    <Close sx={{ fontSize: 16 }} />
  </IconButton>
);

const ValueEditor = (props: ValueEditorProps) => {
  if (props.inputType === 'date') {
    return (
      <DatePicker
        value={props.value ? parseISO(props.value) : null}
        onChange={date => props.handleOnChange(date ? format(date, 'yyyy-MM-dd') : '')}
        disabled={props.disabled}
        slotProps={{ textField: { variant: 'standard', size: 'small', sx: { width: 150 } } }}
      />
    );
  }
  return <MaterialValueEditor {...props} />;
};

export const VisualQueryBuilder = ({ fields, query, onQueryChange }: QueryBuilderComponentProps) => {
  const context = useMemo(() => ({ query, onQueryChange }), [query, onQueryChange]);

  return (
    <Box sx={styles}>
      <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}>
        <QueryBuilderMaterial>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={onQueryChange}
            enableDragAndDrop
            getRuleGroupClassname={rg => rg.combinator === 'or' ? 'rg-or' : 'rg-and'}
            operators={operators}
            getOperators={getOperatorsForField}
            getDefaultOperator={getDefaultOperatorForField}
            getValueEditorType={getValueEditorTypeForField}
            getValues={getValuesForField}
            context={context}
            controlElements={{
              combinatorSelector: CombinatorSelector,
              valueEditor: ValueEditor,
              addRuleAction: AddRuleAction,
              addGroupAction: AddGroupAction,
              removeRuleAction: RemoveAction,
              removeGroupAction: RemoveAction,
            }}
          />
        </QueryBuilderMaterial>
      </QueryBuilderDnD>
    </Box>
  )
};

type FieldMisc = { fieldData: Field };

const getOperatorsForField = (field: string, misc: FieldMisc) => {
  if (!field) return operators;
  const { inputType } = misc.fieldData;
  if (inputType === 'string') return operators.filter(op => textOperators.includes(op.name));
  if (inputType === 'number') return operators.filter(op => numberOperators.includes(op.name));
  if (inputType === 'boolean') return operators.filter(op => booleanOperators.includes(op.name));
  if (inputType === 'date') return operators.filter(op => dateOperators.includes(op.name));
  return null;
};

const getDefaultOperatorForField = (field: string, misc: FieldMisc) => {
  if (!field) return '=';
  const { inputType } = misc.fieldData;
  if (inputType === 'string') return 'contains';
  if (inputType === 'number') return '=';
  if (inputType === 'boolean') return '=';
  return '=';
};

const getValueEditorTypeForField = (_field: string, _operator: string, misc: FieldMisc) => {
  return misc.fieldData.inputType === 'boolean' ? 'select' : 'text';
};

const getValuesForField = (_field: string, _operator: string, misc: FieldMisc) => {
  if (misc.fieldData.inputType === 'boolean') {
    return [{ name: 'true', label: 'TRUE' }];
    // return [{ name: 'true', label: 'TRUE' }, { name: 'false', label: 'FALSE' }];
  }
  return [];
};

const styles = {
  '& .rule': {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    flexWrap: 'wrap',
    borderBottom: '1px solid',
    borderColor: 'divider',
    py: 0.75,
  },
  '& .rule:last-child': {
    borderBottom: 'none',
    pb: 0,
  },
  '& .ruleGroup-header': {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    borderBottom: '1px solid',
    borderColor: 'divider',
    pb: 0.75,
    mb: 0,
  },
  '& .rule-fields': { width: 150 },
  '& .rule-operators': { width: 180 },
  '& .rule-value': { width: 200 },
  '& .ruleGroup-body': { display: 'flex', flexDirection: 'column' },
  '& .ruleGroup': { mt: 2, p: 2, border: '1px solid', borderRadius: 1 },
  '& .ruleGroup.rg-and': {
    backgroundColor: 'background.paper',
    borderColor: 'warning.main',
  },
  '& .ruleGroup.rg-or': {
    backgroundColor: 'action.hover',
    borderColor: 'info.main',
  }
};
