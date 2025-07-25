import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CheckCircle,
    Download,
    Calendar,
    MapPin,
    Users,
    Mail,
    Phone,
    Home,
    ArrowRight,
} from "lucide-react";
import { useBooking } from "../context/BookingContext";

export default function Confirmation() {
    const navigate = useNavigate();
    const { bookingState, resetBooking } = useBooking();

    useEffect(() => {
        if (!bookingState.trip || !bookingState.bookingId) {
            navigate("/search");
        }
    }, [bookingState.trip, bookingState.bookingId, navigate]);

    const handleDownloadReceipt = () => {
        // In a real app, this would generate and download a PDF receipt
        const receipt = {
            bookingId: bookingState.bookingId,
            trip: bookingState.trip,
            traveler: bookingState.formData.personalInfo,
            totalCost: bookingState.totalCost,
            travelers: bookingState.formData.travelers,
            bookingDate: new Date().toLocaleDateString(),
        };

        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(receipt, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute(
            "download",
            `booking-${bookingState.bookingId}.json`
        );
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleNewBooking = () => {
        resetBooking();
        navigate("/search");
    };

    if (!bookingState.trip || !bookingState.bookingId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Booking Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Congratulations! Your trip to{" "}
                        {bookingState.trip.destination} has been successfully
                        booked. Get ready for an amazing adventure!
                    </p>
                </motion.div>

                {/* Booking Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    {/* Booking ID */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Booking Details
                                </h2>
                                <p className="text-gray-600">
                                    Booking ID:{" "}
                                    <span className="font-mono font-semibold text-blue-600">
                                        {bookingState.bookingId}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Trip Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Trip Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <img
                                        src={bookingState.trip.images[0]}
                                        alt={bookingState.trip.destination}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">
                                            {bookingState.trip.destination}
                                        </h4>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {bookingState.trip.country}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 mt-1">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {bookingState.trip.duration}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">
                                                Travelers:
                                            </span>
                                            <div className="font-medium flex items-center mt-1">
                                                <Users className="h-4 w-4 mr-1" />
                                                {
                                                    bookingState.formData
                                                        .travelers
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Total Cost:
                                            </span>
                                            <div className="font-bold text-green-600 text-lg mt-1">
                                                ${bookingState.totalCost}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Customer Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <Users className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">
                                            {
                                                bookingState.formData
                                                    .personalInfo.firstName
                                            }{" "}
                                            {
                                                bookingState.formData
                                                    .personalInfo.lastName
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="font-medium">
                                        {
                                            bookingState.formData.personalInfo
                                                .email
                                        }
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <Phone className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="font-medium">
                                        {
                                            bookingState.formData.personalInfo
                                                .phone
                                        }
                                    </div>
                                </div>

                                {bookingState.formData.specialRequests && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <h4 className="font-medium text-yellow-800 mb-2">
                                            Special Requests:
                                        </h4>
                                        <p className="text-sm text-yellow-700">
                                            {
                                                bookingState.formData
                                                    .specialRequests
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* What's Next */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg p-8 mb-8"
                >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        What's Next?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Confirmation Email
                            </h4>
                            <p className="text-sm text-gray-600">
                                You'll receive a detailed confirmation email
                                within the next few minutes with your itinerary.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-6 w-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Contact from Our Team
                            </h4>
                            <p className="text-sm text-gray-600">
                                Our travel specialists will contact you within
                                24 hours to finalize details and answer
                                questions.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                                Pre-Trip Preparation
                            </h4>
                            <p className="text-sm text-gray-600">
                                We'll send you a comprehensive travel guide and
                                packing list 2 weeks before departure.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Home className="h-5 w-5 mr-2" />
                        Back to Home
                    </button>

                    <button
                        onClick={handleNewBooking}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                        Book Another Trip
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                </motion.div>

                {/* Contact Support */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center mt-12 p-6 bg-gray-100 rounded-lg"
                >
                    <h4 className="font-semibold text-gray-900 mb-2">
                        Need Help?
                    </h4>
                    <p className="text-gray-600 mb-4">
                        Our customer support team is available 24/7 to assist
                        you with any questions or concerns.
                    </p>
                    <div className="flex items-center justify-center space-x-6 text-sm">
                        <div className="flex items-center">
                            <Phone className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="font-medium">
                                +1 (555) 123-4567
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 text-blue-600 mr-1" />
                            <span className="font-medium">
                                support@xyztravel.com
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
