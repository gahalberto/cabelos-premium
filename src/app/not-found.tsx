import Link from "next/link";
import { SearchIcon, HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-[#b08c4f] opacity-20 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Página não encontrada
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
                Desculpe, não conseguimos encontrar a página que você está procurando.
                Ela pode ter sido movida ou não existe mais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-[#b08c4f] hover:bg-[#8a6d3b] text-white gap-2">
                    <Link href="/">
                        <HomeIcon className="w-4 h-4" />
                        Voltar ao Início
                    </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2 border-[#b08c4f] text-[#b08c4f] hover:bg-[#f0efdb]">
                    <Link href="/shop">
                        <SearchIcon className="w-4 h-4" />
                        Explorar Produtos
                    </Link>
                </Button>
            </div>
        </div>
    );
}
