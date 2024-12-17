import {Link} from "react-router-dom";

export function FooterComponent () {
    return(

    <footer className="backdrop-blur-sm bg-black/30 border-b border-white/10">
        <div className="container mx-auto py-4">
            <div className="flex items-center justify-between px-4">
                <div className="text-sm text-white">&copy; 2024 Rigged Motion Studios. All rights reserved.</div>
                <nav className="flex items-center space-x-8 gap-6">
                    <a
                        href="https://www.guavemotion.ch/files/uploads/motion/agb/sfa_agb_2023-guavemotion.pdf"

                    className="text-gray-200 hover:text-[#DBD2A4] transition-colors">AGB</a>
                    <Link
                        to="/impressum"
                        className="text-gray-200 hover:text-[#DBD2A4] transition-colors"
                    >Impressum</Link>

                    <Link
                        to="/datenschutz"
                        className="text-gray-200 hover:text-[#DBD2A4] transition-colors"
                    >Datenschutz</Link>
                </nav>
            </div>
        </div>
    </footer>
    )
}