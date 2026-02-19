import React from 'react';

const ComicCard = ({ comic, isFavorite, onToggleFavorite }) => {
    return (
        <div className="col-6 col-md-4 col-lg-3 mb-4">
            <div className="card h-100 bg-transparent border-0 comic-card-container">
                <div className="comic-card position-relative overflow-hidden rounded-3 shadow-lg">
                    {/* Comic Cover */}
                    <img
                        src={comic.cover_url}
                        alt={comic.title}
                        className="img-fluid w-100 h-100 object-fit-cover comic-cover"
                        loading="lazy"
                    />

                    {/* Overlay Details */}
                    <div className="comic-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-3">
                        <div className="d-flex justify-content-between align-items-end">
                            <div>
                                <h5 className="text-white fw-bold mb-1 comic-title">{comic.title}</h5>
                                <p className="text-white-50 small mb-0">{comic.issue_number || 'Vol. 1'}</p>
                            </div>

                            {/* Favorite Button */}
                            <button
                                className={`btn btn-sm rounded-circle ${isFavorite ? 'btn-danger' : 'btn-outline-light'} fav-btn`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onToggleFavorite(comic.id);
                                }}
                                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                            >
                                <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComicCard;
