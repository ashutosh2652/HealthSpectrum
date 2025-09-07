import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import AboutPage from "./pages/AboutPage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
// import SignIn from "./pages/SignIn";
// import SignUp from "./pages/SignUp";
import AuthLayout from "./components/auth/Layout";
import InsightsPage from "./pages/insights";
import Processing from "./pages/Processing";
import Results from "./pages/results";
import Analysis from "./pages/Analysis.tsx";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { ThemeProvider } from "@/contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* <Route path="/auth" element={<AuthLayout />}>
              <Route path="sign-in" element={<SignIn />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route> */}
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/history" element={<History />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/processing" element={<Processing />} />
            <Route path="/results" element={<Results />} />
            <Route path="/report" element={<Analysis />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
