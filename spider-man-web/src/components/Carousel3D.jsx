import React, { useEffect, useRef } from 'react';

// We rely on styles.css for the 3D logic (.three-d-suits-section, .cartgames-wrapper, etc.)
// No need to import a separate Carousel3D.css

const Carousel3D = () => {
    // Images from original script logic usually
    // We'll use the same list as before
    const images = [
        "/games/miles morales.webp",
        "/games/play31.webp",
        "/games/ps5-msm2-box-front-uk.webp",
        "/games/Spideman2.webp",
        "/games/Spiderman-PS5.webp",
        "/games/wii1.webp",
        "/games/xbox.webp",
        "/games/xbox1.webp",


    ];

    // CSS variables for number of items might be needed if styles.css uses var(--quantity)
    // Looking at styles.css snippet in Step 716:
    // .card { transform: rotateY(calc((360deg / var(--quantity)) * var(--index))) ... }
    // So we MUST set --quantity and --index inline.

    return (
        <section id="3d-suits" className="three-d-suits-section">
            <div className="container mb-5">
                <h2 className="section-title text-center brutalist-text" data-aos="fade-up">
                    JUEGOS DE CONSOLA
                </h2>
            </div>

            <div className="cartgames-wrapper">
                <div className="wrapper">
                    <div
                        className="inner"
                        style={{ '--quantity': images.length }}
                    >
                        {images.map((img, index) => (
                            <div
                                className="card"
                                key={index}
                                style={{ '--index': index }}
                            >
                                <div className="card-inner-spin">
                                    <div className="card-face card-front">
                                        <img src={img} alt={`Game ${index}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="card-face card-back">
                                        {/* Back content logic from styles.css if any, usually just back color/logo */}
                                        <i className="fas fa-spider fa-2x text-danger"></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Carousel3D;
