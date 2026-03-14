import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import '../components/styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [toasts, setToasts] = useState([]);

    const { signIn, signUp, signInWithGoogle } = useAuth();

    // Limpiar toasts cuando se cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setToasts([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Función para mostrar toasts
    const showToast = (type, title, message, duration = 5000) => {
        const id = Date.now();
        const newToast = {
            id,
            type,
            title,
            message,
            closing: false
        };

        setToasts(prev => [...prev, newToast]);

        // Auto-cerrar después de la duración
        setTimeout(() => {
            closeToast(id);
        }, duration);

        return id;
    };

    // Función para cerrar un toast específico
    const closeToast = (id) => {
        setToasts(prev =>
            prev.map(toast =>
                toast.id === id ? { ...toast, closing: true } : toast
            )
        );

        // Eliminar después de la animación
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 300);
    };

    const resetForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
        setSuccessMsg('');
        setIsLogin(true);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const getErrorMessage = (error) => {
        const message = error.message.toLowerCase();

        if (message.includes('already registered')) return 'Este correo ya está registrado.';
        if (message.includes('invalid login credentials')) return 'Credenciales inválidas.';
        if (message.includes('invalid_grant')) return 'Credenciales inválidas o correo no confirmado.';
        if (message.includes('user not found')) return 'Usuario no encontrado.';
        if (message.includes('missing email') || message.includes('must provide an email')) return 'El correo es obligatorio.';
        if (message.includes('missing password') || message.includes('password should be')) return 'La contraseña es obligatoria (mínimo 6 caracteres).';
        if (message.includes('password is too short')) return 'La contraseña debe tener al menos 6 caracteres.';
        if (message.includes('weak password')) return 'La contraseña es muy débil.';
        if (message.includes('rate limit')) return 'Demasiados intentos. Por favor espera unos minutos.';
        if (message.includes('network request failed')) return 'Error de conexión. Revisa tu internet.';

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
            showToast('error', 'Error de validación', 'El correo es obligatorio.');
            return;
        }
        if (!password) {
            setError('La contraseña es obligatoria.');
            showToast('error', 'Error de validación', 'La contraseña es obligatoria.');
            return;
        }
        if (!isLogin) {
            if (!username) {
                setError('El nombre de usuario es obligatorio.');
                showToast('error', 'Error de validación', 'El nombre de usuario es obligatorio.');
                return;
            }
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres.');
                showToast('error', 'Error de validación', 'La contraseña debe tener al menos 6 caracteres.');
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
                showToast('success', '¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente.');
                setTimeout(() => {
                    handleClose();
                }, 1500);
            } else {
                showToast('success', '¡Bienvenido!', 'Has iniciado sesión correctamente.');
                setTimeout(() => {
                    handleClose();
                }, 500);
            }
        } catch (err) {
            console.error(err);
            const errorMessage = getErrorMessage(err);
            setError(errorMessage);
            showToast('error', 'Error de autenticación', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setSuccessMsg('');
            showToast('info', 'Google', 'Iniciando sesión con Google...');

            const { error } = await signInWithGoogle();
            if (error) throw error;

            showToast('success', '¡Bienvenido!', 'Has iniciado sesión con Google correctamente.');
        } catch (err) {
            console.error(err);
            const msg = err.message?.toLowerCase() || '';
            if (msg.includes('provider') || msg.includes('not enabled')) {
                setError('Google no está habilitado. Actívalo en tu panel de Supabase.');
                showToast('warning', 'Google no disponible', 'El inicio de sesión con Google no está configurado.');
            } else {
                setError('Error al iniciar con Google. Intenta de nuevo.');
                showToast('error', 'Error con Google', 'No se pudo iniciar sesión con Google.');
            }
        }
    };

    return (
        <>
            {/* Toast Container */}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast-item ${toast.type} ${toast.closing ? 'closing' : ''}`}
                    >
                        <div className={`toast ${toast.type}`}>
                            <div className="toast-icon">
                                <i className={
                                    toast.type === 'success' ? 'fas fa-check' :
                                        toast.type === 'error' ? 'fas fa-times' :
                                            toast.type === 'warning' ? 'fas fa-exclamation' :
                                                'fas fa-info'
                                }></i>
                            </div>
                            <h3>{toast.title}</h3>
                            <p>{toast.message}</p>
                            <button
                                className="toast-close"
                                onClick={() => closeToast(toast.id)}
                                aria-label="Cerrar"
                            ></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Autenticación */}
            <div className={`auth-modal-overlay ${isOpen ? 'active' : ''}`}>
                <div className="auth-card">
                    <div className="card-cut"></div>

                    <button className="close-modal" onClick={handleClose}>
                        <i className="fas fa-times"></i>
                    </button>

                    <div className="avatar-container">
                        <div className="avatar-circle">
                            <i className="fas fa-spider"></i>
                        </div>
                    </div>

                    <h2 className="text-center auth-title">
                        {isLogin ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}
                    </h2>

                    {/* Mantenemos las alertas tradicionales para compatibilidad */}
                    {error && <div className="alert alert-danger p-2 mb-3">{error}</div>}
                    {successMsg && <div className="alert alert-success p-2 mb-3">{successMsg}</div>}

                    <form onSubmit={handleSubmit}>
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
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin me-2"></i>
                                    Procesando...
                                </>
                            ) : (
                                isLogin ? 'INGRESAR' : 'REGISTRARSE'
                            )}
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

                    <p className="text-center mb-0 auth-footer-text">
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
        </>
    );
};

export default AuthModal;