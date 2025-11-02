import { useState } from 'react';
import { Sparkles, Wand2, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { Event } from '../App';

interface EventGeneratorProps {
  onEventCreated: (event: Event) => void;
  onViewDashboard: () => void;
}

export function EventGenerator({ onEventCreated, onViewDashboard }: EventGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateEvent = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe your event idea');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with a slight delay
    setTimeout(() => {
      const event: Event = {
        id: `evt_${Date.now()}`,
        title: extractTitle(prompt),
        description: generateDescription(prompt),
        date: generateDate(),
        time: generateTime(),
        location: extractLocation(prompt),
        category: extractCategory(prompt),
        coverImage: getCoverImage(extractCategory(prompt)),
        capacity: 50,
        invitedGuests: [],
        createdAt: new Date().toISOString(),
        status: 'draft'
      };

      setIsGenerating(false);
      toast.success('Event generated successfully!');
      onEventCreated(event);
    }, 2000);
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

  const generateDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // 2 weeks from now
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
    return 'To Be Announced';
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

  const quickPrompts = [
    "Birthday party for my best friend next weekend with 30 people",
    "Corporate team building workshop in the office",
    "Virtual product launch event for our new app",
    "Weekend networking meetup for startup founders"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-foreground">AI Event Creator</h2>
              </div>
            </div>
            <Button onClick={onViewDashboard} variant="outline">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="mb-3">Create Your Event in Seconds</h1>
            <p className="text-muted-foreground text-lg">
              Describe your event idea and let AI handle the rest
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What event would you like to create?</CardTitle>
              <CardDescription>
                Provide a brief description and we'll generate all the details for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: I want to organize a birthday party for my daughter's 7th birthday next month with around 25 kids and parents at the park..."
                  className="min-h-[120px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              <Separator />

              <div>
                <p className="text-sm mb-3 text-muted-foreground">Quick examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickPrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="text-left p-3 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                      disabled={isGenerating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateEvent}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Event...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Event with AI
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
