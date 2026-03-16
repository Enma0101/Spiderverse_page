import React from 'react';
import './NewsTicker.css';

const NewsTicker = () => {
    const news = [
        "DAILY BUGLE: ¿Spiderman es una amenaza o un héroe? ¡Opina en nuestra web!",
        "AVISO: Se reporta actividad sospechosa en los laboratorios de Oscorp.",
        "NOTICIA: Miles Morales visto balanceándose por Brooklyn esta mañana.",
        "LOCAL: El alcalde J. Jonah Jameson exige más regulación para los vigilantes.",
        "EVENTO: Convención de fans arácnidos este fin de semana en Central Park.",
        "ALERTA: Posible fuga masiva en La Balsa. Mantengan la calma."
    ];

    return (
        <div className="news-ticker-container">
            <div className="ticker-label">
                <i className="fas fa-newspaper me-2"></i>
                ÚLTIMA HORA
            </div>
            <div className="ticker-wrap">
                <div className="ticker">
                    {news.map((item, index) => (
                        <div key={index} className="ticker-item">{item}</div>
                    ))}
                    {/* Duplicate news for seamless loop */}
                    {news.map((item, index) => (
                        <div key={`dup-${index}`} className="ticker-item">{item}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;
