import Home from "./pages/Home";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/Forgot-Password";
import ClientDashboard from "./pages/ClientDashboard";
import HelpSupport from "./pages/HelpSupport";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/dashboard">
            <ClientDashboard />
          </Route>
          <Route path="/help-support">
            <HelpSupport />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
