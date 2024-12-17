import React from 'react'
import { supabase } from '../supabaseClient'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

const SignOut: React.FC<{ className?: string }> = ({ className }) => {
    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <Button 
            onClick={handleSignOut}
            variant="ghost"
            className={`flex items-center gap-2 text-gray-200 hover:text-white hover:bg-gray-800/50 ${className}`}
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </Button>
    )
}

export { SignOut }