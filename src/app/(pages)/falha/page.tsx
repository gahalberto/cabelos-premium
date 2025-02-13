// src/app/(pages)/falha/page.tsx

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        <p className="text-gray-600">
          ❌ Falha ao processar o pagamento, caso você tenha feito o pagamento e
          caiu nessa página entrar em contato com:
          <a
            href="mailto:gahalberto@icloud.com"
            className="text-blue-500 hover:underline"
          >
            gahalberto@icloud.com
          </a>
        </p>
      </div>
    </div>
  );
}
  