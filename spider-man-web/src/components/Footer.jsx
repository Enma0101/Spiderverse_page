import React from 'react';

const Footer = () => {
    return (
        <footer className="footer py-5">
            <div className="container">
                <div className="row g-4">
                    {/* Col 1: Brand & Social */}
                    <div className="col-lg-4">
                        <a href="#" className="text-decoration-none text-white d-inline-block mb-3">
                            <h3 className="brutalist-text mb-0">
                                <i className="fas fa-spider me-2" aria-hidden="true"></i>
                                COMICS SPIDER
                            </h3>
                        </a>
                        <p className="text-secondary mb-4">
                            Sumérgete en el universo de Marvel's Spider-Man.
                            Disponible exclusivamente en PlayStation.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link neomorph" aria-label="Twitter">
                                <i className="fab fa-twitter" aria-hidden="true"></i>
                            </a>
                            <a href="#" className="social-link neomorph" aria-label="Facebook">
                                <i className="fab fa-facebook" aria-hidden="true"></i>
                            </a>
                            <a href="#" className="social-link neomorph" aria-label="Instagram">
                                <i className="fab fa-instagram" aria-hidden="true"></i>
                            </a>
                            <a href="#" className="social-link neomorph" aria-label="YouTube">
                                <i class="fab fa-youtube" aria-hidden="true"></i>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: Navigation Links */}
                    <div className="col-lg-4">
                        <h4 className="brutalist-text mb-3">Explorar</h4>
                        <ul className="list-unstyled footer-links">
                            <li><a href="#">Inicio</a></li>
                            <li><a href="#games">Trilogía</a></li>
                            <li><a href="#3d-suits">Juegos de Consola</a></li>
                            <li><a href="#features">Características</a></li>
                            <li><a href="#gallery">Galería</a></li>
                        </ul>
                    </div>

                    {/* Col 3: PlayStation Info */}
                    <div className="col-lg-4">
                        <h4 className="brutalist-text mb-3">PlayStation</h4>
                        <p className="small text-secondary mb-3">
                            Exclusivo de PlayStation. Experimenta el poder de PS5 con
                            gráficos de nueva generación y tiempos de carga ultra rápidos.
                        </p>
                        <div className="platform-badges">
                            <span className="badge neomorph me-2">
                                <i className="fab fa-playstation" aria-hidden="true"></i> PS4
                            </span>
                            <span className="badge neomorph">
                                <i className="fab fa-playstation" aria-hidden="true"></i> PS5
                            </span>
                        </div>
                    </div>
                </div>

                <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start">
                        <p className="mb-0 text-secondary small">
                            © 2024 Comics Spider. Todos los derechos reservados.
                            Marvel, Spider-Man y todos los personajes relacionados son marcas registradas de Marvel Characters, Inc.
                        </p>
                    </div>
                    <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                        <a href="#" className="text-secondary small text-decoration-none me-3">Política de Privacidad</a>
                        <a href="#" className="text-secondary small text-decoration-none">Términos de Uso</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
