import React, { useState } from 'react';

const galleryImages = [
    {
        id: 1,
        title: "Spider-Man Swinging",
        category: "gameplay",
        image: "/spider-man-swinging-between-buildings-manhattan-sk.webp"
    },
    {
        id: 2,
        title: "Miles Morales Powers",
        category: "powers",
        image: "/miles-morales-electric-venom-powers-glowing.webp"
    },
    {
        id: 3,
        title: "Combat System",
        category: "combat",
        image: "/spider-man-combat-fighting-enemies-acrobatic.webp"
    },
    {
        id: 4,
        title: "New York City",
        category: "world",
        image: "/new-york-city-skyline-sunset-spider-man-game.webp"
    },
    {
        id: 5,
        title: "Symbiote Suit",
        category: "suits",
        image: "/spider-man-black-symbiote-suit-venom-dark.webp"
    },
    {
        id: 6,
        title: "Villains",
        category: "villains",
        image: "/spider-man-villains-confrontation-epic-battle.webp"
    }
];

const Gallery = () => {
    // Note: The original site might have used a library or custom JS for filtering.
    // We will stick to the React implementation but use the bootstrap classes.
    const [filter, setFilter] = useState('all');

    const filteredImages = filter === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === filter);

    return (
        <section id="gallery" className="gallery-section py-5">
            <div className="container py-5">
                <h2 className="section-title brutalist-text text-center mb-5" data-aos="fade-up">
                    GALERÍA DE IMÁGENES
                </h2>

                {/* Filters */}
                {/* Check styles.css if there are filter classes, usually 'filter-btn' or similar. 
                    If not found, we use standard bootstrap buttons with neomorph. */}
                <div className="d-flex flex-wrap justify-center gap-2 mb-5" data-aos="fade-up">
                    {['all', 'gameplay', 'combat', 'suits', 'villains'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`btn ${filter === cat ? 'btn-primary' : 'btn-outline-custom'} neomorph text-uppercase fw-bold`}
                        >
                            {cat === 'all' ? 'Ver Todo' : cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="row g-4">
                    {filteredImages.map((item, index) => (
                        <div className="col-md-6 col-lg-4" key={item.id} data-aos="fade-up" data-aos-delay={index * 50}>
                            <div className="gallery-item neomorph overflow-hidden position-relative rounded-3" style={{ height: '250px' }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-100 h-100 object-fit-cover transition-transform"
                                    style={{ objectFit: 'cover' }}
                                />
                                <div className="gallery-overlay">
                                    <div className="text-center">
                                        <h4 className="text-white mb-1">{item.title}</h4>
                                        <span className="badge bg-danger text-uppercase">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
