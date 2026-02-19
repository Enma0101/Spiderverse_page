import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const { signIn, signUp, signInWithGoogle } = useAuth();

    if (!isOpen) return null;

    // Limpiar todos los campos del formulario
    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccessMsg('');
        setIsLogin(true);
    };

    // Cerrar modal y limpiar datos
    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getErrorMessage = (error) => {
        const message = error.message.toLowerCase();

        // Supabase / GoTrue Errors
        if (message.includes('already registered')) return 'Este correo ya está registrado.';
        if (message.includes('invalid login credentials')) return 'Credenciales inválidas.';
        if (message.includes('invalid_grant')) return 'Credenciales inválidas o correo no confirmado.';
        if (message.includes('user not found')) return 'Usuario no encontrado.';

        // Validation Errors
        if (message.includes('missing email') || message.includes('must provide an email')) return 'El correo es obligatorio.';
        if (message.includes('missing password') || message.includes('password should be')) return 'La contraseña es obligatoria (mínimo 6 caracteres).';
        if (message.includes('password is too short')) return 'La contraseña debe tener al menos 6 caracteres.';
        if (message.includes('weak password')) return 'La contraseña es muy débil.';

        // Rate Limits
        if (message.includes('rate limit')) return 'Demasiados intentos. Por favor espera unos minutos.';

        // Network / Unknown
        if (message.includes('network request failed')) return 'Error de conexión. Revisa tu internet.';

        // Fallback
        console.warn('Unhandled Auth Error:', message);
        return 'Ocurrió un error inesperado. Intenta de nuevo.';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        // Validación manual
        if (!email) {
            setError('El correo es obligatorio.');
            return;
        }
        if (!password) {
            setError('La contraseña es obligatoria.');
            return;
        }
        if (!isLogin) {
            if (!username) {
                setError('El nombre de usuario es obligatorio.');
                return;
            }
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                return;
            }
        }

        setLoading(true);

        try {
            const { error: authError } = isLogin
                ? await signIn(email, password)
                : await signUp(email, password, { full_name: username });

            if (authError) throw authError;

            // Éxito
            if (!isLogin) {
                setSuccessMsg('¡Registro exitoso! Iniciando sesión...');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                handleClose();
            }
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setSuccessMsg('');
            const { error } = await signInWithGoogle();
            if (error) throw error;
        } catch (err) {
            console.error(err);
            const msg = err.message?.toLowerCase() || '';
            if (msg.includes('provider') || msg.includes('not enabled')) {
                setError('Google no está habilitado. Actívalo en tu panel de Supabase (Authentication → Providers → Google).');
            } else {
                setError('Error al iniciar con Google. Intenta de nuevo.');
            }
        }
    };

    return (
        <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className="auth-card neomorph-card">
                <button className="close-modal" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                </button>

                <h2 className="text-center mb-4 brutalist-text">
                    {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
                </h2>

                {error && <div className="alert alert-danger p-2 mb-3" role="alert">{error}</div>}
                {successMsg && <div className="alert alert-success p-2 mb-3" role="alert">{successMsg}</div>}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {!isLogin && (
                        <div className="input-group neomorph-input-group mb-3">
                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de Usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="input-group neomorph-input-group mb-3">
                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo Electrónico"
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
                            setSuccessMsg('');
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
