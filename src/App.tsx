import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageComponent } from './components/landing-page';
import { ContactPageComponent } from './components/contact-page';
import {HeaderComponent} from './components/header';
import {FooterComponent} from './components/footer';


function App() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#102532] to-[#DCA8CA] text-white font-sans">
            <HeaderComponent/>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPageComponent/>}/>
                    <Route path="/contact" element={<ContactPageComponent/>}/>
                </Routes>
            </Router>
            <FooterComponent/>
        </div>
    );
}

export default App;
