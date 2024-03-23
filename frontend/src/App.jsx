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
import InputUserInfoLayout from "./Layouts/InputUserInfoLayout";
import AuthProvider from "./context/AuthContext.jsx";
import VerifyEmailAddress from "./pages/VerifyEmailAddress.jsx";
import PrivateRoute from "./routers/PrivateRoutes.jsx";
import SetLocationPage from "./pages/SetLocation.jsx";
import VerifiedEmailPrivateRoute from "./routers/VerifiedEmailPrivateRoutes.jsx";
import UploadProfilePicPrivateRoute from "./routers/UploadProfileRoutes.jsx";
import UploadProfilePage from "./pages/UploadProfile.jsx";
import SetBirthReligion from "./pages/SetBirthReligion.jsx";
import RegistrationPage from "./pages/Registration.jsx";

function App() {
  return (
    <>
      <Router>
        <Route exact path="/">
          <Home />
        </Route>

        <AuthProvider>
          <Switch>
            {/* Public Pages */}
            <Route exact path="/ref/:username">
              <SignUp />
            </Route>
            <Route exact path="/signup">
              <RegistrationPage />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/forgot-password">
              <ForgotPassword />
            </Route>

            {/* Client Info Input Pages */}
            {/* <PrivateRoute path="/verify-email" component={VerifyEmailAddress} /> */}
            <Route path="/verify-email">
              <VerifyEmailAddress />
            </Route>
            <Route path="/set-location">
              <SetLocationPage />
            </Route>
            <Route path="/upload-profile-pic">
              <UploadProfilePage />
            </Route>
            <Route path="/set-birth-religion">
              <SetBirthReligion />
            </Route>

            {/* Client Page Layout */}
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
            <Route exact path="/advertise">
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
            <Route exact path="/earn">
              <Earn />
            </Route>
            <Route path="/account-settings">
              <Settings />
            </Route>
            <Route path="/transaction-history">
              <TransactionHistory />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
