import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BookingProvider } from "./context/BookingContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import TripDetails from "./pages/TripDetails";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
    return (
        <BookingProvider>
            <Router>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/promptius" element={<Home />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/trip/:id" element={<TripDetails />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route
                                path="/confirmation"
                                element={<Confirmation />}
                            />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </BookingProvider>
    );
}

export default App;
