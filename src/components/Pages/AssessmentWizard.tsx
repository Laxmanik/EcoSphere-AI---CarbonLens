"use client";

import React, { useState } from "react";
import { useCarbonStore, AssessmentInputs } from "@/store/useCarbonStore";
import { ArrowLeft, ArrowRight, Car, CloudLightning, Utensils, ShoppingBag, Trash2, Cpu } from "lucide-react";

interface AssessmentWizardProps {
  onComplete: () => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onComplete }) => {
  const { inputs, setInputs, calculateResults, wizardStep, setWizardStep } = useCarbonStore();
  const [calculating, setCalculating] = useState(false);

  const steps = [
    { title: "Transportation", icon: <Car className="h-5 w-5" /> },
    { title: "Energy", icon: <CloudLightning className="h-5 w-5" /> },
    { title: "Food", icon: <Utensils className="h-5 w-5" /> },
    { title: "Shopping", icon: <ShoppingBag className="h-5 w-5" /> },
    { title: "Waste", icon: <Trash2 className="h-5 w-5" /> },
  ];

  const handleNext = () => {
    if (wizardStep < 4) {
      setWizardStep(wizardStep + 1);
    } else {
      // Step 5: Start calculating animation
      setCalculating(true);
      setWizardStep(5);
      setTimeout(() => {
        calculateResults();
        setCalculating(false);
        onComplete();
      }, 2000);
    }
  };

  const handleBack = () => {
    if (wizardStep > 0) {
      setWizardStep(wizardStep - 1);
    }
  };

  // Safe input updater
  const updateField = <K extends keyof AssessmentInputs>(field: K, value: AssessmentInputs[K]) => {
    setInputs({ [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 min-h-[75vh] flex flex-col justify-between">
      {/* Wizard Progress Header */}
      {!calculating && wizardStep < 5 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <span className="font-label-caps text-label-caps text-primary uppercase">Assessment Wizard</span>
            <span className="font-data-point text-data-point text-on-surface-variant">Step {wizardStep + 1} of 5</span>
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden flex">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-full flex-1 transition-all duration-500 border-r border-background last:border-0 ${
                  idx <= wizardStep ? "bg-primary" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Stepper Labels */}
          <div className="flex justify-between mt-4 text-xs text-on-surface-variant hidden sm:flex">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 ${idx === wizardStep ? "text-primary font-bold" : ""}`}
              >
                {step.icon}
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wizard Card Content */}
      <div className="glass-card rounded-3xl p-8 lg:p-12 flex-1 flex flex-col justify-center mb-8 min-h-[350px]">
        {calculating ? (
          /* Calculating Loader Step */
          <div className="flex flex-col items-center justify-center gap-6 text-center py-12">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <Cpu className="text-primary h-12 w-12 animate-pulse glow-active" />
              <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-headline-md text-headline-md">CarbonLens AI Engine</h3>
              <p className="text-on-surface-variant text-sm max-w-sm">
                Auditing emission factors, comparing standard grid averages, and calculating sustainability score index...
              </p>
            </div>
          </div>
        ) : (
          /* Input Steps */
          <div>
            {wizardStep === 0 && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="font-headline-md text-headline-md">Transportation habits</h3>
                <p className="text-on-surface-variant text-sm">Let's audit your carbon footprints from daily travel and commutes.</p>
                
                {/* Vehicle type */}
                <div className="flex flex-col gap-3 mt-2">
                  <label className="text-sm font-semibold text-on-surface">Primary Commute Vehicle</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {(["None", "Gasoline", "Diesel", "Hybrid", "Electric"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => updateField("vehicleType", type)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.vehicleType === type
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Distance slider */}
                {inputs.vehicleType !== "None" && (
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <label className="font-semibold text-on-surface">Monthly Driving Distance</label>
                      <span className="text-primary font-mono">{inputs.distanceTravelled} miles</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="50"
                      value={inputs.distanceTravelled}
                      onChange={(e) => updateField("distanceTravelled", parseInt(e.target.value))}
                      className="w-full accent-primary bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                )}

                {/* Flights & transit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Annual Flights Taken</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={inputs.flightsPerYear}
                      onChange={(e) => updateField("flightsPerYear", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Public Transit (hours/week)</label>
                    <input
                      type="number"
                      min="0"
                      max="168"
                      value={inputs.publicTransitHours}
                      onChange={(e) => updateField("publicTransitHours", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 1 && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="font-headline-md text-headline-md">Energy Footprint</h3>
                <p className="text-on-surface-variant text-sm">Heating, electricity, and cooling power constitute a massive chunk of grid emissions.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Electricity consumption (kWh/month)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.electricityConsumption}
                      onChange={(e) => updateField("electricityConsumption", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">AC Usage (hours/day)</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={inputs.acUsageHours}
                      onChange={(e) => updateField("acUsageHours", Math.max(0, Math.min(24, parseInt(e.target.value) || 0)))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Renewable slide */}
                <div className="flex flex-col gap-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <label className="font-semibold text-on-surface">Renewable Energy Percentage</label>
                    <span className="text-primary font-mono">{inputs.renewablePercentage}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={inputs.renewablePercentage}
                    onChange={(e) => updateField("renewablePercentage", parseInt(e.target.value))}
                    className="w-full accent-primary bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Percentage of home electricity sourced from solar, wind, or low-carbon tariffs.</p>
                </div>

                {/* Household size */}
                <div className="flex flex-col gap-2 mt-4">
                  <label className="text-sm font-semibold text-on-surface">Household Size (People)</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateField("householdSize", Math.max(1, inputs.householdSize - 1))}
                      className="w-10 h-10 rounded-xl bg-surface-container border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-lg cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{inputs.householdSize}</span>
                    <button
                      onClick={() => updateField("householdSize", inputs.householdSize + 1)}
                      className="w-10 h-10 rounded-xl bg-surface-container border border-white/10 hover:bg-white/5 flex items-center justify-center font-bold text-lg cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="font-headline-md text-headline-md">Diet & Food Footprint</h3>
                <p className="text-on-surface-variant text-sm">Methane and shipping emissions vary heavily based on what diet and waste habits you maintain.</p>

                {/* Diet type */}
                <div className="flex flex-col gap-3 mt-2">
                  <label className="text-sm font-semibold text-on-surface">Primary Diet Style</label>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {(["Vegan", "Vegetarian", "Pescatarian", "Mixed", "Heavy Meat"] as const).map((diet) => (
                      <button
                        key={diet}
                        onClick={() => updateField("dietType", diet)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.dietType === diet
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{diet}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Food waste */}
                <div className="flex flex-col gap-3 mt-4">
                  <label className="text-sm font-semibold text-on-surface">Food Waste Frequency</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(["Never", "Low", "Medium", "High"] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => updateField("foodWaste", freq)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.foodWaste === freq
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{freq}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="font-headline-md text-headline-md">Consumer Shopping</h3>
                <p className="text-on-surface-variant text-sm">Embedded manufacturing emissions of electronics and shipping impacts of online purchasing.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Online Deliveries (month)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.onlinePurchases}
                      onChange={(e) => updateField("onlinePurchases", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Clothing Purchases (month)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.clothingPurchases}
                      onChange={(e) => updateField("clothingPurchases", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface">Electronics Sourced (year)</label>
                    <input
                      type="number"
                      min="0"
                      value={inputs.electronicsPurchases}
                      onChange={(e) => updateField("electronicsPurchases", Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-surface-container border border-white/10 rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 4 && (
              <div className="flex flex-col gap-6 text-left">
                <h3 className="font-headline-md text-headline-md">Waste & Recycling</h3>
                <p className="text-on-surface-variant text-sm">Sorting and municipal organic composting minimize raw resource processing and landfill methane generation.</p>

                {/* Recycling frequency */}
                <div className="flex flex-col gap-3 mt-2">
                  <label className="text-sm font-semibold text-on-surface">Do you recycle packaging?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(["Always", "Often", "Sometimes", "Never"] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => updateField("recyclingFrequency", freq)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.recyclingFrequency === freq
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{freq}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plastic usage */}
                <div className="flex flex-col gap-3 mt-4">
                  <label className="text-sm font-semibold text-on-surface">Single-Use Plastic Consumption</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["Low", "Medium", "High"] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => updateField("plasticConsumption", level)}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.plasticConsumption === level
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composting */}
                <div className="flex flex-col gap-3 mt-4">
                  <label className="text-sm font-semibold text-on-surface">Do you compost food scraps?</label>
                  <div className="flex gap-4">
                    {(["Yes", "No"] as const).map((val) => (
                      <button
                        key={val}
                        onClick={() => updateField("compostingHabits", val)}
                        className={`flex-1 p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          inputs.compostingHabits === val
                            ? "bg-primary/20 border-primary text-primary"
                            : "bg-surface-container border-white/5 text-on-surface hover:bg-white/5"
                        }`}
                      >
                        <span className="block text-sm font-bold">{val === "Yes" ? "Yes, consistently" : "No, discard standard"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      {!calculating && wizardStep < 5 && (
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={wizardStep === 0}
            className={`px-6 py-3 rounded-lg border font-bold flex items-center gap-2 cursor-pointer transition-all ${
              wizardStep === 0
                ? "border-white/5 text-white/20 cursor-not-allowed"
                : "border-white/10 text-on-surface hover:bg-white/5"
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-primary text-on-primary font-bold rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(78,222,163,0.15)] hover:shadow-[0_0_30px_rgba(78,222,163,0.3)] cursor-pointer"
          >
            {wizardStep === 4 ? "Calculate Impact" : "Continue"} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
