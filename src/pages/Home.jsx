import Carousel from "../components/Carousel";
import ProductCard from "../components/ProductCard";

export default function Home() {
    return (
        <div>
            <Carousel />

            <h2>MR Embalagens</h2>
            <p>Embalagens personalizadas para sua empresa</p>

            <div className="grid">
                <ProductCard image="/prod1.jpg" title="Estojo com zíper" />
                <ProductCard image="/prod2.jpg" title="Envelope de serviço" />
                <ProductCard image="/prod3.jpg" title="Sacola de tecido" />
            </div>
        </div>
    );
}