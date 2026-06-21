"use client";

import React, { useState, useEffect } from "react";
import { ThreeGlobe } from "../Visuals/ThreeGlobe";
import { useCarbonStore } from "@/store/useCarbonStore";
import { ArrowRight, Thermometer, Shield, Award, BarChart3, Factory, ShieldCheck, HelpCircle, Activity } from "lucide-react";

interface LandingPageProps {
  onStartAssessment: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment, onNavigateToTab }) => {
  // Counters for Success Metrics
  const [counters, setCounters] = useState({
    companies: 0,
    offset: 0,
    precision: 0,
    reach: 0
  });

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        companies: Math.round((450 / steps) * currentStep),
        offset: Math.round((12800 / steps) * currentStep),
        precision: Math.round((99 / steps) * currentStep),
        reach: Math.round((24 / steps) * currentStep)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters({
          companies: 450,
          offset: 12800,
          precision: 99.8,
          reach: 24
        });
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Hero Section */}
      <header className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
        <div className="relative z-10 max-w-container-max mx-auto px-6 lg:px-16 w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit">
              <span className="font-label-caps text-label-caps text-primary uppercase">Beta Access Live</span>
            </div>
            <h1 className="font-display-lg text-display-lg leading-tight">
              Intelligent Optimism for a <span className="gradient-text">Greener Planet.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
              Harness the power of AI to deconstruct your carbon footprint. Real-time data, predictive insights, and a personalized roadmap to net-zero.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button
                onClick={onStartAssessment}
                className="px-8 py-4 bg-primary text-on-primary font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(78,222,163,0.15)] hover:shadow-[0_0_30px_rgba(78,222,163,0.3)] cursor-pointer"
              >
                Calculate My Footprint <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => onNavigateToTab("dashboard")}
                className="px-8 py-4 glass-card font-bold rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                Explore Sustainability
              </button>
            </div>
          </div>

          {/* 3D Earth Globe Visual */}
          <div className="relative h-[450px] md:h-[550px] w-full flex items-center justify-center">
            <div className="absolute inset-0 w-full h-full z-0">
              <ThreeGlobe />
            </div>
            {/* Floating Metric Card 1 */}
            <div className="absolute top-1/4 -left-4 animate-float glass-card p-4 rounded-xl shadow-2xl flex flex-col gap-1 z-10" style={{ animationDelay: "0s" }}>
              <span className="font-label-caps text-label-caps text-primary uppercase">Carbon Impact</span>
              <span className="font-headline-md text-headline-md text-on-surface">12.8K Tons</span>
              <span className="font-data-point text-data-point text-on-surface-variant">CO₂ Reduced Locally</span>
            </div>
            {/* Floating Metric Card 2 */}
            <div className="absolute bottom-1/4 -right-4 animate-float glass-card p-4 rounded-xl shadow-2xl flex flex-col gap-1 z-10" style={{ animationDelay: "1.5s" }}>
              <span className="font-label-caps text-label-caps text-soft-lime uppercase">Network Status</span>
              <span className="font-headline-md text-headline-md text-on-surface">Eco Rank: Green</span>
              <div className="flex gap-1 mt-1">
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                <div className="h-1 w-8 bg-primary rounded-full"></div>
                <div className="h-1 w-8 bg-primary/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* What is Carbon Footprint Section */}
      <section id="what-is-carbon" className="py-24 relative bg-surface-container-lowest border-y border-surface-border">
        <div className="max-w-container-max mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="glass-card aspect-square rounded-3xl p-8 flex items-center justify-center relative group">
                <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  
                  {/* Simulated Recharts Bar Chart */}
                  <div className="grid grid-cols-5 items-end gap-3 h-48 w-72 z-10">
                    <div className="bg-primary/25 h-[40%] w-full rounded-t-lg group-hover:h-[60%] transition-all duration-700"></div>
                    <div className="bg-primary/45 h-[65%] w-full rounded-t-lg group-hover:h-[50%] transition-all duration-700 delay-75"></div>
                    <div className="bg-primary/65 h-[85%] w-full rounded-t-lg group-hover:h-[70%] transition-all duration-700 delay-150"></div>
                    <div className="bg-primary/80 h-[50%] w-full rounded-t-lg group-hover:h-[90%] transition-all duration-700 delay-225"></div>
                    <div className="bg-primary h-[95%] w-full rounded-t-lg group-hover:h-[45%] transition-all duration-700 delay-300"></div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 glass-card p-4 rounded-xl border border-primary/30 max-w-[220px] shadow-lg">
                  <p className="font-body-md text-body-md text-on-surface">"Every action leaves a digital ghost of carbon."</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex flex-col gap-6 text-left">
              <span className="font-label-caps text-label-caps text-primary uppercase">The Science</span>
              <h2 className="font-headline-lg text-headline-lg">What is a Carbon Footprint?</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                It is the total amount of greenhouse gases (including carbon dioxide and methane) generated by our daily actions. While invisible, it is the most critical metric of our time. EcoSphere AI translates these abstract numbers into tangible, actionable data.
              </p>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg"><Activity className="text-primary h-6 w-6" /></div>
                  <div>
                    <h4 className="font-body-md font-bold text-on-surface">Direct Emissions</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Fuel combustion in personal transport, gas stoves, and direct heating.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg"><Factory className="text-primary h-6 w-6" /></div>
                  <div>
                    <h4 className="font-body-md font-bold text-on-surface">Indirect Emissions</h4>
                    <p className="text-on-surface-variant text-sm mt-1">Electricity consumption, agricultural processes, and manufacturing supply chains.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-24 relative bg-surface">
        <div className="max-w-container-max mx-auto px-6 lg:px-16 text-center flex flex-col items-center gap-8">
          <span className="font-label-caps text-label-caps text-soft-lime uppercase">Human Impact</span>
          <h2 className="font-headline-lg text-headline-lg max-w-3xl">Decisions made today define the breathable air of 2050.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            We aren't just calculating numbers; we are architecting resilience. By identifying peak carbon drivers, we help you pivot toward sustainable habits without compromising quality of life.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            <div className="p-8 rounded-2xl bg-surface-container flex flex-col gap-4 text-left border border-white/5 shadow-md">
              <Thermometer className="text-sky-bright h-10 w-10" />
              <h3 className="font-headline-md text-headline-md">Climate Stability</h3>
              <p className="text-on-surface-variant text-sm">Limiting warming to 1.5°C requires a 45% reduction in global emissions by 2030.</p>
            </div>
            <div className="p-8 rounded-2xl bg-surface-container flex flex-col gap-4 text-left border border-white/5 shadow-md">
              <ShieldCheck className="text-soft-lime h-10 w-10" />
              <h3 className="font-headline-md text-headline-md">Economic Value</h3>
              <p className="text-on-surface-variant text-sm">Sustainable actions generate massive savings in electricity, transit, and material consumption.</p>
            </div>
            <div className="p-8 rounded-2xl bg-surface-container flex flex-col gap-4 text-left border border-white/5 shadow-md">
              <Award className="text-primary h-10 w-10" />
              <h3 className="font-headline-md text-headline-md">Social Legacy</h3>
              <p className="text-on-surface-variant text-sm">Your footprint is your commitment to the next generation's quality of life and resource access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Factors of Increase Section */}
      <section className="py-24 bg-surface-container-highest border-t border-surface-border">
        <div className="max-w-container-max mx-auto px-6 lg:px-16 text-left">
          <div className="mb-12">
            <span className="font-label-caps text-label-caps text-primary uppercase">Emissions Factors</span>
            <h2 className="font-headline-lg text-headline-lg mt-2">How Footprints Grow</h2>
            <p className="text-on-surface-variant max-w-xl mt-2">Everyday activities contribute silently to carbon output through logistics, supply chains, and power.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-surface-container-low border border-white/10 hover:border-primary/50 transition-all p-6 flex flex-col justify-end">
              <img
                src="/images/logistics_eco.png"
                alt="Logistics"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent z-10"></div>
              <span className="font-label-caps text-label-caps text-primary relative z-20">01</span>
              <h4 className="font-headline-md text-headline-md mt-2 relative z-20">Logistics</h4>
              <p className="text-xs text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 relative z-20">Shipping & global delivery</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-surface-container-low border border-white/10 hover:border-primary/50 transition-all p-6 flex flex-col justify-end">
              <img
                src="/images/power_grid_eco.png"
                alt="Power Grid"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent z-10"></div>
              <span className="font-label-caps text-label-caps text-primary relative z-20">02</span>
              <h4 className="font-headline-md text-headline-md mt-2 relative z-20">Power Grid</h4>
              <p className="text-xs text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 relative z-20">Electricity & cooling</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-surface-container-low border border-white/10 hover:border-primary/50 transition-all p-6 flex flex-col justify-end">
              <img
                src="/images/travel_eco.png"
                alt="Travel"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent z-10"></div>
              <span className="font-label-caps text-label-caps text-primary relative z-20">03</span>
              <h4 className="font-headline-md text-headline-md mt-2 relative z-20">Travel</h4>
              <p className="text-xs text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 relative z-20">Cars, flights & commutes</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-surface-container-low border border-white/10 hover:border-primary/50 transition-all p-6 flex flex-col justify-end">
              <img
                src="/images/agri_food_eco.png"
                alt="Agri-food"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent z-10"></div>
              <span className="font-label-caps text-label-caps text-primary relative z-20">04</span>
              <h4 className="font-headline-md text-headline-md mt-2 relative z-20">Agri-food</h4>
              <p className="text-xs text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 relative z-20">Meat, dairy & waste</p>
            </div>
            <div className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-surface-container-low border border-white/10 hover:border-primary/50 transition-all p-6 flex flex-col justify-end">
              <img
                src="/images/fashion_eco.png"
                alt="Fashion"
                className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:opacity-45 group-hover:scale-105 transition-all duration-500 z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container/60 to-transparent z-10"></div>
              <span className="font-label-caps text-label-caps text-primary relative z-20">05</span>
              <h4 className="font-headline-md text-headline-md mt-2 relative z-20">Fashion</h4>
              <p className="text-xs text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 relative z-20">Clothing & fast-fashion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-24">
        <div className="max-w-container-max mx-auto px-6 lg:px-16 text-left">
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Large Card */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 lg:p-12 flex flex-col justify-between group">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-primary h-6 w-6" />
                </div>
                <h3 className="font-headline-lg text-headline-md lg:text-headline-lg">AI Carbon Advisor</h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                  Our proprietary coach analyzes your lifestyle data to suggest high-impact, low-cost reduction strategies.
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-surface-container/50 relative p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  <span className="font-mono text-xs text-primary uppercase tracking-wider">CarbonLens Advisor Live</span>
                </div>
                <div className="flex flex-col gap-3 font-mono text-xs md:text-sm">
                  <div className="flex gap-2 items-start">
                    <span className="text-primary font-bold">●</span>
                    <p className="text-on-surface">Based on your weekly commuting: Swapping 3 drives for transit offsets <strong className="text-primary">120 kg CO₂/mo</strong>. Try this challenge!</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="text-soft-lime font-bold">✓</span>
                    <p className="text-on-surface">Recommendation: Adjust thermostat limits (+2°C in summer, -2°C in winter) to save <strong className="text-soft-lime">320 kg CO₂/year</strong>.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Card 1 */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between hover:bg-white/5 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-sky-bright/20 rounded-xl flex items-center justify-center">
                  <Thermometer className="text-sky-bright h-6 w-6" />
                </div>
                <h3 className="font-headline-md text-headline-md">Real-Time Forecast</h3>
                <p className="text-on-surface-variant text-sm mb-2">
                  Watch your footprint dynamically adapt based on daily habits and energy mix inputs.
                </p>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-surface-container/50 p-4 flex flex-col gap-2 font-mono text-[11px] justify-center">
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>Current Forecast:</span>
                  <span className="text-sky-bright font-bold">5.8 Tons CO₂/yr</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-bright h-full rounded-full w-[45%]"></div>
                </div>
                <div className="flex justify-between text-[9px] text-on-surface-variant/70">
                  <span>Target: 2.0 Tons</span>
                  <span>Eco-Rank: Good</span>
                </div>
              </div>
            </div>

            {/* Small Card 2 */}
            <div className="md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between hover:bg-white/5 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-soft-lime/20 rounded-xl flex items-center justify-center">
                  <Award className="text-soft-lime h-6 w-6" />
                </div>
                <h3 className="font-headline-md text-headline-md">Gamified Badges</h3>
                <p className="text-on-surface-variant text-sm">
                  Earn eco points, unlock badges, and challenge friends to meet monthly carbon offsets.
                </p>
              </div>
            </div>

            {/* Medium Card */}
            <div className="md:col-span-8 glass-card rounded-3xl p-8 flex flex-col justify-between hover:bg-white/5 transition-all">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 bg-tertiary/20 rounded-xl flex items-center justify-center">
                  <HelpCircle className="text-tertiary h-6 w-6" />
                </div>
                <h3 className="font-headline-md text-headline-md">Interactive Coach & Roadmap</h3>
                <p className="text-on-surface-variant text-sm">
                  Engage with CarbonLens Coach in standard language to receive step-by-step reduction schedules spanning 30-day, 90-day, and 1-year timelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-24 border-y border-surface-border bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="flex flex-col gap-2">
              <span className="font-display-lg text-display-lg text-primary">{counters.companies}+</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Active Citizens</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-display-lg text-display-lg text-primary">{counters.offset} kg</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Annual CO₂ Offset</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-display-lg text-display-lg text-primary">{counters.precision}%</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Precision Index</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-display-lg text-display-lg text-primary">{counters.reach}+</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Eco Badges</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-container-max mx-auto px-6 lg:px-16">
          <div className="glass-card rounded-[40px] p-12 lg:p-16 text-center flex flex-col items-center gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-tertiary/10 pointer-events-none"></div>
            <h2 className="font-display-lg text-display-lg relative z-10">Ready to lead the transition?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl relative z-10">
              Join thousands of conscious consumers using EcoSphere AI to offset carbon waste and outline a clean energy footprint.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 relative z-10">
              <button
                onClick={onStartAssessment}
                className="px-10 py-5 bg-primary text-on-primary font-bold rounded-xl text-lg hover:shadow-[0_0_30px_rgba(78,222,163,0.4)] active:scale-95 transition-all cursor-pointer"
              >
                Start Free Assessment
              </button>
              <button
                onClick={() => onNavigateToTab("education")}
                className="px-10 py-5 glass-card font-bold rounded-xl text-lg hover:bg-white/10 transition-all cursor-pointer"
              >
                Read Climate Guides
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-surface-border w-full py-12">
        <div className="max-w-container-max mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="font-headline-md text-headline-md font-bold text-primary">EcoSphere AI</span>
            <span className="text-on-surface-variant">See Your Impact. Shape a Greener Future.</span>
          </div>
          <div className="flex gap-8 text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
          </div>
          <div className="text-on-surface-variant">
            &copy; 2026 EcoSphere AI. Developed for the Climate-Tech Initiative.
          </div>
        </div>
      </footer>
    </div>
  );
};
