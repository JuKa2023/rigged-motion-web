import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageComponent } from './components/landing-page';
import { ContactPageComponent } from './components/contact-page';

function App() {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<LandingPageComponent />} />
                <Route path="/contact" element={<ContactPageComponent />} />
            </Routes>
        </Router>
    );
}

export default App;