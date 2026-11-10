import { Link } from "react-router-dom";

export const PreviousVersions = () => (
  <Link className="previous-versions text-link" to="/history">Site history <span aria-hidden="true">↗</span></Link>
);
