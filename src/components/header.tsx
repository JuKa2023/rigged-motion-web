import { Link } from 'react-router-dom'
import RiggedmotionSvg from '/assets/Riggedmotion.svg'
import { GoogleSignInComponent } from "@/components/GoogleSignIn"
import { SignOut } from "@/components/SignOut"
import { useAuth } from "@/contexts/AuthContext"

export function HeaderComponent() {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-black/30 border-b border-white/10">
            <div className="container mx-auto py-4">
                <div className="flex justify-between items-center px-4">
                    <Link to="/" className="flex-shrink-0">
                        <img src={RiggedmotionSvg} alt="logo" className="h-8" />
                    </Link>

                    <nav className="flex items-center space-x-8">
                        <Link 
                            to="/auction" 
                            className="text-gray-200 hover:text-white transition-colors"
                        >
                            Versteigerung
                        </Link>
                        <Link 
                            to="/contact"
                            className="text-gray-200 hover:text-white transition-colors"
                        >
                            Kontakt
                        </Link>
                        {user ? (
                            <SignOut />
                        ) : (
                            <GoogleSignInComponent />
                        )}
                    </nav>
                </div>
            </div>
        </header>
    )
}