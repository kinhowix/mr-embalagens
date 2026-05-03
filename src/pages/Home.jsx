import Header from "../components/Header";
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import prod1 from "../assets/produto1.jpg";
import prod2 from "../assets/produto2.jpg";
import prod3 from "../assets/produto3.jpg";

export default function Home() {
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
                    <ProductCard image={prod1} title="Estojo p/ óculos com ímã" />
                    <ProductCard image={prod2} title="Envelope de serviço" />
                    <ProductCard image={prod3} title="Sacola de tecido" />
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