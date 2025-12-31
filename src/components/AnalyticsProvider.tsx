import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider = ({ children }: AnalyticsProviderProps) => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  // Track page views on route changes
  useEffect(() => {
    trackPageView({
      path: location.pathname,
      title: document.title,
      referrer: document.referrer,
    });
  }, [location.pathname, trackPageView]);

  return <>{children}</>;
};

export default AnalyticsProvider;
