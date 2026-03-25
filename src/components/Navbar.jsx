import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LogoutModal from './LogoutModal';

const Navbar = ({ onOpenAuth }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [activeSection, setActiveSection] = useState('home');
    const [showLogout, setShowLogout] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isHomePage = location.pathname === '/';

    // Sync theme
    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll Spy Logic (Only on Home Page)
    useEffect(() => {
        if (location.pathname !== '/') {
            setActiveSection('');
            return;
        }

        const sections = ['home', 'games', '3d-suits', 'features', 'gallery'];

        // Absolute offset from document top (handles nested elements)
        const getTop = (el) => {
            let top = 0;
            while (el) {
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return top;
        };

        const handleScroll = () => {
            const scrollPos = window.scrollY + 250;
            let current = sections[0];

            for (const id of sections) {
                const el = document.getElementById(id);
                if (el && getTop(el) <= scrollPos) {
                    current = id;
                }
            }

            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleNavClick = (href, isRoute) => {
        setIsOpen(false);
        if (isRoute) { // This now covers external links and internal routes
            if (href.startsWith('http')) { // Assuming external links start with http
                window.open(href, '_blank');
            } else {
                navigate(href);
            }
        } else if (href.startsWith('#')) {
            // Internal Hash Link
            if (location.pathname !== '/') {
                navigate('/');
                setTimeout(() => {
                    const element = document.getElementById(href.substring(1));
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                const element = document.getElementById(href.substring(1));
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Fallback for route link if not explicitly marked as isRoute
            navigate(href);
        }
    };

    const navLinks = [
        { name: 'Inicio', href: '#home' },
        { name: 'Trilogía', href: '#games' },
        { name: 'Juegos', href: '#3d-suits' },
        { name: 'Características', href: '#features' },
        { name: 'Galería', href: '#gallery' },
        { name: 'Spider-Verse', href: '/universe', isRoute: true },
        { name: 'Cómics', href: '/comics', isRoute: true },
    ];

    return (
        <>
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
                        <Link className="navbar-brand brutalist-text" to="/" onClick={(e) => {
                            if (isHomePage) { e.preventDefault(); handleNavClick('#home'); }
                        }} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <i className="fas fa-spider" style={{ fontSize: '1.5rem', color: 'var(--accent-primary)' }}></i>
                            <span>COMICS SPIDER</span>
                        </Link>

                        <button
                            className={`navbar-toggler custom-toggler ${isOpen ? 'active' : ''}`}
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                            aria-label="Toggle navigation"
                            style={{ zIndex: 10001, border: 'none', background: 'transparent', outline: 'none' }}
                        >
                            <div className="hamburger-box">
                                <span className="hamburger-inner"></span>
                                <span className="hamburger-inner"></span>
                                <span className="hamburger-inner"></span>
                            </div>
                        </button>

                        {/*
                Manually handle 'show' class for React state collapse mechanism
                Instead of relying on bootstrap.js
            */}
                        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
                            <ul className="navbar-nav ms-auto align-items-center">
                                {navLinks.map((link, index) => {
                                    let isActive = false;
                                    if (link.href.startsWith('#')) {
                                        isActive = isHomePage && link.href === `#${activeSection}`;
                                    } else {
                                        isActive = location.pathname === link.href;
                                    }

                                    return (
                                        <li className="nav-item" key={link.name} style={{ '--i': index }}>
                                            <a
                                                className={`nav-link ${isActive ? 'active' : ''}`}
                                                href={link.href}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleNavClick(link.href, link.isRoute);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {link.name}
                                            </a>
                                        </li>
                                    );
                                })}

                                {/* Separador visual */}
                                <li className="nav-item d-none d-lg-block" style={{ margin: '0 12px' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>|</span>
                                </li>

                                {/* Toggle de tema */}
                                <li className="nav-item" style={{ '--i': navLinks.length }}>
                                    <button
                                        id="themeToggle"
                                        className={`spider-switch ${theme}`}
                                        onClick={toggleTheme}
                                    >
                                        <span className="icon sun"><i className="fas fa-sun"></i></span>
                                        <span className="icon moon"><i className="fas fa-moon"></i></span>
                                        <div className="spider-knob">
                                            <i className="fas fa-spider"></i>
                                        </div>
                                    </button>
                                </li>

                                {/* Botón de Auth / Usuario */}
                                <li className="nav-item auth-nav-item" style={{ marginLeft: '16px', '--i': navLinks.length + 1 }}>
                                    {user ? (
                                        <div className="d-flex align-items-center gap-2">
                                            <div className="d-flex align-items-center gap-2" style={{ padding: '4px 12px', borderRadius: '20px', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                                                <i className="fas fa-user-circle" style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}></i>
                                                <span className="small fw-bold">
                                                    {(user.user_metadata?.full_name || user.email?.split('@')[0] || '').split(' ')[0]}
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-outline-danger btn-sm neomorph px-2"
                                                onClick={() => {
                                                    setShowLogout(true);
                                                    setIsOpen(false);
                                                }}
                                                title="Cerrar Sesión"
                                                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <i className="fas fa-sign-out-alt" style={{ fontSize: '0.8rem' }}></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            id="authBtn"
                                            className="btn btn-outline-light btn-sm neomorph px-3"
                                            onClick={() => {
                                                onOpenAuth();
                                                setIsOpen(false);
                                            }}
                                            style={{ height: '32px', display: 'flex', alignItems: 'center' }}
                                        >
                                            <i className="fas fa-user me-2"></i>Acceder
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
            <LogoutModal isOpen={showLogout} onClose={() => setShowLogout(false)} />
        </>
    );
};

export default Navbar;
