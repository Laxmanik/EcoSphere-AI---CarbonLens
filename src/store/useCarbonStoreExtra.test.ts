import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCarbonStore } from './useCarbonStore';

describe('useCarbonStore - Extra Logic and Edge Cases', () => {
  beforeEach(() => {
    useCarbonStore.getState().resetAll();
    vi.useFakeTimers();
  });

  // 1. Q&A Chat Message Logic
  it('should trigger correct AI response when a keyword matches', () => {
    const store = useCarbonStore.getState();
    const initialHistoryLength = store.chatHistory.length;

    // Send message containing "food waste"
    store.addChatMessage('Can you tell me how to reduce food waste?', 'user');

    expect(useCarbonStore.getState().chatHistory.length).toBe(initialHistoryLength + 1);
    expect(useCarbonStore.getState().chatHistory[initialHistoryLength].text).toBe('Can you tell me how to reduce food waste?');
    expect(useCarbonStore.getState().chatHistory[initialHistoryLength].sender).toBe('user');

    // Run timers for the setTimeout (600ms)
    vi.runAllTimers();

    const updatedHistory = useCarbonStore.getState().chatHistory;
    expect(updatedHistory.length).toBe(initialHistoryLength + 2);
    expect(updatedHistory[initialHistoryLength + 1].sender).toBe('ai');
    expect(updatedHistory[initialHistoryLength + 1].text).toContain('Landfills are massive emitters of methane');
  });

  it('should trigger default help response when no keyword matches', () => {
    const store = useCarbonStore.getState();
    const initialHistoryLength = store.chatHistory.length;

    // Send a message with no keywords
    store.addChatMessage('Hello, can you help me with coding?', 'user');

    vi.runAllTimers();

    const updatedHistory = useCarbonStore.getState().chatHistory;
    expect(updatedHistory.length).toBe(initialHistoryLength + 2);
    expect(updatedHistory[initialHistoryLength + 1].text).toContain('I can help you audit your activities');
  });

  // 2. Challenges & Guardian Badge
  it('should unlock the Planet Guardian badge when all challenges are completed', () => {
    const store = useCarbonStore.getState();

    // Verify initial state of challenges and badges
    expect(store.unlockedBadges).not.toContain('badge_guardian');

    // Toggle all uncompleted challenges
    store.challenges.forEach(c => {
      if (!c.completed) {
        store.toggleChallenge(c.id);
      }
    });

    const updatedState = useCarbonStore.getState();
    expect(updatedState.unlockedBadges).toContain('badge_guardian');
    expect(updatedState.challenges.every(c => c.completed)).toBe(true);
  });

  it('should floor Eco Points to 0 if subtraction exceeds current points', () => {
    const store = useCarbonStore.getState();

    // Reset points to 0 manually for test case
    useCarbonStore.setState({ ecoPoints: 0 });

    // Toggle c1 challenge off (it was uncompleted, toggling it completes it and adds 150 points)
    store.toggleChallenge('c1');
    expect(useCarbonStore.getState().ecoPoints).toBe(150);

    // Toggle it again to uncomplete (subtracts 150 points)
    store.toggleChallenge('c1');
    expect(useCarbonStore.getState().ecoPoints).toBe(0);

    // Toggle c1 to complete again (adds 150 points)
    store.toggleChallenge('c1');
    expect(useCarbonStore.getState().ecoPoints).toBe(150);

    // Manually lower points to 50
    useCarbonStore.setState({ ecoPoints: 50 });

    // Toggle it off (which would subtract 150 points)
    store.toggleChallenge('c1');
    // It should floor to 0
    expect(useCarbonStore.getState().ecoPoints).toBe(0);
  });

  // 3. Roadmap Tasks Completion
  it('should handle toggle roadmap tasks and update points correctly', () => {
    const store = useCarbonStore.getState();
    const initialPoints = store.ecoPoints;

    // Toggle r1 to complete (points +50)
    store.toggleRoadmapTask('r1');
    expect(useCarbonStore.getState().ecoPoints).toBe(initialPoints + 50);

    // Toggle r1 to uncomplete (points -50)
    store.toggleRoadmapTask('r1');
    expect(useCarbonStore.getState().ecoPoints).toBe(initialPoints);
  });

  // 4. Calculation Results Badge Triggers
  it('should unlock specific badges based on calculated score thresholds', () => {
    const store = useCarbonStore.getState();

    // 1. Check explorer badge is always unlocked on calculation
    store.calculateResults();
    expect(useCarbonStore.getState().unlockedBadges).toContain('badge_explorer');

    // 2. Set inputs to get a score between 75 and 89
    // Mixed baseline score is ~60. Let's make it slightly better.
    store.setInputs({
      vehicleType: 'Hybrid',
      distanceTravelled: 100,
      renewablePercentage: 50,
      dietType: 'Vegetarian',
      recyclingFrequency: 'Always',
      flightsPerYear: 0
    });
    store.calculateResults();
    let updatedBadges = useCarbonStore.getState().unlockedBadges;
    expect(useCarbonStore.getState().results.sustainabilityScore).toBeGreaterThanOrEqual(75);
    expect(updatedBadges).toContain('badge_reducer');

    // 3. Set inputs to get a score >= 90
    store.setInputs({
      vehicleType: 'None',
      distanceTravelled: 0,
      flightsPerYear: 0,
      publicTransitHours: 0,
      electricityConsumption: 30,
      renewablePercentage: 100,
      acUsageHours: 0,
      dietType: 'Vegan',
      foodWaste: 'Never',
      onlinePurchases: 0,
      clothingPurchases: 0,
      electronicsPurchases: 0,
      recyclingFrequency: 'Always',
      plasticConsumption: 'Low',
      compostingHabits: 'Yes',
    });
    store.calculateResults();
    updatedBadges = useCarbonStore.getState().unlockedBadges;
    expect(useCarbonStore.getState().results.sustainabilityScore).toBeGreaterThanOrEqual(90);
    expect(updatedBadges).toContain('badge_hero');
  });

  // 5. Reset All State
  it('should restore all states to default when resetAll is invoked', () => {
    const store = useCarbonStore.getState();

    // Make changes
    store.setInputs({ vehicleType: 'Electric' });
    store.toggleChallenge('c1');
    store.toggleRoadmapTask('r1');
    store.addChatMessage('Test message', 'user');

    // Reset
    store.resetAll();

    const resetState = useCarbonStore.getState();
    expect(resetState.inputs.vehicleType).toBe('Gasoline');
    expect(resetState.ecoPoints).toBe(340);
    expect(resetState.unlockedBadges).toEqual(['badge_beginner']);
    expect(resetState.chatHistory.length).toBe(1);
    expect(resetState.wizardStep).toBe(0);
    expect(resetState.hasCompletedWizard).toBe(false);
  });
});
