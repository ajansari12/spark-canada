import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
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
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import Disclaimer from "./pages/legal/Disclaimer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SubscriptionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/app/dashboard" element={<Dashboard />} />
              <Route path="/app/ideas" element={<Ideas />} />
              <Route path="/app/documents" element={<Documents />} />
              <Route path="/app/grants" element={<Grants />} />
              <Route path="/app/trends" element={<Trends />} />
              <Route path="/app/settings" element={<Settings />} />
              <Route path="/wizard" element={<Wizard />} />
              <Route path="/results" element={<Results />} />
              <Route path="/legal/terms" element={<Terms />} />
              <Route path="/legal/privacy" element={<Privacy />} />
              <Route path="/legal/disclaimer" element={<Disclaimer />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SubscriptionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;