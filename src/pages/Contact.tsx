import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, WhatsApp } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  useScrollReveal();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (!error) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours."
        });

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error(error.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact us directly.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "info@irudium.in",
      description: "Send us an email anytime"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp Us",
      content: ["+91 790 437 8166", "+91 638 299 1170"],
      description: "Send us a message anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: ["+91 790 437 8166", "+91 638 299 1170"],
      description: "Mon - Fri from 6pm to 12am"
    },
    {
      icon: Clock,
      title: "Working Hours",
      content: ["Mon - Fri: 5PM - 12AM", "Sat - Sun: 9AM - 12AM"],
      description: "Weekend support available"
    }
  ];

  const services = [
    "Website Design & Development",
    "E-commerce Solutions",
    "UI/UX Design",
    "SEO Optimization",
    "Custom Web Applications",
    "Maintenance & Support"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-6">
              Contact <span className="text-gradient">Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to start your project? Let's discuss how we can bring your vision to life
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="card-glass hover-lift text-center contact__container">

              <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 glow-green">
                    <info.icon size={32} className="text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-orbitron font-semibold mb-2 text-foreground">
                    {info.title}
                  </h3>

                  {/* Render contact content as links (mailto / tel / whatsapp) */}
                  <div className="text-foreground font-medium mb-2">
                    {typeof info.content === "string" ? (
                      // Email or plain string
                      info.title.toLowerCase().includes("email") ? (
                        <a
                          href={`mailto:${info.content}`}
                          className="no-underline hover:text-primary"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <span>{info.content}</span>
                      )
                    ) : Array.isArray(info.content) ? (
                      // For "Working Hours" render plain text (no links)
                      info.title.toLowerCase().includes("work") || info.title.toLowerCase().includes("hours") ? (
                        info.content.map((item, i) => (
                          <div key={i}>{item}</div>
                        ))
                      ) : (
                        info.content.map((item, i) => {
                          const normalized = item.replace(/\s+/g, "").replace(/\+/g, "");
                          if (info.title.toLowerCase().includes("whatsapp")) {
                            // WhatsApp link (opens chat)
                            return (
                              <div key={i}>
                                <a
                                  href={`https://wa.me/${normalized}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="no-underline hover:text-primary"
                                >
                                  {item}
                                </a>
                              </div>
                            );
                          }
                          // Default to tel: for phone numbers
                          return (
                            <div key={i}>
                              <a
                                href={`tel:${item.replace(/\s+/g, "")}`}
                                className="no-underline hover:text-primary"
                              >
                                {item}
                              </a>
                            </div>
                          );
                        })
                      )
                    ) : null}
                  </div>

                  <p className="text-muted-foreground text-sm">
                    {info.description}
                  </p>
                </CardContent>

              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="card-glass flex flex-col">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center glow-green">
                    <MessageSquare size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-orbitron font-bold text-foreground">Send Message</h2>
                    <p className="text-muted-foreground">We'd love to hear from you</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-full">
                <form onSubmit={handleSubmit} className="flex flex-col space-y-6 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="bg-card border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        className="bg-card border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 987 654 3210"
                        className="bg-card border-border/50 focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Project inquiry"
                        className="bg-card border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project..."
                      rows={8}
                      className="bg-card border-border/50 focus:border-primary resize-none"
                      required
                    />
                  </div>

                  <Button type="submit" className="btn-primary w-full">
                    Send Message
                    <Send className="ml-2" size={18} />
                  </Button>
                </form>
                {/* Larger centered Lottie placed at the bottom using mt-auto to utilize extra space */}
                <div className="mt-auto flex justify-center items-end pb-2">
                    <div className="w-56 h-56 md:w-64 md:h-64 rounded-lg overflow-hidden">
                        <DotLottieReact
                        src="https://lottie.host/bff8f7af-151e-4ee6-8136-8119568e24f8/mth1HvckcR.lottie"
                        loop
                        autoplay
                        className="w-full h-full glow-green"
                        style={{ width: '100%', height: '100%' }}
                        aria-hidden
                        />
                    </div>
                </div>
              </CardContent>
            </Card>

            {/* Services & Map */}
            <div className="space-y-8">
              {/* Services List */}
              <Card className="card-glass">
                <CardHeader>
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">
                    How Can We Help?
                  </h3>
                  <p className="text-muted-foreground">
                    Here are some of the services we offer
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {services.map((service, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span className="text-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card className="card-glass">
                <CardHeader>
                  <h3 className="text-xl font-orbitron font-semibold text-foreground">
                    Our Location
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-glow h-64 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={48} className="text-primary/60 mx-auto mb-4" />
                      <p className="text-foreground font-medium">Tamil Nadu, India</p>
                      <p className="text-muted-foreground text-sm">
                        We are remote first but available worldwide
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2 text-sm">
                    <p className="text-foreground font-medium">Working Hours:</p>
                    <p className="text-muted-foreground">Monday - Friday: 5:00 PM - 12:00 AM</p>
                    <p className="text-muted-foreground">Saturday & Sunday: 9:00 AM - 12:00 AM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-up">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground animate-slide-in-up delay-200">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on complexity, but most websites take 4-8 weeks from start to finish."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer maintenance packages and ongoing support to keep your website running smoothly."
              },
              {
                question: "What's included in your pricing?",
                answer: "Our pricing includes design, development, testing, and launch. Hosting and domain are separate."
              },
              {
                question: "Can you work with our existing brand?",
                answer: "Absolutely! We can work with your existing brand guidelines or help develop new ones."
              }
            ].map((faq, index) => (
              <Card key={index} className={`card-glass hover-lift animate-slide-in-up delay-${300 + (index * 100)}`}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Animation Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in-up font-k2d">
              Let's Create Something <span className="text-gradient">Amazing</span>
            </h2>
            <p className="text-xl text-muted-foreground animate-slide-in-up delay-200 font-k2d">
              Ready to transform your digital presence?
            </p>
          </div>
            <div className="flex justify-center animate-float glow_green">
            <DotLottieReact
              src="https://lottie.host/226c30e0-3407-4854-b401-ed1fbeadeaaf/XbF4Xy6Y2D.lottie"
              loop
              autoplay
              className="w-full h-full max-w-lg mx-auto"
              style={{ width: '400px', height: '400px' }}
            />
            </div>

            <style>{`
            .glow_green {
              filter: drop-shadow(0 0 0.75rem #72C08C);
              transition: var(--transition-smooth);
              }
              
              .glow_green:hover {
                filter: drop-shadow(var(--shadow-glow));
              transform: translateY(-2px);
            }
            `}</style>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;