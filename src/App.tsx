import React from "react";

import { BrowserRouter,HashRouter } from "react-router-dom"; // Import BrowserRouter
import { AppProvider } from "./context/AppProvider";
import AppRouter from "./router/AppRouter";
import { StateContext } from "./context/stateContext";

const App: React.FC = () => {
  return (
    <StateContext>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </StateContext>
  );
};

export default App;
