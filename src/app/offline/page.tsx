import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Site Temporariamente Indisponível",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] px-4 text-center">
      {/* Ícone */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a96e]/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-[#c9a96e]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Título */}
      <h1 className="mb-3 text-2xl font-semibold tracking-tight text-gray-800 sm:text-3xl">
        Site Temporariamente Indisponível
      </h1>

      {/* Descrição */}
      <p className="max-w-md text-gray-500 leading-relaxed">
        Este site está temporariamente fora do ar. Se você é o responsável por
        este domínio, entre em contato com o suporte para regularizar o acesso.
      </p>

      {/* Divider */}
      <div className="my-8 h-px w-24 bg-[#c9a96e]/40" />

      {/* Status */}
      <p className="text-xs uppercase tracking-widest text-gray-400">
        Código de status: 503 – Serviço Indisponível
      </p>
    </main>
  );
}
