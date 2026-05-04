import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function Carousel() {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "banners"), orderBy("createdAt", "desc"));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => doc.data());
            setBanners(lista);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Swiper 
            modules={[Autoplay, Pagination]}
            slidesPerView={1} 
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop={banners.length > 1}
        >
            {banners.map((b, i) => (
                <SwiperSlide key={i}>
                    <img src={b.url} className="banner" alt={`Banner ${i}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
