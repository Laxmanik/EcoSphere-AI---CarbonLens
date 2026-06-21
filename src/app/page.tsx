"use client";

import React, { useState, useEffect } from "react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { BackgroundShader } from "@/components/Visuals/BackgroundShader";
import { Logo } from "@/components/Logo";
import { LandingPage } from "@/components/Pages/LandingPage";
import { AssessmentWizard } from "@/components/Pages/AssessmentWizard";
import { AnalyticsDashboard } from "@/components/Pages/AnalyticsDashboard";
import { AICoach } from "@/components/Pages/AICoach";
import { ReductionRoadmap } from "@/components/Pages/ReductionRoadmap";
import { EducationHub } from "@/components/Pages/EducationHub";
import { 
  Home, Calculator, BarChart3, MessageSquare, Compass, BookOpen, Menu, X, Bell, User 
} from "lucide-react";

export default function HomeRoot() {
  const { hasCompletedWizard, wizardStep, setWizardStep } = useCarbonStore();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto transition to dashboard after wizard completion
  const handleWizardComplete = () => {
    setActiveTab("dashboard");
  };

  const startAssessment = () => {
    setWizardStep(0); // Reset wizard steps
    setActiveTab("wizard");
  };

  const tabs = [
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { id: "wizard", label: "Assessment", icon: <Calculator className="h-4 w-4" /> },
    { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "coach", label: "AI Coach", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "roadmap", label: "Roadmap", icon: <Compass className="h-4 w-4" /> },
    { id: "education", label: "Guides", icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-background text-on-surface">
      {/* WebGL Ambient Gradient Mask */}
      <BackgroundShader />

      {/* Persistent Top Header (Desktop & Mobile) */}
      <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-surface-border shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 lg:px-16 max-w-container-max mx-auto">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <Logo className="h-8 w-8 shrink-0 hover:scale-105 transition-all" />
            <div className="flex flex-col text-left">
              <span className="font-bold text-sm leading-tight text-on-surface font-headline-md">EcoSphere AI</span>
              <span className="text-[10px] font-label-caps text-primary uppercase tracking-wider font-semibold">CarbonLens</span>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-1 font-label-caps text-xs font-semibold">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer hover:text-primary ${
                  activeTab === tab.id
                    ? "bg-primary/15 text-primary border border-primary/20 shadow-sm"
                    : "text-on-surface-variant hover:bg-white/5 border border-transparent"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* User Controls & Call-to-action */}
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-1.5 bg-white/5 rounded-lg border border-white/5 cursor-pointer">
              <Bell className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setActiveTab("coach")}
              className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-all p-1.5 bg-white/5 rounded-lg border border-white/5 cursor-pointer"
            >
              <User className="h-4 w-4" />
            </button>
            
            {/* CTA Shortcut */}
            {!hasCompletedWizard && activeTab !== "wizard" && (
              <button
                onClick={startAssessment}
                className="hidden lg:block bg-primary text-on-primary font-bold px-6 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-all hover:bg-emerald-active shadow-md cursor-pointer text-xs uppercase font-label-caps"
              >
                Start Assessment
              </button>
            )}

            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="block md:hidden p-1.5 bg-white/5 border border-white/5 rounded-lg text-on-surface-variant cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Glass Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md md:hidden transition-all flex justify-end">
          <div className="w-[75%] h-full bg-surface-container border-l border-surface-border p-6 flex flex-col justify-between pt-24 font-label-caps text-xs">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-2 block">Menu Directory</span>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl text-left flex items-center gap-3 border transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-primary/20 border-primary/40 text-primary font-bold"
                      : "bg-surface-container-low border-white/5 text-on-surface"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-4 border-t border-white/5 pt-6 text-[10px] text-on-surface-variant text-center">
              <span>EcoSphere AI &bull; Version 1.1</span>
              <span>All rights reserved &copy; 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full pt-20 pb-24 md:pb-12 max-w-container-max mx-auto">
        {activeTab === "home" && (
          <LandingPage 
            onStartAssessment={startAssessment} 
            onNavigateToTab={(tab) => setActiveTab(tab)} 
          />
        )}
        
        {activeTab === "wizard" && (
          <AssessmentWizard onComplete={handleWizardComplete} />
        )}
        
        {activeTab === "dashboard" && (
          <AnalyticsDashboard onStartAssessment={startAssessment} />
        )}
        
        {activeTab === "coach" && (
          <AICoach />
        )}
        
        {activeTab === "roadmap" && (
          <ReductionRoadmap />
        )}
        
        {activeTab === "education" && (
          <EducationHub />
        )}
      </main>

      {/* Responsive Mobile Bottom App Bar (Native Feel) */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-surface/80 backdrop-blur-xl border-t border-surface-border md:hidden block pb-safe-bottom h-16">
        <div className="grid grid-cols-6 h-full font-label-caps text-[9px] font-semibold text-center items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 h-full cursor-pointer ${
                activeTab === tab.id ? "text-primary font-bold" : "text-on-surface-variant"
              }`}
            >
              {tab.icon}
              <span className="truncate max-w-[55px]">{tab.label === "Assessment" ? "Calc" : tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
