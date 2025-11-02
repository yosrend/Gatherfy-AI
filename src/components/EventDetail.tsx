import { useState } from 'react';
import { ArrowLeft, Edit, Share2, Calendar, MapPin, Clock, Users, Plus, Send, Copy, CheckCircle, XCircle, Trash2, Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Event, Guest } from '../App';
import { toast } from 'sonner@2.0.3';
import { copyToClipboard } from './utils/clipboard';

interface EventDetailProps {
  event: Event;
  onEdit: () => void;
  onBack: () => void;
  onEventUpdated: (event: Event) => void;
}

export function EventDetail({ event, onEdit, onBack, onEventUpdated }: EventDetailProps) {
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
  const [isAddingGuest, setIsAddingGuest] = useState(false);

  const handleAddGuest = () => {
    if (!newGuest.name || !newGuest.email) {
      toast.error('Please provide name and email');
      return;
    }

    const guest: Guest = {
      id: `guest_${Date.now()}`,
      name: newGuest.name,
      email: newGuest.email,
      phone: newGuest.phone,
      status: 'pending'
    };

    const updatedEvent = {
      ...event,
      invitedGuests: [...event.invitedGuests, guest]
    };

    onEventUpdated(updatedEvent);
    setNewGuest({ name: '', email: '', phone: '' });
    setIsAddingGuest(false);
    toast.success('Guest added successfully!');
  };

  const handleRemoveGuest = (guestId: string) => {
    const updatedEvent = {
      ...event,
      invitedGuests: event.invitedGuests.filter(g => g.id !== guestId)
    };
    onEventUpdated(updatedEvent);
    toast.success('Guest removed');
  };

  const shareViaWhatsApp = (guest: Guest) => {
    const eventUrl = `${window.location.origin}/?rsvp=${event.id}&guest=${guest.id}`;
    const message = `Hi ${guest.name}! 🎉\n\nYou're invited to: ${event.title}\n📅 ${new Date(event.date).toLocaleDateString()} at ${event.time}\n📍 ${event.location}\n\nPlease confirm your attendance: ${eventUrl}`;
    
    const whatsappUrl = `https://wa.me/${guest.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp...');
  };

  const copyInviteLink = async (guest: Guest) => {
    const eventUrl = `${window.location.origin}/?rsvp=${event.id}&guest=${guest.id}`;
    await copyToClipboard(eventUrl, 'Invite link copied!');
  };

  const shareEvent = async () => {
    const eventUrl = `${window.location.origin}/?event=${event.id}`;
    await copyToClipboard(eventUrl, 'Event link copied!');
  };

  const handlePublish = () => {
    if (event.status === 'published') {
      const updatedEvent = { ...event, status: 'draft' as const };
      onEventUpdated(updatedEvent);
      toast.success('Event unpublished');
    } else {
      const updatedEvent = { ...event, status: 'published' as const };
      onEventUpdated(updatedEvent);
      toast.success('Event published successfully! 🎉');
    }
  };

  const stats = {
    confirmed: event.invitedGuests.filter(g => g.status === 'confirmed').length,
    declined: event.invitedGuests.filter(g => g.status === 'declined').length,
    pending: event.invitedGuests.filter(g => g.status === 'pending').length,
    total: event.invitedGuests.length
  };

  const confirmationRate = stats.total > 0 ? Math.round((stats.confirmed / stats.total) * 100) : 0;

  const getStatusBadge = (status: Event['status']) => {
    const styles = {
      draft: 'bg-secondary text-secondary-foreground',
      published: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
      cancelled: 'bg-destructive/10 text-destructive'
    };
    return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2>Event Details</h2>
                <p className="text-sm text-muted-foreground">Manage and track your event</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={shareEvent} variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={onEdit} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                onClick={handlePublish}
                variant={event.status === 'published' ? 'secondary' : 'default'}
              >
                <Rocket className="w-4 h-4 mr-2" />
                {event.status === 'published' ? 'Unpublish' : 'Publish Live'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Cover Image */}
        {event.coverImage && (
          <div className="mb-6 rounded-lg overflow-hidden border">
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-base">{event.category}</CardDescription>
                  </div>
                  {getStatusBadge(event.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span>Capacity: {event.capacity} attendees</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2">About this event</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Guest List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Guest List</CardTitle>
                    <CardDescription>Manage invitations and track responses</CardDescription>
                  </div>
                  <Dialog open={isAddingGuest} onOpenChange={setIsAddingGuest}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Guest
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Guest</DialogTitle>
                        <DialogDescription>
                          Add a guest to send them an invitation
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="guestName">Name *</Label>
                          <Input
                            id="guestName"
                            value={newGuest.name}
                            onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                            placeholder="Guest name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestEmail">Email *</Label>
                          <Input
                            id="guestEmail"
                            type="email"
                            value={newGuest.email}
                            onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                            placeholder="guest@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="guestPhone">Phone (for WhatsApp)</Label>
                          <Input
                            id="guestPhone"
                            type="tel"
                            value={newGuest.phone}
                            onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                            placeholder="+1234567890"
                          />
                        </div>
                        <Button onClick={handleAddGuest} className="w-full">
                          Add Guest
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmed ({stats.confirmed})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                    <TabsTrigger value="declined">Declined ({stats.declined})</TabsTrigger>
                  </TabsList>

                  {['all', 'confirmed', 'pending', 'declined'].map(tab => (
                    <TabsContent key={tab} value={tab} className="mt-4">
                      <div className="space-y-2">
                        {event.invitedGuests
                          .filter(guest => tab === 'all' || guest.status === tab)
                          .map(guest => (
                            <div key={guest.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{guest.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
                                {guest.phone && (
                                  <p className="text-xs text-muted-foreground">{guest.phone}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant="outline" className={
                                  guest.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' :
                                  guest.status === 'declined' ? 'bg-destructive/10 text-destructive' :
                                  'bg-secondary text-secondary-foreground'
                                }>
                                  {guest.status === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                  {guest.status === 'declined' && <XCircle className="w-3 h-3 mr-1" />}
                                  {guest.status}
                                </Badge>
                                {guest.phone && (
                                  <Button
                                    onClick={() => shareViaWhatsApp(guest)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Send className="w-3 h-3 mr-1" />
                                    WhatsApp
                                  </Button>
                                )}
                                <Button
                                  onClick={() => copyInviteLink(guest)}
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  onClick={() => handleRemoveGuest(guest.id)}
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        {event.invitedGuests.filter(guest => tab === 'all' || guest.status === tab).length === 0 && (
                          <p className="text-center text-muted-foreground py-8 text-sm">No guests in this category</p>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Analytics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Analytics</CardTitle>
                <CardDescription>Track guest responses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-muted-foreground">Confirmation Rate</span>
                    <span className="font-medium">{confirmationRate}%</span>
                  </div>
                  <Progress value={confirmationRate} className="h-2" />
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <span className="text-muted-foreground">Confirmed</span>
                    </div>
                    <span className="font-medium">{stats.confirmed}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full" />
                      <span className="text-muted-foreground">Pending</span>
                    </div>
                    <span className="font-medium">{stats.pending}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span className="text-muted-foreground">Declined</span>
                    </div>
                    <span className="font-medium">{stats.declined}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="text-base">Quick Share</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Share this event with others instantly
                </p>
                <Button onClick={shareEvent} variant="secondary" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Event Link
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
