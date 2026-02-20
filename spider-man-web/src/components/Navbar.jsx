import React, { useState, useEffect } from 'react';

const Navbar = ({ onOpenAuth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [activeSection, setActiveSection] = useState('home');

    // Sync theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, []);

    // Scroll Spy Logic
    useEffect(() => {
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
    }, []);

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
        { name: 'Cómics', href: 'https://www.marvel.com/comics/characters/1009610/spider-man-peter-parker', external: true },
    ];

    return (
        <header className="header-nav" role="banner">
            {/* 
         Standard Bootstrap 5 navbar structure 
         navbar-dark makes text white (if strictly followed by BS CSS)
         navbar-expand-xl means it collapses below XL screens (1200px)
         If user screen is small, they see burger menu. 
         If standard monitor (1920x1080), they should see links.
         We add d-flex to ensure branding is visible.
      */}
            <nav className={`navbar navbar-expand-lg navbar-dark`} aria-label="Main navigation">
                <div className="container-fluid px-4">
                    <a className="navbar-brand brutalist-text" href="#home" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-spider" style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}></i>
                        <span>COMICS SPIDER</span>
                    </a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-expanded={isOpen}
                        aria-label="Toggle navigation"
                        style={{ zIndex: 10001 }} // Force clickable
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* 
                Manually handle 'show' class for React state collapse mechanism 
                Instead of relying on bootstrap.js
            */}
                    <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ms-auto align-items-center">
                            {navLinks.map((link) => {
                                const isActive = !link.external && link.href === `#${activeSection}`;
                                return (
                                    <li className="nav-item" key={link.name}>
                                        <a
                                            className={`nav-link ${isActive ? 'active' : ''}`}
                                            href={link.href}
                                            target={link.external ? "_blank" : "_self"}
                                            onClick={() => setIsOpen(false)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {link.name}
                                        </a>
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
