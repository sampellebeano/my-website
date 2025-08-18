import { Button } from "@/components/ui/button";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in slide-in-from-bottom-8 duration-1000">
          Hello, I'm{" "}
          <span className="gradient-text bg-gradient-secondary bg-clip-text text-transparent">
            Your Name
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 font-light animate-in slide-in-from-bottom-8 duration-1000 delay-200">
          Full Stack Developer & Digital Creator
        </p>
        
        <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-300">
          I craft beautiful, functional digital experiences that bridge creativity and technology. 
          Passionate about building solutions that make a difference.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => scrollToSection("about")}
            className="text-lg px-8 py-6"
          >
            Discover My Work
          </Button>
          <Button 
            variant="glass" 
            size="lg"
            onClick={() => scrollToSection("contact")}
            className="text-lg px-8 py-6"
          >
            Get In Touch
          </Button>
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-700">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Github className="w-6 h-6" />
          </a>
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a 
            href="mailto:your.email@example.com"
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
        
        {/* Scroll Indicator */}
        <button
          onClick={() => scrollToSection("about")}
          className="animate-bounce p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};

export default Hero;