import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { UploadSection } from "@/components/sections/UploadSection";
import { ProcessingSection } from "@/components/sections/ProcessingSection";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { About } from "./About";

const Index = () => {
  const [currentView, setCurrentView] = useState<
    "home" | "about" | "upload" | "processing" | "results"
  >("home");
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the dedicated upload page
    navigate("/upload");
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>

      {/* Enhanced Navigation */}
      <Navbar
        useInternalNavigation={true}
        onHomeClick={() => setCurrentView("home")}
        onAboutClick={() => setCurrentView("about")}
      />

      {/* Main Content */}
      <main className="pt-16 relative z-10">
        {currentView === "home" && (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <FeaturesSection />
          </>
        )}

        {currentView === "about" && (
          <About onBack={() => setCurrentView("home")} />
        )}

        {currentView === "upload" && (
          <UploadSection
            onContinue={() => setCurrentView("processing")}
            onBack={() => setCurrentView("home")}
          />
        )}

        {currentView === "processing" && (
          <ProcessingSection onComplete={() => setCurrentView("results")} />
        )}

        {currentView === "results" && (
          <ResultsSection onStartNew={() => setCurrentView("upload")} />
        )}
      </main>

      {/* Enhanced Footer */}
      {currentView === "home" && (
        <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50 relative z-10">
          <div className="medical-container py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-foreground text-lg">
                    Health-Spectrum
                  </span>
                </div>
                <p className="text-medical-body leading-relaxed">
                  AI-powered medical document analysis for better healthcare
                  decisions and improved patient outcomes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-4">Product</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Features
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Pricing
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    API
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Integrations
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-4">Support</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Help Center
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Contact
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Privacy
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Security
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-4">Company</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li
                    className="hover:text-primary-glow transition-colors cursor-pointer"
                    onClick={() => setCurrentView("about")}
                  >
                    About
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Blog
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Careers
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">
                    Press
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div>© 2024 Health-Spectrum. All rights reserved.</div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Shield className="w-4 h-4 text-accent" />
                <span>HIPAA Compliant & SOC 2 Certified</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
