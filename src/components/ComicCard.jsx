
import React from 'react';
import { Link } from "react-router-dom";

const ComicCard = ({ comic, isFavorite, onToggleFavorite, index }) => {
    // Basic styles for hover effect and transitions sad
    const cardStyle = {
        transition: 'all 0.3s ease-out',
        opacity: 0,
        animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`
    };

    return (
        <div className="comic-card-wrapper position-relative" style={cardStyle}>
            <Link to={`#`} className="text-decoration-none">
                <div
                    className="comic-card overflow-hidden rounded-3 border border-secondary bg-dark position-relative shadow-lg"
                    style={{ transition: 'transform 0.3s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {/* Image Container with Aspect Ratio */}
                    <div style={{ position: 'relative', paddingTop: '150%', overflow: 'hidden' }}>
                        <img
                            src={comic.cover}
                            alt={comic.title}
                            loading="lazy"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        {/* Gradient Overlay */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '60%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)'
                        }} />
                    </div>

                    {/* Content */}
                    <div className="position-absolute bottom-0 start-0 w-100 p-3">
                        <div className="d-flex align-items-center gap-1 mb-2 flex-wrap">
                            {comic.tags && comic.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="badge bg-danger text-white text-uppercase"
                                    style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h3 className="h6 text-white text-uppercase fw-bold mb-1 text-truncate" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '0.5px' }}>
                            {comic.title}
                        </h3>
                        <p className="small text-white-50 mb-0" style={{ fontSize: '0.75rem' }}>
                            #{comic.issue} · {comic.year}
                        </p>
                    </div>
                </div>
            </Link>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    onToggleFavorite(comic.id);
                }}
                className="btn btn-dark rounded-circle position-absolute"
                style={{
                    top: '10px',
                    right: '10px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
                <i className={`${isFavorite ? 'fas text-danger' : 'far text-white'} fa-heart`}></i>
            </button>

            <style>
                {`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </div>
    );
};

export default ComicCard;