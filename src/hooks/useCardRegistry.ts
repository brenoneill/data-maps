import { useCallback, useRef } from "react";

/**
 * Registry for tracking card DOM elements by fides_key.
 * A system can appear in multiple swimlanes, so each key maps to a Set of elements.
 */
export function useCardRegistry() {
  const cardRefs = useRef(new Map<string, Set<HTMLElement>>());

  const registerCard = useCallback(
    (fidesKey: string) => (el: HTMLElement | null) => {
      const map = cardRefs.current;

      if (el) {
        if (!map.has(fidesKey)) {
          map.set(fidesKey, new Set());
        }
        map.get(fidesKey)!.add(el);
      } else {
        // Cleanup: remove stale refs during unmount
        const set = map.get(fidesKey);
        if (set) {
          for (const existing of set) {
            if (!existing.isConnected) {
              set.delete(existing);
            }
          }
          if (set.size === 0) map.delete(fidesKey);
        }
      }
    },
    []
  );

  return { cardRefs, registerCard };
}
