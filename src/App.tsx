import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageComponent } from './components/landing-page';
import { ContactPageComponent } from './components/contact-page';
import {HeaderComponent} from './components/header';
import {FooterComponent} from './components/footer';

function App() {
    return (

        <Router>
            <HeaderComponent />
            <Routes>
                <Route path="/" element={<LandingPageComponent />} />
                <Route path="/contact" element={<ContactPageComponent />} />
            </Routes>
            <FooterComponent />
        </Router>
    );
}

export default App;