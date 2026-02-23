import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutFailurePage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-10 w-10 text-red-600" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Pagamento Recusado 😕
                </h1>
                <p className="mt-2 text-gray-500">
                    Não foi possível processar o seu pagamento. Verifique os dados do
                    cartão ou tente outro meio de pagamento.
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/carrinho"
                    className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600 transition-colors"
                >
                    Tentar novamente
                </Link>
                <Link
                    href="/"
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Voltar à loja
                </Link>
            </div>
        </div>
    );
}
