import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";

export default function Carousel() {
    return (
        <Swiper spaceBetween={20} slidesPerView={1}>
            <SwiperSlide>
                <img src={banner1} className="banner" />
            </SwiperSlide>

            <SwiperSlide>
                <img src={banner2} className="banner" />
            </SwiperSlide>
        </Swiper>
    );
}