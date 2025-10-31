"use client";

import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";

const HeaderBanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden -mt-[88px]">
      {/* Vídeo em background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
    <source src="/videos/videointro.mp4" type="video/mp4" />
        Seu navegador não suporta o elemento de vídeo.
      </video>

      {/* Controle de reprodução */}
      <div className="absolute bottom-8 right-8 z-20">
        <button 
          onClick={togglePlayPause}
          className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-all duration-300 focus:outline-none"
          aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
      </div>

      {/* Overlay para conteúdo, se necessário */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="flex flex-col items-center text-center max-w-2xl px-4">
          {/* Se quiser adicionar algum conteúdo sobre o vídeo */}
        </div>
      </div>
    </div>
  );
}

export default HeaderBanner;
