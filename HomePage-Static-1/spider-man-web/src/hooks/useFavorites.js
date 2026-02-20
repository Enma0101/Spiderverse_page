
import { useState, useEffect } from 'react';

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (id) => {
        setFavorites(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const isFavorite = (id) => favorites.includes(id);

    return { favorites, toggleFavorite, isFavorite };
}
