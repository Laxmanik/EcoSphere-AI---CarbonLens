import { create } from 'zustand';

export interface AssessmentInputs {
  // Transportation
  vehicleType: 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric' | 'None';
  distanceTravelled: number; // miles per month
  flightsPerYear: number;
  publicTransitHours: number; // hours per week

  // Energy
  electricityConsumption: number; // kWh per month
  renewablePercentage: number; // 0 to 100
  acUsageHours: number; // hours per day
  householdSize: number;

  // Food
  dietType: 'Vegan' | 'Vegetarian' | 'Pescatarian' | 'Mixed' | 'Heavy Meat';
  foodWaste: 'Never' | 'Low' | 'Medium' | 'High';

  // Shopping
  onlinePurchases: number; // shipments per month
  clothingPurchases: number; // items per month
  electronicsPurchases: number; // items per year

  // Waste
  recyclingFrequency: 'Always' | 'Often' | 'Sometimes' | 'Never';
  plasticConsumption: 'Low' | 'Medium' | 'High';
  compostingHabits: 'Yes' | 'No';
}

export interface CategoryBreakdown {
  transportation: number; // annual kg CO2
  energy: number;
  food: number;
  shopping: number;
  waste: number;
}

export interface CalculationResults {
  annualEmissions: number; // annual kg CO2
  monthlyEmissions: number; // monthly kg CO2
  sustainabilityScore: number; // 0 to 100
  reductionPotential: number; // annual kg CO2 potential savings
  breakdown: CategoryBreakdown;
  hotspots: {
    category: keyof CategoryBreakdown;
    title: string;
    description: string;
    impact: 'High' | 'Medium';
  }[];
}

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  timeframe: '30-day' | '90-day' | '1-year';
  points: number;
  completed: boolean;
  co2Reduction: number; // annual kg saved
}

interface CarbonState {
  inputs: AssessmentInputs;
  results: CalculationResults;
  ecoPoints: number;
  unlockedBadges: string[];
  challenges: Challenge[];
  roadmap: RoadmapTask[];
  chatHistory: Message[];
  wizardStep: number;
  hasCompletedWizard: boolean;

  setInputs: (inputs: Partial<AssessmentInputs>) => void;
  setWizardStep: (step: number) => void;
  setHasCompletedWizard: (completed: boolean) => void;
  calculateResults: () => void;
  toggleChallenge: (id: string) => void;
  toggleRoadmapTask: (id: string) => void;
  addChatMessage: (text: string, sender: 'ai' | 'user') => void;
  resetAll: () => void;
}

// Default inputs representing the default sample data
const defaultInputs: AssessmentInputs = {
  vehicleType: 'Gasoline',
  distanceTravelled: 600,
  flightsPerYear: 2,
  publicTransitHours: 4,
  electricityConsumption: 380,
  renewablePercentage: 15,
  acUsageHours: 6,
  householdSize: 2,
  dietType: 'Mixed',
  foodWaste: 'Medium',
  onlinePurchases: 5,
  clothingPurchases: 2,
  electronicsPurchases: 1,
  recyclingFrequency: 'Often',
  plasticConsumption: 'Medium',
  compostingHabits: 'No',
};

// Initial challenges list
const initialChallenges: Challenge[] = [
  { id: 'c1', title: 'Car-Free Commute', description: 'Use public transit or walk to work for 3 consecutive days.', points: 150, completed: false },
  { id: 'c2', title: 'Meat-Free Week', description: 'Adopt a full vegetarian diet for 7 days.', points: 250, completed: false },
  { id: 'c3', title: 'Unplug Standby Devices', description: 'Unplug chargers and appliances when not in use for a weekend.', points: 80, completed: true },
  { id: 'c4', title: 'Composting Champion', description: 'Start composting organic waste at home.', points: 200, completed: false },
  { id: 'c5', title: 'Local Shopping Spree', description: 'Buy only locally sourced foods and zero imports for a week.', points: 120, completed: false },
];

