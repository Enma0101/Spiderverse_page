import React from 'react';
import './UniverseWallpapers.css';

const wallpapers = [
    { 
        id: 1, 
        title: 'Classic Spidey', 
        thumbnail: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/spiderman.webp',
        url: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/spiderman.webp' 
    },
    { 
        id: 2, 
        title: 'Miles Morales NYC', 
        thumbnail: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/hero-banner.webp',
        url: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/hero-banner.webp' 
    },
    { 
        id: 3, 
        title: 'Spider-Verse Neon', 
        thumbnail: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/hero-banner.webp',
        url: 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images/hero-banner.webp' 
    }
];

const UniverseWallpapers = () => {
    return (
        <section className="universe-wallpapers py-4">
            <h3 className="brutalist-text mb-4 text-white">WALLPAPERS EXCLUSIVOS</h3>
            <div className="row g-3">
                {wallpapers.map((wp) => (
                    <div className="col-6 col-md-4" key={wp.id} data-aos="zoom-in">
                        <div className="wallpaper-card neomorph">
                            <img src={wp.thumbnail} alt={wp.title} className="wp-thumb" />
                            <div className="wp-overlay">
                                <span className="wp-title small mb-2">{wp.title}</span>
                                <a href={wp.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-danger">
                                    <i className="fas fa-download me-1"></i> HD
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default UniverseWallpapers;
