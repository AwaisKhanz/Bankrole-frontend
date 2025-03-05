import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import SubscriptionGuard from "./routes/SubscriptionGuard";
import AdminMiddleware from "./routes/AdminMiddleware";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";
import Bankrolls from "./pages/Bankrolls";
import CalendarPage from "./pages/Calendar";
import Ranking from "./pages/Ranking";
import UserManagement from "./pages/UserManagement";
import BettingManagement from "./pages/BettingManagement";
import { useAuth } from "./context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ToastContainer } from "react-toastify";
import PaymentPage from "./pages/PaymentPage";
import Loading from "./components/Loading";
import BankrollView from "./pages/BankrollView";
import RiskCalculator from "./pages/RiskCalculator";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Box, useTheme } from "@mui/material";
import Profile from "./pages/Profile";
import PoissonMatchCalculator from "./pages/PoissonMatchCalculator";
import Analytics from "./pages/Analytics";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = ({ toggleTheme, mode }) => {
  const { loading } = useAuth();
  const theme = useTheme();

  if (loading) {
    return <Loading message="Authenticating..." mode={mode} />;
  }

  return (
    <Box
      sx={{
        background: theme.palette.primary.main,
      }}
    >
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login mode={mode} />} />
        <Route path="/register" element={<Register mode={mode} />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword mode={mode} />}
        />
        <Route
          path="/reset-password/:token"
          element={<ResetPassword mode={mode} />}
        />

        <Route
          path="bankroll/view/:id"
          element={<BankrollView mode={mode} isViewMode={true} />}
        />

        {/* Protected routes with Sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout toggleTheme={toggleTheme} mode={mode} />
            </ProtectedRoute>
          }
        >
          <Route
            path="/profile"
            element={
              <Elements stripe={stripePromise}>
                <Profile mode={mode} />
              </Elements>
            }
          />

          <Route
            path="bankroll/:id"
            element={
              <SubscriptionGuard>
                <BankrollView mode={mode} />
              </SubscriptionGuard>
            }
          />

          <Route
            index
            element={
              <SubscriptionGuard>
                <Bankrolls mode={mode} />
              </SubscriptionGuard>
            }
          />
          <Route
            path="calendar"
            element={
              <SubscriptionGuard>
                <CalendarPage mode={mode} />
              </SubscriptionGuard>
            }
          />
          <Route path="ranking" element={<Ranking mode={mode} />} />
          <Route
            path="/risk-calculator"
            element={<RiskCalculator mode={mode} />}
          />

          <Route
            path="/poisson-match-calculator"
            element={<PoissonMatchCalculator mode={mode} />}
          />

          <Route
            path="analytics"
            element={
              <SubscriptionGuard>
                <Analytics mode={mode} />
              </SubscriptionGuard>
            }
          />

          {/* Admin Routes */}
          <Route
            path="user-management"
            element={
              <AdminMiddleware>
                <UserManagement mode={mode} />
              </AdminMiddleware>
            }
          />
          <Route
            path="betting-management"
            element={
              <AdminMiddleware>
                <BettingManagement mode={mode} />
              </AdminMiddleware>
            }
          />
        </Route>

        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage mode={mode} />
            </Elements>
          }
        />
      </Routes>
    </Box>
  );
};

export default App;
