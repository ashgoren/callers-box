import { useRef, useEffect } from 'react';

const DEBOUNCE_MS = 500;

export const usePersistState = <T extends Record<string, unknown>>(
  key: string,
  state: T
) => {
  const isFirstRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Skip persistence on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Reset debounce timer so we only persist after user stops changing state
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Persist state with debounce
    debounceRef.current = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, DEBOUNCE_MS);
  }, [key, state]);
};

export const clearPersistence = (key: string) => {
  localStorage.removeItem(key);
};

export const loadPersistence = <T extends Record<string, unknown>>(key: string, defaults: T): T => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // Only pick keys that exist in defaults
        const filtered = Object.fromEntries(
          Object.keys(defaults).map(k => [k, k in parsed ? parsed[k] : defaults[k]])
        );
        return filtered as T;
      }
      // If parsed value is not an object, fall through to return defaults
    } catch {
      // If JSON parsing fails, fall through to return defaults
    }
  }
  return defaults;
};
