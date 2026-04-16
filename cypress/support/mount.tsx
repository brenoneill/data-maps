import { mount as cypressMount } from "cypress/react18";
import { NuqsAdapter } from "nuqs/adapters/react";
import { AlertProvider } from "@/context/AlertContext";
import { SlideoutProvider } from "@/context/SlideoutContext";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { AlertContainer } from "@/components/layout/AlertContainer";
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <AlertProvider>
        <SlideoutProvider>
          <PreferencesProvider>
            {children}
            <AlertContainer />
          </PreferencesProvider>
        </SlideoutProvider>
      </AlertProvider>
    </NuqsAdapter>
  );
}

export function mount(component: React.ReactElement) {
  cy.window().then((win) => {
    win.history.replaceState({}, "", win.location.pathname);
  });
  return cypressMount(<Providers>{component}</Providers>);
}
