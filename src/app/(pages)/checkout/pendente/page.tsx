import Link from "next/link";
import { Clock } from "lucide-react";

export default function CheckoutPendingPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                <Clock className="h-10 w-10 text-yellow-600" />
            </div>

            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Pagamento em Análise ⏳
                </h1>
                <p className="mt-2 text-gray-500">
                    Seu pagamento está sendo processado. Assim que for confirmado, você
                    receberá um e-mail com a atualização do seu pedido.
                </p>
                <p className="mt-1 text-sm text-gray-400">
                    Pagamentos via boleto podem levar até 3 dias úteis para compensar.
                </p>
            </div>

            <div className="flex gap-4">
                <Link
                    href="/perfil/pedidos"
                    className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white hover:bg-yellow-600 transition-colors"
                >
                    Ver meus pedidos
                </Link>
                <Link
                    href="/"
                    className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Continuar comprando
                </Link>
            </div>
        </div>
    );
}
