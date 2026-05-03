export default function ProductCard({ image, title }) {
    const whatsapp = "5551995425642"; // COLOQUE O NÚMERO REAL AQUI

    const link = `https://wa.me/${whatsapp}?text=Olá! Gostaria de um orçamento sobre ${title}`;

    return (
        <div className="card">
            <img src={image} alt={title} />

            <h3>{title}</h3>

            <a href={link} target="_blank">
                <button>Solicitar Orçamento</button>
            </a>
        </div>
    );
}