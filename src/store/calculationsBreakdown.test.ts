import { describe, it, expect, beforeEach } from 'vitest';
import { useCarbonStore } from './useCarbonStore';

describe('Carbon Calculations Category Breakdown', () => {
  beforeEach(() => {
    useCarbonStore.getState().resetAll();
  });

  // 1. Transportation Category Tests
  it('should calculate transportation emissions correctly for different vehicle types', () => {
    const store = useCarbonStore.getState();

    // Default mixed state baseline check
    store.calculateResults();
    let res = useCarbonStore.getState().results;
    // Mixed Mixed Mixed default transit is 4hrs, flight is 2 per year
    // Gasoline vehicle: 600 miles/mo * 12 * 0.24 = 1728 kg
    // Flights: 2 * 450 = 900 kg
    // Transit: 4 hours * 52 * 1.8 = 374.4 kg -> 374 kg
    // Total transport = 1728 + 900 + 374 = 3002 kg
    expect(res.breakdown.transportation).toBe(3002);

    // Switch vehicle type to Hybrid
    store.setInputs({ vehicleType: 'Hybrid', distanceTravelled: 1000 });
    store.calculateResults();
    res = useCarbonStore.getState().results;
    // Hybrid vehicle: 1000 miles/mo * 12 * 0.12 = 1440 kg
    // Flights: 2 * 450 = 900 kg
    // Transit: 4 hours * 52 * 1.8 = 374 kg
    // Total = 1440 + 900 + 374 = 2714 kg
    expect(res.breakdown.transportation).toBe(2714);

    // Switch vehicle type to Electric
    store.setInputs({ vehicleType: 'Electric', distanceTravelled: 1000 });
    store.calculateResults();
    res = useCarbonStore.getState().results;
    // Electric vehicle: 1000 miles/mo * 12 * 0.05 = 600 kg
    // Total = 600 + 900 + 374 = 1874 kg
    expect(res.breakdown.transportation).toBe(1874);
  });

  // 2. Household Energy Category Tests
  it('should calculate grid energy and AC cooling offsets correctly', () => {
    const store = useCarbonStore.getState();

    // Set custom energy values
    store.setInputs({
      electricityConsumption: 500, // 500 kWh/mo
      renewablePercentage: 50,      // 50% renewable
      acUsageHours: 10,             // 10 hours/day
      householdSize: 2              // 2 people
    });
    store.calculateResults();
    const res = useCarbonStore.getState().results;

    // Grid intensity: 0.46 * (1 - 50/100) = 0.23 kg/kWh
    // Electricity: 500 * 12 * 0.23 / 2 = 690 kg
    // AC emissions: 10 * 365 * 0.3 * (1 - 50/100) = 547.5 kg
    // Total energy = 690 + 547.5 = 1238 kg (rounded)
    expect(res.breakdown.energy).toBe(1238);
  });

  // 3. Diet & Food Category Tests
  it('should calculate food emissions correctly based on diet type and food waste level', () => {
    const store = useCarbonStore.getState();

    // Vegan + No Waste
    store.setInputs({ dietType: 'Vegan', foodWaste: 'Never' });
    store.calculateResults();
    let res = useCarbonStore.getState().results;
    expect(res.breakdown.food).toBe(950); // 950 + 0

    // Heavy Meat + High Waste
    store.setInputs({ dietType: 'Heavy Meat', foodWaste: 'High' });
    store.calculateResults();
    res = useCarbonStore.getState().results;
    expect(res.breakdown.food).toBe(3900); // 3400 + 500
  });

  // 4. Shopping Category Tests
  it('should calculate consumer shopping emissions correctly', () => {
    const store = useCarbonStore.getState();

    // Custom shopping inputs
    store.setInputs({
      onlinePurchases: 10,      // 10 shipments/mo
      clothingPurchases: 5,     // 5 items/mo
      electronicsPurchases: 3   // 3 items/yr
    });
    store.calculateResults();
    const res = useCarbonStore.getState().results;

    // Online shipments: 10 * 12 * 4.5 = 540 kg
    // Clothing: 5 * 12 * 16 = 960 kg
    // Electronics: 3 * 110 = 330 kg
    // Total = 540 + 960 + 330 = 1830 kg
    expect(res.breakdown.shopping).toBe(1830);
  });

  // 5. Waste & Recycling Category Tests
  it('should calculate waste emissions correctly based on recycling and composting', () => {
    const store = useCarbonStore.getState();

    // Always recycle, low plastic, composting Yes
    store.setInputs({
      recyclingFrequency: 'Always',
      plasticConsumption: 'Low',
      compostingHabits: 'Yes'
    });
    store.calculateResults();
    let res = useCarbonStore.getState().results;

    // Baseline: 380 * 0.25 (Always recycle) = 95 kg
    // Plastic: Low = -60 kg -> 35 kg
    // Composting: Yes = 0.75 multiplier -> 35 * 0.75 = 26.25 -> 26 kg
    expect(res.breakdown.waste).toBe(26);

    // Never recycle, high plastic, composting No
    store.setInputs({
      recyclingFrequency: 'Never',
      plasticConsumption: 'High',
      compostingHabits: 'No'
    });
    store.calculateResults();
    res = useCarbonStore.getState().results;

    // Baseline: 380 * 1.0 (Never recycle) = 380 kg
    // Plastic: High = +120 kg -> 500 kg
    // Composting: No = 1.0 multiplier -> 500 kg
    expect(res.breakdown.waste).toBe(500);
  });
});
