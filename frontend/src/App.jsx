import Home from "./pages/Home";
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
import Notifications from "./pages/Notifications";
import UserDetails from "./pages/UserDetails";
import UpdateLocation from "./pages/UpdateLocation";
import Settings from "./pages/Settings";
import TransactionHistory from "./pages/TransactionHistory";
import InviteFriends from "./components/InviteFriends/InviteFriends";
import FundWallets from "./pages/FundWallet";
import Withdrawal from "./pages/Withdrawal";
import Earn from "./pages/Earn";
import EarnWithTasks from "./pages/EarnWithTasks";
import BecomeAMember from "./pages/BecomeAMember";
import Adevertise from "./pages/Advertise";
import Order from "./pages/Order";
import CreateAdvert from "./pages/CreateAdvert";
import ClientLayout from "./Layouts/ClientLayout";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/ref/:username">
            <SignUp />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <ClientLayout>
            <Route path="/dashboard">
              <ClientDashboard />
            </Route>
            <Route path="/help-support">
              <HelpSupport />
            </Route>
            <Route path="/notifications">
              <Notifications />
            </Route>
            <Route path="/user-details">
              <UserDetails />
            </Route>
            <Route path="/fund-wallet">
              <FundWallets />
            </Route>
            <Route path="/withdraw">
              <Withdrawal />
            </Route>
            <Route path="/update-location">
              <UpdateLocation />
            </Route>
            <Route path="/invite">
              <InviteFriends />
            </Route>
            <Route path="/advertise/:slug">
              <CreateAdvert />
            </Route>
            <Route path="/advertise">
              <Adevertise />
            </Route>
            <Route path="/order">
              <Order />
            </Route>
            <Route exact path="/become-a-member">
              <BecomeAMember />
            </Route>
            <Route path="/earn/:slug">
              <EarnWithTasks />
            </Route>
            <Route path="/earn">
              <Earn />
            </Route>
            <Route path="/account-settings">
              <Settings />
            </Route>
            <Route path="/transaction-history">
              <TransactionHistory />
            </Route>
          </ClientLayout>
        </Switch>
      </Router>
    </>
  );
}

export default App;
