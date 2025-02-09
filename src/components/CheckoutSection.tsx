// "use client";
// import { useState } from "react";
// import Rating from "@mui/material/Rating";
// import StarIcon from "@mui/icons-material/Star";
// import Box from "@mui/material/Box";
// import RegisterCheckout from "./RegisterCheckoutForm";


// // Dados simulados do produto
// const product = {
//     name: "InMemorian Tag + Perfil",
//     description: "Uma página de homenagem para compartilhar e preservar memórias, fotos e histórias de seu ente querido.",
//     priceOriginal: "R$ 99,00",
//     priceDiscounted: "R$ 29,00",
//     discount: "44%",
//     rating: 4.9,
//     reviews: 1891,
//     options: [
//         { id: 1, label: "Perfil Básico", amount: 29, price: "R$ 29", stripePlan: "basic" },
//         { id: 2, label: "Perfil Premium", amount: 49,  price: "R$ 49", save: "R$ 30,00", stripePlan: "silver" },
//         // { id: 3, label: "Comprar 3", price: "R$ 147,00", save: "R$ 50,00", stripePlan: "premium" },
//     ],
// };

// const CheckoutSection = () => {
//     const [selectedOption, setSelectedOption] = useState(1);
//     const [error, setError] = useState<string | null>(null);



//     return (
//         <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
//             {/* Seção 2 - lado direito */}  
//             <div className="flex-1 p-4">
//                 {/* Avaliação e número de avaliações */}
//                 <div className="flex items-center mb-4">
//                     <Rating
//                         name="read-only"
//                         value={product.rating}
//                         precision={0.1}
//                         readOnly
//                         emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
//                     />
//                     <Box sx={{ ml: 2 }}>
//                         <strong>Excelente {product.rating}</strong> | {product.reviews} avaliações
//                     </Box>
//                 </div>

//                 {/* Título do Produto */}
//                 <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
//                 <p className="text-gray-600 mb-4">{product.description}</p>

//                 {/* Preço com desconto */}
//                 <div className="flex items-center mb-6">
//                     <span className="text-gray-400 line-through mr-4">{product.priceOriginal}</span>
//                     <span className="text-3xl font-bold text-red-600">{product.priceDiscounted}</span>
//                     <span className="ml-4 bg-gray-200 p-1 rounded-md text-sm">ECONOMIZE {product.discount}</span>
//                 </div>

//                 {/* Características com ícones */}
//                 <ul className="list-none space-y-2 mb-6">
//                     <li>🌟 Ouça sua voz, sinta seu riso caloroso</li>
//                     <li>♾️ Projetado para manter suas histórias vivas</li>
//                     <li>❤️ Mídia ilimitada para memórias ilimitadas</li>
//                     {/* <li>💎 Alumínio premium à prova dágua</li> */}
//                     <li>🇧🇷 Projetado no Brasil</li>
//                     {/* <li>📦 Frete gratuito</li> */}
//                 </ul>

//                 {/* Ofertas de combo */}
//                 <h3 className="text-lg font-bold mb-4">COMBO & ECONOMIZE</h3>
//                 <div className="space-y-4">
//                     {product.options.map((option) => (
//                         <div
//                             key={option.id}
//                             className={`border p-4 rounded-lg flex justify-between items-center ${selectedOption === option.id ? "border-orange-500 bg-orange-100" : ""
//                                 }`}
//                             onClick={() => setSelectedOption(option.id)}
//                         >
//                             <div className="flex items-center space-x-4">
//                                 <input
//                                     type="radio"
//                                     checked={selectedOption === option.id}
//                                     onChange={() => setSelectedOption(option.id)}
//                                 />
//                                 <span>{option.label}</span>
//                             </div>
//                             <div className="text-right">
//                                 <span className="block font-bold">{option.price}</span>
//                                 {option.save && (
//                                     <span className="text-sm text-green-600">
//                                         Você economiza {option.save}
//                                     </span>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Botão de Adicionar ao Carrinho */}
//                         <RegisterCheckout amount={selectedOption === 1 ? 29 : 49} product={product.options.find(option => option.id === selectedOption)?.stripePlan || ''} />

//                 {error && <div className="text-red-500 mt-2">{error}</div>}
//             </div>
//         </div>
//     );
// };

// export default CheckoutSection;
