import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SearchBoxProps {
  initialQuery?: string;
  placeholder?: string;
}

export const SearchBox = ({ initialQuery = "", placeholder = "Search my experience, projects or qualifications" }: SearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form role="search" onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search aria-hidden="true" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            aria-label="Search my CV"
            type="search"
            maxLength={200}
            className="w-full h-14 pl-12 pr-5 text-base border border-border rounded-full
                     shadow-google-subtle hover:shadow-google-search
                     transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-primary
                     bg-input text-foreground"
          />
        </div>
        <div className="flex flex-wrap justify-center mt-5 gap-3 w-full">
          <Button variant="default" type="submit">CV Search</Button>
          <Button variant="secondary" asChild>
            <Link to="/search">View full CV</Link>
          </Button>
        </div>
      </form>
    </div>
  );
};
