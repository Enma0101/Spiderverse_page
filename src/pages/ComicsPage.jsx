import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext } from 'react';
import { AuthContext } from '../context/authContextDef';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useFavorites } from '../hooks/useFavorites';

const STORAGE_BASE = 'https://hniltpsdlatokfdrwmtm.supabase.co/storage/v1/object/public/image';

// Hero banner image (optimized to WebP on Supabase)
const heroBannerImg = `${STORAGE_BASE}/images/hero-banner.webp`;

// Comic Covers (Supabase URLs)
const coverAmazing = `${STORAGE_BASE}/comics/5366994b1ec04efeb7ba87eddb39bae1.webp`;
const coverAmazing2 = `${STORAGE_BASE}/comics/9780785199618_p0_v3_s1200x630.webp`;
const coverMiles = `${STORAGE_BASE}/comics/Miles_Morales_Spider-Man_Vol_1_24.webp`;
const coverSpiderVerse1 = `${STORAGE_BASE}/comics/Spider-Verse_Vol_1_1.webp`;
const coverSpiderVerse2 = `${STORAGE_BASE}/comics/Spider-Verse_Vol_2_1.webp`;
const coverWhisk = `${STORAGE_BASE}/comics/Whisk_cbdf98e605aa9bb98b0429eb03bf6219dr.webp`;

// Comic Pages (Supabase URLs)
const page1 = `${STORAGE_BASE}/comics/content/Whisk_1828bd4dc1ce124b5924b7ec958445e4dr.webp`;
const page2 = `${STORAGE_BASE}/comics/content/Whisk_276036d03414d2f8f224e321bd10708edr.webp`;
const page3 = `${STORAGE_BASE}/comics/content/unnamed.webp`;
const page4 = `${STORAGE_BASE}/comics/content/Whisk_a36348e63f41798b414471bc2328a808dr.webp`;
const page5 = `${STORAGE_BASE}/comics/content/Whisk_b7caf4932788535866d44ed80777e3b0dr.webp`;
const page6 = `${STORAGE_BASE}/comics/content/Whisk_bda297d1a8fa4a185de4fc61f4ed1044dr.webp`;
const page7 = `${STORAGE_BASE}/comics/content/Whisk_c512fe777f873f1a09a47d36023c4e9adr.webp`;
const page8 = `${STORAGE_BASE}/comics/content/Whisk_f1e70e4be57952da66f4d076070ab4b4dr.webp`;

const ITEMS_PER_PAGE = 8;

