import React from 'react'
import { supabase } from '../supabaseClient'

const SignOut: React.FC = () => {
    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return <button onClick={handleSignOut}>Sign Out</button>
}

export { SignOut }