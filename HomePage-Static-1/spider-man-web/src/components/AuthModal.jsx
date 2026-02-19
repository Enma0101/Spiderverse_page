import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, signUp, signInWithGoogle } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = isLogin
                ? await signIn(email, password)
                : await signUp(email, password);

            if (error) throw error;

            // If success, close modal
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

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
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo Electrónico"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group neomorph-input-group mb-4">
                        <span className="input-group-text"><i className="fas fa-lock"></i></span>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Contraseña"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 neomorph-btn" disabled={loading}>
                        {loading ? 'Procesando...' : (isLogin ? 'INGRESAR' : 'REGISTRARSE')}
                    </button>
                </form>

                <div className="auth-separator my-4">
                    <span>O continúa con</span>
                </div>

                <button
                    className="btn btn-google w-100 mb-4 neomorph-btn"
                    onClick={handleGoogleLogin}
                >
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
                            setError('');
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
