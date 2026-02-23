import Link from "next/link";

export default function NotFound() {
    return (
        <div className="bg-gray-50 flex flex-col items-center justify-center px-4 py-24">
            <div className="text-center bg-white p-12 rounded-2xl shadow-md border border-gray-200 max-w-lg mx-auto w-full">
                <p className="text-8xl font-black text-[#8a7d5c] mb-4">404</p>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    😔 Sinto muito, página não encontrada
                </h1>

                <p className="text-gray-600 text-base mb-2">
                    A página que você está tentando acessar não existe ou foi removida.
                </p>
                <p className="text-gray-500 text-sm mb-8">
                    Verifique o endereço digitado ou use os botões abaixo para continuar navegando.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-[#8a7d5c] text-white font-semibold rounded-lg hover:bg-[#6d6349] transition-colors text-center"
                    >
                        🏠 Voltar ao Início
                    </Link>
                    <Link
                        href="/shop"
                        className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-center"
                    >
                        🛍️ Explorar a Loja
                    </Link>
                </div>
            </div>
        </div>
    );
}
