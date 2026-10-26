# NestNova MVP

NestNova is a trusted student-living platform MVP designed to help students find verified PGs, hostels, mess services, and tiffin services near their college or workplace.

## How to Install and Run Locally

1. Clone the repository and navigate to the root folder: `NestNova`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Homepage
│   ├── search/           # Search properties
│   ├── property/[slug]/  # Property detail view
│   ├── food/             # Mess & tiffin discovery
│   ├── compare/          # Side-by-side comparison
│   ├── my-requests/      # Student requests dashboard
│   ├── owner/            # Owner dashboard
│   └── how-verification-works/ # Trust & safety policy
├── components/           # UI Components
│   ├── ui/               # Reusable base components (Button, Badge, etc.)
│   ├── ActionDialog.tsx  # Dialog for enquiries, visits, bookings
│   ├── CostCalculator.tsx# Transparency calculator
│   └── PropertyCard.tsx  # Search result cards
├── data/
│   └── mockData.ts       # Typed mock data (Properties, Food, Reviews, Owners)
├── store/
│   └── clientStore.tsx   # React Context + localStorage for cross-page state
└── utils/
    ├── cn.ts             # Tailwind class merging
    └── travel.ts         # Travel estimation formulas
```

## Demo-Only Features (Not Real)

This is an MVP prototype. The following features run purely on local mock data and client state:

- **Verification**: No actual on-ground checks are performed. Badges and checklists are sample data.
- **Reviews**: Sample data. Review scores are pre-calculated mock numbers.
- **Bookings & Payments**: The "Pay Token" flow simulates a loading state but processes no real payments.
- **Commute Estimates**: Travel times and costs are calculated using simple static mathematical formulas based on mock distances, not live traffic or maps APIs.
- **Requests & Owner Sync**: Enquiries, visits, and bookings are saved in your browser's `localStorage`. Changes in the "Owner Dashboard" instantly reflect in your "My Requests" tab because they share the same browser memory, but there is no real backend server.

## Assumptions Made

- Assumed Next.js 15 (App Router) with Tailwind CSS v4, TypeScript, and Lucide React icons.
- Used local storage wrapped in React Context to simulate real-time updates between the student view and the owner dashboard (avoiding the need for a complex state management library like Redux).
- Built a light-theme only experience based on the color tokens provided.
- Simulated travel data deterministically in `src/utils/travel.ts` instead of integrating Google Maps.
- "Sponsored" properties are intentionally weighted to appear at the top in simple array sorting to demonstrate the "sponsored row" concept, but they are clearly marked.
- Images are simple CSS-generated static placeholders rather than loading external images to avoid broken links and maintain the exact instructions ("No external image URLs").
