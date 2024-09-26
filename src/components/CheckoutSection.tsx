"use client";
import Image from "next/image";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Box from "@mui/material/Box";
import { loadStripe } from "@stripe/stripe-js";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import RegisterCheckout from "./RegisterCheckoutForm";

// Carregue o Stripe com a chave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

// Dados simulados do produto
const product = {
    name: "InMemorian Tag + Perfil",
    description: "Uma página de homenagem para compartilhar e preservar memórias, fotos e histórias de seu ente querido.",
    priceOriginal: "R$ 157,00",
    priceDiscounted: "R$ 97,00",
    discount: "44%",
    rating: 4.6,
    reviews: 89,
    options: [
        { id: 1, label: "Comprar 1", price: "R$ 97,00", stripePlan: "basic" },
        { id: 2, label: "Comprar 2", price: "R$ 129,00", save: "R$ 30,00", stripePlan: "silver" },
        { id: 3, label: "Comprar 3", price: "R$ 147,00", save: "R$ 50,00", stripePlan: "premium" },
    ],
};

const CheckoutSection = () => {
    const [imageSelected, setImageSelected] = useState("/images/image-example.png");
    const [selectedOption, setSelectedOption] = useState(1);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async (plan: string) => {
        const stripe = await stripePromise;

        try {
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan }),
            });

            if (!response.ok) {
                throw new Error("Falha ao criar a sessão de checkout");
            }

            const session = await response.json();

            // Redirecione o usuário para o Stripe Checkout
            const result = await stripe!.redirectToCheckout({ sessionId: session.id });

            if (result.error) {
                setError(result.error.message as string);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
                console.error("Erro ao redirecionar para o checkout:", error);
            } else {
                setError("Ocorreu um erro desconhecido.");
            }
        }

    };

    // Lista de imagens
    const images = [
        "/images/inmemirian_tag.png",
        "/images/image-example.png",
        "/images/destaques.png",
    ];

    return (
        <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto p-6 bg-white">
            {/* Seção 1 - lado esquerdo */}
            <div className="flex-1 p-4">
                {/* Imagem selecionada (tamanho fixo e contenção da imagem) */}
                <div className="w-full h-[400px] relative">
                    <Image
                        src={imageSelected}
                        alt="Imagem selecionada"
                        layout="fill"
                        objectFit="contain"
                        className="rounded-lg"
                    />
                </div>

                {/* Miniaturas (tamanho fixo e contenção da imagem) */}
                <div className="flex space-x-2 mt-4">
                    {images.map((item, index) => (
                        <div key={index} className="w-[100px] h-[100px] relative">
                            <Image
                                src={item}
                                alt={`Miniatura ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                                className="cursor-pointer rounded-lg hover:opacity-75 transition"
                                onClick={() => setImageSelected(item)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Seção 2 - lado direito */}
            <div className="flex-1 p-4">
                {/* Avaliação e número de avaliações */}
                <div className="flex items-center mb-4">
                    <Rating
                        name="read-only"
                        value={product.rating}
                        precision={0.1}
                        readOnly
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <Box sx={{ ml: 2 }}>
                        <strong>Excelente {product.rating}</strong> | {product.reviews} avaliações
                    </Box>
                </div>

                {/* Título do Produto */}
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 mb-4">{product.description}</p>

                {/* Preço com desconto */}
                <div className="flex items-center mb-6">
                    <span className="text-gray-400 line-through mr-4">{product.priceOriginal}</span>
                    <span className="text-3xl font-bold text-red-600">{product.priceDiscounted}</span>
                    <span className="ml-4 bg-gray-200 p-1 rounded-md text-sm">ECONOMIZE {product.discount}</span>
                </div>

                {/* Benefícios */}
                <div className="flex items-center space-x-4 mb-6">
                    <span className="bg-orange-200 p-2 rounded-lg text-xs">Compra única</span>
                    <span className="bg-orange-200 p-2 rounded-lg text-xs">Edite o perfil a qualquer momento</span>
                    <span className="bg-orange-200 p-2 rounded-lg text-xs">Configuração em menos de 5 minutos</span>
                </div>

                {/* Características com ícones */}
                <ul className="list-none space-y-2 mb-6">
                    <li>🌟 Ouça sua voz, sinta seu riso caloroso</li>
                    <li>♾️ Projetado para manter suas histórias vivas</li>
                    <li>❤️ Mídia ilimitada para memórias ilimitadas</li>
                    <li>💎 Alumínio premium à prova dágua</li>
                    <li>🇧🇷 Projetado no Brasil</li>
                    <li>📦 Frete mundial gratuito</li>
                </ul>

                {/* Ofertas de combo */}
                <h3 className="text-lg font-bold mb-4">COMBO & ECONOMIZE</h3>
                <div className="space-y-4">
                    {product.options.map((option) => (
                        <div
                            key={option.id}
                            className={`border p-4 rounded-lg flex justify-between items-center ${selectedOption === option.id ? "border-orange-500 bg-orange-100" : ""
                                }`}
                            onClick={() => setSelectedOption(option.id)}
                        >
                            <div className="flex items-center space-x-4">
                                <input
                                    type="radio"
                                    checked={selectedOption === option.id}
                                    onChange={() => setSelectedOption(option.id)}
                                />
                                <span>{option.label}</span>
                            </div>
                            <div className="text-right">
                                <span className="block font-bold">{option.price}</span>
                                {option.save && (
                                    <span className="text-sm text-green-600">
                                        Você economiza {option.save}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botão de Adicionar ao Carrinho */}
                <Dialog>
                    <DialogTrigger
                        className="w-full bg-orange-500 text-white font-bold py-3 mt-6 rounded-lg hover:bg-orange-600"
                    >
                        COMPRAR
                    </DialogTrigger>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Finalize sua compra</DialogTitle>
                            <DialogDescription>
                                🌟 Você está um passo de  🕯️ <b>Eternizar</b> 🕯️ o seu ente querido.
                            </DialogDescription>
                        </DialogHeader>
                        <RegisterCheckout product={product.options.find(option => option.id === selectedOption)?.stripePlan || ''} />
                    </DialogContent>
                </Dialog>

                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default CheckoutSection;
