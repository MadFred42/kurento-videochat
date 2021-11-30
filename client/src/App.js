import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Context } from './';
import { observer } from 'mobx-react-lite';
import { AuthRoutes, PublicRoutes } from "./routes";

const App = observer(() => {
  const { authStore } = useContext(Context);
  console.log(authStore.isAuth)
  return (
    <Router className="App">
      <Routes>
        {
          authStore.isAuth && AuthRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))
        }
        {
          PublicRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} exact />
          ))
        }
      </Routes>
    </Router>
  );
});

export default App;
