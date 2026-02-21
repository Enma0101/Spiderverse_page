import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthContext } from './authContextDef';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Asegurar que el perfil exista en public.profiles
    const ensureProfile = async (currentUser) => {
        if (!currentUser) return;

        const nombre = currentUser.user_metadata?.full_name
            || currentUser.user_metadata?.name
            || currentUser.email?.split('@')[0]
            || 'Usuario';

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: currentUser.id,
                email: currentUser.email,
                nombre: nombre,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.warn('Error al guardar perfil:', error.message);
        }
    };

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            setLoading(false);
            // Guardar perfil en cada login (incluye Google OAuth redirect)
            if (_event === 'SIGNED_IN' && currentUser) {
                await ensureProfile(currentUser);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = (email, password, data) => supabase.auth.signUp({
        email,
        password,
        options: { data }
    });
    const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
    const signInWithGoogle = () => supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    const signOut = () => supabase.auth.signOut();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <AuthContext.Provider value={{
            user, signUp, signIn, signInWithGoogle, signOut, loading,
            isAuthOpen, setIsAuthOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
};
