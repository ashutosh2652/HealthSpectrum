import { motion } from 'framer-motion';
import { Brain, Shield, Users, Award, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import patientCare from '@/assets/patient-care.jpg';
import doctorHero from '@/assets/doctor-hero.jpg';

interface AboutProps {
  onBack: () => void;
}

export const About = ({ onBack }: AboutProps) => {
  return (
    <div className="min-h-screen cosmic-bg">
      <div className="absolute inset-0 stars-pattern opacity-40"></div>
      
      <div className="medical-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-24 pb-16"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <Button
              onClick={onBack}
              variant="ghost"
              className="absolute top-8 left-8 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-5xl font-bold text-medical-title mb-6">
              About MedAnalyze
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Revolutionizing healthcare through AI-powered medical document analysis, 
              making complex medical information accessible to everyone.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe that every patient deserves to understand their medical information. 
                Our AI-powered platform transforms complex medical documents into clear, 
                actionable insights that empower better healthcare decisions.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By bridging the gap between medical complexity and patient understanding, 
                we're creating a future where healthcare is more transparent, accessible, and effective.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-medical">
                <img 
                  src={patientCare} 
                  alt="Medical team providing patient care" 
                  className="w-full h-80 object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                icon: Brain,
                title: "AI-Powered",
                description: "Advanced machine learning algorithms analyze medical documents with precision"
              },
              {
                icon: Shield,
                title: "HIPAA Compliant",
                description: "Enterprise-grade security ensures your medical data is always protected"
              },
              {
                icon: Users,
                title: "Patient-Centered",
                description: "Designed with patients in mind, making complex medical information accessible"
              },
              {
                icon: Award,
                title: "Clinically Validated",
                description: "Our analysis is backed by medical expertise and continuous validation"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="card-medical-glow text-center p-8"
              >
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Built by Medical AI Experts
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Our team combines decades of medical expertise with cutting-edge AI research 
              to deliver the most accurate and reliable medical document analysis platform.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <div className="rounded-2xl overflow-hidden shadow-medical">
                <img 
                  src={doctorHero} 
                  alt="Medical AI research team" 
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-accent rounded-xl p-3 shadow-accent animate-bounce-subtle">
                <Brain className="w-6 h-6 text-accent-foreground" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};