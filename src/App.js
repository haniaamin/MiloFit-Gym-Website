import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import Homepage from "./pages/Homepage";
import TrainersPage from "./pages/TrainersPage";
import Opinions from "./components/Opinions";
import Footer from "./components/Footer";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassword";
import EmailVerification from "./pages/auth/EmailVerification";
import ResetPassword from "./pages/auth/ResetPassword";
import PassChanged from "./pages/auth/PassChanged";
import CreateAccount from "./pages/auth/CreateAccount";
import CompleteProfile from "./pages/trainee/CompleteProfile";
import FitnessGoals from "./pages/trainee/FitnessGoals";
import ActivityLevel from "./pages/trainee/ActivityLevel";
import MedicalInfo from "./pages/trainee/MedicalInfo";
import CompleteProfileTrainer from "./pages/trainer/CompleteProfileTrainer";
import FinalSubmit from "./pages/trainer/FinalSubmit";
import TraineeDash from "./pages/traineedash/TraineeDash";
import TraineeProgress from "./pages/traineedash/TraineeProgress";
import UpcomingSessions from "./pages/traineedash/UpcomingSessions";
import TrainerProfiles from "./pages/traineedash/TrainerProfiles";
import Membership from "./pages/traineedash/Membership";
import Chat from "./pages/traineedash/Chat";
import TraineeProfile from "./pages/traineedash/TraineeProfile";
import TraineeFeedback from "./pages/traineedash/TraineeFeedback";
import TrainerDash from "./pages/trainerdash/TrainerDash";
import ClientManagement from "./pages/trainerdash/ClientManagement";
import Schedule from "./pages/trainerdash/Schedule";
import TrainerProgress from "./pages/trainerdash/TrainerProgress";
import Packages from "./pages/trainerdash/Packages";
import TrainerChat from "./pages/trainerdash/TrainerChat";
import TrainerSettings from "./pages/trainerdash/TrainerSettings";
import TrainerProfile from "./pages/trainerdash/TrainerProfile";
import TrainerPackages from "./pages/traineedash/TrainerPackages";
import PaymentMethod from './pages/traineedash/PaymentMethod';
import PaymentConfirmation from './pages/traineedash/PaymentConfirmation';
import TraineeReviewForm from './pages/traineedash/TraineeReviewForm';
import { ReviewProvider } from './context/ReviewContext';
import AIplan from './pages/traineedash/AIplan';
import PlanDisplayPage from './pages/traineedash/PlanDisplayPage';
import AdminDash from "./pages/admindash/AdminDash";
import UserManagement from "./pages/admindash/UserManagement";
import TrainerApproval from "./pages/admindash/TrainerApproval";
import TrainerApprovalProfile from "./pages/admindash/TrainerApprovalProfile";
import ContentManagement from "./pages/admindash/ContentManagement";
import NotificationsManagement from "./pages/admindash/NotificationsManagement";
import Analytics from "./pages/admindash/Analytics";
import BillingManagement from "./pages/admindash/BillingManagement";
import AdminProfile from "./pages/admindash/AdminProfile";

function App() {
  return (
    <Router>
      <ReviewProvider>
        <div className="App">
          <Header />
          <Chatbot />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/opinions" element={<Opinions />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pass-changed" element={<PassChanged />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/complete-profile-trainee" element={<CompleteProfile />} />
            <Route path="/fitness-goals" element={<FitnessGoals />} />
            <Route path="/activity-level" element={<ActivityLevel />} />
            <Route path="/medical-info" element={<MedicalInfo />} />
            <Route path="/complete-profile-trainer" element={<CompleteProfileTrainer />} />
            <Route path="/final-submit" element={<FinalSubmit />} />
            <Route path="/trainee-dashboard" element={<TraineeDash />} />
            <Route path="/ai-plan" element={<AIplan />} />
            <Route path="/progress-tracking" element={<TraineeProgress />} />
            <Route path="/upcoming-sessions" element={<UpcomingSessions />} />
            <Route path="/trainer-profiles" element={<TrainerProfiles />} />
            <Route path="/membership-packages" element={<Membership />} />
            <Route path="/trainer-packages/:id" element={<TrainerPackages />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/settings-profile" element={<TraineeProfile />} />
            <Route path="/feedback-reviews" element={<TraineeFeedback />} />
            <Route path="/trainer-dashboard" element={<TrainerDash />} />
            <Route path="/client-management" element={<ClientManagement />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/trainer-progress" element={<TrainerProgress />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/trainer-chat" element={<TrainerChat />} />
            <Route path="/trainer-settings" element={<TrainerSettings />} />
            <Route path="/trainer-profile:id" element={<TrainerProfile />} />
            <Route path="/trainer/:id" element={<TrainerProfile />} />
            <Route path="/payment" element={<PaymentMethod />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
            <Route path="/write-review" element={<TraineeReviewForm />} />
            <Route path="/plan-display" element={<PlanDisplayPage />} />
            <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/user-manage" element={<UserManagement />} />
        <Route path="/trainer-approval" element={<TrainerApproval />} />
        <Route path="/trainer-approval/:id" element={<TrainerApprovalProfile />} />
        <Route path="/content-manage" element={<ContentManagement />} />
        <Route path="/notification-manage" element={<NotificationsManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/billing-manage" element={<BillingManagement />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
          </Routes>
        </div>
      </ReviewProvider>
    </Router>
  );
}

export default App;