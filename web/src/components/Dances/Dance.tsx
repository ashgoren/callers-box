import { useDance, useCreateDance, useUpdateDance, useDeleteDance } from '@/hooks/useDances';
import { useAddChoreographerToDance, useRemoveChoreographerFromDance } from '@/hooks/useDancesChoreographers';
import { useChoreographers } from '@/hooks/useChoreographers';
import { usePendingRelations } from '@/hooks/usePendingRelations';
import { RelationEditor } from '@/components/RelationEditor';
import { Spinner, ErrorMessage } from '@/components/shared';
import { columns, newRecord } from './config';
import { RecordView } from '@/components/RecordView';
import { RecordEdit } from '@/components/RecordEdit';
import { RelationList } from '@/components/RelationList';
import { useDrawerState } from '@/contexts/DrawerContext';
import type { DanceInsert, DanceUpdate, Dance as DanceType } from '@/lib/types/database';

export const Dance = ({ id }: { id?: number }) => {
  const { mode } = useDrawerState();

  const { mutateAsync: createDance } = useCreateDance();
  const { mutateAsync: updateDance } = useUpdateDance();
  const { mutateAsync: deleteDance } = useDeleteDance();
  const { mutateAsync: addChoreographer } = useAddChoreographerToDance();
  const { mutateAsync: removeChoreographer } = useRemoveChoreographerFromDance();

  const { data: dance, isLoading, error } = useDance(Number(id));
  const { data: choreographers } = useChoreographers();

  const pending = usePendingRelations();

  const handleSave = async (updates: DanceUpdate) => {
    const { id: danceId } = mode === 'create'
      ? await createDance(updates as DanceInsert)
      : await updateDance({ id: dance!.id, updates });

    await pending.commitChanges(
      (choreographerId) => addChoreographer({ danceId, choreographerId }),
      (choreographerId) => removeChoreographer({ danceId, choreographerId })
    );
  };

  if (mode === 'create') {
    return (
      <RecordEdit
        data={newRecord}
        columns={columns}
        title={'New Dance'}
        onSave={handleSave}
        hasPendingRelationChanges={pending.hasPendingChanges}
      >
        <RelationEditor
          model='choreographer'
          label='Choreographers'
          relations={[] as DanceType['dances_choreographers']}
          getRelationId={dc => dc.choreographer.id}
          getRelationLabel={dc => dc.choreographer.name}
          options={choreographers ?? []}
          getOptionLabel={choreographer => choreographer.name}
          getOptionId={choreographer => choreographer.id}
          pending={pending}
        />
      </RecordEdit>
    );
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!dance) return <ErrorMessage error={new Error('Dance not found')} />;

  if (mode === 'edit') {
    return (
      <RecordEdit
        data={dance}
        columns={columns}
        title={`Edit: ${dance.title}`}
        onSave={handleSave}
        hasPendingRelationChanges={pending.hasPendingChanges}
      >
        <RelationEditor
          model='choreographer'
          label='Choreographers'
          relations={dance.dances_choreographers}
          getRelationId={dc => dc.choreographer.id}
          getRelationLabel={dc => dc.choreographer.name}
          options={choreographers ?? []}
          getOptionId={choreographer => choreographer.id}
          getOptionLabel={choreographer => choreographer.name}
          pending={pending}
        />
      </RecordEdit>
    );
  }

  return (
    <RecordView
      data={dance}
      columns={columns}
      title={`Dance: ${dance.title}`}
      onDelete={() => deleteDance({ id: id! })}
    >
      <RelationList
        model='program'
        label='🔗 Programs'
        relations={dance.programs_dances}
        getRelationId={(pd) => pd.program.id}
        getRelationLabel={(pd) => `${pd.program.date} - ${pd.program.location}`}
      />
      <RelationList
        model='choreographer'
        label='🔗 Choreographers'
        relations={dance.dances_choreographers}
        getRelationId={(dc) => dc.choreographer.id}
        getRelationLabel={(dc) => dc.choreographer.name}
      />
    </RecordView>
  );
};
