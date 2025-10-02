import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, Rocket, Zap, Shield, CheckCircle, TrendingUp, Clock, Award, Target, Lightbulb, Globe, Smartphone, Code, Palette, Search, ShoppingCart, Database, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Animated Stats Component
const AnimatedStats = () => {
  const stats = [
    { target: 50, suffix: "+", label: "Startups Launched" },
    { target: 98, suffix: "%", label: "Client Satisfaction" },
    { target: 24, suffix: "/7", label: "Support Available" },
    { target: 300, suffix: "%", label: "Performance Boost" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pt-8">
      {stats.map((stat, index) => {
        const { ref, displayValue } = useCountAnimation({
          target: stat.target,
          suffix: stat.suffix,
          duration: 2000
        });
        
        return (
          <div 
            key={index} 
            ref={ref as any}
            className="text-center stats__item group"
          >
            <div className="relative p-4 sm:p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient mb-2 sm:mb-3 font-orbitron">
                  {displayValue}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-muted-foreground font-k2d font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  useScrollReveal();
  const services = [
    {
      title: "UI/UX Design",
      description: "Beautiful, user-centered designs that convert visitors into customers",
      icon: Palette,
      features: ["User Research", "Wireframing", "Prototyping", "Visual Design"]
    },
    {
      title: "Web Development", 
      description: "Fast, responsive websites built with modern technologies",
      icon: Code,
      features: ["React/Next.js", "TypeScript", "Responsive Design", "API Integration"]
    },
    {
      title: "Performance Optimization",
      description: "Lightning-fast websites that rank higher and convert better",
      icon: Zap,
      features: ["Speed Optimization", "SEO", "Core Web Vitals", "Analytics"]
    },
    {
      title: "E-commerce Solutions",
      description: "Complete online stores that drive sales and growth",
      icon: ShoppingCart,
      features: ["Payment Integration", "Inventory Management", "Order Processing", "Analytics"]
    },
    {
      title: "SEO & Marketing",
      description: "Get found by your ideal customers with strategic SEO",
      icon: Search,
      features: ["Keyword Research", "Content Strategy", "Technical SEO", "Local SEO"]
    },
    {
      title: "Mobile Apps",
      description: "Native and web apps that engage users on any device",
      icon: Smartphone,
      features: ["React Native", "Progressive Web Apps", "App Store Optimization", "Push Notifications"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechFlow Inc.",
      content: "Irudium transformed our startup vision into a stunning reality. Their attention to detail and innovative approach exceeded our expectations completely."
    },
    {
      name: "Michael Chen", 
      role: "Founder",
      company: "Digital Ventures",
      content: "As a new startup, we needed a partner who understood our budget and timeline. Irudium delivered exceptional results that helped us launch successfully."
    },
    {
      name: "Emily Rodriguez",
      role: "Co-Founder", 
      company: "StartupXYZ",
      content: "Outstanding results! Our website performance improved by 300% and our conversion rate doubled. Best investment for our startup."
    }
  ];

  const stats = [
    { value: "50+", label: "Startups Launched" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Support Available" },
    { value: "300%", label: "Average Performance Boost" }
  ];

  const startupFeatures = [
    {
      icon: Rocket,
      title: "Startup-Friendly Pricing",
      description: "Affordable packages designed for growing businesses"
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Get your MVP launched in weeks, not months"
    },
    {
      icon: Shield,
      title: "Scalable Solutions",
      description: "Built to grow with your business from day one"
    },
    {
      icon: CheckCircle,
      title: "Proven Process",
      description: "Battle-tested methods that deliver results"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Strategy",
      description: "We analyze your business goals, target audience, and competition to create a winning strategy.",
      icon: Target
    },
    {
      step: "02", 
      title: "Design & Prototype",
      description: "Our designers create stunning visuals and interactive prototypes for your approval.",
      icon: Palette
    },
    {
      step: "03",
      title: "Development & Testing",
      description: "Our developers bring designs to life with clean, scalable code and rigorous testing.",
      icon: Code
    },
    {
      step: "04",
      title: "Launch & Optimization",
      description: "We deploy your project and continuously optimize for better performance and results.",
      icon: Rocket
    }
  ];

  const technologies = [
    { name: "React", category: "Frontend" },
    { name: "Next.js", category: "Framework" },
    { name: "TypeScript", category: "Language" },
    { name: "Tailwind CSS", category: "Styling" },
    { name: "Node.js", category: "Backend" },
    { name: "MongoDB", category: "Database" },
    { name: "AWS", category: "Cloud" },
    { name: "Vercel", category: "Hosting" }
  ];

  const industries = [
    { name: "E-commerce", icon: ShoppingCart, projects: "25+" },
    { name: "SaaS", icon: Globe, projects: "18+" },
    { name: "Healthcare", icon: Shield, projects: "12+" },
    { name: "Education", icon: Award, projects: "15+" },
    { name: "Finance", icon: TrendingUp, projects: "10+" },
    { name: "Real Estate", icon: Target, projects: "8+" }
  ];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
          <div className="container mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 home__data text-center lg:text-left">
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 font-k2d text-xs sm:text-sm mx-auto lg:mx-0 w-fit">
                🚀 New Startup? We've Got You Covered!
              </Badge>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight font-k2d">
                Build Your <span className="text-gradient">Dream Website</span> in Record Time
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl font-k2d mx-auto lg:mx-0">
                From startup MVPs to enterprise solutions, we create stunning websites that convert visitors into customers. Launch faster, grow bigger.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start">
                <Button size="lg" className="btn-primary group font-k2d w-full sm:w-auto">
                  Start Your Project
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="btn-secondary font-k2d w-full sm:w-auto">
                  View Our Work
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-accent border-2 border-background" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground font-k2d">50+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                  ))}
                  <span className="text-xs sm:text-sm text-muted-foreground ml-2 font-k2d">5.0 Rating</span>
                </div>
              </div>
            </div>
            
            <div className="relative home__img mt-8 lg:mt-0">
              <div className="relative hero-illustration">
                <DotLottieReact
                  src="https://lottie.host/226c30e0-3407-4854-b401-ed1fbeadeaaf/XbF4Xy6Y2D.lottie"
                  loop
                  autoplay
                  className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-3xl mx-auto hover-lift illustration-glow"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <AnimatedStats />
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                Our <span className="text-gradient">Core Services</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                We specialize in creating digital experiences that drive results for startups and growing businesses.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card key={index} className="card-service group services__card">
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-10 h-10 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors font-orbitron">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 font-k2d">
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm font-k2d">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Startup Features */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                Why <span className="text-gradient">Startups Choose Us</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                We understand the unique challenges startups face. Our solutions are designed to help you move fast and scale smart.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {startupFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="text-center group feature__item">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors font-orbitron">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-k2d">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Process */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                Our <span className="text-gradient">Proven Process</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                From concept to launch, we follow a structured approach that ensures your project succeeds.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative process__step">
                    <div className="text-center group">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg font-orbitron">
                          {step.step}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-accent" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 font-orbitron">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground font-k2d">
                        {step.description}
                      </p>
                    </div>
                    {index < process.length - 1 && (
                      <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="text-gradient">Technologies</span> We Master
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                We work with cutting-edge technologies to build fast, scalable, and maintainable solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="text-center group tech__item">
                  <div className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
                    <h3 className="font-semibold text-lg mb-2 font-orbitron">{tech.name}</h3>
                    <p className="text-sm text-muted-foreground font-k2d">{tech.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                <span className="text-gradient">Industries</span> We Serve
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                From e-commerce to healthcare, we've helped businesses across various industries achieve their digital goals.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => {
                const IconComponent = industry.icon;
                return (
                  <Card key={index} className="card-service group industry__card">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 font-orbitron">{industry.name}</h3>
                      <p className="text-primary font-semibold font-k2d">{industry.projects} Projects</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
                What Our <span className="text-gradient">Clients Say</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-k2d">
                Don't just take our word for it. Here's what our satisfied clients have to say about working with us.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="card-glass testimonial__card">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic font-k2d">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent mr-4" />
                      <div>
                        <div className="font-semibold font-orbitron">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground font-k2d">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-orbitron">
              Ready to <span className="text-gradient">Launch Your Startup?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-k2d">
              Join hundreds of successful startups who chose us to bring their vision to life. 
              Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary group font-k2d">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary font-k2d">
                Schedule a Call
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-k2d">Free Consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-k2d">No Hidden Costs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span className="font-k2d">Fast Turnaround</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;