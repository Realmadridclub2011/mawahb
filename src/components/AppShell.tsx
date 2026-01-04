// src/components/AppShell.tsx
import React from "react";

type Props = {
  children: React.ReactNode;
  /** يضيف مسافة تحت علشان الـ bottom nav */
  navPadding?: boolean;
  className?: string;
};

export function AppShell({ children, navPadding = true, className = "" }: Props) {
  return (
    <div className={["app-bg min-h-screen", navPadding ? "pb-20" : "", className].join(" ")}>
      {children}
    </div>
  );
}
