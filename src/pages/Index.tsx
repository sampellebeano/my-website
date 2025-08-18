import { useState } from "react";
import { GoogleSearchBox } from "@/components/GoogleSearchBox";
import { CVNavigation } from "@/components/CVNavigation";
import { CVFooter } from "@/components/CVFooter";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Here you could implement actual search functionality
    console.log("Searching for:", query);
  };

  const handleNavigation = (section: string) => {
    // Here you could implement navigation to different CV sections
    console.log("Navigating to:", section);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with navigation */}
      <header className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Button variant="google-nav">
              About this CV
            </Button>
            <Button variant="google-nav">
              Download PDF
            </Button>
          </div>
          
          <CVNavigation onNavigate={handleNavigation} />
        </div>
      </header>

      {/* Main content area - Google-style centered layout */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 pb-20">
        {/* Logo/Name area */}
        <div className="mb-8">
          <h1 className="text-6xl lg:text-7xl font-normal text-foreground mb-2 tracking-tight">
            <span className="text-google-blue">J</span>
            <span className="text-google-red">o</span>
            <span className="text-google-yellow">h</span>
            <span className="text-google-blue">n</span>
            <span className="text-google-green"> </span>
            <span className="text-google-red">D</span>
            <span className="text-google-blue">o</span>
            <span className="text-google-yellow">e</span>
          </h1>
          <p className="text-center text-google-gray text-lg">
            Full Stack Developer & Problem Solver
          </p>
        </div>

        {/* Search box */}
        <GoogleSearchBox 
          onSearch={handleSearch}
          placeholder="Search my experience, skills, projects..."
        />

        {/* Quick stats - Google's info cards style */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl w-full">
          <div className="text-center p-4 bg-card rounded-lg shadow-google-subtle hover:shadow-google-search transition-shadow duration-search">
            <div className="text-2xl font-bold text-google-blue mb-1">5+</div>
            <div className="text-sm text-google-gray">Years Experience</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg shadow-google-subtle hover:shadow-google-search transition-shadow duration-search">
            <div className="text-2xl font-bold text-google-green mb-1">50+</div>
            <div className="text-sm text-google-gray">Projects Completed</div>
          </div>
          <div className="text-center p-4 bg-card rounded-lg shadow-google-subtle hover:shadow-google-search transition-shadow duration-search">
            <div className="text-2xl font-bold text-google-red mb-1">15+</div>
            <div className="text-sm text-google-gray">Technologies</div>
          </div>
        </div>
      </main>

      <CVFooter />
    </div>
  );
};

export default Index;
