import { useNotify } from '@/hooks/useNotify';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addVibeToDance, removeVibeFromDance } from '@/lib/api/dancesVibes';

export const useAddVibeToDance = () => {
  const { toastError } = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ danceId, vibeId }: { danceId: number; vibeId: number }) =>
      addVibeToDance(danceId, vibeId),
    onSuccess: (_, { danceId }) => {
      queryClient.invalidateQueries({ queryKey: ['dance', danceId] });
      queryClient.invalidateQueries({ queryKey: ['dances'] });
      queryClient.invalidateQueries({ queryKey: ['vibes'] });
      // success('Vibe added to dance');
    },
    onError: (err: Error) => toastError(err.message || 'Error adding vibe to dance')
  });
};

export const useRemoveVibeFromDance = () => {
  const { toastError } = useNotify();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ danceId, vibeId }: { danceId: number; vibeId: number }) =>
      removeVibeFromDance(danceId, vibeId),
    onSuccess: (_, { danceId }) => {
      queryClient.invalidateQueries({ queryKey: ['dance', danceId] });
      queryClient.invalidateQueries({ queryKey: ['dances'] });
      queryClient.invalidateQueries({ queryKey: ['vibes'] });
      // success('Vibe removed from dance');
    },
    onError: (err: Error) => toastError(err.message || 'Error removing vibe from dance')
  });
};
