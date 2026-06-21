import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from './useCarbonStore';

describe('useCarbonStore', () => {
  beforeEach(() => {
    useCarbonStore.getState().resetAll();
  });

  it('should initialize with default values', () => {
    const state = useCarbonStore.getState();
    expect(state.ecoPoints).toBe(340);
    expect(state.inputs.vehicleType).toBe('Gasoline');
    expect(state.chatHistory.length).toBe(1);
  });

  it('should allow updating assessment inputs', () => {
    const store = useCarbonStore.getState();
    store.setInputs({ vehicleType: 'Electric', distanceTravelled: 200 });
    
    const updatedState = useCarbonStore.getState();
    expect(updatedState.inputs.vehicleType).toBe('Electric');
    expect(updatedState.inputs.distanceTravelled).toBe(200);
  });

  it('should calculate correct emissions and score', () => {
    const store = useCarbonStore.getState();
    // Set low footprint values
    store.setInputs({
      vehicleType: 'None',
      distanceTravelled: 0,
      flightsPerYear: 0,
      publicTransitHours: 0,
      electricityConsumption: 50,
      renewablePercentage: 100,
      acUsageHours: 0,
      householdSize: 4,
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
    const results = useCarbonStore.getState().results;
    
    expect(results.annualEmissions).toBeLessThan(1500);
    expect(results.sustainabilityScore).toBeGreaterThan(90);
  });

  it('should handle toggle challenge and add/subtract eco points', () => {
    const store = useCarbonStore.getState();
    const initialPoints = store.ecoPoints;
    
    // Toggle c1 challenge
    store.toggleChallenge('c1');
    
    const updatedState = useCarbonStore.getState();
    expect(updatedState.challenges.find(c => c.id === 'c1')?.completed).toBe(true);
    expect(updatedState.ecoPoints).toBe(initialPoints + 150);
  });
});
