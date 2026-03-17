
import { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AuthContext } from '../context/authContextDef';

export function useFavorites() {
    const { user, setIsAuthOpen } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load from localStorage for guests
    useEffect(() => {
        if (!user) {
            try {
                const saved = localStorage.getItem('favorites');
                setFavorites(saved ? JSON.parse(saved) : []);
            } catch (e) {
                console.error('Error loading favorites from localStorage', e);
                setFavorites([]);
            }
            setLoading(false);
        }
    }, [user]);

    // Initial load from Supabase for authenticated users
    useEffect(() => {
        if (user && isSupabaseConfigured) {
            const fetchFavs = async () => {
                setLoading(true);
                try {
                    const { data, error } = await supabase
                        .from('favorites')
                        .select('comic_id')
                        .eq('user_id', user.id);

                    if (!error && data) {
                        setFavorites(data.map(f => f.comic_id));
                    }
                } catch (e) {
                    console.error('Error fetching favorites from Supabase', e);
                } finally {
                    setLoading(false);
                }
            };
            fetchFavs();
        }
    }, [user]);

    // Save to localStorage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }, [favorites, user]);

    const toggleFavorite = useCallback(async (comicId) => {
        if (!user) {
            // For guests, just update local state (syncs to localStorage via useEffect)
            setFavorites(prev =>
                prev.includes(comicId)
                    ? prev.filter(id => id !== comicId)
                    : [...prev, comicId]
            );
            return;
        }

        if (!isSupabaseConfigured) return;

        const isFav = favorites.includes(comicId);

        try {
            if (isFav) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('comic_id', comicId);
                
                if (!error) {
                    setFavorites(prev => prev.filter(id => id !== comicId));
                }
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert([{ user_id: user.id, comic_id: comicId }]);
                
                if (!error) {
                    setFavorites(prev => [...prev, comicId]);
                }
            }
        } catch (err) {
            console.error('Error toggling favorite in Supabase:', err);
        }
    }, [user, favorites]);

    const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

    return useMemo(() => ({
        favorites,
        toggleFavorite,
        isFavorite,
        loading
    }), [favorites, toggleFavorite, isFavorite, loading]);
}
