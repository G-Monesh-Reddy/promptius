import React, { createContext, useContext, useReducer } from 'react';

const initialFormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
  },
  paymentInfo: {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  },
  travelers: 1,
  specialRequests: '',
};

const initialState = {
  trip: null,
  formData: initialFormData,
  currentStep: 1,
  totalCost: 0,
  bookingId: '',
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_TRIP':
      return {
        ...state,
        trip: action.payload,
        totalCost: action.payload.price * state.formData.travelers,
      };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'SET_TRAVELERS':
      return {
        ...state,
        formData: { ...state.formData, travelers: action.payload },
        totalCost: state.trip ? state.trip.price * action.payload : 0,
      };
    case 'CONFIRM_BOOKING':
      return {
        ...state,
        bookingId: `XYZ${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
}

const BookingContext = createContext(undefined);

export function BookingProvider({ children }) {
  const [bookingState, dispatch] = useReducer(bookingReducer, initialState);

  const contextValue = {
    bookingState,
    setTrip: (trip) => dispatch({ type: 'SET_TRIP', payload: trip }),
    updateFormData: (data) => dispatch({ type: 'UPDATE_FORM_DATA', payload: data }),
    setCurrentStep: (step) => dispatch({ type: 'SET_CURRENT_STEP', payload: step }),
    setTravelers: (count) => dispatch({ type: 'SET_TRAVELERS', payload: count }),
    confirmBooking: () => dispatch({ type: 'CONFIRM_BOOKING' }),
    resetBooking: () => dispatch({ type: 'RESET_BOOKING' }),
  };

  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}