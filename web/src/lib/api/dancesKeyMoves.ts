import { supabase } from '@/lib/supabase'

export const addKeyMoveToDance = async (danceId: number, keyMoveId: number) => {
  const { data, error } = await supabase
    .from('dances_key_moves')
    .insert({ dance_id: danceId, key_move_id: keyMoveId })
    .select()
    .single()

  if (error) throw new Error(error.message);
  return data;
};

export const removeKeyMoveFromDance = async (danceId: number, keyMoveId: number) => {
  const { data, error } = await supabase
    .from('dances_key_moves')
    .delete()
    .eq('dance_id', danceId)
    .eq('key_move_id', keyMoveId)
    .select()
    .single()

  if (error) throw new Error(error.message);
  return data;
};
