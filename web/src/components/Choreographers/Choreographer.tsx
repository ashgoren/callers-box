import { useChoreographer, useCreateChoreographer, useUpdateChoreographer, useDeleteChoreographer } from '@/hooks/useChoreographers';
import { Spinner, ErrorMessage } from '@/components/shared';
import { columns, newRecord } from './config';
import { RecordView } from '@/components/RecordView';
import { RecordEdit } from '@/components/RecordEdit';
import { RelationList } from '@/components/RelationList';
import { useDrawerState } from '@/contexts/DrawerContext';
import type { ChoreographerInsert, ChoreographerUpdate } from '@/lib/types/database';

export const Choreographer = ({ id }: { id?: number }) => {
  const { mode } = useDrawerState();

  const { mutateAsync: createChoreographer } = useCreateChoreographer();
  const { mutateAsync: updateChoreographer } = useUpdateChoreographer();
  const { mutateAsync: deleteChoreographer } = useDeleteChoreographer();

  const { data: choreographer, isLoading, error } = useChoreographer(Number(id));

  const handleSave = async (updates: ChoreographerUpdate) => {
    if (mode === 'create') {
      await createChoreographer(updates as ChoreographerInsert);
    } else {
      await updateChoreographer({ id: choreographer!.id, updates });
    }
  };

  if (mode === 'create') {
    return (
      <RecordEdit
        data={newRecord}
        columns={columns}
        title={'New Choreographer'}
        onSave={handleSave}
        hasPendingRelationChanges={false}
      />
    );
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!choreographer) return <ErrorMessage error={new Error('Choreographer not found')} />;

  if (mode === 'edit') {
    return (
      <RecordEdit
        data={choreographer}
        columns={columns}
        title={choreographer.name}
        onSave={handleSave}
        hasPendingRelationChanges={false}
      />
    );
  }

  return (
    <RecordView
      data={choreographer}
      columns={columns}
      title={`Choreographer: ${choreographer.name}`}
      onDelete={() => deleteChoreographer({ id: choreographer.id })}
    >
      <RelationList
        model='dance'
        label='🔗 Dances'
        relations={choreographer.dances_choreographers}
        getRelationId={(dc => dc.dance.id)}
        getRelationLabel={(dc) => dc.dance.title}
      />
    </RecordView>
  );
};
