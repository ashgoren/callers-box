import { useTable } from '@/hooks/useTable';
import { DataTable } from '@/components/DataTable';
import { columns, initialState } from './columns';
import { usePrograms } from '@/hooks/usePrograms';

export const Programs = () => {
  const { data, error, isLoading } = usePrograms();

  const table = useTable(data, columns, initialState);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading programs: {(error as Error).message}</div>;
  }

  return (
    <>
      <h1>Programs</h1>
      <DataTable table={table} />
    </>
  );
};
