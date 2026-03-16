import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import './styles/AuthModal.css';

const LogoutModal = ({ isOpen, onClose }) => {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
        window.location.reload(); // <--- Fuerza carga limpia del estado
    };

    return (
        <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="auth-card logout-card" style={{ maxWidth: 'min(90%, 400px)' }} onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="card-cut"></div>

                <div className="avatar-container">
                    <div className="avatar-circle">
                        <i className="fas fa-spider"></i>
                    </div>
                </div>

                <div className="text-center mb-4 position-relative" style={{ zIndex: 10 }}>
                    <h4 className="auth-title">
                        ¿Cerrar sesión?
                    </h4>

                    <p className="auth-footer-text" style={{ fontSize: '0.95rem', opacity: 0.9 }}>
                        ¿Estás seguro de que quieres salir de tu cuenta?
                    </p>
                </div>

                <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3">
                    <button
                        className="btn-premium primary flex-fill"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn-premium primary flex-fill"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                            <i className="fas fa-sign-out-alt me-2"></i>
                        )}
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
