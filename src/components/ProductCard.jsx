import ProductCarousel from "./ProductCarousel";

export default function ProductCard({ images, title, description }) {
    const whatsapp = "5551995425642"; 
    const link = `https://wa.me/${whatsapp}?text=Olá! Gostaria de um orçamento sobre ${title}`;

    return (
        <div className="card">
            <ProductCarousel images={images} />
            <div className="card-info">
                <h3>{title}</h3>
                {description && <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>{description}</p>}
                <a href={link} target="_blank" rel="noreferrer">
                    <button className="btn btn-primary btn-full">Solicitar Orçamento</button>
                </a>
            </div>
        </div>
    );
}