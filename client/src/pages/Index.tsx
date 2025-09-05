import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Brain, FileText, Shield, ArrowRight, Zap, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/sections/HeroSection';
import { UploadSection } from '@/components/sections/UploadSection';
import { ProcessingSection } from '@/components/sections/ProcessingSection';
import { ResultsSection } from '@/components/sections/ResultsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { About } from './About';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'upload' | 'processing' | 'results'>('home');

  const handleGetStarted = () => {
    // For backend functionality like authentication and file uploads,
    // you'll need to connect to Supabase first
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-30"></div>
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-card/90 backdrop-blur-2xl border-b border-border/50 shadow-card">
        <div className="medical-container">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground group-hover:text-primary-glow transition-colors">MedAnalyze</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-6"
            >
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-primary-glow transition-colors font-medium"
                onClick={() => setCurrentView('home')}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-primary-glow transition-colors font-medium"
                onClick={() => setCurrentView('about')}
              >
                About
              </Button>
              <Button className="btn-medical-primary group">
                <Shield className="w-4 h-4 mr-2" />
                Sign In
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 relative z-10">
        {currentView === 'home' && (
          <>
            <HeroSection onGetStarted={handleGetStarted} />
            <FeaturesSection />
          </>
        )}
        
        {currentView === 'about' && (
          <About onBack={() => setCurrentView('home')} />
        )}
        
        {currentView === 'upload' && (
          <UploadSection 
            onContinue={() => setCurrentView('processing')}
            onBack={() => setCurrentView('home')}
          />
        )}
        
        {currentView === 'processing' && (
          <ProcessingSection 
            onComplete={() => setCurrentView('results')}
          />
        )}
        
        {currentView === 'results' && (
          <ResultsSection 
            onStartNew={() => setCurrentView('upload')}
          />
        )}
      </main>

      {/* Enhanced Footer */}
      {currentView === 'home' && (
        <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50 relative z-10">
          <div className="medical-container py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-foreground text-lg">MedAnalyze</span>
                </div>
                <p className="text-medical-body leading-relaxed">
                  AI-powered medical document analysis for better healthcare decisions and improved patient outcomes.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold text-foreground mb-4">Product</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Features</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Pricing</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">API</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Integrations</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-foreground mb-4">Support</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Help Center</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Contact</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Privacy</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Security</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-foreground mb-4">Company</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li 
                    className="hover:text-primary-glow transition-colors cursor-pointer"
                    onClick={() => setCurrentView('about')}
                  >
                    About
                  </li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Blog</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Careers</li>
                  <li className="hover:text-primary-glow transition-colors cursor-pointer">Press</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <div>© 2024 MedAnalyze. All rights reserved.</div>
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