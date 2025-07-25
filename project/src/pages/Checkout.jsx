import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  CreditCard, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Lock,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { bookingState, updateFormData, setCurrentStep, setTravelers, confirmBooking } = useBooking();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!bookingState.trip) {
      navigate('/search');
    }
  }, [bookingState.trip, navigate]);

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Confirmation', icon: CheckCircle },
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      const { personalInfo } = bookingState.formData;
      if (!personalInfo.firstName) newErrors.firstName = 'First name is required';
      if (!personalInfo.lastName) newErrors.lastName = 'Last name is required';
      if (!personalInfo.email) newErrors.email = 'Email is required';
      if (!personalInfo.phone) newErrors.phone = 'Phone number is required';
      if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      
      if (personalInfo.email && !/\S+@\S+\.\S+/.test(personalInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (step === 2) {
      const { paymentInfo } = bookingState.formData;
      if (!paymentInfo.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!paymentInfo.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentInfo.cvv) newErrors.cvv = 'CVV is required';
      if (!paymentInfo.cardholderName) newErrors.cardholderName = 'Cardholder name is required';

      if (paymentInfo.cardNumber && paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (paymentInfo.cvv && paymentInfo.cvv.length !== 3) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(bookingState.currentStep)) {
      if (bookingState.currentStep < 3) {
        setCurrentStep(bookingState.currentStep + 1);
      } else {
        confirmBooking();
        navigate('/confirmation');
      }
    }
  };

  const handlePrevious = () => {
    if (bookingState.currentStep > 1) {
      setCurrentStep(bookingState.currentStep - 1);
    } else {
      navigate(-1);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  if (!bookingState.trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.id <= bookingState.currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      step.id <= bookingState.currentStep ? 'text-blue-600' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 ${
                      step.id < bookingState.currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={bookingState.currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-sm p-8"
            >
              {/* Step 1: Personal Information */}
              {bookingState.currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={bookingState.formData.personalInfo.firstName}
                        onChange={(e) => updateFormData({
                          personalInfo: { ...bookingState.formData.personalInfo, firstName: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={bookingState.formData.personalInfo.lastName}
                        onChange={(e) => updateFormData({
                          personalInfo: { ...bookingState.formData.personalInfo, lastName: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={bookingState.formData.personalInfo.email}
                        onChange={(e) => updateFormData({
                          personalInfo: { ...bookingState.formData.personalInfo, email: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={bookingState.formData.personalInfo.phone}
                        onChange={(e) => updateFormData({
                          personalInfo: { ...bookingState.formData.personalInfo, phone: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={bookingState.formData.personalInfo.dateOfBirth}
                        onChange={(e) => updateFormData({
                          personalInfo: { ...bookingState.formData.personalInfo, dateOfBirth: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Travelers
                      </label>
                      <select
                        value={bookingState.formData.travelers}
                        onChange={(e) => setTravelers(parseInt(e.target.value))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Traveler{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingState.formData.specialRequests}
                      onChange={(e) => updateFormData({ specialRequests: e.target.value })}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any special requests or dietary requirements..."
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {bookingState.currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={bookingState.formData.paymentInfo.cardNumber}
                          onChange={(e) => updateFormData({
                            paymentInfo: { ...bookingState.formData.paymentInfo, cardNumber: formatCardNumber(e.target.value) }
                          })}
                          className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={bookingState.formData.paymentInfo.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                              }
                              updateFormData({
                                paymentInfo: { ...bookingState.formData.paymentInfo, expiryDate: value }
                              });
                            }}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={bookingState.formData.paymentInfo.cvv}
                            onChange={(e) => updateFormData({
                              paymentInfo: { ...bookingState.formData.paymentInfo, cvv: e.target.value.replace(/\D/g, '') }
                            })}
                            className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.cvv ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="123"
                            maxLength={3}
                          />
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        value={bookingState.formData.paymentInfo.cardholderName}
                        onChange={(e) => updateFormData({
                          paymentInfo: { ...bookingState.formData.paymentInfo, cardholderName: e.target.value }
                        })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Name as it appears on card"
                      />
                      {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-900">Secure Payment</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your payment information is encrypted and secure. We never store your credit card details.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingState.currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>
                  
                  <div className="space-y-6">
                    {/* Personal Info Summary */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">
                            {bookingState.formData.personalInfo.firstName} {bookingState.formData.personalInfo.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{bookingState.formData.personalInfo.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 font-medium">{bookingState.formData.personalInfo.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Travelers:</span>
                          <span className="ml-2 font-medium">{bookingState.formData.travelers}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
                      <div className="text-sm">
                        <span className="text-gray-600">Card ending in:</span>
                        <span className="ml-2 font-medium">
                          ***{bookingState.formData.paymentInfo.cardNumber.slice(-4)}
                        </span>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          required
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
                          {' '}and{' '}
                          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {bookingState.currentStep === 1 ? 'Back to Trip' : 'Previous'}
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  {bookingState.currentStep === 3 ? 'Complete Booking' : 'Next'}
                  {bookingState.currentStep !== 3 && <ArrowRight className="h-4 w-4 ml-2" />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={bookingState.trip.images[0]}
                    alt={bookingState.trip.destination}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{bookingState.trip.destination}</h4>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {bookingState.trip.country}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{bookingState.trip.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Travelers:</span>
                    <span className="font-medium">{bookingState.formData.travelers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">${bookingState.trip.price}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-blue-600">${bookingState.totalCost}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <div className="flex items-center justify-center text-sm text-gray-600 mb-2">
                  <Lock className="h-4 w-4 mr-1" />
                  Secure SSL Encryption
                </div>
                <p className="text-xs text-gray-500">
                  Your personal and payment information is protected
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}