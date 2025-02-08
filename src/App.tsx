import React from 'react';
import { AppProvider } from './context/AppProvider';
import AppRouter from './router/AppRouter';

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppRouter />
        </AppProvider>
    );
};

export default App;
