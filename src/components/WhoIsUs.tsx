"use client"
import { Roboto } from 'next/font/google'
import Image from 'next/image';
import { Button } from './ui/button';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const roboto = Roboto({
    weight: '400',
    subsets: ['latin'],
})

const WhoIsUs = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,  // Configurando a duração da animação
        });
    }, []);

    return (
        <>
            <div className='flex flex-col justify-center items-center mt-10 mx-4 md:mx-10'>
                {/* Título animado */}
                <div data-aos="fade-right" className={`text-3xl font-sans font-extrabold text-center text-gray-700 ${roboto.className}`}>
                    <b>Eternize</b> a memória do seu ente querido
                </div>

                {/* Imagem central com animação */}
                <div data-aos="fade-right" className='flex justify-center items-center mt-10'>
                    <Image src={`/images/image-example.png`} alt='Foto' width={400} height={400} />
                </div>

                {/* Descrição com formatação e espaçamento */}
                <div data-aos="fade-left" className='text-justify mt-10 px-4 md:px-20 lg:px-40'>
                    <b>InMemorian</b> é uma plataforma criada para aqueles que desejam <b>manter vivas as memórias de entes queridos</b> que se foram.
                </div>
                
                <div data-aos="fade-right" className='mt-6 px-4 md:px-20 lg:px-40 text-justify'>
                    Acreditamos que recordar é uma forma de <b>manter as pessoas sempre presentes em nossas vidas.</b> Nossa missão é fornecer uma forma única e personalizável para você compartilhar histórias, fotos e momentos marcantes de quem foi tão especial para você.
                </div>

                {/* Botão com espaçamento */}
                <Button data-aos="fade-left" className="w-70 mt-10 bg-orange-400">Comece Agora - Crie Sua Homenagem</Button>
            </div>

            {/* Imagem de destaque com alinhamento */}
            <div data-aos="fade-right" className='flex justify-center items-center mt-12'>
                <Image src={`/images/destaques.png`} alt='Foto' width={600} height={400} />
            </div>
        </>
    )
}

export default WhoIsUs;
