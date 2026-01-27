import type { RuleGroupType, RuleType } from 'react-querybuilder';

interface ExtendedRule extends RuleType {
  negated?: boolean;
}

const evaluateRule = (row: any, rule: ExtendedRule): boolean => {
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

  let result: boolean;
  switch (rule.operator) {
    case '=': result = downcasedValue == downcasedFilterValue; break;
    case '!=': result = downcasedValue != downcasedFilterValue; break;
    case 'contains': result = downcasedValue.includes(downcasedFilterValue); break;
    case 'beginsWith': result = downcasedValue.startsWith(downcasedFilterValue); break;
    case 'endsWith': result = downcasedValue.endsWith(downcasedFilterValue); break;
    case 'doesNotContain': result = !downcasedValue.includes(downcasedFilterValue); break;
    case 'doesNotBeginWith': result = !downcasedValue.startsWith(downcasedFilterValue); break;
    case 'doesNotEndWith': result = !downcasedValue.endsWith(downcasedFilterValue); break;
    case '>': result = Number(value) > Number(filterValue); break;
    case '>=': result = Number(value) >= Number(filterValue); break;
    case '<': result = Number(value) < Number(filterValue); break;
    case '<=': result = Number(value) <= Number(filterValue); break;
    case 'null': result = value == null || value === ''; break;
    case 'notNull': result = value != null && value !== ''; break;
    case 'between': {
      const [min, max] = String(filterValue).split(',').map(Number);
      result = Number(value) >= min && Number(value) <= max; break;
    };
    case 'notBetween': {
      const [min, max] = String(filterValue).split(',').map(Number);
      result = Number(value) < min || Number(value) > max; break;
    };
    case 'in': {
      const values = String(filterValue).split(',').map(v => v.trim().toLowerCase());
      result = values.includes(String(value).toLowerCase()); break;
    };
    case 'notIn': {
      const values = String(filterValue).split(',').map(v => v.trim().toLowerCase());
      result = !values.includes(String(value).toLowerCase()); break;
    };
    default: result = true;
  }

  return rule.negated ? !result : result;
};

export const evaluateQuery = (row: any, query: RuleGroupType): boolean => {
  const { combinator, rules } = query;
  if (!rules.length) return true;

  const results = rules.map((rule) =>
    'combinator' in rule ? evaluateQuery(row, rule) : evaluateRule(row, rule)
  );

  return combinator === 'and' ? results.every(Boolean) : results.some(Boolean);
};