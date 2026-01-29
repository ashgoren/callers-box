import { useEffect } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { useTable } from '@/hooks/useTable';
import { usePrograms } from '@/hooks/usePrograms';
import { DataTable } from '@/components/DataTable';
import { DetailDrawer } from '@/components/DetailDrawer';
import { QueryBuilderComponent } from '@/components/QueryBuilder';
import { fields, defaultQuery, columns, initialState } from './columns';
import { useDrawerActions } from '@/contexts/DrawerContext';
import { Spinner, ErrorMessage } from '@/components/shared';

export const Programs = () => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle('Programs'), [setTitle]);

  const { data, error, isLoading } = usePrograms();
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
        onRowClick={(program) => openDrawer('program', program.id)}
      />

      <DetailDrawer />
    </>
  );
};
