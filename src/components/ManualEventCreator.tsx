import { useState } from 'react';
import { ArrowLeft, Save, Calendar as CalendarIcon, PartyPopper, Briefcase, Users, Music, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Event } from '../App';
import { toast } from 'sonner@2.0.3';

interface ManualEventCreatorProps {
  onEventCreated: (event: Event) => void;
  onBack: () => void;
}

const eventTemplates = [
  {
    id: 'birthday',
    name: 'Birthday Party',
    icon: PartyPopper,
    category: 'celebration',
    description: 'Celebrate a special birthday',
    defaultCapacity: 30
  },
  {
    id: 'business',
    name: 'Business Meeting',
    icon: Briefcase,
    category: 'business',
    description: 'Professional business event',
    defaultCapacity: 20
  },
  {
    id: 'networking',
    name: 'Networking Event',
    icon: Users,
    category: 'networking',
    description: 'Connect with like-minded people',
    defaultCapacity: 50
  },
  {
    id: 'entertainment',
    name: 'Concert/Show',
    icon: Music,
    category: 'entertainment',
    description: 'Musical or entertainment event',
    defaultCapacity: 100
  },
  {
    id: 'social',
    name: 'Social Gathering',
    icon: Coffee,
    category: 'social',
    description: 'Casual social meetup',
    defaultCapacity: 25
  }
];

export function ManualEventCreator({ onEventCreated, onBack }: ManualEventCreatorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'social',
    capacity: '',
    coverImage: ''
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = eventTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        category: template.category,
        capacity: template.defaultCapacity.toString()
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event: Event = {
      id: `evt_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      coverImage: formData.coverImage || getCoverImage(formData.category),
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      invitedGuests: [],
      createdAt: new Date().toISOString(),
      status: 'draft'
    };

    toast.success('Event created successfully!');
    onEventCreated(event);
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2>Create Event Manually</h2>
              <p className="text-sm text-muted-foreground">Fill in the details for your event</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Event Template</CardTitle>
              <CardDescription>Select a template to pre-fill common settings</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <label
                        key={template.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                          selectedTemplate === template.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={template.id} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium">{template.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{template.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Provide the basic details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe your event"
                  className="min-h-[120px]"
                  required
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => updateField('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Event location or venue"
                  required
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="celebration">Celebration</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Optional)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => updateField('capacity', e.target.value)}
                    placeholder="Maximum attendees"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use a default image based on category
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" size="lg">
              <Save className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Button type="button" variant="outline" onClick={onBack} size="lg">
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
