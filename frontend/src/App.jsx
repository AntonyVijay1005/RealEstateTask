import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import MyProperties from './pages/MyProperties';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import EditProperty from './pages/EditProperty';
import Enquiries from './pages/Enquiries';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer'; // Assuming Footer component path

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
