import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { System } from "@/types";

interface SlideoutContextValue {
  isOpen: boolean;
  activeSystem: System | null;
  openSlideout: (system: System) => void;
  closeSlideout: () => void;
}

const SlideoutContext = createContext<SlideoutContextValue | null>(null);

export function SlideoutProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSystem, setActiveSystem] = useState<System | null>(null);

  const openSlideout = useCallback((system: System) => {
    setActiveSystem(system);
    setIsOpen(true);
  }, []);

  const closeSlideout = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setActiveSystem(null), 300);
  }, []);

  return (
    <SlideoutContext.Provider
      value={{ isOpen, activeSystem, openSlideout, closeSlideout }}
    >
      {children}
    </SlideoutContext.Provider>
  );
}

export function useSlideout(): SlideoutContextValue {
  const ctx = useContext(SlideoutContext);
  if (!ctx)
    throw new Error("useSlideout must be used within SlideoutProvider");
  return ctx;
}
