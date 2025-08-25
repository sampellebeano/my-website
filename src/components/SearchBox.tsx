import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBox = ({ onSearch, placeholder = "Search my CV..." }: SearchBoxProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-12 text-lg border-2 border-border rounded-full 
                     shadow-search hover:shadow-search focus:shadow-search 
                     transition-shadow duration-200 focus:outline-none focus:ring-0 focus:border-border
                     bg-input text-foreground"
          />
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-muted hover:text-foreground transition-colors duration-150"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="flex flex-wrap justify-center mt-8 gap-4 w-full">
        <Button variant="default" onClick={() => {
          onSearch?.(query);
          navigate(`/search?query=${encodeURIComponent(query)}`);
        }}>
          CV Search
        </Button>
        <Button variant="secondary">
          I'm Feeling Hireable
        </Button>
      </div>
    </div>
  );
};