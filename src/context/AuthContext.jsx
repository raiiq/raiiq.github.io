/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Failsafe: Force loading to false after 2 seconds if Supabase hangs
        const timer = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 2000);

        // Check active session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) console.error("Session error:", error);
            if (mounted) {
                setUser(session?.user ?? null);
                setIsAdmin(session?.user?.email === 'outofrai@gmail.com');
                setLoading(false);
                clearTimeout(timer);
            }
        }).catch(err => {
            console.error("Supabase auth error:", err);
            if (mounted) setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                setIsAdmin(session?.user?.email === 'outofrai@gmail.com');
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(timer);
            subscription.unsubscribe();
        };
    }, []);

    const login = async () => {
        // Use origin to ensure a clean redirect to the root section.
        const currentUrl = window.location.origin;
        console.log('Initiating login with redirect to:', currentUrl);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: currentUrl
            }
        });
        if (error) console.error("Login error:", error);
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout error:", error);
    };

    return (
        <AuthContext.Provider value={{ user, isAdmin, login, logout, loading }}>
            {loading ? (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary border-white"></div>
                    <p>Loading app...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
