import React, { createContext } from 'react';

// Types for state and actions
export interface AppState {
    transactions: any[]; // Replace `any` with your transaction type
    loading: boolean;
}

export interface AppAction {
    type: 'SET_TRANSACTIONS' | 'SET_LOADING';
    payload: any;
}

// Context type
export interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

// Create the context with a default value of `undefined`
export const AppContext = createContext<AppContextType | undefined>(undefined);
