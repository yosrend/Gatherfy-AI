import { useState } from 'react';
import { ArrowLeft, Save, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Event } from '../App';
import { toast } from 'sonner@2.0.3';

interface EventEditorProps {
  event: Event;
  onSave: (event: Event) => void;
  onCancel: () => void;
}

export function EventEditor({ event, onSave, onCancel }: EventEditorProps) {
  const [formData, setFormData] = useState(event);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Event updated successfully!');
  };

  const updateField = (field: keyof Event, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={onCancel} variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2>Edit Event</h2>
              <p className="text-sm text-muted-foreground">Update your event details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-3xl">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
              <CardDescription>Make changes to your event details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
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
                <Label htmlFor="location">Location</Label>
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
                      <SelectValue placeholder="Select category" />
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
                    value={formData.capacity || ''}
                    onChange={(e) => updateField('capacity', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Maximum attendees"
                    min="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage || ''}
                  onChange={(e) => updateField('coverImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
