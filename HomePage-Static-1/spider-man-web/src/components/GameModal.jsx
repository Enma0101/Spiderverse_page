import React, { useEffect, useCallback, useState } from 'react';
import './GameModal.css';

/* ─────────────────────────────────────────────────────────
   Sub-componente: estrellas de puntuación
───────────────────────────────────────────────────────── */
function StarRating({ rating }) {
    const filled = Math.round(parseFloat(rating));
    return (
        <div className="gm-stars" aria-label={`Puntuación: ${rating} de 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`gm-star${i <= filled ? ' filled' : ''}`}>
                    ★
                </span>
            ))}
            <span className="gm-rating-num">{rating} / 5</span>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────
   Modal principal
   Props:
     game    – objeto con los datos del juego
     onClose – callback para cerrar
───────────────────────────────────────────────────────── */
function GameModal({ game, onClose }) {
    const [isClosing, setIsClosing] = useState(false);

    // Disparar animación de salida y luego desmontar
    const startClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 170); // coinçde con duración de gm-slide-down (160ms)
    }, [onClose]);

    // Cerrar con Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') startClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [startClose]);

    // Bloquear scroll de la página mientras el modal está abierto
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Click en el backdrop (no en la tarjeta) → cerrar
    const handleBackdropClick = useCallback(
        (e) => { if (e.target === e.currentTarget) startClose(); },
        [startClose]
    );

    return (
        <div
            className={`gm-backdrop${isClosing ? ' closing' : ''}`}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalles de ${game.title}`}
        >
            <div className={`gm-card${isClosing ? ' closing' : ''}`} style={{ '--accent': game.color }}>

                {/* ── Cabecera con color del juego ── */}
                <div
                    className="gm-header"
                    style={{
                        background: `linear-gradient(135deg, ${game.color}dd 0%, ${game.color}55 100%)`,
                    }}
                >
                    {/* Patrón de telaraña decorativo */}
                    <div className="gm-web-bg" aria-hidden="true" />

                    <span className="gm-badge">{game.badge}</span>
                    <h2 className="gm-title">{game.title}</h2>
                    <p className="gm-subtitle">{game.subtitle}</p>

                    <button
                        className="gm-close"
                        onClick={startClose}
                        aria-label="Cerrar modal"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                {/* ── Cuerpo ── */}
                <div className="gm-body">
                    <StarRating rating={game.rating} />

                    <p className="gm-description">{game.description}</p>

                    {/* Grid de metadatos */}
                    <div className="gm-meta">
                        <div className="gm-meta-item">
                            <span className="gm-meta-label">Plataforma</span>
                            <span className="gm-meta-value">{game.platform}</span>
                        </div>
                        <div className="gm-meta-item">
                            <span className="gm-meta-label">Desarrollador</span>
                            <span className="gm-meta-value">{game.developer}</span>
                        </div>
                        <div className="gm-meta-item">
                            <span className="gm-meta-label">Año</span>
                            <span className="gm-meta-value">{game.year}</span>
                        </div>
                        <div className="gm-meta-item">
                            <span className="gm-meta-label">Género</span>
                            <span className="gm-meta-value">{game.genre}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        className="gm-cta"
                        style={{ background: game.color }}
                        type="button"
                        onClick={() => window.open('https://store.playstation.com', '_blank')}
                    >
                        Ver en PlayStation Store
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GameModal;
