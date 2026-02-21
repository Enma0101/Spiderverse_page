import React from 'react';

const HeroBanner = () => {
    return (
        <div className="position-relative w-100 overflow-hidden" style={{ height: '400px' }}>
            <div
                className="position-absolute w-100 h-100"
                style={{
                    backgroundImage: 'url("https://i.annihil.us/u/prod/marvel/i/mg/c/e0/535fecbbb9784.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)'
                }}
            />
            {/* Gradient Overlay */}
            <div
                className="position-absolute w-100 h-100"
                style={{ background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
            />

            <div className="container position-relative h-100 d-flex flex-column justify-content-center align-items-center text-center">
                <h1 className="display-3 fw-bold text-white mb-2 brutalist-text" style={{ textShadow: '0 0 20px rgba(229, 9, 20, 0.8)' }}>
                    SPIDER-COMICS
                </h1>
                <p className="lead text-white-50" style={{ maxWidth: '600px' }}>
                    Explora la colección definitiva de aventuras del trepamuros a través del multiverso.
                </p>
            </div>
        </div>
    );
};

export default HeroBanner;
