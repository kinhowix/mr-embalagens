import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";

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
        <Swiper slidesPerView={1} autoplay={{ delay: 3000 }}>
            {banners.map((b, i) => (
                <SwiperSlide key={i}>
                    <img src={b.url} className="banner" alt={`Banner ${i}`} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}