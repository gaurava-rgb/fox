import { createBrowserRouter, Navigate } from 'react-router-dom'
import MarketingLayout from './layouts/MarketingLayout.jsx'
import AppLayout from './layouts/AppLayout.jsx'
import Home from './marketing/Home.jsx'
import Pricing from './marketing/Pricing.jsx'
import About from './marketing/About.jsx'
import SignIn from './app/SignIn.jsx'
import Overview from './app/Overview.jsx'
import Discover from './app/Discover.jsx'
import Results from './app/Results.jsx'
import Drafts from './app/Drafts.jsx'
import Assets from './app/Assets.jsx'
import Connectors from './app/Connectors.jsx'
import Graph from './app/Graph.jsx'
import Flows from './app/Flows.jsx'
import Reports from './app/Reports.jsx'
import Billing from './app/Billing.jsx'
import Settings from './app/Settings.jsx'

/* GitHub Pages serves this project at /fox/ — detect the subpath so
   BrowserRouter works locally (root) and on Pages (/fox) alike. */
const onPages = typeof window !== 'undefined' && window.location.pathname.startsWith('/fox')
const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/about', element: <About /> },
    ],
  },
  { path: '/signin', element: <SignIn /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/app', element: <Navigate to="/projects/demo/summary" replace /> },
      { path: '/projects/:projectId/summary', element: <Overview /> },
      { path: '/projects/:projectId/discover', element: <Discover /> },
      { path: '/projects/:projectId/results', element: <Results /> },
      { path: '/projects/:projectId/drafts', element: <Drafts /> },
      { path: '/projects/:projectId/assets', element: <Assets /> },
      { path: '/projects/:projectId/connectors', element: <Connectors /> },
      { path: '/projects/:projectId/graph', element: <Graph /> },
      { path: '/projects/:projectId/flows', element: <Flows /> },
      { path: '/projects/:projectId/reports/:slug', element: <Reports /> },
      { path: '/billing', element: <Billing /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
], { basename: onPages ? '/fox' : '/' })

export default router
