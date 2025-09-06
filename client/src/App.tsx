import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import AboutPage from "./pages/AboutPage";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AuthLayout from "./components/auth/Layout";
import InsightsPage from "./pages/insights";
import Processing from "./pages/Processing"
import Results from "./pages/results";
import Process from "./pages/process";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<InsightsPage />}/>
           <Route path="/processing" element={<Processing />}/>
            <Route path="/results" element={<Results />}/>
             <Route path="/process" element={<Process/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
