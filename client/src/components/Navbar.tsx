import { motion } from "framer-motion";
import { Shield, ArrowRight, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerUserThunk, loginUserThunk } from "@/store/thunk/authThunk";

// import UserProfile from "./components/UserProfile";

interface NavbarProps {
  className?: string;
  onHomeClick?: () => void;
  onAboutClick?: () => void;
  useInternalNavigation?: boolean;
}

export const Navbar = ({
  className = "",
  onHomeClick,
  onAboutClick,
  useInternalNavigation = false,
}: NavbarProps) => {
  const location = useLocation();
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;

    // Guard all fields coming from Clerk to avoid runtime errors
    const email =
      user.emailAddresses && user.emailAddresses.length > 0
        ? user.emailAddresses[0].emailAddress
        : undefined;
    const clerkId = user.id;
    const userName =
      user.firstName ||
      user.username ||
      (email ? email.split("@")[0] : undefined);

    // Only proceed when we have at least an email or clerkId
    console.log(email, " ", userName, " ", clerkId);

    dispatch(registerUserThunk({ email, userName, clerkId })).then(
      (data: any) => {
        if (data.payload.success) {
          loginUserThunk({ email, clerkId });
        }
      }
    );
  }, [user, dispatch]);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-card/90 backdrop-blur-2xl border-b border-border/50 shadow-card ${className}`}
    >
      <div className="medical-container">
        <div className="flex items-center justify-between h-16">
          <Link to="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 overflow-hidden rounded-full shadow-glow group-hover:scale-110 transition-transform duration-300">
                <img
                  src="/logo2.png"
                  alt="HealthSpectrum Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold flex transition-colors">
                <span className="text-[#273fb9]">Health</span>
                <span className="text-[#30a88e]">Spectrum</span>
              </span>
            </motion.div>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-6"
          >
            <Link to="/">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                Home
              </Button>
            </Link>

            <Link to="/about">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  isActive("/about")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                About
              </Button>
            </Link>
            <Link to="/upload">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  !useInternalNavigation && isActive("/upload")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                Upload
              </Button>
            </Link>

            <Link to="/history">
              <Button
                variant="ghost"
                className={`transition-colors font-medium ${
                  !useInternalNavigation && isActive("/history")
                    ? "text-primary-glow bg-primary-soft border border-primary/20 rounded-lg px-4"
                    : "text-muted-foreground hover:text-primary-glow"
                }`}
              >
                History
              </Button>
            </Link>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 p-0 text-muted-foreground hover:text-primary-glow transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
            <SignedOut>
              {/* <p>You are signed out.</p> */}
              <SignInButton mode="modal" />
              <SignUpButton mode="modal" />
            </SignedOut>

            <SignedIn>
              <div
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <UserButton />
                {/* <button onClick={logoutFromBackend}>Logout</button> */}
              </div>

              {/* <UserProfile /> */}
            </SignedIn>
            {/* <Link to="/auth/sign-in">
              <Button className="btn-medical-primary group">
                <Shield className="w-4 h-4 mr-2" />
                Login/Signup
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link> */}
          </motion.div>
        </div>
      </div>
    </nav>
  );
};
