import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CV from "./pages/CV";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectOverview from "./pages/ProjectOverview";
import Updates from "./pages/Updates";
import Books from "./pages/Books";
import SiteHistory from "./pages/SiteHistory";
import { RouteScroll } from "./components/RouteScroll";
import { sections } from "./data/cv";

const queryClient = new QueryClient();

const LegacyCVRedirect = () => {
  const { search } = useLocation();
  const requestedSection = new URLSearchParams(search).get("section");
  const section = sections.find(item => item.id === requestedSection);
  return <Navigate replace to={section ? `/cv?section=${section.id}` : "/cv"} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <RouteScroll />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/search" element={<LegacyCVRedirect />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectOverview />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/books" element={<Books />} />
          <Route path="/history" element={<SiteHistory />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
