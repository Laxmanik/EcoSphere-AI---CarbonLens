"use client";

import React from "react";
import { useCarbonStore } from "@/store/useCarbonStore";
import { CheckCircle2, Circle, Calendar, Trophy, Zap, Sparkles } from "lucide-react";

export const ReductionRoadmap: React.FC = () => {
  const { roadmap, challenges, toggleRoadmapTask, toggleChallenge, unlockedBadges } = useCarbonStore();

  const timeframes = [
    { key: "30-day", title: "30-Day Quick Wins", color: "text-sky-bright bg-sky-bright/10 border-sky-bright/20" },
    { key: "90-day", title: "90-Day Habit Shift", color: "text-soft-lime bg-soft-lime/10 border-soft-lime/20" },
    { key: "1-year", title: "1-Year Strategic Swap", color: "text-primary bg-primary/10 border-primary/20" },
  ];

  // Badges catalog
  const badgesCatalog = [
    { id: "badge_beginner", name: "Green Beginner", description: "Completed setup and established carbon baseline footprint.", color: "text-[#adc6ff] border-[#adc6ff]/20 bg-[#adc6ff]/10" },
    { id: "badge_explorer", name: "Eco Explorer", description: "Completed first Carbon Footprint assessment.", color: "text-[#4fdbc8] border-[#4fdbc8]/20 bg-[#4fdbc8]/10" },
    { id: "badge_reducer", name: "Carbon Reducer", description: "Attained a Sustainability Index score of 75+.", color: "text-[#bef264] border-[#bef264]/20 bg-[#bef264]/10" },
    { id: "badge_hero", name: "Sustainability Hero", description: "Attained a Sustainability Index score of 90+.", color: "text-[#4edea3] border-[#4edea3]/20 bg-[#4edea3]/10" },
    { id: "badge_guardian", name: "Planet Guardian", description: "Completed all active Weekly Eco Challenges.", color: "text-orange-400 border-orange-400/20 bg-orange-400/10" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* Left Column: Reduction Roadmap Timeline */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <div>
          <span className="font-label-caps text-label-caps text-primary uppercase">Carbon Reduction Roadmap</span>
          <h2 className="font-headline-lg text-headline-lg mt-1">Decarbonization Milestones</h2>
          <p className="text-on-surface-variant text-sm mt-1">Step-by-step reduction schedules. Check off items to earn Eco Points.</p>
        </div>

        <div className="flex flex-col gap-8">
          {timeframes.map((tf, index) => {
            const tasks = roadmap.filter((r) => r.timeframe === tf.key);
            return (
              <div key={index} className="flex flex-col gap-4">
                {/* Timeframe Label */}
                <div className={`px-4 py-2 rounded-xl border w-fit font-label-caps text-xs uppercase font-bold flex items-center gap-2 ${tf.color}`}>
                  <Calendar className="h-4 w-4" /> {tf.title}
                </div>

                {/* Vertical Timeline Track */}
                <div className="border-l-2 border-white/5 ml-4 pl-6 flex flex-col gap-6">
                  {tasks.map((task) => (
                    <div key={task.id} className="relative flex items-start gap-4 group">
                      {/* Interactive dot/check */}
                      <button
                        onClick={() => toggleRoadmapTask(task.id)}
                        className="absolute -left-[35px] top-0.5 bg-background focus:outline-none cursor-pointer"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-primary h-6 w-6" />
                        ) : (
                          <Circle className="text-on-surface-variant hover:text-primary h-6 w-6" />
                        )}
                      </button>

                      <div className="flex-1 flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1">
                          <span className={`font-bold font-headline-md text-sm transition-all ${task.completed ? "line-through text-on-surface-variant" : "text-on-surface"}`}>
                            {task.title}
                          </span>
                          <p className="text-xs text-on-surface-variant leading-relaxed max-w-lg">{task.description}</p>
                          
                          <div className="flex gap-4 mt-2">
                            <span className="text-[10px] font-label-caps uppercase text-primary">-{task.co2Reduction} kg CO₂ / yr</span>
                            <span className="text-[10px] font-label-caps uppercase text-soft-lime">+{task.points} Points</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Weekly Challenges & Achievements */}
      <div className="lg:col-span-4 flex flex-col gap-8">
        
        {/* Weekly Challenges Panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Trophy className="text-soft-lime h-5 w-5" />
            <h3 className="font-headline-md text-headline-md text-sm font-bold">Weekly Eco Challenges</h3>
          </div>
          
          <div className="flex flex-col gap-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                onClick={() => toggleChallenge(c.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-start gap-3 ${
                  c.completed 
                    ? "bg-primary/5 border-primary/20 text-on-surface-variant" 
                    : "bg-white/[0.01] border-white/5 hover:border-primary/20 text-on-surface"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {c.completed ? (
                    <CheckCircle2 className="text-primary h-5 w-5" />
                  ) : (
                    <Circle className="text-on-surface-variant h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-bold font-headline-md ${c.completed ? "line-through" : ""}`}>{c.title}</span>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed">{c.description}</p>
                  <span className="text-[9px] font-label-caps text-primary uppercase mt-1">+{c.points} Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Badges Panel */}
        <div className="glass-card rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="text-primary h-5 w-5" />
            <h3 className="font-headline-md text-headline-md text-sm font-bold">Achievement Badges</h3>
          </div>
          
          <div className="flex flex-col gap-4">
            {badgesCatalog.map((b) => {
              const isUnlocked = unlockedBadges.includes(b.id);
              return (
                <div 
                  key={b.id} 
                  className={`flex gap-4 items-start transition-all p-3 rounded-xl border ${
                    isUnlocked 
                      ? "bg-white/[0.02] border-white/10 opacity-100" 
                      : "border-dashed border-white/5 opacity-40 select-none"
                  }`}
                >
                  <div className={`px-2 py-2 rounded-xl border text-xs font-bold text-center shrink-0 ${isUnlocked ? b.color : "border-white/5 text-white/20 bg-white/5"}`}>
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-on-surface font-headline-md">{b.name}</span>
                      {!isUnlocked && <span className="text-[8px] font-label-caps uppercase text-on-surface-variant bg-white/5 px-1 rounded">Locked</span>}
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">{b.description}</p>
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
export default ReductionRoadmap;
