import React from "react";
import loadjs from "loadjs";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Signup } from "./pages/Signup";
import Login from "./pages/Login";
import MultifactorAuth from "./pages/MultifactorAuth";
import { Navbar } from "./components/UI/Navbar";
import { Footer } from "./components/UI/Footer";

import { useUserStore } from "./store/user.store";
import { ForgotPassword } from "./components/Auth/ForgotPassword";
import { ResetPassword } from "./components/Auth/ResetPassword";
import { Dashboard } from "./components/UI/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProfile } from "./components/UI/UserProfile/UserProfile";
import { Order } from "./components/UI/Order/Order";

function App() {
  const isAuthenticated = useUserStore((state) => !!state.accessToken);
  const user = useUserStore((state) => state.user);

  console.log("🟡 user: ", user);

  // SCRIPT LOAD
  const runScript = () => {
    loadjs(
      [
        "/assets/js/all.min.js",
        "/assets/js/aos.js",
        "/assets/js/bootstrap.bundle.min.js",
        "/assets/js/custom.js",
        "/assets/js/fslightbox.js",
        "/assets/js/niceCountryInput.js",
        "/assets/js/plugins.js",
        "/assets/js/plugin-custom.js",
        "/assets/js/purecounter_vanilla.js",
        "/assets/js/swiper-bundle.min.js",
        "assets/js/bootstrap.bundle.min.js",
        "assets/js/all.min.js",
        "assets/js/swiper-bundle.min.js",
        "assets/js/aos.js",
        "assets/js/fslightbox.js",
        "assets/js/custom.js",
      ],
      () => {
        console.info("Scripts Loaded!");
      }
    );
  };

  React.useEffect(() => {
    runScript();
  }, []);

  const NavbarLayout = () => (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route path="/two-step-auth" element={<MultifactorAuth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={<NavbarLayout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/orders" element={<Order />} />
            </Route>
          </Route>
          <Route path="*" element={<p>404 Page</p>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
