import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import ComicCard from '../components/ComicCard';

const Comics = () => {
    const [comics, setComics] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // Auth context to check if user is logged in
    const { user } = useAuth();

    useEffect(() => {
        fetchComics();
        if (user) {
            fetchFavorites();
        } else {
            setFavorites(new Set());
        }
    }, [user]);

    const fetchComics = async () => {
        try {
            const { data, error } = await supabase
                .from('comics')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setComics(data);
        } catch (error) {
            console.error('Error fetching comics:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('comic_id');

            if (error) throw error;

            // Store favorite comic IDs in a Set for O(1) lookup
            const favSet = new Set(data.map(f => f.comic_id));
            setFavorites(favSet);
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    const toggleFavorite = async (comicId) => {
        if (!user) {
            alert('Debes iniciar sesión para guardar favoritos.');
            document.getElementById('authBtn')?.click(); // Trigger auth modal
            return;
        }

        const isFav = favorites.has(comicId);

        try {
            if (isFav) {
                // Remove from favorites
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('comic_id', comicId);

                if (error) throw error;

                const newFavs = new Set(favorites);
                newFavs.delete(comicId);
                setFavorites(newFavs);
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from('favorites')
                    .insert([{ user_id: user.id, comic_id: comicId }]);

                if (error) throw error;

                const newFavs = new Set(favorites);
                newFavs.add(comicId);
                setFavorites(newFavs);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
            alert('Error al actualizar favoritos. Revisa la consola.');
        }
    };

    const filteredComics = showFavoritesOnly
        ? comics.filter(c => favorites.has(c.id))
        : comics;

    return (
        <div className="container-fluid py-5" style={{ marginTop: '80px', minHeight: '100vh' }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <h1 className="brutalist-text mb-0" style={{ fontSize: '3rem' }}>
                        CATÁLOGO DE <span style={{ color: 'var(--accent-primary)' }}>CÓMICS</span>
                    </h1>

                    {user && (
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="favSwitch"
                                checked={showFavoritesOnly}
                                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                            <label className="form-check-label text-white ms-2 fw-bold" htmlFor="favSwitch">
                                <i className="fas fa-heart text-danger me-2"></i>Mis Favoritos
                            </label>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="text-center text-white py-5">
                        <div className="spinner-border text-danger" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando el multiverso...</p>
                    </div>
                ) : (
                    <>
                        {filteredComics.length === 0 ? (
                            <div className="text-center text-white-50 py-5">
                                <h3>No se encontraron cómics.</h3>
                                {showFavoritesOnly && <p>Aún no has guardado ningún favorito.</p>}
                            </div>
                        ) : (
                            <div className="row">
                                {filteredComics.map(comic => (
                                    <ComicCard
                                        key={comic.id}
                                        comic={comic}
                                        isFavorite={favorites.has(comic.id)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Comics;
