import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

    const [selectedImage, setSelectedImage] = useState(null);

    const openLightbox = (index) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden'; // Evita scrollear el fondo
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setSelectedImage((prev) => (prev + 1) % filteredImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setSelectedImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight' && selectedImage !== null) {
            setSelectedImage((prev) => (prev + 1) % filteredImages.length);
        } else if (e.key === 'ArrowLeft' && selectedImage !== null) {
            setSelectedImage((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
        }
    }, [selectedImage, filteredImages.length]);

    useEffect(() => {
        if (selectedImage !== null) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage, handleKeyDown]);

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

                {/* Grid AnimatePresence allows elements to animate in and out */}
                <motion.div layout className="row g-4">
                    <AnimatePresence>
                        {filteredImages.map((item, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="col-md-6 col-lg-4"
                                key={item.id}
                                onClick={() => openLightbox(index)}
                                style={{ cursor: 'pointer' }}
                                whileHover={{ scale: 1.05, rotateY: 5, rotateX: 5, zIndex: 10 }}
                                whileTap={{ scale: 0.95 }}
                            >
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
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lightbox-overlay"
                        onClick={closeLightbox}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                            zIndex: 10000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            className="btn lightbox-btn position-absolute top-0 end-0 m-4 rounded-circle d-flex align-items-center justify-content-center"
                            onClick={closeLightbox}
                            style={{ zIndex: 10001, width: '50px', height: '50px' }}
                        >
                            <i className="fas fa-times fs-4"></i>
                        </button>

                        {/* Prev Button */}
                        <motion.button
                            className="btn lightbox-btn position-absolute start-0 ms-2 ms-md-4 rounded-circle d-flex align-items-center justify-content-center"
                            onClick={prevImage}
                            style={{ zIndex: 10001, width: '60px', height: '60px' }}
                        >
                            <i className="fas fa-chevron-left fs-3"></i>
                        </motion.button>

                        <motion.img
                            key={selectedImage}
                            src={filteredImages[selectedImage].image}
                            alt={filteredImages[selectedImage].title}
                            initial={{ scale: 0.8, opacity: 0, x: 100 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 0.8, opacity: 0, x: -100 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            style={{
                                maxHeight: '85vh',
                                maxWidth: '85vw',
                                objectFit: 'contain',
                                borderRadius: '12px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                        />

                        {/* Image Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="position-absolute bottom-0 mb-5 text-center"
                        >
                            <h3 className="brutalist-text text-white mb-2" style={{ letterSpacing: '2px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                                {filteredImages[selectedImage].title}
                            </h3>
                            <span className="badge bg-danger text-uppercase px-3 py-2">
                                {filteredImages[selectedImage].category}
                            </span>
                        </motion.div>

                        {/* Next Button */}
                        <motion.button
                            className="btn lightbox-btn position-absolute end-0 me-2 me-md-4 rounded-circle d-flex align-items-center justify-content-center"
                            onClick={nextImage}
                            style={{ zIndex: 10001, width: '60px', height: '60px' }}
                        >
                            <i className="fas fa-chevron-right fs-3"></i>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
