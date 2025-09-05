import { motion } from 'framer-motion';
import { Brain, Shield, Clock, Users, FileText, TrendingUp, Zap, Eye } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced medical AI analyzes your documents with 95% accuracy, extracting key health insights and risk factors.',
    gradient: 'from-primary to-primary-hover'
  },
  {
    icon: Shield,
    title: 'HIPAA Compliant',
    description: 'Your medical data is encrypted and processed securely with full HIPAA compliance and privacy protection.',
    gradient: 'from-accent to-accent'
  },
  {
    icon: Clock,
    title: 'Instant Results',
    description: 'Get comprehensive health analysis in under 60 seconds, no waiting for manual review or interpretation.',
    gradient: 'from-warning to-warning'
  },
  {
    icon: Eye,
    title: 'Document OCR',
    description: 'Extract text from any medical document format - PDFs, images, handwritten notes, and lab reports.',
    gradient: 'from-primary to-accent'
  },
  {
    icon: TrendingUp,
    title: 'Risk Assessment',
    description: 'Identify potential health risks and get severity indicators with clear explanations and next steps.',
    gradient: 'from-destructive to-warning'
  },
  {
    icon: Users,
    title: 'Share with Doctors',
    description: 'Generate professional reports that you can easily share with your healthcare providers for better care.',
    gradient: 'from-accent to-primary'
  }
];

const stats = [
  { value: '10,000+', label: 'Documents Analyzed', icon: FileText },
  { value: '95%', label: 'Accuracy Rate', icon: Brain },
  { value: '<60s', label: 'Average Processing', icon: Clock },
  { value: '99.9%', label: 'Data Security', icon: Shield }
];

export const FeaturesSection = () => {
  return (
    <section className="medical-section bg-card/30">
      <div className="medical-container">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-medical-title mb-4">Powerful Medical AI Features</h2>
          <p className="text-medical-body max-w-2xl mx-auto">
            Transform complex medical documents into clear, actionable health insights with our advanced AI technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-medical-glow group"
            >
              <div className={`
                w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6
                group-hover:scale-110 transition-transform duration-300
              `}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-medical-title mb-4">How It Works</h2>
            <p className="text-medical-body max-w-2xl mx-auto">
              Get comprehensive medical insights in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Documents',
                description: 'Securely upload your medical documents, prescriptions, lab results, or health reports.',
                icon: FileText
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our medical AI processes and analyzes your documents to extract key health insights.',
                icon: Brain
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive a comprehensive health report with recommendations and risk assessments.',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center relative"
              >
                {/* Connection Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-8 h-0.5 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2 z-10" />
                )}
                
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <item.icon className="w-8 h-8 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{item.step}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};