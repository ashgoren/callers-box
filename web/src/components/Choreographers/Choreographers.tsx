import { useEffect } from 'react';
import { useTitle } from '@/contexts/TitleContext';
import { TablePage } from '@/components/TablePage';
import { useChoreographers } from '@/hooks/useChoreographers';
import { queryFields, defaultQuery, columns, tableInitialState } from './config';
import type { Choreographer } from '@/lib/types/database';

export const Choreographers = () => {
  const { setTitle } = useTitle();
  useEffect(() => setTitle('Choreographers'), [setTitle]);

  return (
    <>
      <TablePage<Choreographer>
        model='choreographer'
        useData={useChoreographers}
        columns={columns}
        queryFields={queryFields}
        defaultQuery={defaultQuery}
        tableInitialState={tableInitialState}
      />
    </>
  );
};
