import { useState } from 'react';
import { Eye, UserCog, Calendar, MapPin, Clock, Image as ImageIcon, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Event } from '../App';
import { toast } from 'sonner@2.0.3';

interface EventPreviewProps {
  event: Event;
  onViewAsAdmin: () => void;
  onViewAsGuest: () => void;
  onUpdateEvent: (event: Event) => void;
}

export function EventPreview({ event, onViewAsAdmin, onViewAsGuest, onUpdateEvent }: EventPreviewProps) {
  const [editDialog, setEditDialog] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleOpenEdit = (field: string, currentValue: string) => {
    setEditDialog(field);
    setEditValue(currentValue);
  };

  const handleSaveEdit = () => {
    if (!editDialog) return;

    const updatedEvent = { ...event };
    
    switch (editDialog) {
      case 'title':
        updatedEvent.title = editValue || 'Untitled Event';
        break;
      case 'description':
        updatedEvent.description = editValue || 'No description provided';
        break;
      case 'date':
        updatedEvent.date = editValue || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'time':
        updatedEvent.time = editValue || '18:00';
        break;
      case 'location':
        updatedEvent.location = editValue || 'Location not set';
        break;
      case 'coverImage':
        updatedEvent.coverImage = editValue;
        break;
    }

    onUpdateEvent(updatedEvent);
    setEditDialog(null);
    toast.success('Updated successfully!');
  };

  const isFieldEmpty = (value: string | undefined) => {
    return !value || value === 'Untitled Event' || value === 'No description provided' || 
           value === 'Location not set' || value === 'Date not set' || value === 'Time not set';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h2>Event Created Successfully! 🎉</h2>
            <p className="text-sm text-muted-foreground">Choose how you want to view your event</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Preview Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Preview</CardTitle>
                <CardDescription>Click on any field to edit it</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover Image */}
                <div 
                  className="relative group cursor-pointer border-2 border-dashed rounded-lg overflow-hidden"
                  onClick={() => handleOpenEdit('coverImage', event.coverImage || '')}
                >
                  {event.coverImage ? (
                    <img src={event.coverImage} alt={event.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Image not set</p>
                        <p className="text-xs text-muted-foreground">Click to add</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Edit2 className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Title */}
                <div
                  className="cursor-pointer group p-4 rounded-lg border hover:border-primary transition-colors"
                  onClick={() => handleOpenEdit('title', event.title)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Event Name</Label>
                      <h3 className={`mt-1 ${isFieldEmpty(event.title) ? 'text-muted-foreground italic' : ''}`}>
                        {event.title || 'Name not set'}
                      </h3>
                    </div>
                    <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Description */}
                <div
                  className="cursor-pointer group p-4 rounded-lg border hover:border-primary transition-colors"
                  onClick={() => handleOpenEdit('description', event.description)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">About</Label>
                      <p className={`text-sm mt-1 ${isFieldEmpty(event.description) ? 'text-muted-foreground italic' : ''}`}>
                        {event.description || 'Description not set'}
                      </p>
                    </div>
                    <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="cursor-pointer group p-4 rounded-lg border hover:border-primary transition-colors"
                    onClick={() => handleOpenEdit('date', event.date)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Date
                        </Label>
                        <p className={`text-sm mt-1 ${!event.date ? 'text-muted-foreground italic' : ''}`}>
                          {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Date not set'}
                        </p>
                      </div>
                      <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  <div
                    className="cursor-pointer group p-4 rounded-lg border hover:border-primary transition-colors"
                    onClick={() => handleOpenEdit('time', event.time)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Time
                        </Label>
                        <p className={`text-sm mt-1 ${!event.time ? 'text-muted-foreground italic' : ''}`}>
                          {event.time || 'Time not set'}
                        </p>
                      </div>
                      <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div
                  className="cursor-pointer group p-4 rounded-lg border hover:border-primary transition-colors"
                  onClick={() => handleOpenEdit('location', event.location)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Location
                      </Label>
                      <p className={`text-sm mt-1 ${isFieldEmpty(event.location) ? 'text-muted-foreground italic' : ''}`}>
                        {event.location || 'Location not set'}
                      </p>
                    </div>
                    <Edit2 className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">Category:</Label>
                  <Badge variant="outline" className="capitalize">{event.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            <Card className="border-2 border-primary/50 hover:border-primary transition-colors cursor-pointer" onClick={onViewAsAdmin}>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4 mx-auto">
                  <UserCog className="w-6 h-6" />
                </div>
                <CardTitle className="text-center">View as Admin</CardTitle>
                <CardDescription className="text-center">
                  Full access to manage your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>View and manage guest list</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Add guests and send invites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Track RSVP analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Publish/unpublish event</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Edit all event details</span>
                  </li>
                </ul>
                <Button className="w-full mt-4">
                  <UserCog className="w-4 h-4 mr-2" />
                  Continue as Admin
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary transition-colors cursor-pointer" onClick={onViewAsGuest}>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-secondary-foreground mb-4 mx-auto">
                  <Eye className="w-6 h-6" />
                </div>
                <CardTitle className="text-center">View as Guest</CardTitle>
                <CardDescription className="text-center">
                  See what guests will see
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>View event details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Preview invitation page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>No management features</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full mt-4">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview as Guest
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => setEditDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editDialog}</DialogTitle>
            <DialogDescription>
              Update the {editDialog} for your event
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {editDialog === 'description' ? (
              <Textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${editDialog}`}
                className="min-h-[120px]"
              />
            ) : editDialog === 'date' ? (
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : editDialog === 'time' ? (
              <Input
                type="time"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Enter ${editDialog}`}
              />
            )}
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditDialog(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
