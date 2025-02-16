"use client";
import { Roboto } from "next/font/google";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <section className="w-full bg-emerald-100 py-10 px-4 sm:px-10 md:px-20 lg:px-36">
      <header className="text-center">
        <h1 className="text-4xl font-raleway">
          A Marca Da Sua <span className="font-bold">Extensão</span>
        </h1>
        <Separator className="my-4 bg-gray-400 mx-auto" />
      </header>

      <article className="mt-12 text-center">
        <h2 className="text-3xl font-raleway mb-6">Lançamentos</h2>
        <p className="text-lg font-raleway max-w-2xl mx-auto">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic 
        </p>
      </article>
    <div className="mt-8">
    <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>

    </div>
    </section>
  );
};

export default WhoIsUs;