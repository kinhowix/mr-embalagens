import Header from "../components/Header";
import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";

import prod1 from "../assets/produto1.jpg";
import prod2 from "../assets/produto2.jpg";
import prod3 from "../assets/produto3.jpg";

export default function Home() {
    return (
        <div>
            <Header />

            <Carousel />

            <section className="intro">
                <h2>Embalagens personalizadas para sua empresa</h2>
                <p>
                    Produzimos estojos, envelopes e sacolas com a identidade da sua marca.
                </p>
            </section>

            <section className="grid">
                <ProductCard image={prod1} title="Estojo p/ óculos com ímã" />
                <ProductCard image={prod2} title="Envelope de serviço" />
                <ProductCard image={prod3} title="Sacola de tecido" />
            </section>
        </div>
    );
}