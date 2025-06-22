import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';


// Import all pages
import Home from './feature/Home';
import RegisterRole from './feature/auth/pages/RegisterRole';
import RegisterUser from './feature/auth/pages/RegisterUser';
import RegisterVendor from './feature/auth/pages/RegisterVendor';
import Login from './feature/auth/pages/Login';
import Events from './feature/events/pages/Events';
import EventDetail from './feature/events/pages/EventDetail';
import WhitelistRegistration from './feature/events/pages/WhitelistRegistration';
import MintPage from './feature/certificates/pages/MintPage';
import MyCertificates from './feature/certificates/pages/MyCertificates';
import VerifyCertificate from './feature/certificates/pages/VerifyCertificate';
import VendorLogin from './feature/vendors/pages/VendorLogin';
import VendorDashboard from './feature/vendors/pages/VendorDashboard';
import CreateEvent from './feature/vendors/events/pages/CreateEvent';
import ManageEvent from './feature/vendors/events/pages/ManageEvent';
import ViewWhitelist from './feature/events/pages/ViewWhitelist';
import MyEvent from './feature/events/pages/Myevent';
import ViewMinted from './feature/certificates/pages/ViewMinted';
import VendorProfile from './feature/vendors/pages/VendorProfile';
import About from './feature/About';
import FAQ from './feature/FAQ';
import NotFound from './feature/NotFound';
import ServerError from './feature/ServerError';
import Help from './feature/Help';
import TermsOfService from './feature/TermsOfService';
import PrivacyPolicy from './feature/PrivacyPolicy';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterRole />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/vendor" element={<RegisterVendor />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events" element={<Events />} />
          <Route path="/myevents" element={<MyEvent />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/whitelist/:eventId" element={<WhitelistRegistration />} />
          <Route path="/mint/:eventId" element={<MintPage />} />
          <Route path="/my-certificates" element={<MyCertificates />} />
          <Route path="/verify/:tokenId" element={<VerifyCertificate />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />

          {/* Vendor Routes */}
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/event/create" element={<CreateEvent />} />
          <Route path="/vendor/event/:id" element={<ManageEvent />} />
          <Route path="/vendor/event/:id/whitelist" element={<ViewWhitelist />} />
          <Route path="/vendor/event/:id/minted" element={<ViewMinted />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />

          {/* Error Routes */}
          <Route path="/500" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;