// Initial roadmap tasks
const initialRoadmap: RoadmapTask[] = [
  // 30-Day Plan
  { id: 'r1', title: 'Swap to LED Bulbs', description: 'Replace 10 traditional halogen bulbs with high-efficiency LEDs.', timeframe: '30-day', points: 50, completed: false, co2Reduction: 120 },
  { id: 'r2', title: 'Implement Meatless Mondays', description: 'Commit to eating no meat every Monday.', timeframe: '30-day', points: 75, completed: false, co2Reduction: 210 },
  { id: 'r3', title: 'Verify Energy Vampire Outlets', description: 'Put major entertainment systems on smart power strips.', timeframe: '30-day', points: 40, completed: true, co2Reduction: 85 },
  // 90-Day Plan
  { id: 'r4', title: 'Eco-Friendly Laundry habits', description: 'Wash clothes on cold cycle and air dry on a line.', timeframe: '90-day', points: 100, completed: false, co2Reduction: 180 },
  { id: 'r5', title: 'Adjust Smart Thermostat Settings', description: 'Lower heating by 2°C in winter and AC by 2°C in summer.', timeframe: '90-day', points: 120, completed: false, co2Reduction: 320 },
  { id: 'r6', title: 'Establish Zero-Waste Grocery Kit', description: 'Eliminate plastic produce bags and use cotton totes.', timeframe: '90-day', points: 80, completed: false, co2Reduction: 90 },
  // 1-Year Plan
  { id: 'r7', title: 'Transition to Hybrid/Electric Vehicle', description: 'Upgrade gasoline commuter car to a clean alternative.', timeframe: '1-year', points: 500, completed: false, co2Reduction: 1800 },
  { id: 'r8', title: 'Install Rooftop Solar Panels', description: 'Generate at least 50% of domestic power from clean local solar.', timeframe: '1-year', points: 800, completed: false, co2Reduction: 2200 },
];

const initialChatHistory: Message[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: 'Hello! I am CarbonLens Coach. I can help explain your footprint details, guide you through clean energy swaps, or provide daily sustainability tips. What would you like to explore first?',
    timestamp: new Date(),
  },
];

