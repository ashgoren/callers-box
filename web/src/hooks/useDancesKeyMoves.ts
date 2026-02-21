import { useNotify } from '@/hooks/useNotify';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addKeyMoveToDance, removeKeyMoveFromDance } from '@/lib/api/dancesKeyMoves';

export const useAddKeyMoveToDance = () => {
  const { toastError } = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ danceId, keyMoveId }: { danceId: number; keyMoveId: number }) =>
      addKeyMoveToDance(danceId, keyMoveId),
    onSuccess: (_, { danceId }) => {
      queryClient.invalidateQueries({ queryKey: ['dance', danceId] });
      queryClient.invalidateQueries({ queryKey: ['dances'] });
      queryClient.invalidateQueries({ queryKey: ['key_moves'] });
      // success('Key move added to dance');
    },
    onError: (err: Error) => toastError(err.message || 'Error adding key move to dance')
  });
};

export const useRemoveKeyMoveFromDance = () => {
  const { toastError } = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ danceId, keyMoveId }: { danceId: number; keyMoveId: number }) =>
      removeKeyMoveFromDance(danceId, keyMoveId),
    onSuccess: (_, { danceId }) => {
      queryClient.invalidateQueries({ queryKey: ['dance', danceId] });
      queryClient.invalidateQueries({ queryKey: ['dances'] });
      queryClient.invalidateQueries({ queryKey: ['key_moves'] });
      // success('Key move removed from dance');
    },
    onError: (err: Error) => toastError(err.message || 'Error removing key move from dance')
  });
};
