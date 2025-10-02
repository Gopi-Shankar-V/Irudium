import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/assets/Logo.png";

const ForgotPassword = () => {
  useScrollReveal();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <Card className="card-glass backdrop-blur-md border-primary/20 animate-scale-in">
            <CardHeader className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center glow-green">
                <img src={Logo} alt="Logo" className="w-20 h-20" />
              </div>
              <CardTitle className="text-2xl font-orbitron text-gradient">
                {emailSent ? "Check Your Email" : "Reset Password"}
              </CardTitle>
              <p className="text-muted-foreground font-k2d">
                {emailSent 
                  ? "We've sent password reset instructions to your email"
                  : "Enter your email to receive reset instructions"
                }
              </p>
            </CardHeader>
            
            <CardContent>
              {emailSent ? (
                <div className="space-y-6 text-center">
                  <p className="text-muted-foreground font-k2d">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {setEmailSent(false); setEmail("");}} 
                      variant="outline" 
                      className="w-full"
                    >
                      Try Different Email
                    </Button>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-k2d">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-card/50 border-primary/20 focus:border-primary hover:border-primary/40 transition-all duration-300 font-k2d"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full btn-primary group" disabled={isLoading}>
                    <span className="font-k2d">{isLoading ? "Sending..." : "Send Reset Email"}</span>
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                  </Button>
                  
                  <div className="text-center">
                    <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors font-k2d text-sm inline-flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;