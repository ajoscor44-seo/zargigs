import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import AuthProvider from "./context/LandingContext";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import AboutUs from "./pages/AboutUs";
import TermsOfUse from "./pages/TermsOfUse";

function App() {
  axios.defaults.baseURL =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_SERVER_BASE_URL
      : import.meta.env.VITE_PROD_SERVER_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <>
      <AuthProvider>
        <Router>
          {/* Landing Page */}
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/privacy-policy">
            <PrivacyPolicy />
          </Route>
          <Route path="/refund-policy">
            <RefundPolicy />
          </Route>
          <Route path="/about-us">
            <AboutUs />
          </Route>
          <Route path="/terms">
            <TermsOfUse />
          </Route>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
