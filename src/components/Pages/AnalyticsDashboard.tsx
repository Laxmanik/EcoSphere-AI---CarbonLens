"use client";

import React from "react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line, Legend
} from "recharts";
import { AlertCircle, ArrowUpRight, Flame, Leaf, Zap, Globe, Sparkles } from "lucide-react";

interface AnalyticsDashboardProps {
  onStartAssessment: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onStartAssessment }) => {
  const { results, hasCompletedWizard } = useCarbonStore();

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertCircle className="text-error h-12 w-12 mb-4" />
        <h3 className="font-headline-md text-headline-md mb-2">No Emissions Data Available</h3>
        <p className="text-on-surface-variant max-w-sm mb-6">Complete the Carbon Footprint Assessment Wizard first to populate your dashboard.</p>
        <button
          onClick={onStartAssessment}
          className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg cursor-pointer"
        >
          Start Assessment
        </button>
      </div>
    );
  }

  // Convert kg to metric tons
  const annualTons = (results.annualEmissions / 1000).toFixed(1);
  const monthlyTons = (results.monthlyEmissions / 1000).toFixed(2);
  const potentialTons = (results.reductionPotential / 1000).toFixed(1);

  // Pie chart data
  const pieData = [
    { name: "Transportation", value: results.breakdown.transportation, color: "#4edea3" }, // primary
    { name: "Energy", value: results.breakdown.energy, color: "#0566d9" }, // secondary-container
    { name: "Food", value: results.breakdown.food, color: "#bef264" }, // soft-lime
    { name: "Shopping", value: results.breakdown.shopping, color: "#4fdbc8" }, // tertiary
    { name: "Waste", value: results.breakdown.waste, color: "#7dd3fc" }, // sky-bright
  ];

  // Bar chart data (User vs Global Average)
  // Average values estimated: Transit 3000, Energy 2800, Food 2100, Shopping 900, Waste 300 = Total ~9100kg CO2/year
  const comparisonData = [
    { category: "Transit", User: results.breakdown.transportation, Average: 3000 },
    { category: "Energy", User: results.breakdown.energy, Average: 2800 },
    { category: "Food", User: results.breakdown.food, Average: 2100 },
    { category: "Shopping", User: results.breakdown.shopping, Average: 900 },
    { category: "Waste", User: results.breakdown.waste, Average: 300 },
  ];

  // Radar chart data (Footprint Dimensions)
  const radarData = [
    { subject: "Transit Efficiency", value: Math.max(20, Math.min(100, Math.round(100 - results.breakdown.transportation / 60))) },
    { subject: "Clean Grid", value: Math.max(20, Math.min(100, Math.round(100 - results.breakdown.energy / 50))) },
    { subject: "Diet Score", value: Math.max(20, Math.min(100, Math.round(100 - results.breakdown.food / 45))) },
    { subject: "Shopping Impact", value: Math.max(20, Math.min(100, Math.round(100 - results.breakdown.shopping / 25))) },
    { subject: "Zero Waste", value: Math.max(20, Math.min(100, Math.round(100 - results.breakdown.waste / 8))) },
  ];

  // Trend line chart data (12 Month Projection with and without reduction tasks)
  const trendData = Array.from({ length: 6 }, (_, index) => {
    const monthNames = ["Jan", "Mar", "May", "Jul", "Sep", "Nov"];
    const baseEmissions = results.monthlyEmissions;
    const reductionSlope = results.reductionPotential / 12 / 5; // potential monthly reduction scaled
    return {
      month: monthNames[index],
      Baseline: baseEmissions,
      Projected: Math.max(100, Math.round(baseEmissions - reductionSlope * index)),
    };
  });

  const getScoreCategory = (score: number) => {
    if (score >= 90) return { label: "Climate Champion", color: "text-primary border-primary/20 bg-primary/10" };
    if (score >= 75) return { label: "Green Citizen", color: "text-soft-lime border-soft-lime/20 bg-soft-lime/10" };
    if (score >= 60) return { label: "Conscious Consumer", color: "text-tertiary border-tertiary/20 bg-tertiary/10" };
    if (score >= 40) return { label: "High Impact", color: "text-orange-400 border-orange-400/20 bg-orange-400/10" };
    return { label: "Critical Impact", color: "text-error border-error/20 bg-error/10" };
  };

  const scoreInfo = getScoreCategory(results.sustainabilityScore);

  return (
    <div className="flex flex-col gap-8 max-w-container-max mx-auto px-6 lg:px-16 py-8 text-left">
      {/* Baseline Sample Data Warning Banner */}
      {!hasCompletedWizard && (
        <div className="glass-card border-amber-500/30 bg-amber-500/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-headline-md text-base font-bold text-on-surface">Viewing Sample Baseline Data</h4>
              <p className="text-on-surface-variant text-sm mt-0.5">Customize your scores and calculations with your specific transportation, energy, and diet habits.</p>
            </div>
          </div>
          <button
            onClick={onStartAssessment}
            className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg cursor-pointer whitespace-nowrap hover:scale-105 transition-all shadow-[0_0_20px_rgba(78,222,163,0.15)]"
          >
            Start Assessment Wizard
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Annual Footprint</span>
            <span className="p-1.5 bg-white/5 rounded-lg text-on-surface-variant"><Globe className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold font-display-lg">{annualTons}</h2>
            <span className="text-xs text-on-surface-variant font-data-point">Metric Tons CO₂e / year</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Monthly Output</span>
            <span className="p-1.5 bg-white/5 rounded-lg text-on-surface-variant"><Flame className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold font-display-lg">{monthlyTons}</h2>
            <span className="text-xs text-on-surface-variant font-data-point">Metric Tons CO₂e / month</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Sustainability Score</span>
            <span className="p-1.5 bg-white/5 rounded-lg text-on-surface-variant"><Leaf className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold font-display-lg">{results.sustainabilityScore}</h2>
              <span className="text-xs text-on-surface-variant font-data-point">Points (0–100)</span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-label-caps uppercase ${scoreInfo.color}`}>
              {scoreInfo.label}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Reduction Potential</span>
            <span className="p-1.5 bg-white/5 rounded-lg text-on-surface-variant"><Zap className="h-4 w-4" /></span>
          </div>
          <div className="mt-4">
            <h2 className="text-4xl font-bold font-display-lg">{potentialTons}</h2>
            <span className="text-xs text-on-surface-variant font-data-point">Tons CO₂e offset potential</span>
          </div>
        </div>
      </div>

      {/* Grid: Charts & Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Pie Chart: Emissions Breakdown */}
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between h-[380px]">
          <h3 className="font-headline-md text-headline-md text-sm font-bold border-b border-white/5 pb-3">Emissions Breakdown</h3>
          <div className="flex-1 min-h-[200px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="glass-card px-3 py-2 rounded-lg text-xs shadow-md border border-white/10">
                          <span className="font-bold text-on-surface block">{data.name}</span>
                          <span className="text-primary font-mono block mt-0.5">{data.value.toLocaleString()} kg CO₂/yr</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">{annualTons}t</span>
              <span className="text-[10px] text-on-surface-variant font-label-caps uppercase">Total / Yr</span>
            </div>
          </div>
          
          {/* Custom Legends */}
          <div className="grid grid-cols-3 gap-2 text-[10px] font-label-caps text-on-surface-variant mt-2 border-t border-white/5 pt-3">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                <span className="truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: User vs Global Average */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <h3 className="font-headline-md text-headline-md text-sm font-bold border-b border-white/5 pb-3">User Emissions vs. Global Averages</h3>
          <div className="flex-1 min-h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="category" stroke="#bbcabf" fontSize={11} tickLine={false} />
                <YAxis stroke="#bbcabf" fontSize={10} tickLine={false} unit=" kg" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 rounded-lg text-xs shadow-md border border-white/10 flex flex-col gap-1">
                          <span className="font-bold text-on-surface">{payload[0].payload.category}</span>
                          <span className="text-primary font-mono">You: {payload[0].value} kg</span>
                          <span className="text-on-surface-variant font-mono">Average: {payload[1].value} kg</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Bar dataKey="User" fill="#4edea3" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="Average" fill="rgba(255, 255, 255, 0.15)" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid: Radar and Trend Lines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart: Sustainability Dimensions */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <h3 className="font-headline-md text-headline-md text-sm font-bold border-b border-white/5 pb-3">Sustainability Dimension Indexes</h3>
          <div className="flex-1 min-h-[220px] mt-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="#bbcabf" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.1)" fontSize={8} />
                <Radar name="Index Score" dataKey="value" stroke="#bef264" fill="#bef264" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Projection Line Chart */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 h-[380px] flex flex-col justify-between">
          <h3 className="font-headline-md text-headline-md text-sm font-bold border-b border-white/5 pb-3">Decarbonization Projection Timeline</h3>
          <div className="flex-1 min-h-[220px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#bbcabf" fontSize={11} tickLine={false} />
                <YAxis stroke="#bbcabf" fontSize={10} tickLine={false} unit=" kg" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-card p-3 rounded-lg text-xs shadow-md border border-white/10 flex flex-col gap-1">
                          <span className="font-bold text-on-surface">Month: {payload[0].payload.month}</span>
                          <span className="text-on-surface-variant font-mono">Baseline: {payload[0].value} kg</span>
                          <span className="text-primary font-mono">Decarbonized: {payload[1].value} kg</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 10, fontFamily: "JetBrains Mono" }} />
                <Line type="monotone" dataKey="Baseline" stroke="rgba(255, 255, 255, 0.2)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="Projected" stroke="#4fdbc8" strokeWidth={3} dot={{ stroke: '#4fdbc8', strokeWidth: 1, r: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Carbon Hotspots & Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Hotspots Panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <div className="p-1 bg-red-500/10 text-red-500 rounded"><ArrowUpRight className="h-5 w-5" /></div>
            <h3 className="font-headline-md text-headline-md text-sm font-bold">Identified Carbon Hotspots</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {results.hotspots.map((hs, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="mt-0.5"><span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-label-caps uppercase rounded font-bold">{hs.impact}</span></div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="font-bold text-sm text-on-surface font-headline-md">{hs.title}</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{hs.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Category Stats */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <div className="p-1 bg-primary/10 text-primary rounded"><Leaf className="h-5 w-5" /></div>
            <h3 className="font-headline-md text-headline-md text-sm font-bold">Emissions Breakdown Metrics</h3>
          </div>
          
          <div className="flex flex-col gap-3 justify-center h-full">
            {pieData.map((d, i) => {
              const percentage = ((d.value / results.annualEmissions) * 100).toFixed(0);
              return (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-label-caps">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                      <span className="text-on-surface">{d.name}</span>
                    </div>
                    <span className="text-on-surface-variant">{(d.value / 1000).toFixed(1)}t ({percentage}%)</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: d.color, width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
