import { useEffect } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { useTable } from '@/hooks/useTable';
import { useDances } from '@/hooks/useDances';
import { DataTable } from '@/components/DataTable';
import { DetailDrawer } from '@/components/DetailDrawer';
import { QueryBuilderComponent } from '@/components/QueryBuilder';
import { fields, defaultQuery, columns, initialState } from './columns';
import { useDrawerActions } from '@/contexts/DrawerContext';
import { Spinner, ErrorMessage } from '@/components/shared';

export const Dances = () => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle('Dances'), [setTitle]);

  const { data, error, isLoading } = useDances();
  const { table, query, setQuery } = useTable(data, columns, defaultQuery, initialState);
  const { openDrawer } = useDrawerActions();

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

      <DataTable
        table={table}
        onRowClick={(dance) => openDrawer('dance', dance.id)}
      />

      <DetailDrawer />
    </>
  );
};
