import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface PreferencesContextValue {
  isOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openPreferences = useCallback(() => setIsOpen(true), []);
  const closePreferences = useCallback(() => setIsOpen(false), []);

  return (
    <PreferencesContext.Provider
      value={{ isOpen, openPreferences, closePreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
