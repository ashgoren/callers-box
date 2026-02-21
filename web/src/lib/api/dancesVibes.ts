import { supabase } from '@/lib/supabase'

export const addVibeToDance = async (danceId: number, vibeId: number) => {
  const { data, error } = await supabase
    .from('dances_vibes')
    .insert({ dance_id: danceId, vibe_id: vibeId })
    .select()
    .single()

  if (error) throw new Error(error.message);
  return data;
};

export const removeVibeFromDance = async (danceId: number, vibeId: number) => {
  const { data, error } = await supabase
    .from('dances_vibes')
    .delete()
    .eq('dance_id', danceId)
    .eq('vibe_id', vibeId)
    .select()
    .single()

  if (error) throw new Error(error.message);
  return data;
};
