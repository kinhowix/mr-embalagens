import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function Carousel() {
    return (
        <Swiper spaceBetween={20} slidesPerView={1} autoplay>
            <SwiperSlide>
                <img src="/banner1.jpg" alt="banner" />
            </SwiperSlide>
            <SwiperSlide>
                <img src="/banner2.jpg" alt="banner" />
            </SwiperSlide>
        </Swiper>
    );
}