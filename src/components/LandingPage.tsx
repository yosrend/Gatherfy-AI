import { useState } from 'react';
import { Sparkles, Calendar, Users, Zap, MessageSquare, Mail, Share2, BarChart3, ChevronDown, Send, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { PlaceholdersAndVanishInput } from './ui/placeholders-and-vanish-input';
import { toast } from 'sonner@2.0.3';
import { Event } from '../App';

interface LandingPageProps {
  onGetStarted: () => void;
  onEventGenerated: (event: Event) => void;
  onLogin: (email: string, role: 'admin' | 'user') => void;
}

export function LandingPage({ onGetStarted, onEventGenerated, onLogin }: LandingPageProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    "Birthday party for my daughter's 7th birthday next month",
    "Corporate team building workshop next Friday",
    "Virtual product launch event for our new app",
    "Networking meetup for startup founders this weekend"
  ];

  const generateEvent = async (userPrompt: string) => {
    if (!userPrompt.trim()) {
      toast.error('Please describe your event idea');
      return;
    }

    setIsGenerating(true);
    setChatMessages([...chatMessages, { role: 'user', text: userPrompt }]);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponse = `Great! I'm creating your event for "${extractTitle(userPrompt)}". Just a moment...`;
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 500);

    // Generate event
    setTimeout(() => {
      const event: Event = {
        id: `evt_${Date.now()}`,
        title: extractTitle(userPrompt),
        description: generateDescription(userPrompt),
        date: generateDate(userPrompt),
        time: generateTime(),
        location: extractLocation(userPrompt),
        category: extractCategory(userPrompt),
        coverImage: getCoverImage(extractCategory(userPrompt)),
        capacity: 50,
        invitedGuests: [],
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      setIsGenerating(false);
      const successMessage = `✨ Your "${event.title}" event has been created! Redirecting you to complete the setup...`;
      setChatMessages(prev => [...prev, { role: 'ai', text: successMessage }]);
      
      setTimeout(() => {
        onEventGenerated(event);
      }, 1500);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateEvent(prompt);
    setPrompt('');
  };

  const handleGoogleSSO = () => {
    setIsLoading(true);
    // Simulate Google SSO
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Logged in with Google!');
      onLogin('google-user@example.com', 'user');
    }, 1500);
  };

  const handleMicrosoftSSO = () => {
    setIsLoading(true);
    // Simulate Microsoft SSO
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Logged in with Microsoft!');
      onLogin('microsoft-user@example.com', 'user');
    }, 1500);
  };

  const extractTitle = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('birthday')) return 'Birthday Celebration';
    if (keywords.includes('wedding')) return 'Wedding Celebration';
    if (keywords.includes('conference')) return 'Professional Conference';
    if (keywords.includes('workshop')) return 'Interactive Workshop';
    if (keywords.includes('meetup')) return 'Community Meetup';
    if (keywords.includes('party')) return 'Party Event';
    if (keywords.includes('launch')) return 'Product Launch Event';
    return 'Special Event';
  };

  const generateDescription = (text: string): string => {
    return `Join us for an amazing event! ${text}\n\nWe're excited to bring together wonderful people for this special occasion. Don't miss out on this opportunity to connect, celebrate, and create lasting memories.`;
  };

  const generateDate = (text: string): string => {
    const keywords = text.toLowerCase();
    const date = new Date();
    
    if (keywords.includes('tomorrow')) {
      date.setDate(date.getDate() + 1);
    } else if (keywords.includes('next week') || keywords.includes('next friday') || keywords.includes('next weekend')) {
      date.setDate(date.getDate() + 7);
    } else if (keywords.includes('next month')) {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setDate(date.getDate() + 14); // Default: 2 weeks
    }
    
    return date.toISOString().split('T')[0];
  };

  const generateTime = (): string => {
    return '18:00';
  };

  const extractLocation = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('online') || keywords.includes('virtual')) return 'Virtual Event (Online)';
    if (keywords.includes('park')) return 'Central Park';
    if (keywords.includes('office')) return 'Office Conference Room';
    if (keywords.includes('restaurant')) return 'Downtown Restaurant';
    return 'Location not set';
  };

  const extractCategory = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('business') || keywords.includes('conference') || keywords.includes('workshop')) return 'business';
    if (keywords.includes('birthday') || keywords.includes('wedding') || keywords.includes('anniversary')) return 'celebration';
    if (keywords.includes('meetup') || keywords.includes('networking')) return 'networking';
    if (keywords.includes('concert') || keywords.includes('music')) return 'entertainment';
    return 'social';
  };

  const getCoverImage = (category: string): string => {
    const images: { [key: string]: string } = {
      business: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      celebration: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      networking: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
      entertainment: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
      social: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800'
    };
    return images[category] || images.social;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-semibold">AI Event Creator</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <div className="flex gap-2">
                <Button onClick={handleGoogleSSO} disabled={isLoading} variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button onClick={handleMicrosoftSSO} disabled={isLoading} variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Microsoft
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button onClick={handleGoogleSSO} disabled={isLoading} size="sm">Sign In</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Event Management</span>
              </div>
              <h1 className="mb-6 text-4xl md:text-6xl">
                Create Events in Seconds with AI
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Just describe your event idea, and watch AI create everything for you
              </p>
              
              {/* SSO Login Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                <Button onClick={handleGoogleSSO} disabled={isLoading} variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button onClick={handleMicrosoftSSO} disabled={isLoading} variant="outline" size="lg" className="w-full sm:w-auto min-w-[200px]">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                    <path fill="#f35325" d="M1 1h10v10H1z"/>
                    <path fill="#81bc06" d="M12 1h10v10H12z"/>
                    <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                    <path fill="#ffba08" d="M12 12h10v10H12z"/>
                  </svg>
                  Continue with Microsoft
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Sign in to start creating events instantly
              </p>
            </div>

            {/* Features Pills */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span>Guest Management</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <span>Real-time Analytics</span>
              </div>

              <div className="w-full mt-8">
                <PlaceholdersAndVanishInput
                  placeholders={quickPrompts}
                  onChange={(e) => setPrompt(e.target.value)}
                  onSubmit={(e) => {
                    e.preventDefault();
                    generateEvent(prompt);
                  }}
                  disabled={isGenerating}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">About AI Event Creator</h2>
            <p className="text-lg text-muted-foreground">
              We believe event planning should be effortless. Our AI-powered platform transforms 
              your ideas into fully-formed events with just a few words, handling everything from 
              invitations to analytics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
                <CardDescription>
                  Describe your event in plain English and watch AI generate all the details instantly
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Guest Management</CardTitle>
                <CardDescription>
                  Easily manage guest lists, send invitations, and track RSVPs all in one place
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Get real-time insights on attendance, confirmation rates, and guest engagement
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to create, manage, and analyze your events
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <CardTitle>AI Event Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Transform ideas into complete events with intelligent suggestions for dates, venues, and details
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Automatically suggest optimal dates and times based on your preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Guest List Import</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bulk import guests from Excel or Google Sheets with a single click
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-8 h-8 text-primary mb-4" />
                <CardTitle>WhatsApp Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Send invitations directly via WhatsApp with personalized messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="w-8 h-8 text-primary mb-4" />
                <CardTitle>RSVP Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor guest responses in real-time with detailed analytics
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Share2 className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Share event links instantly and let guests RSVP with one click
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about AI Event Creator
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does AI event creation work?</AccordionTrigger>
                <AccordionContent>
                  Simply describe your event in plain English (e.g., "Birthday party for my daughter next month with 30 guests"). 
                  Our AI analyzes your description and automatically generates event details including title, description, 
                  suggested date/time, and appropriate category.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Can I import my guest list from a spreadsheet?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can upload CSV files exported from Excel or Google Sheets. Simply prepare a file with columns 
                  for Name, Email, and Phone (optional), and import it with one click. We also provide a template to help you get started.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do guests RSVP to my event?</AccordionTrigger>
                <AccordionContent>
                  Each guest receives a unique invitation link that you can share via WhatsApp, email, or any messaging platform. 
                  When they click the link, they'll see the event details and can confirm or decline their attendance with one click. 
                  All responses are tracked in real-time in your dashboard.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I create events manually without AI?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! While AI creation is fast and convenient, you can also create events manually with full control. 
                  Choose from pre-built templates (Birthday, Business Meeting, Networking, etc.) or start from scratch and 
                  customize every detail.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Is there an admin dashboard?</AccordionTrigger>
                <AccordionContent>
                  Yes! Admin users get access to a comprehensive dashboard with system-wide analytics, event management, 
                  and detailed RSVP statistics. You can view all events, track confirmation rates, and manage everything from one place.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Can I edit events after creating them?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can edit any event detail at any time. Change the title, description, date, time, location, or any other 
                  field. You can also publish or unpublish events with one click.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="mb-4">Ready to Create Your First Event?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of event organizers who use AI to create amazing events in seconds
              </p>
              <Button onClick={onGetStarted} size="lg" className="text-lg px-8">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started for Free
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-semibold">AI Event Creator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create and manage events with the power of artificial intelligence
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 AI Event Creator. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
