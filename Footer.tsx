import { Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:your.email@example.com", label: "Email" },
  ];

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-2">Let's Build Something Amazing</h3>
            <p className="text-background/80">
              Ready to bring your ideas to life? Let's connect and create something extraordinary together.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-3 rounded-full bg-background/10 hover:bg-background/20 transition-all duration-300 hover:scale-110"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/70">
          <p>
            © {currentYear} Your Name. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-400" /> using React & TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;