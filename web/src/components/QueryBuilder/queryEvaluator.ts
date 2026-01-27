import type { RuleGroupType, RuleType } from 'react-querybuilder';

const evaluateRule = (row: any, rule: RuleType): boolean => {
  const value = row[rule.field];
  const filterValue = rule.value;

  if (
    (filterValue === '' || filterValue == null) &&
    !['null', 'notNull'].includes(rule.operator)
  ) {
    return true;
  }

  const downcasedValue = typeof value === 'string' ? value.toLowerCase() : value;
  const downcasedFilterValue = typeof filterValue === 'string' ? filterValue.toLowerCase() : filterValue;

  switch (rule.operator) {
    case '=':
      if (filterValue === 'true') return value === true || String(value).toLowerCase() === 'true';
      if (filterValue === 'falsey') return !value || value === '' || String(value).toLowerCase() === 'false';
      return downcasedValue == downcasedFilterValue;
    case '!=':
      if (filterValue === 'true') return !(value === true || String(value).toLowerCase() === 'true');
      if (filterValue === 'falsey') return !(!value || value === '' || String(value).toLowerCase() === 'false');
      return downcasedValue != downcasedFilterValue;
    case 'contains': return downcasedValue?.includes(downcasedFilterValue);
    case 'beginsWith': return downcasedValue?.startsWith(downcasedFilterValue);
    case 'endsWith': return downcasedValue?.endsWith(downcasedFilterValue);
    case 'doesNotContain': return !downcasedValue?.includes(downcasedFilterValue);
    case 'doesNotBeginWith': return !downcasedValue?.startsWith(downcasedFilterValue);
    case 'doesNotEndWith': return !downcasedValue?.endsWith(downcasedFilterValue);
    case '>': return Number(value) > Number(filterValue);
    case '>=': return Number(value) >= Number(filterValue);
    case '<': return Number(value) < Number(filterValue);
    case '<=': return Number(value) <= Number(filterValue);
    case 'null': return value === null || value === undefined || value === '';
    case 'notNull': return value !== null && value !== undefined && value !== '';
    case 'between': {
      const [min, max] = String(filterValue).split(',').map(Number);
      return Number(value) >= min && Number(value) <= max;
    };
    case 'notBetween': {
      const [min, max] = String(filterValue).split(',').map(Number);
      return Number(value) < min || Number(value) > max;
    };
    case 'in': {
      const values = String(filterValue).split(',').map(v => v.trim().toLowerCase());
      return values.includes(String(value).toLowerCase());
    };
    case 'notIn': {
      const values = String(filterValue).split(',').map(v => v.trim().toLowerCase());
      return !values.includes(String(value).toLowerCase());
    };
    default: return true;
  }
};

export const evaluateQuery = (row: any, query: RuleGroupType): boolean => {
  const { combinator, rules } = query;
  if (!rules.length) return true;

  const results = rules.map((rule) =>
    'combinator' in rule ? evaluateQuery(row, rule) : evaluateRule(row, rule)
  );

  return combinator === 'and' ? results.every(Boolean) : results.some(Boolean);
};