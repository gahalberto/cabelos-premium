"use client";
import { Roboto } from "next/font/google";
import Image from "next/image";
import { Button } from "./ui/button";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Card,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CardContent } from "@mui/material";
import { StarRounded } from "@mui/icons-material";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const WhoIsUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // duração das animações
    });
  }, []);

  const router = useRouter();

  return (
    <div className="w-full bg-[#030D20] pb-10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Texto inicial */}
        <p className="text-zinc-400 text-center mt-4 text-sm">
          +4500 memoriais feitos de entes-queridos que jamais serão esquecidos
        </p>

        {/* Seção 1: Imagem e descrição */}
        <div className="flex flex-col md:flex-row gap-10 mt-10">
          <div
            className="flex-1 flex justify-center items-center"
            data-aos="fade-right"
          >
            <Image
              src="/images/propaganda1.png"
              alt="Foto"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div
            className="flex-1 text-white text-justify px-4 md:px-20 lg:px-40 flex items-center"
            data-aos="fade-left"
          >
            <p>
              <b>InMemorian</b> é uma plataforma criada para aqueles que desejam{" "}
              <b>manter vivas as memórias de entes queridos</b> que se foram.
            </p>
          </div>
        </div>

        {/* Seção 2: Imagem e texto */}
        <div className="flex flex-col md:flex-row gap-10 mt-10 mb-10">
          <div
            className="flex-1 flex justify-center items-center"
            data-aos="fade-right"
          >
            <Image
              src="/images/celular-perfil.png"
              alt="Foto"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div
            className="flex-1 text-white text-justify px-4 md:px-20 lg:px-40 flex items-center"
            data-aos="fade-right"
          >
            <p>
              Acreditamos que lembrar é uma forma de{" "}
              <b>manter as pessoas sempre presentes em nossas vidas.</b> Nossa missão
              é fornecer uma forma única e personalizável para você compartilhar
              histórias, fotos e momentos marcantes de quem foi tão especial para você.
            </p>
          </div>
        </div>

        {/* Seção 3: Destaques */}
        <div
          className="flex justify-center items-center mt-12"
          data-aos="fade-right"
        >
          <Image
            src="/images/destaques2.png"
            alt="Foto"
            width={600}
            height={400}
            className="w-full sm:w-1/3  h-auto"
          />
        </div>

        {/* Seção 4: Preços */}
        <div className="mt-20">
          <h1 className="text-4xl text-white font-bold text-center mb-12">
            Preços
          </h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Card Básico */}
            <div className="flex-1"             data-aos="fade-left"
            >
              <Card>
                <CardHeader className="bg-slate-800 rounded-t-sm shadow-2xl">
                  <CardTitle>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-400">Básico</span>
                        <h1 className="text-4xl font-sans font-bold">R$ 29</h1>
                      </div>
                      <div>
                        <Image
                          src="/images/icon1.png"
                          alt="Icon"
                          width={100}
                          height={100}
                        />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-indigo-950 rounded-b-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl">1 ano de acesso</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl">10 fotos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/x-icon.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-red-400 text-xl">Vídeos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/x-icon.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-red-400 text-xl">
                      Biografia gerada por AI
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <Button  onClick={() => router.push('/criar-perfil')} className="bg-red-400 text-white font-bold shadow-sm shadow-black px-10 mt-6">
                      Quero fazer meu site memorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card Premium */}
            <div className="flex-1" data-aos="fade-right">
              <Card className="shadow-red-700 shadow-2xl border-2 border-red-500">
                <CardHeader className="bg-[#05142E] rounded-t-sm border-b-2 border-red-500">
                  <CardTitle>
                    <div className="relative flex justify-center items-center text-center rounded-lg p-2 w-full -mt-5">
                      <span className="text-xs flex items-center text-red-400">
                        <StarRounded className="mr-1 text-red-400   " /> Mais Escolhido
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-400">Premium</span>
                        <h1 className="text-4xl font-sans font-bold">R$ 49</h1>
                      </div>
                      <div>
                        <Image
                          src="/images/icon3.png"
                          alt="Icon"
                          width={100}
                          height={200}
                        />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-indigo-950 rounded-b-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl">Pra sempre acesso</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl">30 fotos</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl">Vídeo</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/images/icon2.png"
                      alt="Icon"
                      width={30}
                      height={30}
                    />
                    <p className="font-bold text-xl text-yellow-400">
                      Biografia gerada por AI
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <Button onClick={() => router.push('/criar-perfil')} className="bg-red-400 text-white font-bold shadow-sm shadow-black px-10 mt-6">
                      Quero fazer meu site memorial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoIsUs;
