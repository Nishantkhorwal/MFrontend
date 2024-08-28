import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import PropertyDetail from "./components/PropertyDetails"; // Import PropertyDetail
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <div className="">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            {/* Protect the home route */}
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            {/* Protect the property detail route */}
            <Route path="/property/:id" element={<ProtectedRoute element={<PropertyDetail />} />} />
          </Routes>
        </div>
        <Footer/>
      </Router>
    </>
  );
}

export default App;


