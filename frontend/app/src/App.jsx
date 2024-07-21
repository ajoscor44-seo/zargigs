import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
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
import TaskHistory from "./pages/TaskHistory";
import CreateAdvert from "./pages/CreateAdvert";
import AuthProvider from "./context/AuthContext.jsx";
import PrivateRoute from "./routers/PrivateRoutes.jsx";
import RegistrationPage from "./pages/Registration.jsx";
import Authentication from "./pages/Authentication.jsx";
import UploadInfoPage from "./pages/UploadInfoPage.jsx";
import UploadProfilePrivateRoute from "./routers/UploadProfileRoutes.jsx";
import MemberPrivateRoute from "./routers/MemberPrivateRoute.jsx";
import VerifiedMemberPrivateRoute from "./routers/VerifiedMemberPrivateRoute.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import CreateOrder from "./pages/CreateOrder.jsx";
import TaskDetails from "./pages/TaskDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import TransferPage from "./pages/Transfer.jsx";
import FundingDetails from "./pages/FundingDetails.jsx";
import Advertisement from "./pages/Advertisement.jsx";

function App() {
  axios.defaults.baseURL =
    import.meta.env.VITE_NODE_ENV !== "production"
      ? import.meta.env.VITE_DEV_SERVER_BASE_URL
      : import.meta.env.VITE_PROD_SERVER_BASE_URL;
  axios.defaults.withCredentials = true;

  return (
    <>
      <Router>
        {/* App Routes */}
        <AuthProvider>
          <Switch>
            {/* Public Pages */}
            <Route exact path="/ref/:username">
              <RegistrationPage />
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
            <PrivateRoute exact path="/" component={ClientDashboard} />
            <PrivateRoute path="/help-support" component={HelpSupport} />
            <PrivateRoute path="/notifications" component={Notifications} />
            <PrivateRoute path="/user-details" component={UserDetails} />
            <PrivateRoute path="/fund-wallet" component={FundWallets} />
            <PrivateRoute path="/fundings/:id" component={FundingDetails} />
            <VerifiedMemberPrivateRoute
              path="/withdraw"
              component={Withdrawal}
            />
            <VerifiedMemberPrivateRoute
              path="/transfer"
              component={TransferPage}
            />
            <PrivateRoute path="/update-location" component={UpdateLocation} />
            <PrivateRoute path="/edit-profile" component={EditProfile} />
            <PrivateRoute path="/invite" component={InviteFriends} />
            <PrivateRoute path="/advertisements" component={Advertisement} />
            <PrivateRoute path="/advertise/:slug" component={CreateAdvert} />
            <PrivateRoute path="/advertise" component={Adevertise} />
            <PrivateRoute path="/order/:slug" component={CreateOrder} />
            <PrivateRoute
              path="/order-history/:slug/:id"
              component={OrderDetails}
            />
            <PrivateRoute path="/order-history" component={OrderHistory} />
            <PrivateRoute path="/order" component={Order} />
            <MemberPrivateRoute
              path="/become-a-member"
              component={BecomeAMember}
            />
            <VerifiedMemberPrivateRoute
              path="/earn/:type/:slug/:platform/:status/:id"
              component={TaskDetails}
            />
            <VerifiedMemberPrivateRoute
              path="/earn/:slug"
              component={EarnWithTasks}
            />
            <VerifiedMemberPrivateRoute
              path="/tasks-history"
              component={TaskHistory}
            />
            <PrivateRoute path="/earn" component={Earn} />
            <PrivateRoute path="/account-settings" component={Settings} />
            <PrivateRoute
              path="/transaction-history"
              component={TransactionHistory}
            />
            <Route component={NotFound} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
