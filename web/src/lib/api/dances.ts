import { supabase } from '@/lib/supabase'
import type { Dance, DanceInsert, DanceUpdate } from '@/lib/types/database';

export const getDances = async () => {
  const { data, error } = await supabase
    .from('dances')
    .select('*, programs_dances(id, order, program:programs(*)), dances_choreographers(id, choreographer:choreographers(*))');

  if (error) {
    console.error('Error fetching dances:', error);
    throw new Error(error.message);
  }
  return data as Dance[];
};

export const getDance = async (id: number) => {
  const { data, error } = await supabase
    .from('dances')
    .select('*, programs_dances(id, order, program:programs(*)), dances_choreographers(id, choreographer:choreographers(*))')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data as Dance;
};

export const updateDance = async (id: number, updates: DanceUpdate) => {
  const { data, error } = await supabase
    .from('dances')
    .update(updates)
    .eq('id', id)
    .select('*, programs_dances(id, order, program:programs(*)), dances_choreographers(id, choreographer:choreographers(*))')
    .single();

  if (error) throw new Error(error.message);
  return data as Dance;
};

export const createDance = async (newDance: DanceInsert) => {
  const { data, error } = await supabase
    .from('dances')
    .insert(newDance)
    .select('*, programs_dances(id, order, program:programs(*)), dances_choreographers(id, choreographer:choreographers(*))')
    .single();

  if (error) throw new Error(error.message);
  return data as Dance;
};

export const deleteDance = async (id: number) => {
  const { error } = await supabase
    .from('dances')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
};
