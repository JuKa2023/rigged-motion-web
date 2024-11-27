import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageComponent } from './components/landing-page';
import { ContactPageComponent } from './components/contact-page';
import { HeaderComponent } from './components/header';
import { FooterComponent } from './components/footer';
import { AuctionPageComponent } from "@/components/auction.tsx";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#102532] to-[#DCA8CA] text-white font-sans">
            <Router>
                <HeaderComponent />
                <Routes>
                    <Route path="/" element={<LandingPageComponent />} />
                    <Route path="/contact" element={<ContactPageComponent />} />
                    <Route path="/auction" element={<AuctionPageComponent />} />

                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </Router>
            <FooterComponent />
        </div>
    );
}

export default App;