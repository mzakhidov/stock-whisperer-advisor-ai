
# AI Stock Whisperer

AI Stock Whisperer is an advanced platform for smart stock discovery, insightful analytics, and actionable investing insights powered by artificial intelligence.

## Features

- Real-time stock market data and analysis
- AI-powered buy/sell signals and risk assessments
- Personalized dashboards and watchlists
- Educational resources on stock market basics and investing
- Secure user authentication and profile management
- Responsive and modern UI built with React and Tailwind CSS

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components
- React Router DOM for routing
- Tanstack React Query for data fetching and caching
- Sonner for notifications
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js and npm installed (recommend using nvm for version management)

### Installation

1. Clone the repository:

```bash
git clone <YOUR_GIT_REPOSITORY_URL>
```

2. Navigate to the project directory:

```bash
cd <PROJECT_DIRECTORY>
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

Create a `.env` file in the root directory and add your API keys:

```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
VITE_FMP_API_KEY=your_financial_modeling_prep_api_key
VITE_POLYGON_API_KEY=your_polygon_api_key
```

If no API keys are configured, the app will use mock data.

### Running the App

Start the development server with hot reload:

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:8080
```

## Project Structure

- `src/components`: Reusable UI components
- `src/pages`: Page components corresponding to routes
- `src/contexts`: React contexts like AuthContext
- `src/services`: API and data services, including stock data fetching and recommendation logic
- `src/hooks`: Custom React hooks
- `src/types`: TypeScript type definitions
- `src/App.tsx`: Main app entry and routing

## Usage

- Visit `/` for the landing page
- Visit `/guides` for educational content (no login required)
- Login or sign up to access the dashboard and profile
- Manage your watchlist, view detailed stock data, and get AI-powered recommendations

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes and enhancements.

## License

This project is open-source and licensed under the MIT License.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.

