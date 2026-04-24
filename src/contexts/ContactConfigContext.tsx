"use client";

import { createContext, useContext } from "react";
import { defaultContactConfig, type ContactConfig } from "@/config/contact-defaults";

export type { ContactConfig };
export { defaultContactConfig };

const ContactConfigContext = createContext<ContactConfig>(defaultContactConfig);

export function ContactConfigProvider({
  config,
  children,
}: {
  config: ContactConfig;
  children: React.ReactNode;
}) {
  return (
    <ContactConfigContext.Provider value={config}>
      {children}
    </ContactConfigContext.Provider>
  );
}

export function useContactConfig() {
  return useContext(ContactConfigContext);
}
