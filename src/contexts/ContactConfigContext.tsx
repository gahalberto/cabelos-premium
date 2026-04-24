"use client";

import { createContext, useContext } from "react";

export interface ContactConfig {
  whatsappMain: string;
  whatsappSP: string;
  whatsappRJ: string;
  whatsappMessage: string;
  phoneSP: string;
}

export const defaultContactConfig: ContactConfig = {
  whatsappMain:    "5511912290102",
  whatsappSP:      "5511912290102",
  whatsappRJ:      "5511912290102",
  whatsappMessage: "Oi eu vim pelo site www.cabelospremium.com.br",
  phoneSP:         "551138252050",
};

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
