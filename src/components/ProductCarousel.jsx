import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function ProductCarousel({ images }) {
    if (!images || images.length === 0) return null;

    return (
        <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            loop={images.length > 1}
        >
            {images.map((img, index) => (
                <SwiperSlide key={index}>
                    <img
                        src={img}
                        alt={`Imagem ${index + 1}`}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
