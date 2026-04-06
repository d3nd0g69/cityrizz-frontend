/*
 * CityRizz App Router
 * Design: Modern City Magazine
 * Routes: Home, Post Detail, Category, About, Contact, 404
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import NewsletterPage from "./pages/NewsletterPage";
import AdvertisePage from "./pages/AdvertisePage";
import UnsubscribePage from "./pages/UnsubscribePage";
import AdminSubscribersPage from "./pages/AdminSubscribersPage";
import EventsPage from "./pages/EventsPage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/post/:slug" component={PostDetail} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/newsletter" component={NewsletterPage} />
      <Route path="/advertise" component={AdvertisePage} />
      <Route path="/unsubscribe" component={UnsubscribePage} />
      <Route path="/admin/subscribers" component={AdminSubscribersPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