const comicsData = [
    {
        id: 1,
        title: "The Amazing Spider-Man",
        issue: "#22",
        series: "The Amazing Spider-Man (2025)",
        creators: ["Joe Kelly", "Nick Bradshaw", "Mark Bagley"],
        category: "amazing",
        badge: "NUEVO",
        image: coverAmazing,
        pages: [page1, page2, page3, page4],
        dialogues: [
            [
                { text: "¡El Duende Verde ataca de nuevo!", x: "10%", y: "15%", delay: 0.5, type: "narration" },
                { text: "¿A dónde crees que vas, Araña?", x: "50%", y: "40%", delay: 1.5, type: "speech" }
            ],
            [
                { text: "¡No te saldrás con la tuya esta vez!", x: "20%", y: "80%", delay: 0.8, type: "speech-spidey" }
            ],
            [
                { text: "KRAKOOOM!", x: "40%", y: "50%", delay: 0.2, type: "sfx" },
                { text: "¡Cuidado abajo!", x: "15%", y: "20%", delay: 1.2, type: "speech-spidey" }
            ],
            [
                { text: "Fin del primer asalto.", x: "10%", y: "10%", delay: 1, type: "narration" }
            ]
        ]
    },
    {
        id: 2,
        title: "Miles Morales: Spider-Man",
        issue: "#1",
        series: "Miles Morales: Spider-Man (2022)",
        creators: ["Cody Ziglar", "Federico Vicentini"],
        category: "miles",
        badge: "DESTACADO",
        image: coverMiles,
        pages: [page5, page6, page7, page8],
        dialogues: [
            [
                { text: "Brooklyn... Mi hogar.", x: "5%", y: "10%", delay: 0.4, type: "thought" },
                { text: "Y mi responsabilidad.", x: "60%", y: "80%", delay: 1.5, type: "thought" }
            ],
            [
                { text: "¡Oye! ¡Devuelve eso!", x: "10%", y: "20%", delay: 0.5, type: "speech" },
                { text: "Zzzt!", x: "70%", y: "50%", delay: 1.2, type: "sfx" }
            ],
            [
                { text: "Nadie escapa del Prowler...", x: "40%", y: "30%", delay: 0.8, type: "speech" }
            ],
            [
                { text: "Eso está por verse, tío Aaron.", x: "30%", y: "80%", delay: 1.0, type: "speech-spidey" }
            ]
        ]
    },
    {
        id: 3,
        title: "Spider-Verse",
        issue: "#1",
        series: "Spider-Verse (2025)",
        creators: ["Dan Slott", "Olivier Coipel"],
        category: "amazing",
        badge: "EVENTO",
        image: coverSpiderVerse1,
        pages: [page1, page4, page7, page2],
        dialogues: [
            [
                { text: "Toda la red está conectada...", x: "10%", y: "10%", delay: 0.5, type: "narration" }
            ],
            [
                { text: "¡Demasiados arácnidos en un solo lugar!", x: "20%", y: "70%", delay: 1, type: "speech" }
            ],
            [
                { text: "¡Tenemos que trabajar juntos!", x: "50%", y: "20%", delay: 0.6, type: "speech-spidey" }
            ],
            [
                { text: "Hagámoslo.", x: "40%", y: "85%", delay: 1.2, type: "speech" }
            ]
        ]
    },
    {
        id: 4,
        title: "Spider-Verse II",
        issue: "#2",
        series: "Spider-Verse (2025)",
        creators: ["Dan Slott", "Giuseppe Camuncoli"],
        category: "amazing",
        badge: null,
        image: coverSpiderVerse2,
        pages: [page8, page5, page6, page3],
        dialogues: [
            [
                { text: "Los Herederos se acercan.", x: "10%", y: "15%", delay: 0.5, type: "narration" }
            ],
            [
                { text: "No huiremos más.", x: "60%", y: "75%", delay: 0.8, type: "speech-spidey" }
            ],
            [
                { text: "¡Cuidado con la retaguardia!", x: "20%", y: "30%", delay: 0.4, type: "speech" },
                { text: "¡SWISH!", x: "70%", y: "60%", delay: 1.1, type: "sfx" }
            ],
            [
                { text: "La batalla final comienza aquí.", x: "15%", y: "15%", delay: 1.5, type: "narration" }
            ]
        ]
    },
    {
        id: 5,
        title: "The Amazing Spider-Man",
        issue: "#21",
        series: "The Amazing Spider-Man (2025)",
        creators: ["Joe Kelly", "Todd Nauck", "John Romita Jr."],
        category: "amazing",
        badge: "NUEVO",
        image: coverAmazing2,
        pages: [page2, page3, page5, page8],
        dialogues: [
            [
                { text: "Otra mañana tranquila en NY.", x: "10%", y: "10%", delay: 0.5, type: "thought" },
                { text: "O eso creía...", x: "60%", y: "85%", delay: 1.5, type: "thought" }
            ],
            [
                { text: "¡Alerta en el Banco Central!", x: "20%", y: "40%", delay: 1.0, type: "speech" }
            ],
            [
                { text: "¡Ríndete, Spider-Man!", x: "50%", y: "20%", delay: 0.7, type: "speech" }
            ],
            [
                { text: "Oblígame.", x: "30%", y: "70%", delay: 1.2, type: "speech-spidey" }
            ]
        ]
    },
    {
        id: 6,
        title: "Symbiote Spider-Man",
        issue: "#3",
        series: "Symbie Infinity Comic (2026)",
        creators: ["Jacob Chabot"],
        category: "symbiote",
        badge: "EXCLUSIVO",
        image: coverWhisk,
        pages: [page6, page1, page4, page7],
        dialogues: [
            [
                { text: "Este traje negro... me siento diferente.", x: "5%", y: "15%", delay: 0.5, type: "thought" }
            ],
            [
                { text: "Más fuerte.", x: "70%", y: "80%", delay: 1.2, type: "thought" },
                { text: "Más rápido.", x: "70%", y: "88%", delay: 1.9, type: "thought" }
            ],
            [
                { text: "¡No tienes escapatoria, Rhino!", x: "20%", y: "30%", delay: 0.6, type: "speech-spidey" }
            ],
            [
                { text: "CRASH!", x: "50%", y: "50%", delay: 0.4, type: "sfx" },
                { text: "Demasiado poder...", x: "15%", y: "20%", delay: 1.5, type: "thought" }
            ]
        ]
    },
    {
        id: 7,
        title: "Classic Spider-Man",
        issue: "#1",
        series: "Classics (2024)",
        creators: ["Stan Lee"],
        category: "clasicos",
        badge: null,
        image: coverAmazing,
        pages: [page1, page2],
        dialogues: [[], []]
    }
];

