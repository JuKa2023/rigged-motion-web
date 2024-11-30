import React from 'react'
import { supabase } from '../supabaseClient'

const GoogleSignIn: React.FC = () => {
    const handleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            })
            if (error) throw error
        } catch (error) {
            console.error('Error signing in with Google:', error)
        }
    }

    return (
        <button onClick={handleSignIn}>
            Sign in with Google
        </button>
    )
}

export default GoogleSignIn