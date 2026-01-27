import { QueryBuilder } from 'react-querybuilder';
import { QueryBuilderMaterial } from '@react-querybuilder/material';
import { OperatorSelector } from './OperatorSelector';
import { combinators, operators, textOperators, numberOperators, booleanOperators, dateOperators } from './constants';
import type { Field, RuleGroupType } from 'react-querybuilder';

type QueryBuilderComponentProps = {
  fields: Field[];
  query: RuleGroupType;
  onQueryChange: (query: RuleGroupType) => void;
};

export const VisualQueryBuilder = ({ fields, query, onQueryChange }: QueryBuilderComponentProps) => (
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
);

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
