import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

const LogoutModal = ({ isOpen, onClose }) => {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleLogout = async () => {
        setLoading(true);
        await signOut();
        setLoading(false);
        onClose();
    };

    return (
        <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="auth-card logout-card" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>

                <div className="text-center mb-4">
                    <i className="fas fa-spider" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '1rem', display: 'block' }}></i>
                    <h4 className="brutalist-text" style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        ¿Cerrar sesión?
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                        ¿Estás seguro de que quieres salir de tu cuenta?
                    </p>
                </div>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-light btn-sm neomorph flex-fill"
                        onClick={onClose}
                        style={{ padding: '0.6rem' }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn-danger btn-sm neomorph flex-fill"
                        onClick={handleLogout}
                        disabled={loading}
                        style={{ padding: '0.6rem' }}
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
