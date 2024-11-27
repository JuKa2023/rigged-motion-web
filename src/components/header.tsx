import { Link } from 'react-router-dom';
import RiggedmotionSvg from '/assets/Riggedmotion.svg';

export function HeaderComponent() {
    return (
        <header className="container mx-auto py-6 flex justify-between items-center">
            <div
                className="flex justify-between items-center border-b border-white border-opacity-200 pb-4 w-full px-12"
                style={{ borderBottomColor: '#DBD2A4', borderBottomWidth: '5px' }}
            >
                <Link to="/">
                    <img src={RiggedmotionSvg} alt="logo" className="h-8 flex-shrink-0" />
                </Link>
                <nav className="ml-auto w-1/3 flex justify-end space-x-8 gap-4">
                    <Link to="/auction">Versteigerung</Link>
                    <Link to="/contact">Kontakt</Link>
                </nav>
            </div>
        </header>
    );
}