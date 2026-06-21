# EcoSphere AI - CarbonLens

CarbonLens is a premium, climate-tech SaaS platform designed to empower individuals and households to assess, visualize, and systematically reduce their carbon footprints. Utilizing real-time data visualizers, an AI-guided coach, and actionable roadmaps, CarbonLens turns climate action from abstract goals into measurable progress.

---

## 🌟 Platform Overview

CarbonLens combines deep scientific metrics with a high-fidelity, interactive, dark-themed glassmorphic user experience inspired by premium products like Linear and Stripe.

### Key Capabilities
- **Interactive Assessment Wizard**: A 5-step detailed onboarding quiz covering Transportation, Energy, Food, Shopping, and Waste.
- **Analytics Dashboard**: Dynamic KPI readouts and interactive charts detailing annual emissions, categories breakdowns, and monthly trends.
- **AI Sustainability Coach**: A real-time context-aware chat interface providing actionable solutions and tips on demand.
- **Reduction Roadmap**: A gamified 30-day, 90-day, and 1-year timeline showing milestones, points, unlocked badges, and weekly challenges.
- **Education Hub**: A searchable and category-filtered repository of climate articles, featuring a high-fidelity PDF report export capability.

---

## 🏗️ Folder Structure & Architecture

The application is structured inside Next.js 16 App Router using React 19, TypeScript, Tailwind CSS v4, and Zustand.

```
EcoSphere AI - CarbonLens/
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css          # Design system variables, Tailwind v4 configurations, animations
│   │   ├── layout.tsx           # Global HTML shell, font integration, and viewport setups
│   │   └── page.tsx             # Root page containing layout navigation, tab state, and WebGL overlays
│   ├── components/
│   │   ├── Logo.tsx             # Interactive SVG brand logo
│   │   ├── Pages/
│   │   │   ├── AICoach.tsx            # AI Chat window with preset chips and response generator
│   │   │   ├── AnalyticsDashboard.tsx # Recharts breakdown visualization, baseline notifications
│   │   │   ├── AssessmentWizard.tsx   # Multi-stage questionnaires and calculation trigger
│   │   │   ├── EducationHub.tsx       # Resource list, filter controllers, and jsPDF exporter
│   │   │   ├── LandingPage.tsx        # Hero banner, 3D Globe overlay, and Bento grid metrics
│   │   │   └── ReductionRoadmap.tsx   # Reduction milestone roadmap tracker and badges display
│   │   └── Visuals/
│   │       ├── BackgroundShader.tsx   # GPU WebGL fluid noise background shader
│   │       └── ThreeGlobe.tsx         # Interactive Three.js wireframe sphere and star field
│   └── store/
│       └── useCarbonStore.ts    # Central Zustand store managing inputs, metrics, badges, and history
```

---

## 🧪 Carbon Calculation Formulas

