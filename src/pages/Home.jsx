import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import Header from "../components/Header";
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export default function Home() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(lista);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="home-page">
            <Header />

            <Carousel />

            <section className="section container">
                <motion.div 
                    className="section-title"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2>Embalagens que encantam</h2>
                    <p>Produzimos estojos, envelopes e sacolas com a identidade da sua marca, unindo qualidade e elegância.</p>
                </motion.div>

                <div className="grid">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            images={product.images} 
                            title={product.name} 
                        />
                    ))}
                    {products.length === 0 && (
                        <p className="text-center" style={{ gridColumn: '1/-1', color: '#666' }}>
                            Carregando produtos...
                        </p>
                    )}
                </div>
            </section>

            <footer className="section text-center" style={{ backgroundColor: '#f8f9fa', padding: '40px 0' }}>
                <div className="container">
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        © 2026 MR Embalagens. Todos os direitos reservados.
                    </p>
                </div>
            </footer>

            <a
                href="https://wa.me/5551995425642"
                className="whatsapp-float"
                target="_blank"
                rel="noreferrer"
            >
                <MessageCircle size={32} />
            </a>
        </div>
    );
}