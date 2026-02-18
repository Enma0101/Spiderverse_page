import React, { useState } from 'react';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    // The overlay class in auth-modal.css is .auth-modal-overlay
    // It usually has display: none; and becomes display: flex; with .active
    // In React, we conditionally render, so we can just use the class or force display.
    // actually auth-modal.css might have:
    // .auth-modal-overlay.active { display: flex; ... }
    // Since we render based on isOpen, we can just add 'active' class always if rendered, 
    // OR just render the div with correct classes.

    return (
        <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className="auth-card neomorph-card">
                <button className="close-modal" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <h2 className="text-center mb-4 brutalist-text">
                    {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
                </h2>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    {!isLogin && (
                        <div className="input-group neomorph-input-group mb-3">
                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                            <input type="text" className="form-control" placeholder="Nombre de Usuario" required />
                        </div>
                    )}

                    <div className="input-group neomorph-input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                        <input type="email" className="form-control" placeholder="Correo Electrónico" required />
                    </div>

                    <div className="input-group neomorph-input-group mb-4">
                        <span className="input-group-text"><i className="fas fa-lock"></i></span>
                        <input type="password" className="form-control" placeholder="Contraseña" required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 neomorph-btn">
                        {isLogin ? 'INGRESAR' : 'REGISTRARSE'}
                    </button>
                </form>

                <div className="auth-separator my-4">
                    <span>O continúa con</span>
                </div>

                <button className="btn btn-google w-100 mb-4 neomorph-btn">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" className="me-2" />
                    Google
                </button>

                <p className="text-center mb-0">
                    {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                    <a
                        href="#"
                        className="text-gradient fw-bold text-decoration-none"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLogin(!isLogin);
                        }}
                    >
                        {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                    </a>
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
