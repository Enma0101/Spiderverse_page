import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onOpenAuth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    // Sync theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    // Scroll Spy Logic (only on homepage)
    useEffect(() => {
        if (!isHomePage) return;

        const handleScroll = () => {
            const sections = ['home', 'games', '3d-suits', 'features', 'gallery'];

            // Find the current section
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if section is somewhat in the middle of viewport or top
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call once on mount to set initial active section
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const navLinks = [
        { name: 'Inicio', href: '#home' },
        { name: 'Trilogía', href: '#games' },
        { name: 'Juegos', href: '#3d-suits' },
        { name: 'Características', href: '#features' },
        { name: 'Galería', href: '#gallery' },
        { name: 'Cómics', href: '/comics', isRoute: true },
    ];

    return (
        <header className="header-nav" role="banner">
            <nav className={`navbar navbar-expand-lg navbar-dark`} aria-label="Main navigation">
                <div className="container-fluid px-4">
                    <Link className="navbar-brand brutalist-text" to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-spider" style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}></i>
                        <span>COMICS SPIDER</span>
                    </Link>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                        style={{ zIndex: 10001 }}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            {navLinks.map((link) => {
                                // For route-based links (Comics page)
                                if (link.isRoute) {
                                    const isActive = location.pathname === link.href;
                                    return (
                                        <li className="nav-item" key={link.name}>
                                            <Link
                                                className={`nav-link ${isActive ? 'active' : ''}`}
                                                to={link.href}
                                                onClick={() => setIsOpen(false)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    );
                                }

                                // For hash links on homepage
                                const isActive = isHomePage && link.href === `#${activeSection}`;

                                return (
                                    <li className="nav-item" key={link.name}>
                                        {isHomePage ? (
                                            <a
                                                className={`nav-link ${isActive ? 'active' : ''}`}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {link.name}
                                            </a>
                                        ) : (
                                            <Link
                                                className="nav-link"
                                                to={`/${link.href}`}
                                                onClick={() => setIsOpen(false)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}

                            <li className="nav-item ms-3">
                                <button
                                    id="authBtn"
                                    className="btn btn-outline-light btn-sm neomorph px-3"
                                    onClick={() => {
                                        onOpenAuth();
                                        setIsOpen(false);
                                    }}
                                >
                                    <i className="fas fa-user me-2"></i>Acceder
                                </button>
                            </li>

                            <li className="nav-item ms-2">
                                <button
                                    id="themeToggle"
                                    className={`spider-switch ${theme}`}
                                    onClick={toggleTheme}
                                    aria-label="Cambiar tema"
                                    title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
                                >
                                    <span className="icon sun"><i className="fas fa-sun"></i></span>
                                    <span className="icon moon"><i className="fas fa-moon"></i></span>
                                    <div className="spider-knob">
                                        <i className="fas fa-spider"></i>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