The carbon calculation engine is defined in [useCarbonStore.ts](file:///e:/ComSwitch/Google%20Virtual%20Promptwars%20Challenges/EcoSphere%20AI%20-%20CarbonLens/src/store/useCarbonStore.ts). Annual emissions are calculated in **kg CO₂** and aggregated across five categories:

### 1. Transportation
Calculates emissions from private vehicles, flights, and public transit:
$$\text{Transportation} = \text{Vehicle Emissions} + \text{Flight Emissions} + \text{Public Transit Emissions}$$
- **Vehicle Type Factors** (per mile):
  - *Gasoline*: $0.24 \text{ kg CO}_2$
  - *Diesel*: $0.27 \text{ kg CO}_2$
  - *Hybrid*: $0.12 \text{ kg CO}_2$
  - *Electric*: $0.05 \text{ kg CO}_2$ (accounting for regional grid charging index)
  - *None*: $0.00 \text{ kg CO}_2$
- **Flight Factor**: $450 \text{ kg CO}_2$ per flight (covers average short/long-haul segments).
- **Public Transit**: $1.8 \text{ kg CO}_2$ per commuting hour (scaled weekly to annual).

### 2. Household Energy
Estimates electricity and space cooling loads divided by occupants:
$$\text{Energy} = \frac{\text{Electricity Consumption} \times 12 \times \text{Grid Intensity}}{\text{Household Size}} + \text{AC Consumption}$$
- **Grid Intensity**: Baseline of $0.46 \text{ kg per kWh}$ modified by renewable power offsets:
  $$\text{Grid Intensity} = 0.46 \times \left(1 - \frac{\text{Renewable \%}}{100}\right)$$
- **AC Cooling Factor**: $0.3 \text{ kg per hour}$ adjusted by renewable offsets and scaled annually.

### 3. Food and Diet
Correlates nutrition profiles and waste behaviors:
$$\text{Food} = \text{Diet Baseline} + \text{Food Waste Increment}$$
- **Diet Types** (annual baseline):
  - *Vegan*: $950 \text{ kg CO}_2$
  - *Vegetarian*: $1,350 \text{ kg CO}_2$
  - *Pescatarian*: $1,600 \text{ kg CO}_2$
  - *Mixed*: $2,200 \text{ kg CO}_2$
  - *Heavy Meat*: $3,400 \text{ kg CO}_2$
- **Waste Factor**: Up to $+500 \text{ kg CO}_2$ (High Waste) or $0 \text{ kg CO}_2$ (Never).

### 4. Shopping and Consumer Goods
Measures lifecycle greenhouse gases for manufactured products:
$$\text{Shopping} = (\text{Online Shipments} \times 12 \times 4.5) + (\text{Clothing Items} \times 12 \times 16) + (\text{Electronics} \times 110)$$
- **Online Shipments**: $4.5 \text{ kg CO}_2$ per delivery.
- **Apparel Items**: $16 \text{ kg CO}_2$ per garment.
- **Electronics**: $110 \text{ kg CO}_2$ per gadget/device.

### 5. Waste and Disposal
Calculates refuse footprint based on diversion indices:
$$\text{Waste} = (\text{Baseline Waste} \times \text{Recycling Multiplier} + \text{Plastic Factor}) \times \text{Composting Multiplier}$$
- **Baseline Waste**: $380 \text{ kg CO}_2$ per user.
- **Recycling Multipliers**: $0.25$ (Always) to $1.0$ (Never).
- **Plastic Factor**: $-60 \text{ kg CO}_2$ (Low) to $+120 \text{ kg CO}_2$ (High).
- **Composting Offset**: $0.75$ multiplier (saves 25% methane emissions via anaerobic decomposition bypass).

---

## 📈 Score Normalization

The overall **Sustainability Score** maps the total annual emissions into a $0 - 100$ index:
$$\text{Sustainability Score} = \max\left(0, \min\left(100, 100 - \frac{\text{Total Emissions}}{190}\right)\right)$$
- An annual emission of **$0 \text{ kg}$** yields a score of **$100$**.
- A standard mixed baseline of **$7,600 \text{ kg}$** yields a score of **$60$**.
- Extremely high-impact footprints exceeding **$19,000 \text{ kg}$** floor to a score of **$0$**.

---

## 🚀 Execution Commands

### Installation
Install standard dependencies from `package.json`:
```bash
npm install
```

### Local Development
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build and Deploy
Verify compiler setups and generate production build assets:
```bash
npm run build
```

Run the compiled app locally:
```bash
npm start
```

---

## 🐙 How to Push to GitHub

Follow these steps to initialize git (if not already done) and push the project to your GitHub repository:

1. **Initialize Git Repository**:
   If you haven't initialized git in this directory yet:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for EcoSphere AI CarbonLens"
   ```

2. **Create a GitHub Repository**:
   - Go to [GitHub](https://github.com/) and create a new repository (keep it empty, do not initialize with README or gitignore).
   - Copy the remote repository URL (e.g., `https://github.com/your-username/ecosphere-carbonlens.git`).

3. **Link Local Repository to GitHub & Push**:
   ```bash
   git remote add origin https://github.com/your-username/ecosphere-carbonlens.git
   git branch -M main
   git push -u origin main
   ```

---

## ☁️ How to Deploy to Google Cloud Run

We have included a production-ready `Dockerfile` and `.dockerignore` for containerized deployment. Google Cloud Run is the recommended serverless container platform for running Next.js.

### Prerequisites
1. Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install).
2. Initialize the CLI and log in:
   ```bash
   gcloud init
   gcloud auth login
   ```
3. Enable the required API services in your Google Cloud Project:
   ```bash
   gcloud services enable run.googleapis.com containerregistry.googleapis.com artifactregistry.googleapis.com
   ```

### Option A: Direct Deployment (easiest, via gcloud run deploy)
You can build and deploy the container image directly using Google Cloud Build in a single command:
```bash
gcloud run deploy ecosphere-carbonlens --source . --region us-central1 --allow-unauthenticated
```
*This command uploads your local source files, builds the Docker container in the cloud, registers it, and deploys it to a secure, auto-scaling Cloud Run service.*

### Option B: Build and Push Manually (using Artifact Registry)
1. **Create an Artifact Registry Repository**:
   ```bash
   gcloud artifacts repositories create ecosphere-repo --repository-format=docker --location=us-central1
   ```

2. **Configure Docker authentication**:
   ```bash
   gcloud auth configure-docker us-central1-docker.pkg.dev
   ```

3. **Build and Tag your Docker image locally**:
   ```bash
   docker build -t us-central1-docker.pkg.dev/[PROJECT_ID]/ecosphere-repo/carbonlens:v1 .
   ```
   *(Replace `[PROJECT_ID]` with your actual Google Cloud Project ID).*

4. **Push the image to Google Artifact Registry**:
   ```bash
   docker push us-central1-docker.pkg.dev/[PROJECT_ID]/ecosphere-repo/carbonlens:v1
   ```

5. **Deploy the container to Cloud Run**:
   ```bash
   gcloud run deploy ecosphere-carbonlens \
     --image us-central1-docker.pkg.dev/[PROJECT_ID]/ecosphere-repo/carbonlens:v1 \
     --region us-central1 \
     --allow-unauthenticated
   ```

Once deployed, Google Cloud Run will output a public HTTPS service URL (e.g., `https://ecosphere-carbonlens-xxxxxx-uc.a.run.app`) where your live application is hosted!

