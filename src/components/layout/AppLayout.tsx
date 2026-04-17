import type { ReactNode } from "react";
import { Header } from "./Header";
import { AlertContainer } from "./AlertContainer";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      <AlertContainer />
    </div>
  );
}
