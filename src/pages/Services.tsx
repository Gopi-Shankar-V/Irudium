import { 
  Palette, 
  Code, 
  Globe, 
  Layers, 
  ShoppingCart, 
  Settings, 
  Search,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// Import 3D illustrations
import uiuxImage from "@/assets/service-uiux.png";
import webdevImage from "@/assets/service-webdev.png";
import performanceImage from "@/assets/service-performance.png";
import ecommerceImage from "@/assets/service-ecommerce.png";
import seoImage from "@/assets/service-seo.png";
import cmsImage from "@/assets/service-cms.png";
import staticImage from "@/assets/service-static.png";
import dynamicImage from "@/assets/service-dynamic.png";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Services = () => {
  useScrollReveal();
  const services = [
    {
      icon: Palette,
      title: "UI/UX Designing",
      description: "Creating intuitive and beautiful user interfaces that provide exceptional user experiences.",
      features: ["User Research", "Wireframing", "Prototyping", "Visual Design"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹1,499</span>
          <span className="text-gradient font-semibold">₹1,199</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/686de92d-b47f-434a-884b-77b588d476d3/3oSh1YX0Z7.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Globe,
      title: "Website Designing",
      description: "Custom website designs that reflect your brand identity and engage your audience.",
      features: ["Responsive Design", "Brand Integration", "Modern Layouts", "Cross-browser Compatibility"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹9,999</span>
          <span className="text-gradient font-semibold">₹6,999</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/ee17a60b-55ec-4975-a11f-c4d23b58f278/pwIt0ufatU.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Code,
      title: "Website Development",
      description: "Full-stack web development using the latest technologies and best practices.",
      features: ["Custom Development", "API Integration", "Database Design", "Performance Optimization"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹14,990</span>
          <span className="text-gradient font-semibold">₹11,990</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/7c5a7220-229d-4347-9087-b347f6453bd5/V4UF5nptUY.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Layers,
      title: "Static Website",
      description: "Fast-loading, secure static websites perfect for portfolios and business showcases.",
      features: ["Lightning Fast", "SEO Optimized", "CDN Integration", "Security Focused"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹9,999</span>
          <span className="text-gradient font-semibold">₹6,999</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/ee17a60b-55ec-4975-a11f-c4d23b58f278/pwIt0ufatU.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Settings,
      title: "Dynamic Multi-functional Website",
      description: "Feature-rich dynamic websites with advanced functionality and user interactions.",
      features: ["User Authentication", "Content Management", "Real-time Updates", "Advanced Features"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹14,990</span>
          <span className="text-gradient font-semibold">₹11,990</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/7c5a7220-229d-4347-9087-b347f6453bd5/V4UF5nptUY.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: ShoppingCart,
      title: "E-Commerce Website",
      description: "Complete e-commerce solutions with payment integration and inventory management.",
      features: ["Payment Gateways", "Inventory Management", "Order Processing", "Analytics Dashboard"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="line-through text-muted-foreground mr-2">₹19,990</span>
          <span className="text-gradient font-semibold">₹14,990</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/6c59aa52-b156-4dbe-ab37-e6fcedff2d0b/pwHedKq6Mv.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Settings,
      title: "Web CMS Development",
      description: "Custom content management systems tailored to your specific business needs.",
      features: ["Custom CMS", "User Roles", "Content Workflow", "Multi-site Management"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="text-gradient font-semibold">₹999/month</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/54051d26-0980-476e-b8eb-fb9223595ab0/fWoKleBcWD.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Comprehensive SEO strategies to improve your website's search engine rankings.",
      features: ["Technical SEO", "Content Optimization", "Link Building", "Performance Analytics"],
      price: (
        <span>
          <span className="text-sm text-muted-foreground mr-2">Starting at</span>
          <span className="text-gradient font-semibold">₹999/month</span>
        </span>
      ),
      image: (
        <div className="w-48 h-48 mx-auto">
          <DotLottieReact
            src="https://lottie.host/6b78eeca-c9f5-4610-808f-c96fe9020ac0/AnO33CMOZi.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      ),
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "₹2,500",
      description: "Perfect for small businesses and startups",
      features: [
        "Static Website Design",
        "Up to 5 Pages",
        "Responsive Design",
        "Basic SEO Setup",
        "1 Month Support"
      ],
      recommended: false
    },
    {
      name: "Professional",
      price: "₹5,500",
      description: "Ideal for growing businesses",
      features: [
        "Dynamic Website Development",
        "Up to 15 Pages",
        "Content Management System",
        "Advanced SEO",
        "E-commerce Integration",
        "3 Months Support"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "₹12,000",
      description: "For large organizations and complex projects",
      features: [
        "Custom Web Application",
        "Unlimited Pages",
        "Advanced CMS",
        "API Development",
        "Multi-user System",
        "12 Months Support",
        "Dedicated Project Manager"
      ],
      recommended: false
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive web development and design solutions to bring your digital vision to life
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-service group hover:scale-105 transition-all duration-300 animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <div className="relative mb-6">
                    {/* <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-20 h-20 mx-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300 "
                    /> */}
                    {service.image} 
                  </div>
                  <h3 className="text-xl font-orbitron font-semibold mb-3 text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check size={16} className="text-primary mr-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-semibold text-gradient mb-4">
                    {service.price}
                  </div>
                  <Link to="/contact">
                    <Button className="btn-secondary w-full">
                      Get Quote
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Package Comparison */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Service <span className="text-gradient">Packages</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect package for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  pkg.recommended 
                    ? 'card-glass border-primary/50 glow-green scale-105' 
                    : 'card-glass'
                } hover-lift`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <h3 className="text-2xl font-orbitron font-bold text-foreground mb-2">
                    {pkg.name}
                  </h3>
                  <div className="text-4xl font-bold text-gradient mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-muted-foreground">
                    {pkg.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check size={20} className="text-primary mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact">
                    <Button 
                      className={pkg.recommended ? "btn-primary w-full" : "btn-secondary w-full"}
                    >
                      Get Started
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-4">
              Our <span className="text-gradient">Process</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A streamlined approach to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "Understanding your goals, requirements, and target audience"
              },
              {
                step: "02",
                title: "Planning",
                description: "Creating detailed project roadmap and technical specifications"
              },
              {
                step: "03",
                title: "Development",
                description: "Building your solution with cutting-edge technologies"
              },
              {
                step: "04",
                title: "Launch",
                description: "Testing, optimization, and successful project deployment"
              }
            ].map((process, index) => (
              <Card key={index} className="card-glass hover-lift text-center process__step">
                <CardContent className="p-8">
                  <div className="text-4xl font-orbitron font-bold text-gradient mb-4">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {process.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {process.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold mb-6">
            Ready to Start Your <span className="text-gradient">Project</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Let's discuss your requirements and create something amazing together.
          </p>
          <Link to="/contact">
            <Button className="btn-primary text-lg px-10 py-4">
              Get Free Consultation
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;