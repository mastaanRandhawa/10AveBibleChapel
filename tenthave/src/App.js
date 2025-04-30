import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Sermon from "./pages/Sermon";
import Prayers from "./pages/Prayers";
import Contact from "./pages/Contact";
import Bulletin from "./pages/Bulletin";
import Header from "./components/Header";
import Footer from "./components/Footer"
import ScrollToTop from "./pages/scrollToTop"; // Import the ScrollToTop component

function App() {
  return (
    <Router>
    <ScrollToTop /> {/* This will scroll to the top on every route change */}
      <Header /> {/* Navigation bar stays on all pages */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/bulletin" element={<Bulletin />} />
        <Route path="/sermon" element={<Sermon />} />
        <Route path="/prayers" element={<Prayers />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>


      <Footer />
    </Router>
  );
}

export default App;
