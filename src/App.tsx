import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import ErrorBoundary from "@/components/ErrorBoundary";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Wizard from "./pages/Wizard";
import Results from "./pages/Results";
import Ideas from "./pages/Ideas";
import Documents from "./pages/Documents";
import Grants from "./pages/Grants";
import Trends from "./pages/Trends";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import SuccessStories from "./pages/SuccessStories";
import IdeaDatabase from "./pages/IdeaDatabase";
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Disclaimer from "./pages/legal/Disclaimer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsProvider>
              <Routes>
                <Route path="/" element={<RouteErrorBoundary routeName="Home"><Index /></RouteErrorBoundary>} />
                <Route path="/auth" element={<RouteErrorBoundary routeName="Auth"><Auth /></RouteErrorBoundary>} />
                <Route path="/pricing" element={<RouteErrorBoundary routeName="Pricing"><Pricing /></RouteErrorBoundary>} />
                <Route path="/app/dashboard" element={<RouteErrorBoundary routeName="Dashboard"><Dashboard /></RouteErrorBoundary>} />
                <Route path="/app/ideas" element={<RouteErrorBoundary routeName="Ideas"><Ideas /></RouteErrorBoundary>} />
                <Route path="/app/documents" element={<RouteErrorBoundary routeName="Documents"><Documents /></RouteErrorBoundary>} />
                <Route path="/app/grants" element={<RouteErrorBoundary routeName="Grants"><Grants /></RouteErrorBoundary>} />
                <Route path="/app/trends" element={<RouteErrorBoundary routeName="Trends"><Trends /></RouteErrorBoundary>} />
                <Route path="/app/settings" element={<RouteErrorBoundary routeName="Settings"><Settings /></RouteErrorBoundary>} />
                <Route path="/wizard" element={<RouteErrorBoundary routeName="Wizard"><Wizard /></RouteErrorBoundary>} />
                <Route path="/results" element={<RouteErrorBoundary routeName="Results"><Results /></RouteErrorBoundary>} />
                <Route path="/success-stories" element={<RouteErrorBoundary routeName="SuccessStories"><SuccessStories /></RouteErrorBoundary>} />
                <Route path="/idea-database" element={<RouteErrorBoundary routeName="IdeaDatabase"><IdeaDatabase /></RouteErrorBoundary>} />
                <Route path="/legal/terms" element={<RouteErrorBoundary routeName="Terms"><Terms /></RouteErrorBoundary>} />
                <Route path="/legal/privacy" element={<RouteErrorBoundary routeName="Privacy"><Privacy /></RouteErrorBoundary>} />
                <Route path="/legal/disclaimer" element={<RouteErrorBoundary routeName="Disclaimer"><Disclaimer /></RouteErrorBoundary>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;