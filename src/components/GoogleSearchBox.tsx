import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GoogleSearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const GoogleSearchBox = ({ onSearch, placeholder = "Search my CV..." }: GoogleSearchBoxProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-google-gray w-5 h-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-12 text-lg border-2 border-border rounded-full 
                     shadow-google-search hover:shadow-google-search focus:shadow-google-search 
                     transition-shadow duration-search focus:outline-none focus:ring-0 focus:border-border
                     bg-input text-foreground"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-google-gray hover:text-foreground transition-colors duration-fast"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      <div className="flex justify-center mt-8 space-x-4">
        <Button variant="google-search" onClick={() => onSearch?.(query)}>
          CV Search
        </Button>
        <Button variant="google-lucky">
          I'm Feeling Hireable
        </Button>
      </div>
    </div>
  );
};