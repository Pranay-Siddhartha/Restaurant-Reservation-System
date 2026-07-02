import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiLightningBolt,
  HiClock,
  HiClipboardCheck,
  HiArrowRight,
} from 'react-icons/hi';
import PageTransition from '../components/PageTransition';
import SplitText from '../components/SplitText';
import TiltedCard from '../components/TiltedCard';
import SpotlightCard from '../components/SpotlightCard';
import ChampagneParticles from '../components/ChampagneParticles';
import ShinyText from '../components/ShinyText';

const features = [
  {
    icon: HiCalendar,
    title: 'Easy Booking',
    description:
      'Reserve your table in seconds with our intuitive booking system. Pick a date, time, and party size.',
  },
  {
    icon: HiLightningBolt,
    title: 'Smart Table Assignment',
    description:
      'Our system automatically finds the best available table for your party size and preferences.',
  },
  {
    icon: HiClock,
    title: 'Real-time Availability',
    description:
      'See live table availability and never worry about double bookings or scheduling conflicts.',
  },
  {
    icon: HiClipboardCheck,
    title: 'Manage Reservations',
    description:
      'View, modify, or cancel your reservations anytime from your personal dashboard.',
  },
];

const steps = [
  {
    number: '1',
    title: 'Search',
    description: 'Choose your preferred date, time, and number of guests.',
  },
  {
    number: '2',
    title: 'Book',
    description: 'Confirm your reservation with just one click. Instant confirmation.',
  },
  {
    number: '3',
    title: 'Enjoy',
    description: 'Show up and enjoy your meal. Your table will be ready and waiting.',
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function LandingPage() {
  return (
    <PageTransition className="overflow-hidden bg-transparent">
      {/* Hero */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] pt-32 sm:pt-40 pb-20">
        
        {/* Champagne Particles only (no blurry spots) */}
        <ChampagneParticles count={40} />
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto py-12"
          >

          <SplitText 
            text="Effortless Restaurant Reservations" 
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight justify-center" 
            delay={0.2}
          />
          <motion.p variants={fadeUp} className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Seamlessly book tables, manage reservations, and deliver exceptional
            dining experiences — all from one beautiful platform.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary px-8 py-3 text-base gap-2"
            >
              Get Started
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="btn-secondary px-8 py-3 text-base"
            >
              Learn More
            </a>
          </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything you need to manage reservations
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed to make restaurant booking effortless for
              both diners and managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <TiltedCard key={feature.title}>
                  <div
                    className="glass p-6 hover:shadow-glass-lg transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed flex-1">
                      {feature.description}
                    </p>
                  </div>
                </TiltedCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Three simple steps to your perfect dining experience.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto relative"
          >
            {/* Animated SVG Line for desktop connecting the steps */}
            <div className="hidden md:block absolute top-10 left-[16.66%] w-[66.66%] h-1 z-0">
               <svg width="100%" height="4" className="overflow-visible">
                 <motion.line 
                    x1="0" y1="2" x2="100%" y2="2" 
                    stroke="var(--color-indigo-600, #d6a87c)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                    viewport={{ once: true }}
                 />
               </svg>
            </div>

            {steps.map((step, index) => (
              <motion.div key={step.number} variants={fadeUp} className="text-center relative z-10">
                <SpotlightCard className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[#121212] shadow-glass-sm cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <span className="text-3xl font-extrabold text-indigo-600 drop-shadow-sm">
                    {step.number}
                  </span>
                </SpotlightCard>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-gray-500 leading-relaxed max-w-[250px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-12 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto relative">
              Join thousands of restaurants already using DineTown to manage their
              reservations effortlessly.
            </p>
            <Link
              to="/register"
              className="btn-primary mt-8 px-8 py-3 text-base inline-flex gap-2 relative"
            >
              Create Free Account
              <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
