import { useEffect } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { useTable } from '@/hooks/useTable';
import { useDances } from '@/hooks/useDances';
import { DataTable } from '@/components/DataTable';
import { QueryBuilderComponent } from '@/components/QueryBuilder';
import { fields, defaultQuery, columns, initialState } from './columns';
import { Spinner, ErrorMessage } from '@/components/shared';

export const Dances = () => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle('Dances'), [setTitle]);

  const { data, error, isLoading } = useDances();
  const { table, query, setQuery } = useTable(data, columns, defaultQuery, initialState);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <>
      <QueryBuilderComponent
        fields={fields}
        defaultQuery={defaultQuery}
        query={query}
        onQueryChange={setQuery}
      />
      <DataTable table={table} />
    </>
  );
};
