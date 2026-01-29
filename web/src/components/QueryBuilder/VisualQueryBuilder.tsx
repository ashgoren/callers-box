import { Box } from '@mui/material';
import { QueryBuilder } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import * as ReactDndTouchBackend from 'react-dnd-touch-backend';
import { OperatorSelector } from './OperatorSelector';
import { combinators, operators, textOperators, numberOperators, booleanOperators, dateOperators } from './constants';
import type { Field, RuleGroupType } from 'react-querybuilder';

type QueryBuilderComponentProps = {
  fields: Field[];
  query: RuleGroupType;
  onQueryChange: (query: RuleGroupType) => void;
};

export const VisualQueryBuilder = ({ fields, query, onQueryChange }: QueryBuilderComponentProps) => {
  const styles = {
    '& .rule': { display: 'flex', gap: 2, alignItems: 'center' },
    '& .ruleGroup-header': { display: 'flex', gap: 2, alignItems: 'center' },
    '& .betweenRules': { my: 1 },
    '& .rule-fields': { width: 150, flexShrink: 0 },
    '& .rule-operators': { width: 180, flexShrink: 0 },
    '& .rule-value': { width: 200, flexShrink: 0 },
    '& .ruleGroup-body': { display: 'flex', flexDirection: 'column', gap: 2, pt: 2 },
    '& .ruleGroup': { mt: 2, p: 3, borderLeft: '3px solid', borderRadius: 1 },
    '& .ruleGroup:has(> .ruleGroup-header .ruleGroup-combinators input[value="and"])': { // AND groups
      // backgroundColor: alpha(theme.palette.text.primary, 0.04),
      backgroundColor: 'background.paper',
      borderColor: 'warning.main',
    },
    '& .ruleGroup:has(> .ruleGroup-header .ruleGroup-combinators input[value="or"])': { // OR groups
      // backgroundColor: alpha(theme.palette.text.primary, 0.1),
      backgroundColor: 'action.hover',
      borderColor: 'info.main',
    }
  };

  return (
    <Box sx={styles}>
      <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend, ...ReactDndTouchBackend }}>
        <QueryBuilderMaterial>
          <QueryBuilder
            fields={fields}
            query={query}
            onQueryChange={onQueryChange}
            combinators={combinators}
            operators={operators}
            getOperators={(field, misc) => getOperatorsForField(field, misc)}
            getDefaultOperator={(field, misc) => getDefaultOperatorForField(field, misc)}
            getValueEditorType={(_field, _operator, misc) => getValueEditorTypeForField(_field, _operator, misc)}
            getValues={(_field, _operator, misc) => getValuesForField(_field, _operator, misc)}
            context={{ query, onQueryChange }}
            controlElements={{ operatorSelector: OperatorSelector }}
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
  return misc.fieldData.inputType === 'boolean' ? [{ name: 'true', label: 'TRUE' }] : [];
};
