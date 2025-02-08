import React, { useReducer } from 'react';
import { AppContext, AppState, AppAction } from './AppContext';

// Initial state
const initialState: AppState = {
    transactions: [],
    loading: false,
};

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
    switch (action.type) {
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

// AppProvider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

