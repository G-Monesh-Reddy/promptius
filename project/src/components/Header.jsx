import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Plane, Menu, X } from "lucide-react";

export default function Header() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to="/promptius"
                        className="flex items-center space-x-2"
                    >
                        <Plane className="h-8 w-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">
                            XYZ Travel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/promptius"
                            className={`font-medium transition-colors ${
                                isActive("/")
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/search"
                            className={`font-medium transition-colors ${
                                isActive("/search")
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            Destinations
                        </Link>
                        <Link
                            to="/about"
                            className={`font-medium transition-colors ${
                                isActive("/about")
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            About
                        </Link>
                        <Link
                            to="/contact"
                            className={`font-medium transition-colors ${
                                isActive("/contact")
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600"
                            }`}
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <nav className="flex flex-col space-y-3">
                            <Link
                                to="/"
                                className={`font-medium py-2 transition-colors ${
                                    isActive("/")
                                        ? "text-blue-600"
                                        : "text-gray-700 hover:text-blue-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/search"
                                className={`font-medium py-2 transition-colors ${
                                    isActive("/search")
                                        ? "text-blue-600"
                                        : "text-gray-700 hover:text-blue-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Destinations
                            </Link>
                            <Link
                                to="/about"
                                className={`font-medium py-2 transition-colors ${
                                    isActive("/about")
                                        ? "text-blue-600"
                                        : "text-gray-700 hover:text-blue-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link
                                to="/contact"
                                className={`font-medium py-2 transition-colors ${
                                    isActive("/contact")
                                        ? "text-blue-600"
                                        : "text-gray-700 hover:text-blue-600"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