// Helper function to calculate emissions and scores
const performCalculations = (inputs: AssessmentInputs): CalculationResults => {
  // 1. Transportation Calculation (Annual kg CO2)
  let vehicleEmissions = 0;
  if (inputs.vehicleType === 'Gasoline') vehicleEmissions = inputs.distanceTravelled * 12 * 0.24; // 0.24 kg/mile
  else if (inputs.vehicleType === 'Diesel') vehicleEmissions = inputs.distanceTravelled * 12 * 0.27; // 0.27 kg/mile
  else if (inputs.vehicleType === 'Hybrid') vehicleEmissions = inputs.distanceTravelled * 12 * 0.12; // 0.12 kg/mile
  else if (inputs.vehicleType === 'Electric') vehicleEmissions = inputs.distanceTravelled * 12 * 0.05; // 0.05 kg/mile (grid charging)
  
  const flightEmissions = inputs.flightsPerYear * 450; // Average 450kg CO2 per flight
  const publicTransitEmissions = inputs.publicTransitHours * 52 * 1.8; // 1.8kg CO2 per hour on transit
  const transportationTotal = Math.round(vehicleEmissions + flightEmissions + publicTransitEmissions);

  // 2. Energy Calculation (Annual kg CO2)
  // Grid electricity intensity: ~0.46 kg per kWh. Renewable offset reduces this.
  const gridIntensity = 0.46 * (1 - inputs.renewablePercentage / 100);
  const electricityEmissions = (inputs.electricityConsumption * 12 * gridIntensity) / inputs.householdSize;
  const acEmissions = inputs.acUsageHours * 365 * 0.3 * (1 - inputs.renewablePercentage / 100); // 0.3kg per AC hour
  const energyTotal = Math.round(electricityEmissions + acEmissions);

  // 3. Food Calculation (Annual kg CO2)
  let dietEmissions = 2200; // Moderate mixed default
  if (inputs.dietType === 'Vegan') dietEmissions = 950;
  else if (inputs.dietType === 'Vegetarian') dietEmissions = 1350;
  else if (inputs.dietType === 'Pescatarian') dietEmissions = 1600;
  else if (inputs.dietType === 'Heavy Meat') dietEmissions = 3400;

  let foodWasteEmissions = 250;
  if (inputs.foodWaste === 'Never') foodWasteEmissions = 0;
  else if (inputs.foodWaste === 'Low') foodWasteEmissions = 100;
  else if (inputs.foodWaste === 'High') foodWasteEmissions = 500;
  const foodTotal = Math.round(dietEmissions + foodWasteEmissions);

  // 4. Shopping Calculation (Annual kg CO2)
  const shippingEmissions = inputs.onlinePurchases * 12 * 4.5; // 4.5kg per delivery
  const clothingEmissions = inputs.clothingPurchases * 12 * 16; // 16kg per garment
  const electronicsEmissions = inputs.electronicsPurchases * 110; // 110kg per device
  const shoppingTotal = Math.round(shippingEmissions + clothingEmissions + electronicsEmissions);

  // 5. Waste Calculation (Annual kg CO2)
  let wasteBaseline = 380; // Baseline annual waste emissions per person
  let recyclingMultiplier = 0.5;
  if (inputs.recyclingFrequency === 'Always') recyclingMultiplier = 0.25;
  else if (inputs.recyclingFrequency === 'Often') recyclingMultiplier = 0.4;
  else if (inputs.recyclingFrequency === 'Sometimes') recyclingMultiplier = 0.7;
  else if (inputs.recyclingFrequency === 'Never') recyclingMultiplier = 1.0;

  let plasticFactor = 0;
  if (inputs.plasticConsumption === 'Low') plasticFactor = -60;
  else if (inputs.plasticConsumption === 'High') plasticFactor = 120;

  let compostingMultiplier = 1.0;
  if (inputs.compostingHabits === 'Yes') compostingMultiplier = 0.75; // 25% reduction in organic methane

  const wasteTotal = Math.round((wasteBaseline * recyclingMultiplier + plasticFactor) * compostingMultiplier);

  // Annual and monthly metrics
  const annualEmissions = transportationTotal + energyTotal + foodTotal + shoppingTotal + wasteTotal;
  const monthlyEmissions = Math.round(annualEmissions / 12);

  // Sustainability score: Scale from 0 to 100
  // Target: Net-zero is 100, average is around 8000kg (score 60), high impact is > 18000kg (score 10)
  const normalizedScore = Math.max(0, Math.min(100, Math.round(100 - (annualEmissions / 190))));

  // Calculate potential reduction
  const reductionPotential = Math.round(
    (inputs.vehicleType === 'Gasoline' || inputs.vehicleType === 'Diesel' ? vehicleEmissions * 0.5 : 0) +
    (inputs.renewablePercentage < 80 ? energyTotal * 0.6 : 0) +
    (inputs.dietType === 'Heavy Meat' || inputs.dietType === 'Mixed' ? dietEmissions * 0.35 : 0) +
    (inputs.recyclingFrequency !== 'Always' ? wasteTotal * 0.3 : 0) +
    (shoppingTotal * 0.25)
  );

  // Determine carbon hotspots
  const hotspots: CalculationResults['hotspots'] = [];
  
  if (vehicleEmissions > 1500) {
    hotspots.push({
      category: 'transportation',
      title: 'High Vehicle Emissions',
      description: 'Your monthly gasoline/diesel commute accounts for a significant portion of your footprint. Switching to public transit, carpooling, or planning electric vehicle adoption will drop this score.',
      impact: 'High',
    });
  }

  if (electricityEmissions > 1200 && inputs.renewablePercentage < 30) {
    hotspots.push({
      category: 'energy',
      title: 'Fossil-Fuel Power Consumption',
      description: 'Your household electricity is mostly fed from standard fossil-fuel grid grids. Upgrading to a green energy plan or installing solar offsets this impact completely.',
      impact: 'High',
    });
  }

  if (dietEmissions > 2000) {
    hotspots.push({
      category: 'food',
      title: 'High Meat Consumption Diet',
      description: 'Your current food intake relies heavily on red meat and animal products. Reducing beef and dairy intake, even slightly, cuts methane contribution significantly.',
      impact: 'Medium',
    });
  }

  if (shoppingTotal > 800) {
    hotspots.push({
      category: 'shopping',
      title: 'Frequent Consumer Purchases',
      description: 'Online shipments, fast fashion purchases, and electronics shopping have higher embedded manufacturing and shipping emissions. Buying durable goods offsets this.',
      impact: 'Medium',
    });
  }

  if (inputs.recyclingFrequency === 'Never' || inputs.recyclingFrequency === 'Sometimes') {
    hotspots.push({
      category: 'waste',
      title: 'Unsorted Household Waste',
      description: 'Infrequent recycling of plastics, metals, and cardboards channels recyclable materials into landfills, amplifying municipal greenhouse gas impacts.',
      impact: 'Medium',
    });
  }

  // Ensure there is at least one hotspot
  if (hotspots.length === 0) {
    hotspots.push({
      category: 'energy',
      title: 'Minor Grid Emissions',
      description: 'Your footprint is outstandingly low. Offsetting minor residual grid electricity with community solar projects is your final step.',
      impact: 'Medium',
    });
  }

  return {
    annualEmissions,
    monthlyEmissions,
    sustainabilityScore: normalizedScore,
    reductionPotential,
    breakdown: {
      transportation: transportationTotal,
      energy: energyTotal,
      food: foodTotal,
      shopping: shoppingTotal,
      waste: wasteTotal,
    },
    hotspots,
  };
};

