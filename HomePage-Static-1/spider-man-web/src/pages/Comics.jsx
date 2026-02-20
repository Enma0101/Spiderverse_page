
import React from 'react';
import { comics } from "../data/comics";
import { useFavorites } from "../hooks/useFavorites";
import ComicCard from "../components/ComicCard";
import HeroBanner from "../components/HeroBanner";

const Comics = () => {
    const { toggleFavorite, isFavorite } = useFavorites();

    return (
        <div className="min-vh-100 bg-black text-white">
            <HeroBanner />

            <section id="comics" className="container py-5">
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="display-4 fw-bold text-uppercase brutalist-text" style={{
                        color: '#fff',
                        textShadow: '0 0 10px rgba(229, 9, 20, 0.5)',
                        borderBottom: '4px solid #e50914',
                        display: 'inline-block',
                        paddingBottom: '10px'
                    }}>
                        Biblioteca de Cómics
                    </h2>
                </div>

                <div className="row g-4 justify-content-center">
                    {comics.map((comic, i) => (
                        <div key={comic.id} className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <ComicCard
                                comic={comic}
                                isFavorite={isFavorite(comic.id)}
                                onToggleFavorite={toggleFavorite}
                                index={i}
                            />
                        </div>
                    ))}
                </div>
            </section>

            <footer className="border-top border-secondary py-4 text-center mt-5 bg-dark">
                <p className="text-white-50 small mb-0">
                    🕷️ SPIDER-COMICS · Fan Project · 2026
                </p>
            </footer>
        </div>
    );
};

export default Comics;