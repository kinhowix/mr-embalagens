export default function ProductCard({ image, title }) {
    const whatsappLink = `https://wa.me/5599999999999?text=Olá, gostaria de um orçamento sobre ${title}`;

    return (
        <div className="card">
            <img src={image} alt={title} />
            <h3>{title}</h3>

            <a href={whatsappLink} target="_blank">
                <button>Solicitar Orçamento</button>
            </a>
        </div>
    );
}