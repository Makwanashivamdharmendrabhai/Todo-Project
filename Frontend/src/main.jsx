import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Home, Login, Signup, User, Complete } from "./components/index";
import store from "../store/store";
import { Provider } from "react-redux";
import AuthLayout from "./components/layout/authLayout";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        {/* login and signup route */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />

        {/* user routes */}
        <Route
          path="/"
          element={
            <AuthLayout>
              <App />
            </AuthLayout>
          }
        >
          <Route path="user" element={<User />} />
          <Route path="user/complete" element={<Complete />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
