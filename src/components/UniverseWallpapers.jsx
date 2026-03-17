import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './UniverseWallpapers.css';

const STORAGE_BASE = 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image/images';

const wallpapers = [
    { 
        id: 1, 
        title: 'Manhattan Skyline', 
        url: `${STORAGE_BASE}/spider-man-swinging-between-buildings-manhattan-sk.webp`
    },
    { 
        id: 2, 
        title: 'Venom Powers', 
        url: `${STORAGE_BASE}/miles-morales-electric-venom-powers-glowing.webp`
    },
    { 
        id: 3, 
        title: 'Sunset in NYC', 
        url: `${STORAGE_BASE}/new-york-city-skyline-sunset-spider-man-game.webp`
    },
    { 
        id: 4, 
        title: 'The Symbiote', 
        url: `${STORAGE_BASE}/spider-man-black-symbiote-suit-venom-dark.webp`
    },
    { 
        id: 5, 
        title: 'Swinging NYC', 
        url: `${STORAGE_BASE}/spider-man-ps4-game-swinging-through-city.webp`
    },
    { 
        id: 6, 
        title: 'Dual Heroes', 
        url: `${STORAGE_BASE}/spider-man-2-ps5-peter-and-miles-dual-heroes.webp`
    }
];
const WallpaperSection = ({ wallpaper, progress, index, total }) => {
    const isEven = index % 2 === 0;
    // Precise timing for transitions based on index
    const start = index / total;
    const end = (index + 1) / total;
    
    // First image starts visible, others slide in
    const isFirst = index === 0;
    const isLast = index === total - 1;

    // Define distinct points for the transition
    // We add a tiny epsilon to ensure no two points are identical
    const eps = 0.001; 
    
    const entryStart = isFirst ? -0.1 : start;
    const entryEnd = isFirst ? 0 : start + (0.1 / total);
    const exitStart = isLast ? 1.1 : end - (0.1 / total);
    const exitEnd = end;

    const x = useTransform(
        progress, 
        [entryStart, entryEnd, exitStart, exitEnd], 
        [isFirst ? '0%' : (isEven ? '100%' : '-100%'), '0%', '0%', (isEven ? '-100%' : '100%')]
    );
    
    const opacity = useTransform(
        progress, 
        [entryStart, entryEnd, exitStart, exitEnd], 
        [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
    );
    
    const scale = useTransform(
        progress, 
        [entryStart, entryEnd, exitStart, exitEnd], 
        [1, 1.05, 1.05, 1.1]
    );
    
    // Layering: higher index = higher layer during its active time
    const zIndex = useTransform(
        progress,
        [start - eps, start, end, end + eps],
        [1, index + 10, index + 10, 1]
    );

    return (
        <motion.div 
            style={{ opacity, x, zIndex }}
            className="wallpaper-frame"
        >
            <div className="wallpaper-container neomorph">
                <motion.img 
                    src={wallpaper.url} 
                    alt={wallpaper.title}
                    style={{ scale }}
                    className="wallpaper-image"
                    loading="eager"
                />
                <div className="wallpaper-overlay-inner"></div>
            </div>
            <motion.div 
                className="wallpaper-caption"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h4 className="brutalist-text">{wallpaper.title}</h4>
            </motion.div>
        </motion.div>
    );
};

const UniverseWallpapers = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section className="universe-wallpapers" ref={containerRef}>
            <div className="sticky-wrapper">
                <div className="wallpaper-overlay">
                    <div className="container">
                        <h3 className="brutalist-text section-title mt-10 pt-7 mb-7 text-white">GALERÍA CINEMATOGRÁFICA</h3>
                    </div>
                </div>
                
                <div className="wallpaper-viewport">
                    {wallpapers.map((wp, index) => (
                        <WallpaperSection 
                            key={wp.id} 
                            wallpaper={wp} 
                            progress={scrollYProgress} 
                            index={index} 
                            total={wallpapers.length}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UniverseWallpapers;
