import {Link} from 'react-router-dom';
import {User} from '@supabase/supabase-js'
import {supabase} from '../supabaseClient'
import RiggedmotionSvg from '/assets/Riggedmotion.svg';

import {GoogleSignInComponent} from "@/components/GoogleSignIn.tsx";
import {SignOut} from "@/components/SignOut.tsx";
import {useEffect, useState} from "react";


export function HeaderComponent() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const {data: authListener} = supabase.auth.onAuthStateChange(
            async (_, session) => {
                const currentUser = session?.user ?? null
                setUser(currentUser)
            }
        )
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <header className="container mx-auto py-6 flex justify-between items-center">
            <div
                className="flex justify-between items-center border-b border-white border-opacity-200 pb-4 w-full px-12"
                style={{borderBottomColor: '#DBD2A4', borderBottomWidth: '5px'}}
            >
                <Link to="/">
                    <img src={RiggedmotionSvg} alt="logo" className="h-8 flex-shrink-0"/>
                </Link>

                <nav className="ml-auto w-1/3 flex justify-end space-x-8 gap-4">
                    <Link to="/auction">Versteigerung</Link>
                    <Link to="/contact">Kontakt</Link>
                    {user ? (
                        <SignOut/>
                    ) : (
                        <GoogleSignInComponent/>
                    )}
                </nav>
            </div>
        </header>
    );
}