const qaLibrary = [
  {
    keywords: ["food waste", "waste food", "waste", "compost", "landfill", "scraps"],
    question: "How can I reduce food waste?",
    answer: "Landfills are massive emitters of methane. You can reduce food waste by:\n\n- Planning meals before shopping to avoid buying excess.\n- Storing food properly using airtight containers to prolong freshness.\n- Composting kitchen scraps to prevent anaerobic landfill decay."
  },
  {
    keywords: ["solar", "panels", "photovoltaic", "renewables"],
    question: "Is solar power worth it?",
    answer: "Yes! Installing solar panels offsets domestic electricity emissions to zero. It typically pays back its manufacturing carbon footprint in 1.5 years and offers substantial electricity savings."
  },
  {
    keywords: ["ev charging", "ev", "charging", "electric vehicle", "electric car"],
    question: "How do I optimize EV charging?",
    answer: "To optimize electric vehicle (EV) charging:\n\n- Charge during off-peak hours (when renewable grid mix is highest).\n- Use smart chargers that integrate directly with local solar production if available."
  },
  {
    keywords: ["beef", "meat", "lamb", "cow", "pork", "chicken", "diet", "vegan", "vegetarian", "plant-based"],
    question: "Why does beef have high emissions?",
    answer: "Beef production requires up to 20x more land and releases 10x more greenhouse gases than poultry. Cattle produce methane during digestion, and forest clearing for pastures releases carbon."
  },
  {
    keywords: ["electricity", "save power", "power strips", "energy vampires", "standby"],
    question: "How can I save household electricity?",
    answer: "Easy ways to cut electricity use:\n\n- Replace 10 traditional bulbs with LEDs (saves ~120kg CO₂/yr).\n- Unplug 'energy vampires' (chargers, appliances) when not in use.\n- Use smart power strips to automate cutting standby power."
  },
  {
    keywords: ["carbon footprint", "what is a carbon footprint"],
    question: "What is a carbon footprint?",
    answer: "A carbon footprint is the total amount of greenhouse gases (primarily carbon dioxide and methane) emitted directly or indirectly by our daily activities, measured in CO₂ equivalent (CO₂e)."
  },
  {
    keywords: ["net-zero", "net zero", "carbon neutral"],
    question: "What is Net-Zero?",
    answer: "Net-zero means achieving a balance between greenhouse gases put into the atmosphere and those taken out, ensuring our net atmospheric contribution is zero."
  },
  {
    keywords: ["flight", "plane", "flights", "aviation", "flying"],
    question: "Why are flights so carbon-heavy?",
    answer: "Aviation burns massive amounts of jet fuel directly in the high atmosphere. Just one long-haul roundtrip flight releases over 1,000 kg of direct CO₂ per passenger."
  },
  {
    keywords: ["fashion", "clothing", "clothes", "garment", "polyester", "apparel"],
    question: "Is fast fashion bad for the climate?",
    answer: "Yes. Fast fashion relies on cheap synthetic fibers (polyester, which is oil-based) and fossil-fuel-powered supply chains. The average garment emits 16 kg of CO₂ during production."
  },
  {
    keywords: ["transit", "public transit", "bus", "train", "subway", "rail"],
    question: "How does public transit help?",
    answer: "Taking electric buses, subways, or trains reduces travel emissions by up to 85% per passenger mile compared to driving a gasoline car."
  },
  {
    keywords: ["organic", "organic farming", "pesticides"],
    question: "Should I eat organic food?",
    answer: "Organic farming avoids synthetic fertilizers (which are carbon-intense to manufacture). However, eating plant-based (even non-organic) has a much larger carbon reduction than eating organic meat."
  },
  {
    keywords: ["recycle plastic", "recycling", "plastics", "recycle"],
    question: "Is recycling plastic effective?",
    answer: "Recycling reduces energy needed to manufacture raw plastics by 30-80%. However, reducing plastic use entirely and swapping to reusable containers is far more effective."
  },
  {
    keywords: ["heating", "cooling", "ac", "thermostat", "hvac", "temperature"],
    question: "How do I reduce heating/cooling footprint?",
    answer: "Adjust your smart thermostat settings: lowering heating by 2°C in winter and raising AC by 2°C in summer can cut HVAC emissions by 320 kg CO₂/year."
  },
  {
    keywords: ["co2e", "carbon equivalent", "equivalent"],
    question: "What is CO2e?",
    answer: "CO2e, or Carbon Dioxide Equivalent, is a standard unit for measuring carbon footprints. It translates the warming impact of other gases (like methane or nitrous oxide) into the equivalent amount of CO2."
  },
  {
    keywords: ["water", "shorter showers", "shower", "hot water", "cold wash"],
    question: "How can I reduce water usage?",
    answer: "Heating water is energy-intensive. Shorter showers, installing low-flow tap aerators, and washing clothes on cold cycles reduce water heating emissions significantly."
  },
  {
    keywords: ["online shopping", "delivery", "shipping", "packages"],
    question: "Is online shopping better than in-store?",
    answer: "Online shopping can be more efficient if delivery vans replace individual driving trips. However, selecting rushed/express shipping or returning items frequently quadruples emissions."
  },
  {
    keywords: ["offset", "offsets", "planting trees", "tree planting", "reforestation"],
    question: "What are the best tree offset projects?",
    answer: "The best tree planting offset projects focus on biodiverse reforestation rather than monoculture tree farms, ensuring trees grow to maturity and support local ecology."
  },
  {
    keywords: ["local food", "food miles", "buy local"],
    question: "Should I buy local food?",
    answer: "Buying local food reduces shipping distances ('food miles'). However, what you eat matters more than where it comes from. Swapping beef for beans reduces far more CO₂ than buying local beef."
  },
  {
    keywords: ["dairy", "milk", "oat milk", "cheese", "yogurt"],
    question: "What is the impact of dairy?",
    answer: "Like beef, dairy farming produces methane from cattle digestion and waste. Swapping dairy milk for oat or soy milk cuts your breakfast footprint by 70%."
  },
  {
    keywords: ["wind", "wind energy", "turbines", "wind power"],
    question: "Is wind energy better than solar?",
    answer: "Both are clean. Wind turbines have a slightly lower lifetime carbon footprint than solar panels, but both reduce grid emissions to near-zero compared to coal or gas."
  },
  {
    keywords: ["audit", "energy audit", "home audit"],
    question: "How do I start a home energy audit?",
    answer: "Start by checking window/door seals for drafts, verifying attic insulation depth, checking HVAC air filters, and assessing the age of major appliances."
  },
  {
    keywords: ["paris agreement", "1.5", "2 degrees", "climate goal"],
    question: "What is the Paris Agreement goal?",
    answer: "The Paris Agreement aims to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels, to prevent severe climate impacts."
  },
  {
    keywords: ["electronics", "phone", "computer", "devices", "laptop"],
    question: "What is the climate impact of electronics?",
    answer: "Manufacturing microchips and shipping devices is highly carbon-intensive. Extending your phone or computer's lifespan to 4+ years avoids significant mining and manufacturing carbon."
  },
  {
    keywords: ["paper vs plastic", "paper bags", "plastic bags"],
    question: "Is paper better than plastic?",
    answer: "Paper bags require 4x more energy and significantly more water to manufacture than single-use plastic, but they biodegrade. Reusable canvas bags are the best solution, used 100+ times."
  },
  {
    keywords: ["led", "light bulbs", "lighting"],
    question: "Why use LED light bulbs?",
    answer: "LEDs use 90% less energy than traditional incandescent bulbs and last up to 25 times longer, rapidly dropping domestic lighting carbon emissions."
  }
];

