import { Button } from "@/components/ui/button";

interface CVNavigationProps {
  onNavigate?: (section: string) => void;
}

export const CVNavigation = ({ onNavigate }: CVNavigationProps) => {
  const navItems = [
    { label: "About", section: "about" },
    { label: "Experience", section: "experience" },
    { label: "Skills", section: "skills" },
    { label: "Projects", section: "projects" },
    { label: "Contact", section: "contact" },
  ];

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Button
          key={item.section}
          variant="google-nav"
          onClick={() => onNavigate?.(item.section)}
          className="text-sm"
        >
          {item.label}
        </Button>
      ))}
    </nav>
  );
};