import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";

function App() {
  axios.defaults.baseURL =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_SERVER_BASE_URL
      : import.meta.env.VITE_PROD_SERVER_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <>
      <Router>
        {/* Landing Page */}
        <Route exact path="/">
          <Home />
        </Route>
      </Router>
    </>
  );
}

export default App;
