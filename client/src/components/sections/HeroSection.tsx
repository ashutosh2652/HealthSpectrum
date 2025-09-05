import { motion } from "framer-motion";
import { Brain, Upload, Zap, Shield, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
	onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
	return (
		<section className='medical-section cosmic-bg relative overflow-hidden'>
			{/* Enhanced Background Effects */}
			<div className='absolute inset-0 bg-gradient-cosmic'></div>
			<div className='absolute inset-0 stars-pattern'></div>
			<div className='absolute top-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float'></div>
			<div className='absolute bottom-20 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float-delayed'></div>
			<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-aurora rounded-full blur-3xl animate-pulse-soft'></div>

			<div className='medical-container relative z-10'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
					{/* Content */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className='space-y-8'
					>
						<div className='space-y-4'>
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
								className='inline-flex items-center space-x-2 bg-primary-soft border border-primary/20 rounded-full px-4 py-2'
							>
								<Zap className='w-4 h-4 text-primary' />
								<span className='text-sm font-medium text-primary'>
									AI-Powered Analysis
								</span>
							</motion.div>

							<h1 className='text-5xl lg:text-6xl font-bold leading-tight'>
								<span className='text-medical-title'>
									Transform Your
								</span>
								<br />
								<span className='text-foreground'>
									Medical Documents
								</span>
							</h1>

							<p className='text-xl text-muted-foreground leading-relaxed'>
								Upload prescriptions, lab results, and medical
								reports to get instant AI-powered analysis, risk
								assessments, and personalized health insights
								you can understand.
							</p>
						</div>

						<div className='flex flex-col sm:flex-row gap-4'>
							<Button
								onClick={onGetStarted}
								className='btn-medical-primary group'
							>
								<Upload className='w-5 h-5 mr-2' />
								Get Started Free
								<ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
							</Button>

							<Button className='btn-medical-secondary'>
								<FileText className='w-5 h-5 mr-2' />
								View Demo
							</Button>
						</div>

						{/* Trust Indicators */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6 }}
							className='flex items-center space-x-6 pt-4'
						>
							<div className='flex items-center space-x-2'>
								<Shield className='w-5 h-5 text-accent' />
								<span className='text-sm text-muted-foreground'>
									HIPAA Compliant
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<Brain className='w-5 h-5 text-primary' />
								<span className='text-sm text-muted-foreground'>
									AI-Verified
								</span>
							</div>
							<div className='flex items-center space-x-2'>
								<Zap className='w-5 h-5 text-warning' />
								<span className='text-sm text-muted-foreground'>
									Instant Results
								</span>
							</div>
						</motion.div>
					</motion.div>

					{/* Enhanced Visual with Images */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className='relative'
					>
						{/* Main Analysis Card */}
						<div className='relative card-medical-glow backdrop-blur-2xl shadow-medical'>
							{/* Doctor Image */}

							{/* Mock Document Interface */}
							<div className='space-y-6 relative z-10'>
								<div className='flex items-center justify-between'>
									<h3 className='text-xl font-bold text-foreground'>
										AI Medical Analysis
									</h3>
									<div className='status-normal animate-pulse-soft'>
										Active
									</div>
								</div>

								<div className='space-y-4'>
									<div className='bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-accent/20'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm font-semibold text-foreground'>
												Blood Pressure
											</span>
											<span className='status-normal'>
												Normal
											</span>
										</div>
										<div className='w-full bg-secondary/50 rounded-full h-3'>
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: "75%" }}
												transition={{
													duration: 2,
													delay: 1,
												}}
												className='bg-gradient-to-r from-accent to-accent-glow h-3 rounded-full shadow-accent'
											></motion.div>
										</div>
									</div>

									<div className='bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-warning/20'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm font-semibold text-foreground'>
												Cholesterol
											</span>
											<span className='status-warning'>
												Monitor
											</span>
										</div>
										<div className='w-full bg-secondary/50 rounded-full h-3'>
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: "50%" }}
												transition={{
													duration: 2,
													delay: 1.5,
												}}
												className='bg-gradient-to-r from-warning to-warning/80 h-3 rounded-full'
											></motion.div>
										</div>
									</div>

									<div className='bg-muted/50 backdrop-blur-sm rounded-xl p-5 border border-primary/20'>
										<div className='flex items-center justify-between mb-3'>
											<span className='text-sm font-semibold text-foreground'>
												Health Score
											</span>
											<span className='text-sm font-mono text-primary-glow font-bold'>
												85/100
											</span>
										</div>
										<div className='w-full bg-secondary/50 rounded-full h-3'>
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: "85%" }}
												transition={{
													duration: 2,
													delay: 2,
												}}
												className='bg-gradient-primary h-3 rounded-full shadow-glow'
											></motion.div>
										</div>
									</div>
								</div>
							</div>

							{/* Enhanced Floating Elements */}
							<motion.div
								animate={{
									y: [-15, 15, -15],
									rotate: [0, 5, 0],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: "easeInOut",
								}}
								className='absolute -top-6 -right-6 bg-gradient-primary rounded-2xl p-4 shadow-glow animate-glow'
							>
								<Brain className='w-8 h-8 text-primary-foreground' />
							</motion.div>

							<motion.div
								animate={{
									y: [15, -15, 15],
									rotate: [0, -5, 0],
								}}
								transition={{
									duration: 5,
									repeat: Infinity,
									ease: "easeInOut",
									delay: 1,
								}}
								className='absolute -bottom-6 -left-6 bg-gradient-to-br from-accent to-accent-glow rounded-2xl p-4 shadow-accent'
							>
								<FileText className='w-8 h-8 text-accent-foreground' />
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
