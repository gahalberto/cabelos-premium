import { Button } from "./ui/button";

const HeaderBanner = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Vídeo em background com opacidade */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
        autoPlay
        loop
        muted
      >
        <source src="/images/banner1.mp4" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Fundo preto semi-transparente para o texto */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

      {/* Conteúdo do banner (texto, descrição e botão) */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center max-w-2xl px-4">
          <h1 className="text-white text-4xl font-bold">
            Eternize as Memórias de Quem Você Ama
          </h1>
          <p className="text-lg mt-4 text-gray-300">
            Com o InMemorian, crie homenagens digitais para eternizar a memória dos seus entes queridos. Personalize uma página com fotos, biografias e recordações especiais que manterão viva a lembrança de quem sempre fará parte de sua história.
          </p>
          {/* Espaçamento entre o texto e o botão */}
          <Button className="w-70 mt-6 bg-orange-400">Comece Agora - Crie Sua Homenagem</Button>
        </div>
      </div>
    </div>
  );
}

export default HeaderBanner;
