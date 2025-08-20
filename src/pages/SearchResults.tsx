import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");

  return (
    <div>
      <h1>Search Results</h1>
      <p>Your search: <strong>{query}</strong></p>
      <p>Hello World</p>
    </div>
  );
};

export default SearchResults;