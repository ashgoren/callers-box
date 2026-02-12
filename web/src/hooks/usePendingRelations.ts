import { useState } from 'react';

export const usePendingRelations = <TAdd = number>(
  options?: { getId?: (item: TAdd) => number }
) => {
  const [pendingAdds, setPendingAdds] = useState<TAdd[]>([]);
  const [pendingRemoves, setPendingRemoves] = useState<number[]>([]);

  const getId = options?.getId ?? (item => item as number);

  const addItem = (item: TAdd) => {
    if (pendingRemoves.includes(getId(item))) {
      setPendingRemoves(prev => prev.filter(id => id !== getId(item)));
    } else {
      setPendingAdds(prev => [...prev, item]);
    }
  };

  const removeItem = (id: number) => {
    if (pendingAdds.some(item => getId(item) === id)) {
      setPendingAdds(prev => prev.filter(item => getId(item) !== id));
    } else {
      setPendingRemoves(prev => [...prev, id]);
    }
  };

  const commitChanges = async (
    onCommitAdd: (item: TAdd) => Promise<void>,
    onCommitRemove: (id: number) => Promise<void>
  ) => {
    await Promise.all([
      ...pendingAdds.map(item => onCommitAdd(item)),
      ...pendingRemoves.map(id => onCommitRemove(id))
    ]);
  };

  // A reset function isn't strictly necessary since component remounts on change of drawer mode or record
  // const reset = () => {
  //   setPendingAdds([]);
  //   setPendingRemoves([]);
  // };

  return {
    pendingAdds,
    pendingRemoves,
    addItem,
    removeItem,
    commitChanges,
    hasPendingChanges: pendingAdds.length > 0 || pendingRemoves.length > 0
  };
};
