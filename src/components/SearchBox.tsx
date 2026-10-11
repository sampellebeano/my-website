import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
  initialQuery?: string;
  placeholder?: string;
}

export const SearchBox = ({ initialQuery = "", placeholder = "Search this site" }: SearchBoxProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();
  return (
    <form role="search" className="site-search" onSubmit={event => {
      event.preventDefault();
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }}>
      <Search size={16} aria-hidden="true" className="search-icon" />
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder={placeholder}
        aria-label="Search this site" type="search" maxLength={200} />
      <button type="submit" aria-label="Search"><ArrowRight size={17} aria-hidden="true" /></button>
    </form>
  );
};
