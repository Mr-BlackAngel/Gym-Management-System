import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import GuestPortal from "./components/GuestPortal";
import AdminDashboard from "./components/AdminDashboard";
import TrainerDashboard from "./components/TrainerDashboard";
import MemberDashboard from "./components/MemberDashboard";

export type UserRole = "admin" | "trainer" | "member" | "guest" | null;

interface User {
  email: string;
  role: UserRole;
  name: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] =
    useState<"guest" | "login" | "signup" | "dashboard">("guest");

  // Load remembered session
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      const user = JSON.parse(rememberedUser);
      setCurrentUser(user);
      setCurrentView("dashboard");
    }
  }, []);

  // LOGIN handler
  const handleLogin = (user: User, rememberMe: boolean) => {
    setCurrentUser(user);
    setCurrentView("dashboard");

    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify(user));
    }
  };

  // LOGOUT handler
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("guest");
    localStorage.removeItem("rememberedUser");
  };

  const handleJoinNow = () => {
    setCurrentView("login");
  };

  const renderView = () => {
    /* Guest Portal */
    if (currentView === "guest") {
      return (
        <GuestPortal
          onJoinNow={handleJoinNow}
          onLogin={() => setCurrentView("login")}
        />
      );
    }

    /* Signup Page */
    /* Signup Page */
    if (currentView === "signup") {
      return (
        <Signup
          onBackToLogin={() => setCurrentView("login")}
          onSignupSuccess={() => setCurrentView("login")}
        />
      );
    }


    /* Login Page */
    if (currentView === "login") {
      return (
        <LoginPage
          onLogin={handleLogin}
          onBackToGuest={() => setCurrentView("guest")}
          onSignup={() => setCurrentView("signup")}
        />
      );
    }

    /* Dashboards */
    if (currentView === "dashboard" && currentUser) {
      switch (currentUser.role) {
        case "admin":
          return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
        case "trainer":
          return <TrainerDashboard user={currentUser} onLogout={handleLogout} />;
        case "member":
          return <MemberDashboard user={currentUser} onLogout={handleLogout} />;
        default:
          return (
            <GuestPortal
              onJoinNow={handleJoinNow}
              onLogin={() => setCurrentView("login")}
            />
          );
      }
    }

    return (
      <GuestPortal
        onJoinNow={handleJoinNow}
        onLogin={() => setCurrentView("login")}
      />
    );
  };

  return <div className="min-h-screen">{renderView()}</div>;
}
