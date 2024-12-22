import './App.css';
import './index.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPageComponent } from "@/components/landing-page";
import { ContactPageComponent } from "@/components/contact-page";
import { ImpressumPageComponent } from "@/components/Impressum-page.tsx";
import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";
import { AuctionPageComponent } from "@/components/auction.tsx";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivacyPolicy from "@/components/privacy-policy";
import { ProfilePageComponent } from "@/components/profile-page";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-r from-[#102532] to-[#DCA8CA] text-white font-sans">
        <Router>
          <HeaderComponent />
          <Routes>
            <Route path="/" element={<LandingPageComponent />} />
            <Route path="/contact" element={<ContactPageComponent />} />
            <Route path="/auction" element={<AuctionPageComponent />} />
            <Route path="/impressum" element={<ImpressumPageComponent />} />
            <Route path="/datenschutz" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<ProfilePageComponent />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
          <FooterComponent />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;