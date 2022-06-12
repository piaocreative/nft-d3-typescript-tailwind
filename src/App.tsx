import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { Route, useRouteMatch, Switch } from 'react-router-dom';

import "./App.css";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { Reports } from "./pages/Reports";
import { LoadingContext } from "./context/LoadingContext";

function App() {
  const [loading, setLoading] = React.useState(false);
  const loading_context = React.useMemo(
    () => ({
      loading,
      setLoading,
    }),
    [loading]
  );

  return (
    <LoadingContext.Provider value={loading_context}>
      <DarkModeToggle className="fixed right-4 top-4 z-50" />
      {/* <Reports /> */}
      {/* <Switch>
        <Route path='/"company_id' component={Reports} />
      </Switch> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Reports />} />
          <Route path="/:company_id" element={<Reports />} />
        </Routes>
      </BrowserRouter>
    </LoadingContext.Provider>
  );
}

export default App;
