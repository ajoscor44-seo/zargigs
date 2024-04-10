import Home from "./pages/Home";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
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
import AuthProvider from "./context/AuthContext.jsx";
import PrivateRoute from "./routers/PrivateRoutes.jsx";
import RegistrationPage from "./pages/Registration.jsx";
import Authentication from "./pages/Authentication.jsx";
import UploadInfoPage from "./pages/UploadInfoPage.jsx";
import UploadProfilePrivateRoute from "./routers/UploadProfileRoutes.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";
import MemberPrivateRoute from "./routers/MemberPrivateRoute.jsx";
import VerifiedMemberPrivateRoute from "./routers/VerifiedMemberPrivateRoute.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import AdvertOrderDetails from "./pages/AdvertOrderDetails.jsx";

function App() {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  return (
    <>
      <Router>
        {/* Landing Page */}
        <Route exact path="/">
          <Home />
        </Route>

        {/* App Routes */}
        <AuthProvider>
          <SocketContextProvider>
            <Switch>
              {/* Public Pages */}
              <Route exact path="/ref/:username">
                <SignUp />
              </Route>
              <Route exact path="/signup">
                <RegistrationPage />
              </Route>
              <Route exact path="/login">
                <Authentication />
              </Route>

              {/* Client Forgot Password Route */}
              <PrivateRoute
                exact
                path="/forgot-password/:username"
                component={ForgotPassword}
              />

              {/* Client Info Input Pages */}
              <UploadProfilePrivateRoute
                path="/input-user-info"
                component={UploadInfoPage}
              />

              {/* Client Page Layout */}
              <PrivateRoute path="/dashboard" component={ClientDashboard} />
              <PrivateRoute path="/help-support" component={HelpSupport} />
              <PrivateRoute path="/notifications" component={Notifications} />
              <PrivateRoute path="/user-details" component={UserDetails} />
              <PrivateRoute path="/fund-wallet" component={FundWallets} />
              <VerifiedMemberPrivateRoute
                path="/withdraw"
                component={Withdrawal}
              />
              <PrivateRoute
                path="/update-location"
                component={UpdateLocation}
              />
              <PrivateRoute path="/invite" component={InviteFriends} />
              <PrivateRoute path="/advertise/:slug" component={CreateAdvert} />
              <PrivateRoute path="/advertise" component={Adevertise} />
              <PrivateRoute path="/order/:slug" component={CreateAdvert} />
              <PrivateRoute
                path="/order-history/:id"
                component={AdvertOrderDetails}
              />
              <PrivateRoute path="/order-history" component={OrderHistory} />
              <PrivateRoute path="/order" component={Order} />
              <MemberPrivateRoute
                path="/become-a-member"
                component={BecomeAMember}
              />
              <VerifiedMemberPrivateRoute
                path="/earn/:slug"
                component={EarnWithTasks}
              />
              <PrivateRoute path="/earn" component={Earn} />
              <PrivateRoute path="/account-settings" component={Settings} />
              <PrivateRoute
                path="/transaction-history"
                component={TransactionHistory}
              />
            </Switch>
          </SocketContextProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
