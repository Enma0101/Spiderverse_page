import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
        image: "/spider-man-ps4-game-cover-peter-parker-classic-sui.webp",
        pages: [
            "/spider-man-ps4-game-cover-peter-parker-classic-sui.webp",
            "/spider-man-ps4-game-swinging-through-city.webp",
            "/spider-man-combat-fighting-enemies-acrobatic.webp",
            "/spider-man-swinging-between-buildings-manhattan-sk.webp",
        ]
    },
    {
        id: 2,
        title: "Miles Morales: Spider-Man",
        issue: "#42",
        series: "Miles Morales: Spider-Man (2022)",
        creators: ["Christopher Condon", "Stefano Caselli"],
        category: "miles",
        badge: null,
        image: "/miles-morales-electric-venom-powers-glowing.webp",
        pages: [
            "/miles-morales-electric-venom-powers-glowing.webp",
            "/miles-morales-spider-man-game-electric-powers.webp",
            "/miles-morales-spider-man-ps5-game-bioelectric-powe.webp",
            "/spider-man-swinging-through-new-york-city-skyline-.webp",
        ]
    },
    {
        id: 3,
        title: "Symbiote Spider-Man",
        issue: "#3",
        series: "Symbie Infinity Comic (2026)",
        creators: ["Jacob Chabot"],
        category: "symbiote",
        badge: "EXCLUSIVO",
        image: "/spider-man-black-symbiote-suit-venom-dark.webp",
        pages: [
            "/spider-man-black-symbiote-suit-venom-dark.webp",
            "/spider-man-2-ps5-peter-parker-miles-morales-venom-.webp",
            "/spider-man-villains-confrontation-epic-battle.webp",
            "/spider-man-combat-fighting-enemies-acrobatic.webp",
        ]
    },
    {
        id: 4,
        title: "Amazing Spider-Man: Torn",
        issue: "#5",
        series: "Amazing Spider-Man: Torn (2025)",
        creators: ["J. Michael Straczynski", "Pere Perez", "Mark Bagley"],
        category: "amazing",
        badge: null,
        image: "/spider-man-combat-fighting-enemies-acrobatic.webp",
        pages: [
            "/spider-man-combat-fighting-enemies-acrobatic.webp",
            "/spider-man-ps4-game-cover-peter-parker-classic-sui.webp",
            "/spider-man-villains-confrontation-epic-battle.webp",
            "/new-york-city-skyline-sunset-spider-man-game.webp",
        ]
    },
    {
        id: 5,
        title: "Spider-Man '94",
        issue: "#4",
        series: "Spider-Man '94 (2025)",
        creators: ["JM DeMatteis", "James Towe"],
        category: "clasicos",
        badge: null,
        image: "/spider-man-swinging-between-buildings-manhattan-sk.webp",
        pages: [
            "/spider-man-swinging-between-buildings-manhattan-sk.webp",
            "/spider-man-ps4-game-swinging-through-city.webp",
            "/new-york-city-skyline-sunset-spider-man-game.webp",
            "/spider-man-swinging-through-new-york-city-skyline-.webp",
        ]
    },
    {
        id: 6,
        title: "Symbiote Spider-Man",
        issue: "#2",
        series: "Symbie Infinity Comic (2026)",
        creators: ["Jacob Chabot"],
        category: "symbiote",
        badge: "EXCLUSIVO",
        image: "/spider-man-2-ps5-peter-parker-miles-morales-venom-.webp",
        pages: [
            "/spider-man-2-ps5-peter-parker-miles-morales-venom-.webp",
            "/spider-man-black-symbiote-suit-venom-dark.webp",
            "/spider-man-villains-confrontation-epic-battle.webp",
            "/spider-man-2-ps5-peter-and-miles-dual-heroes.webp",
        ]
    },
    {
        id: 7,
        title: "The Amazing Spider-Man",
        issue: "#21",
        series: "The Amazing Spider-Man (2025)",
        creators: ["Joe Kelly", "Todd Nauck", "John Romita Jr."],
        category: "amazing",
        badge: "NUEVO",
        image: "/spider-man-ps4-game-swinging-through-city.webp",
        pages: [
            "/spider-man-ps4-game-swinging-through-city.webp",
            "/spider-man-ps4-game-cover-peter-parker-classic-sui.webp",
            "/spider-man-swinging-between-buildings-manhattan-sk.webp",
            "/spider-man-combat-fighting-enemies-acrobatic.webp",
        ]
    },
    {
        id: 8,
        title: "Miles Morales: Ultimate",
        issue: "#8",
        series: "Miles Morales: Spider-Man (2022)",
        creators: ["Cody Ziglar", "Federico Vicentini"],
        category: "miles",
        badge: null,
        image: "/miles-morales-spider-man-game-electric-powers.webp",
        pages: [
            "/miles-morales-spider-man-game-electric-powers.webp",
            "/miles-morales-electric-venom-powers-glowing.webp",
            "/miles-morales-spider-man-ps5-game-bioelectric-powe.webp",
            "/spider-man-2-ps5-peter-and-miles-dual-heroes.webp",
        ]
    },
    {
        id: 9,
        title: "Radioactive Spider-Man",
        issue: "#3",
        series: "Radioactive Spider-Man (2025)",
        creators: ["Joe Kelly", "Kev Walker"],
        category: "clasicos",
        badge: "NUEVO",
        image: "/spider-man-villains-confrontation-epic-battle.webp",
        pages: [
            "/spider-man-villains-confrontation-epic-battle.webp",
            "/spider-man-combat-fighting-enemies-acrobatic.webp",
            "/spider-man-ps4-game-cover-peter-parker-classic-sui.webp",
            "/new-york-city-skyline-sunset-spider-man-game.webp",
        ]
    },
    {
        id: 10,
        title: "Battleworld: Spider-Verse",
        issue: "#5",
        series: "Battleworld (2025)",
        creators: ["Christos Gage", "Marcus To", "Leinil Francis Yu"],
        category: "amazing",
        badge: null,
        image: "/spider-man-swinging-through-new-york-city-skyline-.webp",
        pages: [
            "/spider-man-swinging-through-new-york-city-skyline-.webp",
            "/spider-man-swinging-between-buildings-manhattan-sk.webp",
            "/spider-man-ps4-game-swinging-through-city.webp",
            "/spider-man-2-ps5-peter-and-miles-dual-heroes.webp",
        ]
    },
    {
        id: 11,
        title: "Venom: Symbiote Rage",
        issue: "#1",
        series: "Symbie Infinity Comic (2026)",
        creators: ["Jacob Chabot"],
        category: "symbiote",
        badge: "EXCLUSIVO",
        image: "/miles-morales-spider-man-ps5-game-bioelectric-powe.webp",
        pages: [
            "/miles-morales-spider-man-ps5-game-bioelectric-powe.webp",
            "/spider-man-black-symbiote-suit-venom-dark.webp",
            "/spider-man-2-ps5-peter-parker-miles-morales-venom-.webp",
            "/spider-man-villains-confrontation-epic-battle.webp",
        ]
    },
    {
        id: 12,
        title: "Spider-Man 2099",
        issue: "#12",
        series: "Spider-Man 2099 (2024)",
        creators: ["Steve Orlando", "David Wachter"],
        category: "clasicos",
        badge: null,
        image: "/new-york-city-skyline-sunset-spider-man-game.webp",
        pages: [
            "/new-york-city-skyline-sunset-spider-man-game.webp",
            "/spider-man-swinging-through-new-york-city-skyline-.webp",
            "/spider-man-ps4-game-swinging-through-city.webp",
            "/spider-man-swinging-between-buildings-manhattan-sk.webp",
        ]
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

/* ---- Comic Reader Modal ---- */
const ComicReader = ({ comic, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = comic.pages.length;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                setCurrentPage(p => Math.min(p + 1, totalPages - 1));
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setCurrentPage(p => Math.max(p - 1, 0));
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [totalPages, onClose]);

    const progress = ((currentPage + 1) / totalPages) * 100;

    return (
        <div className="comic-reader-overlay" onClick={onClose}>
            <div className="comic-reader" onClick={(e) => e.stopPropagation()}>
                <div className="comic-reader-header">
                    <div className="comic-reader-title">
                        <i className="fas fa-book-open me-2"></i>
                        <span>{comic.series} {comic.issue}</span>
                    </div>
                    <div className="comic-reader-page-info">
                        Página {currentPage + 1} de {totalPages}
                    </div>
                    <button className="comic-reader-close" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="comic-reader-progress">
                    <div className="comic-reader-progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="comic-reader-viewport">
                    <button
                        className={`comic-reader-nav prev ${currentPage === 0 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className="comic-reader-page-container">
                        <img
                            src={comic.pages[currentPage]}
                            alt={`${comic.title} - Página ${currentPage + 1}`}
                            className="comic-reader-page"
                            key={currentPage}
                        />
                    </div>

                    <button
                        className={`comic-reader-nav next ${currentPage === totalPages - 1 ? 'disabled' : ''}`}
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
                        disabled={currentPage === totalPages - 1}
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div className="comic-reader-thumbnails">
                    {comic.pages.map((page, i) => (
                        <button
                            key={i}
                            className={`comic-reader-thumb ${i === currentPage ? 'active' : ''}`}
                            onClick={() => setCurrentPage(i)}
                        >
                            <img src={page} alt={`Página ${i + 1}`} />
                        </button>
                    ))}
                </div>

                <div className="comic-reader-hint">
                    <span><i className="fas fa-keyboard me-1"></i> Usa ← → o Espacio para navegar · Esc para cerrar</span>
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
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('comic-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        localStorage.setItem('comic-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = useCallback((e, comicId) => {
        e.stopPropagation();
        setFavorites(prev =>
            prev.includes(comicId)
                ? prev.filter(id => id !== comicId)
                : [...prev, comicId]
        );
    }, []);

    const isFavorite = (comicId) => favorites.includes(comicId);

    // Filter pipeline
    let results = filter === 'favorites'
        ? comicsData.filter(c => favorites.includes(c.id))
        : filter === 'all'
            ? comicsData
            : comicsData.filter(c => c.category === filter);

    if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        results = results.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.series.toLowerCase().includes(q) ||
            c.creators.some(cr => cr.toLowerCase().includes(q))
        );
    }

    // Sort
    const sorted = [...results].sort((a, b) => {
        if (sortOrder === 'newest') return b.id - a.id;
        if (sortOrder === 'oldest') return a.id - b.id;
        if (sortOrder === 'az') return a.title.localeCompare(b.title);
        return b.title.localeCompare(a.title);
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
        // Scroll to grid
        const grid = document.querySelector('.comics-grid-section');
        if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="comics-page">
            {/* Hero Banner */}
            <section className="comics-hero">
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
                                className="comics-sort-btn"
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
                                        alt={comic.title}
                                        loading="lazy"
                                    />
                                    {comic.badge && (
                                        <span className={`comic-badge ${comic.badge === 'EXCLUSIVO' ? 'exclusive' : 'new'}`}>
                                            {comic.badge}
                                        </span>
                                    )}

                                    <button
                                        className={`comic-fav-btn ${isFavorite(comic.id) ? 'active' : ''}`}
                                        onClick={(e) => toggleFavorite(e, comic.id)}
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
                                    <h3 className="comic-card-title">
                                        {comic.series} {comic.issue}
                                    </h3>
                                    <div className="comic-card-creators">
                                        {comic.creators.map((creator, i) => (
                                            <span key={i} className="comic-creator">
                                                {creator}{i < comic.creators.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
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
