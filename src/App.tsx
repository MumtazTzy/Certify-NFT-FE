// App.tsx (Versi Baru dan Direkomendasikan)

// 1. Ganti import lama dengan createBrowserRouter dan RouterProvider
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 2. Import komponen Layout dan semua halaman Anda tetap sama
import Layout from './components/Layout';
import Home from './feature/Home';
import RegisterRole from './feature/auth/pages/RegisterRole';
import RegisterUser from './feature/auth/pages/RegisterUser';
import RegisterVendor from './feature/auth/pages/RegisterVendor';
import Login from './feature/auth/pages/Login';
import Events from './feature/user/events/pages/Events';
import EventDetail from './feature/user/events/pages/EventDetail';
import WhitelistRegistration from './feature/user/whitelist/pages/WhitelistRegistration';
import MintPage from './feature/vendors/pages/MintPage';
import MyCertificates from './feature/user/certificates/pages/MyCertificates';
import VerifyCertificate from './feature/vendors/pages/VerifyCertificate';
import VendorLogin from './feature/vendors/pages/VendorLogin';
import VendorDashboard from './feature/vendors/pages/VendorDashboard';
import CreateEvent from './feature/vendors/events/pages/CreateEvent';
import ManageEvent from './feature/vendors/events/pages/ManageEvent';
import ViewWhitelist from './feature/vendors/events/pages/ViewWhitelist';
import MyEvent from './feature/user/events/pages/Myevent';
import ViewMinted from './feature/vendors/pages/ViewMinted';
import VendorProfile from './feature/vendors/pages/VendorProfile';
import About from './feature/About';
import FAQ from './feature/FAQ';
import NotFound from './feature/NotFound';
import ServerError from './feature/ServerError';
import Help from './feature/Help';
import TermsOfService from './feature/TermsOfService';
import PrivacyPolicy from './feature/PrivacyPolicy';
import UserDashboard from './feature/user/dashboard/UserDashboard';
import UserProfile from './feature/user/UserProfile';
import UploadCertificateForm from './feature/vendors/events/components/UploadCertificateForm';
import MintCertificateButton from './feature/user/certificates/components/MintCeritificateButton';

// 3. Definisikan semua rute Anda sebagai objek JavaScript di luar komponen App
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Layout menjadi elemen root yang membungkus semua halaman
    // errorElement: <ErrorPage />, // Opsional: Halaman error khusus untuk rute ini
    children: [
      // Semua rute halaman sekarang menjadi 'children' dari Layout
      { index: true, element: <Home /> }, // 'index: true' menandakan ini halaman default untuk path '/'
      
      // Public Routes (tanpa slash di depan)
      { path: 'register', element: <RegisterRole /> },
      { path: 'register/user', element: <RegisterUser /> },
      { path: 'register/vendor', element: <RegisterVendor /> },
      { path: 'login', element: <Login /> },
      { path: 'events', element: <Events /> },
      { path: 'myevents', element: <MyEvent /> },
      { path: 'events/:id', element: <EventDetail /> },
      { path: 'whitelist/:eventId', element: <WhitelistRegistration /> },
      { path: 'mint/:eventId', element: <MintPage /> },
      { path: 'my-certificates', element: <MyCertificates /> },
      { path: 'verify/:tokenId', element: <VerifyCertificate /> },
      { path: 'about', element: <About /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'help', element: <Help /> },
      { path: 'terms', element: <TermsOfService /> },
      { path: 'privacy', element: <PrivacyPolicy /> },

      // Vendor Routes
      { path: 'vendor/login', element: <VendorLogin /> },
      { path: 'vendor/dashboard', element: <VendorDashboard /> },
      { path: 'vendor/event/create', element: <CreateEvent /> },
      { path: 'vendor/event/:id', element: <ManageEvent /> },
      { path: 'vendor/event/:id/whitelist', element: <ViewWhitelist /> },
      { path: 'vendor/event/:id/minted', element: <ViewMinted /> },
      { path: 'vendor/profile', element: <VendorProfile /> },
      { path: 'vendor/event/:id/upload-certificate', element: <UploadCertificateForm eventId={':id'} /> },

      // User Routes
      { path: 'user/dashboard', element: <UserDashboard /> },
      { path: 'profile', element: <UserProfile /> },
     

      // Error Routes
      { path: '500', element: <ServerError /> },
      { path: '*', element: <NotFound /> }, // Rute 'catch-all' untuk halaman tidak ditemukan
    ],
  },
]);

// 4. Komponen App sekarang hanya perlu merender RouterProvider
function App() {
  return <RouterProvider router={router} />;
}

export default App;