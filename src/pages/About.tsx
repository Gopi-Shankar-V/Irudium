import { Target, Eye, Users, Award, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const About = () => {
  useScrollReveal();
  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "Started with a vision to make digital transformation possible for everyone"
    },
    {
      year: "2021",
      title: "First Major Project",
      description: "Successfully delivered our first enterprise-level web application"
    },
    {
      year: "2022",
      title: "Team Expansion",
      description: "Grew to a team of 15+ talented developers and designers"
    },
    {
      year: "2023",
      title: "Global Reach",
      description: "Expanded services internationally with clients across 3 continents"
    },
    {
      year: "2024",
      title: "Innovation Leader",
      description: "Recognized as a leading innovator in web development solutions"
    }
  ];

  const stats = [
    { icon: Users, value: "50+", label: "Happy Clients" },
    { icon: Award, value: "100+", label: "Projects Completed" },
    { icon: TrendingUp, value: "99%", label: "Success Rate" },
    { icon: Calendar, value: "4+", label: "Years Experience" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 about__content">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-4 sm:mb-6">
              About <span className="text-gradient">Irudium</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              At IRUDIUM, we believe every business deserves a strong digital presence. 
              Our mission is to craft websites and solutions that not only look great but also deliver measurable results.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <Card className="card-glass hover-lift about__content">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 glow-green">
                  <Target size={32} className="text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-gradient">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To help businesses grow by building websites, e-commerce platforms, and digital solutions that are fast, 
                  user-friendly, and results-driven. We blend technology, design, and strategy to deliver experiences that engage users and drive measurable success.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass hover-lift about__img">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 glow-green">
                  <Eye size={32} className="text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold mb-4 text-gradient">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To become a trusted partner for businesses worldwide, known for creating modern websites, seamless e-commerce, 
                  and powerful digital strategies. We aim to shape a future where every brand can thrive online with scalable, beautiful, and impactful solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a recognized leader in web development
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-primary opacity-30 hidden lg:block" />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex-col lg:space-x-8`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full glow-green hidden lg:block z-10" />
                  
                  {/* Content Card */}
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}>
                    <Card className="card-glass hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <span className="text-2xl font-orbitron font-bold text-gradient">
                            {milestone.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {milestone.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our <span className="text-gradient">Impact</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Numbers that speak to our commitment and success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="card-glass hover-lift text-center stats__item">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 glow-green">
                    <stat.icon size={24} className="text-primary-foreground sm:hidden" />
                    <stat.icon size={28} className="text-primary-foreground hidden sm:block lg:hidden" />
                    <stat.icon size={32} className="text-primary-foreground hidden lg:block" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-orbitron font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We constantly push the boundaries of what's possible with cutting-edge technology."
              },
              {
                title: "Quality",
                description: "Every project receives our utmost attention to detail and commitment to excellence."
              },
              {
                title: "Collaboration",
                description: "We work closely with our clients to ensure their vision becomes reality."
              },
              {
                title: "Transparency",
                description: "Open communication and honest feedback throughout every project phase."
              },
              {
                title: "Efficiency",
                description: "Delivering results on time and within budget without compromising quality."
              },
              {
                title: "Growth",
                description: "Continuously learning and evolving to provide the best solutions possible."
              }
            ].map((value, index) => (
              <Card key={index} className="card-service group">
                <CardContent className="p-6">
                  <h3 className="text-xl font-orbitron font-semibold mb-3 text-gradient">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;