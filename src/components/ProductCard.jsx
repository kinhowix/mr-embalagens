export default function ProductCard({ image, title }) {
    const whatsapp = "5551995425642"; 
    const link = `https://wa.me/${whatsapp}?text=Olá! Gostaria de um orçamento sobre ${title}`;

    return (
        <div className="card">
            <img src={image} alt={title} />
            <div className="card-info">
                <h3>{title}</h3>
                <a href={link} target="_blank" rel="noreferrer">
                    <button className="btn btn-primary btn-full">Solicitar Orçamento</button>
                </a>
            </div>
        </div>
    );
}