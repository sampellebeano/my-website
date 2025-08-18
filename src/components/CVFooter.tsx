import { Button } from "@/components/ui/button";

export const CVFooter = () => {
  const footerLinks = [
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "Email", href: "#" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-google-light-gray border-t border-border py-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center text-sm">
          <div className="flex space-x-6">
            <Button variant="google-nav" className="text-xs">
              Privacy
            </Button>
            <Button variant="google-nav" className="text-xs">
              Terms
            </Button>
          </div>
          
          <div className="flex space-x-6">
            {footerLinks.map((link) => (
              <Button 
                key={link.label} 
                variant="google-nav" 
                className="text-xs"
                onClick={() => window.open(link.href, '_blank')}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};