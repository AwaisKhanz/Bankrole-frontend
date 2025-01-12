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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading message="Authenticating..." />;
  }

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes with Sidebar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="bankroll/:id"
            element={
              <SubscriptionGuard>
                <BankrollView />
              </SubscriptionGuard>
            }
          />

          <Route
            index
            element={
              <SubscriptionGuard>
                <Bankrolls />
              </SubscriptionGuard>
            }
          />
          <Route
            path="calendar"
            element={
              <SubscriptionGuard>
                <CalendarPage />
              </SubscriptionGuard>
            }
          />
          <Route path="ranking" element={<Ranking />} />
          <Route path="/risk-calculator" element={<RiskCalculator />} />

          {/* Admin Routes */}
          <Route
            path="user-management"
            element={
              <AdminMiddleware>
                <UserManagement />
              </AdminMiddleware>
            }
          />
          <Route
            path="betting-management"
            element={
              <AdminMiddleware>
                <BettingManagement />
              </AdminMiddleware>
            }
          />
        </Route>
        <Route
          path="/payment"
          element={
            <Elements stripe={stripePromise}>
              <PaymentPage />
            </Elements>
          }
        />
      </Routes>
    </>
  );
};

export default App;
