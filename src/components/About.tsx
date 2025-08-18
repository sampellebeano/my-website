import { Card } from "@/components/ui/card";
import profilePhoto from "@/assets/profile-photo.jpg";

const About = () => {
  const skills = [
    { name: "React & TypeScript", level: 95 },
    { name: "Node.js & Express", level: 90 },
    { name: "UI/UX Design", level: 85 },
    { name: "Cloud Services (AWS)", level: 80 },
    { name: "Database Design", level: 88 },
    { name: "Mobile Development", level: 75 },
  ];

  return (
    <section id="about" className="section-padding bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating meaningful digital experiences through innovative technology
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl hover-lift">
              <img 
                src={profilePhoto} 
                alt="Profile"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full blur-2xl opacity-60" />
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Crafting Digital Excellence
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                With over 5 years of experience in full-stack development, I specialize in building 
                scalable web applications and intuitive user interfaces. My journey began with a 
                curiosity for problem-solving and has evolved into a passion for creating solutions 
                that impact real users.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I believe in the power of clean code, beautiful design, and seamless user experiences. 
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
                projects, or sharing knowledge with the developer community.
              </p>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Technical Skills</h4>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {[
            { number: "50+", label: "Projects Completed" },
            { number: "5+", label: "Years Experience" },
            { number: "20+", label: "Happy Clients" },
            { number: "10k+", label: "Lines of Code" },
          ].map((stat, index) => (
            <Card key={index} className="p-6 text-center hover-lift bg-card/50 backdrop-blur-sm">
              <div className="text-3xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">
                {stat.label}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;