import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./pages/scrollToTop";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Sermon = lazy(() => import("./pages/Sermon"));
const SermonSeriesDetail = lazy(() => import("./pages/SermonSeriesDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Bulletin = lazy(() => import("./pages/Bulletin"));
const Prayer = lazy(() => import("./pages/Prayer"));
const Login = lazy(() => import("./pages/Login"));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <Header />

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/bulletin" element={<Bulletin />} />
            <Route path="/prayer" element={<Prayer />} />
            <Route path="/sermon" element={<Sermon />} />
            <Route path="/sermon/:seriesId" element={<SermonSeriesDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>

        <Footer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