export const useCarbonStore = create<CarbonState>((set, get) => ({
  inputs: defaultInputs,
  results: performCalculations(defaultInputs),
  ecoPoints: 340, // Start with some default points
  unlockedBadges: ['badge_beginner'], // Start with Beginner badge
  challenges: initialChallenges,
  roadmap: initialRoadmap,
  chatHistory: initialChatHistory,
  wizardStep: 0,
  hasCompletedWizard: false,

  setInputs: (newInputs) => {
    set((state) => {
      const updatedInputs = { ...state.inputs, ...newInputs };
      return { inputs: updatedInputs };
    });
  },

  setWizardStep: (step) => set({ wizardStep: step }),

  setHasCompletedWizard: (completed) => set({ hasCompletedWizard: completed }),

  calculateResults: () => {
    const { inputs } = get();
    const results = performCalculations(inputs);
    
    // Auto unlock badges based on score
    set((state) => {
      const badges = [...state.unlockedBadges];
      
      if (!badges.includes('badge_explorer')) {
        badges.push('badge_explorer'); // Completion badge
      }
      
      if (results.sustainabilityScore >= 75 && !badges.includes('badge_reducer')) {
        badges.push('badge_reducer');
      }
      if (results.sustainabilityScore >= 90 && !badges.includes('badge_hero')) {
        badges.push('badge_hero');
      }
      
      return { 
        results,
        unlockedBadges: badges,
        hasCompletedWizard: true,
        wizardStep: 6 // result page inside wizard
      };
    });
  },

  toggleChallenge: (id) => {
    set((state) => {
      const updatedChallenges = state.challenges.map((c) => {
        if (c.id === id) {
          const nextState = !c.completed;
          // Add or subtract eco points
          const pointChange = nextState ? c.points : -c.points;
          return { ...c, completed: nextState };
        }
        return c;
      });

      const clickedChallenge = state.challenges.find((c) => c.id === id);
      const pointsDiff = clickedChallenge 
        ? (clickedChallenge.completed ? -clickedChallenge.points : clickedChallenge.points)
        : 0;

      // Unlocking Planet Guardian if all challenges completed
      const allCompleted = updatedChallenges.every((c) => c.completed);
      const badges = [...state.unlockedBadges];
      if (allCompleted && !badges.includes('badge_guardian')) {
        badges.push('badge_guardian');
      }

      return {
        challenges: updatedChallenges,
        ecoPoints: Math.max(0, state.ecoPoints + pointsDiff),
        unlockedBadges: badges,
      };
    });
  },

  toggleRoadmapTask: (id) => {
    set((state) => {
      const updatedRoadmap = state.roadmap.map((r) => {
        if (r.id === id) {
          return { ...r, completed: !r.completed };
        }
        return r;
      });

      const clickedTask = state.roadmap.find((r) => r.id === id);
      const pointsDiff = clickedTask 
        ? (clickedTask.completed ? -clickedTask.points : clickedTask.points)
        : 0;

      return {
        roadmap: updatedRoadmap,
        ecoPoints: Math.max(0, state.ecoPoints + pointsDiff),
      };
    });
  },

  addChatMessage: (text, sender) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date(),
    };

    set((state) => ({
      chatHistory: [...state.chatHistory, newMessage],
    }));

    // Trigger auto intelligent response if user sent the message
    if (sender === 'user') {
      setTimeout(() => {
        const lowerText = text.toLowerCase();
        let aiResponse = "";

        // Look for matching Q&A response
        const match = qaLibrary.find((item) =>
          item.keywords.some((kw) => lowerText.includes(kw))
        );

        if (match) {
          aiResponse = match.answer;
        } else {
          aiResponse = "I can help you audit your activities. To get started, you can try asking about specific reductions, like 'How can I save electricity?' or 'What is the most carbon-heavy diet?'";
        }

        const replyMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date(),
        };

        set((state) => ({
          chatHistory: [...state.chatHistory, replyMessage],
        }));
      }, 600);
    }
  },

  resetAll: () => {
    set({
      inputs: defaultInputs,
      results: performCalculations(defaultInputs),
      ecoPoints: 340,
      unlockedBadges: ['badge_beginner'],
      challenges: initialChallenges,
      roadmap: initialRoadmap,
      chatHistory: initialChatHistory,
      wizardStep: 0,
      hasCompletedWizard: false,
    });
  },
}));
