# Mesh Circular Shift Visualizer

Interactive React web application that simulates a circular `q`-shift on a 2D mesh topology.

## Live Deployment URL

Add your public deployment URL here after publishing, for example:

https://mesh-shift-visualizer-dgpp.vercel.app

## Features

- Input validation for `p` (4 to 64, perfect square only) and `q` (1 to `p-1`)
- Mesh grid visualization for `sqrt(p) x sqrt(p)` nodes
- Step-by-step view of:
  - Before shift
  - Stage 1: Row shift by `q mod sqrt(p)`
  - Stage 2: Column shift by `floor(q / sqrt(p))`
- Real-time complexity panel
- Mesh vs ring communication comparison chart
- Pure reusable shift logic module in `src/utils/shiftLogic.js`

## Repository Structure

```
mesh-shift-visualizer/
├── public/
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx
│   │   ├── ControlPanel.jsx
│   │   └── ComplexityPanel.jsx
│   ├── utils/
│   │   └── shiftLogic.js
│   ├── App.jsx
│   ├── index.jsx
│   └── styles.css
├── README.md
├── package.json
├── vite.config.js
└── index.html
```

## Local Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the local URL shown in the terminal.

## Production Build

```bash
npm run build
npm run preview
```

## Deployment on Vercel

1. Push this project to a **public GitHub repository**.
2. Sign in to Vercel.
3. Click **Add New Project** and import the GitHub repo.
4. Keep the default Vite settings.
5. Deploy.
6. Copy the public URL and paste it at the top of this README.

## Suggested Commit History

Use meaningful incremental commits, for example:

- `Initialize Vite React project`
- `Add pure mesh shift logic`
- `Build control panel and validation`
- `Implement mesh grid states and arrows`
- `Add complexity comparison panel`
- `Polish styles and responsive layout`
- `Add report and screenshots`