const categories = [
    { key: 'all', label: 'Todos', icon: 'fa-layer-group' },
    { key: 'favorites', label: 'Favoritos', icon: 'fa-heart' },
    { key: 'amazing', label: 'Amazing', icon: 'fa-spider' },
    { key: 'miles', label: 'Miles Morales', icon: 'fa-bolt' },
    { key: 'symbiote', label: 'Symbiote', icon: 'fa-skull' },
    { key: 'clasicos', label: 'Clásicos', icon: 'fa-star' },
];

/* ---- Interactive Comic Reader Modal ---- */
const ComicReader = ({ comic, onClose }) => {
    // Persistencia de página usando localStorage
    const storageKey = `comic-progress-${comic.id}`;
    const savedPage = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const [currentPage, setCurrentPage] = useState(savedPage < (comic.pages?.length || 0) ? savedPage : 0);
    const [scale, setScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const constraintsRef = useRef(null);

    const totalPages = comic.pages?.length || 0;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Guardar progreso automáticamente
    useEffect(() => {
        localStorage.setItem(storageKey, currentPage.toString());
    }, [currentPage, storageKey]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                handleNext();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePrev();
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [totalPages, onClose, currentPage]);

    const handleNext = () => {
        setScale(1);
        setCurrentPage(p => Math.min(p + 1, totalPages - 1));
    };

    const handlePrev = () => {
        setScale(1);
        setCurrentPage(p => Math.max(p - 1, 0));
    };

    const handleZoomIn = () => setScale(s => Math.min(s + 0.5, 3));
    const handleZoomOut = () => setScale(s => Math.max(s - 0.5, 1));
    const toggleZoom = () => setScale(s => s === 1 ? 2 : 1);

    const progress = totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0;

    return (
        <div className="comic-reader-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
            <div className="comic-reader" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="comic-reader-header">
                    <div className="comic-reader-title d-flex align-items-center gap-2">
                        <i className="fas fa-book-open text-danger"></i>
                        <span className="fw-bold fs-5">{comic.series || comic.title} {comic.issue}</span>
                    </div>

                    {/* Desktop Actions (Hidden on mobile) */}
                    <div className="comic-reader-actions d-none d-md-flex align-items-center gap-3">
                        <div className="comic-reader-controls d-flex align-items-center gap-2">
                            <button className="btn btn-sm btn-outline-light" onClick={handleZoomOut} disabled={scale === 1}>
                                <i className="fas fa-search-minus"></i>
                            </button>
                            <span className="text-white-50" style={{ fontSize: '0.8rem' }}>{Math.round(scale * 100)}%</span>
                            <button className="btn btn-sm btn-outline-light" onClick={handleZoomIn} disabled={scale === 3}>
                                <i className="fas fa-search-plus"></i>
                            </button>
                        </div>

                        <div className="comic-reader-page-info px-3 py-1 bg-dark rounded-pill border border-secondary small">
                            {currentPage + 1} / {totalPages}
                        </div>
                    </div>

                    <button className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px' }} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Mobile Sub-Header (Only visible on mobile) */}
                <div className="comic-reader-sub-header d-flex d-md-none align-items-center justify-content-center">
                    <div className="comic-reader-actions d-flex align-items-center gap-4">
                        <div className="comic-reader-controls d-flex align-items-center gap-3">
                            <button className="btn btn-sm btn-outline-light border-0" onClick={handleZoomOut} disabled={scale === 1}>
                                <i className="fas fa-search-minus"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-light border-0" onClick={handleZoomIn} disabled={scale === 3}>
                                <i className="fas fa-search-plus"></i>
                            </button>
                        </div>
                        <div className="comic-reader-page-info px-3 py-1 bg-dark rounded-pill border border-secondary small">
                            {currentPage + 1} / {totalPages}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="comic-reader-progress">
                    <div className="comic-reader-progress-bar bg-danger" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                </div>

                {/* Interactive Viewport */}
                <div className="comic-reader-viewport position-relative overflow-hidden" ref={constraintsRef} style={{ cursor: scale > 1 ? 'grab' : 'default' }}>
                    <button
                        className={`btn lightbox-btn position-absolute start-0 ms-3 rounded-circle d-flex align-items-center justify-content-center ${currentPage === 0 ? 'd-none' : ''}`}
                        onClick={handlePrev}
                        style={{ zIndex: 2000, width: '50px', height: '50px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <i className="fas fa-chevron-left fs-4 text-white"></i>
                    </button>

                    <div className="comic-reader-page-container d-flex align-items-center justify-content-center h-100 w-100 position-relative" style={{ overflow: 'hidden' }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage}
                                className="position-relative d-inline-block"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0, scale: scale }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ type: "tween", duration: 0.3 }}
                                drag={scale > 1}
                                dragConstraints={constraintsRef}
                                onDragStart={() => setIsDragging(true)}
                                onDragEnd={() => setTimeout(() => setIsDragging(false), 150)}
                                onDoubleClick={toggleZoom}
                            >
                                <img
                                    src={comic.pages?.[currentPage]}
                                    alt={`Página ${currentPage + 1}`}
                                    className="img-fluid"
                                    style={{ maxHeight: '85vh', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
                                />

                                {/* Animated Dialogues Overlay */}
                                {comic.dialogues && comic.dialogues[currentPage] && comic.dialogues[currentPage].map((dialogue, idx) => (
                                    <motion.div
                                        key={`dialogue-${currentPage}-${idx}`}
                                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: dialogue.delay || 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                                        className={`comic-dialogue-bubble ${dialogue.type || 'speech'}`}
                                        style={{
                                            position: 'absolute',
                                            left: dialogue.x,
                                            top: dialogue.y,
                                            zIndex: 10,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {dialogue.text}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        className={`btn lightbox-btn position-absolute end-0 me-3 rounded-circle d-flex align-items-center justify-content-center ${currentPage === totalPages - 1 ? 'd-none' : ''}`}
                        onClick={handleNext}
                        style={{ zIndex: 2000, width: '50px', height: '50px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <i className="fas fa-chevron-right fs-4 text-white"></i>
                    </button>
                </div>

                {/* Thumbnails */}
                <div className="comic-reader-thumbnails bg-black p-2 d-flex gap-2 overflow-auto" style={{ borderTop: '1px solid #333' }}>
                    {comic.pages?.map((page, i) => (
                        <button
                            key={i}
                            className={`comic-reader-thumb p-0 overflow-hidden rounded ${i === currentPage ? 'border border-danger border-2' : 'border border-secondary'}`}
                            onClick={() => { setScale(1); setCurrentPage(i) }}
                            style={{ minWidth: '60px', height: '80px', opacity: i === currentPage ? 1 : 0.5, transition: 'all 0.2s' }}
                        >
                            <img src={page} alt={`Página ${i + 1}`} className="w-100 h-100 object-fit-cover" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ---- Main Comics Page ---- */
const ComicsPage = () => {
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [readingComic, setReadingComic] = useState(null);
    const { user, setIsAuthOpen } = useContext(AuthContext);
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const [dbComics, setDbComics] = useState([]);

    // Fetch Comics from Supabase (only if configured)
    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const fetchData = async () => {
            try {
                // Fetch Comics
                const { data: comics, error: comicsError } = await supabase.from('comics').select('*');
                if (comicsError) {
                    console.error('Error fetching comics:', comicsError);
                } else if (comics && comics.length > 0) {
                    setDbComics(comics);
                }
            } catch (err) {
                console.error('Error connecting to Supabase:', err);
            }

            // Refresh AOS after data loads
            setTimeout(() => { AOS.refresh(); }, 500);
        };

        fetchData();
    }, []);

    // Seed missing comics to Supabase (matches your table: id, title, issue_number, description, cover_url)
    useEffect(() => {
        if (!isSupabaseConfigured) return;

        const seedComics = async () => {
            try {
                // Get IDs already in the database
                const { data: existing, error } = await supabase.from('comics').select('id');
                if (error) { console.error('Error checking comics:', error); return; }

                const existingIds = new Set((existing || []).map(c => c.id));

                // Only insert comics that don't already exist
                const missing = comicsData
                    .filter(c => !existingIds.has(c.id))
                    .map(({ id, title, issue, series, creators }) => ({
                        id,
                        title,
                        issue_number: issue,
                        description: `${series} — por ${(creators || []).join(', ')}`
                    }));

                if (missing.length > 0) {
                    const { error: insertError } = await supabase.from('comics').insert(missing);
                    if (insertError) console.error('Error seeding comics:', insertError);
                    else console.log(`✅ ${missing.length} cómics agregados a Supabase`);
                }
            } catch (err) {
                console.error('Error seeding comics:', err);
            }
        };
        seedComics();
    }, []);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        window.scrollTo(0, 0);
    }, []);

    const handleToggleFavorite = useCallback((e, comicId) => {
        e.stopPropagation();
        if (!user) {
            setIsAuthOpen(true);
            return;
        }
        toggleFavorite(comicId);
    }, [user, toggleFavorite, setIsAuthOpen]);

    // Always use local comicsData — it has the actual image imports
    // dbComics from Supabase won't have working image references
    const displayData = comicsData;

    let results = filter === 'favorites'
        ? displayData.filter(c => favorites.includes(c.id))
        : filter === 'all'
            ? displayData
            : displayData.filter(c => (c.category || '').toLowerCase() === filter.toLowerCase());

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        results = results.filter(c =>
            (c.title || '').toLowerCase().includes(q) ||
            (c.series || '').toLowerCase().includes(q) ||
            (c.creators || []).some(cr => (cr || '').toLowerCase().includes(q))
        );
    }

    // Sort
    const sorted = [...results].sort((a, b) => {
        if (sortOrder === 'newest') return Number(b.id) - Number(a.id);
        if (sortOrder === 'oldest') return Number(a.id) - Number(b.id);
        if (sortOrder === 'az') return (a.title || '').localeCompare(b.title || '');
        return (b.title || '').localeCompare(a.title || '');
    });

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
    const safePage = Math.min(currentPage, totalPages);
    const startIdx = (safePage - 1) * ITEMS_PER_PAGE;
    const pageItems = sorted.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchQuery, sortOrder]);

    const goToPage = (page) => {
        setCurrentPage(page);
        const grid = document.querySelector('.comics-grid-section');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="comics-page">
            {/* Hero Banner */}
            <section className="comics-hero" style={{
                backgroundImage: `url(${heroBannerImg})`
            }}>
                <div className="comics-hero-overlay"></div>
                <div className="container position-relative" style={{ zIndex: 2 }}>
                    <Link to="/" className="comics-back-link" data-aos="fade-right">
                        <i className="fas fa-arrow-left me-2"></i> Volver al Inicio
                    </Link>
                    <h1 className="comics-hero-title brutalist-text" data-aos="fade-up">
                        SPIDER-MAN: CÓMICS
                    </h1>
                    <p className="comics-hero-subtitle" data-aos="fade-up" data-aos-delay="100">
                        Explora la colección completa de cómics del universo de Spider-Man
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="comics-filters-section">
                <div className="container">
                    <div className="comics-filters-bar" data-aos="fade-up">
                        <div className="comics-controls-row">
                            <div className="comics-search-wrapper">
                                <i className="fas fa-search comics-search-icon"></i>
                                <input
                                    type="text"
                                    className="comics-search-input"
                                    placeholder="Buscar cómic, serie o autor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="comics-search-clear"
                                        onClick={() => setSearchQuery('')}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>

                            <button
                                className="comics-sort-btn me-2"
                                onClick={() => {
                                    const orders = ['newest', 'oldest', 'az', 'za'];
                                    const idx = orders.indexOf(sortOrder);
                                    setSortOrder(orders[(idx + 1) % orders.length]);
                                }}
                            >
                                <i className="fas fa-sort-amount-down me-2"></i>
                                {sortOrder === 'newest' ? 'Recientes' :
                                    sortOrder === 'oldest' ? 'Antiguos' :
                                        sortOrder === 'az' ? 'A → Z' : 'Z → A'}
                            </button>

                            <button 
                                className="comics-sort-btn surprise-btn"
                                onClick={() => {
                                    if (sorted.length > 0) {
                                        const randomIdx = Math.floor(Math.random() * sorted.length);
                                        setReadingComic(sorted[randomIdx]);
                                    }
                                }}
                                title="¡Sorpréndeme! (Cómic Aleatorio)"
                            >
                                <i className="fas fa-magic me-2 text-warning"></i>
                                Aleatorio
                            </button>

                            <div className="comics-results-count">
                                <span className="results-number">{sorted.length}</span>
                                <span className="results-label"> cómics</span>
                            </div>
                        </div>

                        <div className="comics-category-tabs">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setFilter(cat.key)}
                                    className={`comics-tab ${filter === cat.key ? 'active' : ''} ${cat.key === 'favorites' ? 'fav-tab' : ''}`}
                                >
                                    <i className={`fas ${cat.icon} tab-icon`}></i>
                                    <span className="tab-label">{cat.label}</span>
                                    {cat.key === 'favorites' && favorites.length > 0 && (
                                        <span className="tab-badge">{favorites.length}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Comics Grid */}
            <section className="comics-grid-section">
                <div className="container">
                    <div className="comics-grid">
                        {pageItems.map((comic, index) => (
                            <article
                                className="comic-card"
                                key={comic.id}
                                data-aos="fade-up"
                                data-aos-delay={index * 60}
                                onClick={() => setReadingComic(comic)}
                            >
                                <div className="comic-card-image">
                                    <img
                                        src={comic.image}
                                        alt={comic.title || 'Cómic'}
                                        loading="lazy"
                                    />
                                    {comic.badge && (
                                        <span className={`comic-badge ${comic.badge === 'EXCLUSIVO' ? 'exclusive' : 'new'}`}>
                                            {comic.badge}
                                        </span>
                                    )}

                                    <button
                                        className={`comic-fav-btn ${isFavorite(comic.id) ? 'active' : ''}`}
                                        onClick={(e) => handleToggleFavorite(e, comic.id)}
                                        aria-label={isFavorite(comic.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                        title={isFavorite(comic.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    >
                                        <i className={`${isFavorite(comic.id) ? 'fas' : 'far'} fa-heart`}></i>
                                    </button>

                                    <div className="comic-card-overlay">
                                        <button className="comic-detail-btn">
                                            <i className="fas fa-book-reader me-2"></i>LEER
                                        </button>
                                    </div>
                                </div>
                                <div className="comic-card-info">
                                    <h3 className="comic-card-title" style={{ fontSize: '1rem', fontWeight: '900' }}>
                                        {comic.series || comic.title || 'Cómic'} {comic.issue || ''}
                                    </h3>
                                    <div className="comic-card-creators">
                                        {comic.creators?.map((creator, i) => (
                                            <span key={i} className="comic-creator">
                                                {creator}{i < comic.creators.length - 1 ? ', ' : ''}
                                            </span>
                                        )) || <span className="comic-creator">Varios Autores</span>}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className="comics-pagination" data-aos="fade-up">
                            <button
                                className="page-btn page-arrow"
                                onClick={() => goToPage(safePage - 1)}
                                disabled={safePage === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    className={`page-btn page-number ${page === safePage ? 'active' : ''}`}
                                    onClick={() => goToPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="page-btn page-arrow"
                                onClick={() => goToPage(safePage + 1)}
                                disabled={safePage === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>

                            <span className="page-info">
                                Página {safePage} de {totalPages}
                            </span>
                        </nav>
                    )}

                    {/* Empty State */}
                    {sorted.length === 0 && (
                        <div className="comics-empty" data-aos="fade-up">
                            <i className="fas fa-spider fa-3x mb-3"></i>
                            <h3>
                                {filter === 'favorites'
                                    ? 'No tienes cómics favoritos aún'
                                    : 'No se encontraron cómics'}
                            </h3>
                            <p>
                                {filter === 'favorites'
                                    ? 'Haz clic en el ❤️ de un cómic para agregarlo a tus favoritos'
                                    : searchQuery
                                        ? 'Intenta con otro término de búsqueda'
                                        : 'Intenta con otra categoría'}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Comic Reader Modal */}
            {readingComic && (
                <ComicReader
                    comic={readingComic}
                    onClose={() => setReadingComic(null)}
                />
            )}
        </div>
    );
};

export default ComicsPage;
