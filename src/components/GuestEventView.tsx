import { ArrowLeft, Calendar, MapPin, Clock, Users, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Event } from '../App';
import { copyToClipboard } from './utils/clipboard';

interface GuestEventViewProps {
  event: Event;
  onBack: () => void;
}

export function GuestEventView({ event, onBack }: GuestEventViewProps) {
  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/?event=${event.id}`;
    await copyToClipboard(eventUrl, 'Event link copied!');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={onBack} variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2>Guest View</h2>
                <p className="text-sm text-muted-foreground">This is what guests will see</p>
              </div>
            </div>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-3xl">
        <Card>
          <CardContent className="p-0">
            {/* Cover Image */}
            {event.coverImage && (
              <div className="w-full h-64 overflow-hidden rounded-t-lg">
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Title and Status */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl">{event.title}</h1>
                  <Badge variant="outline" className="capitalize">
                    {event.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground capitalize">{event.category}</p>
              </div>

              <Separator />

              {/* Event Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{event.capacity} attendees</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="mb-3">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <Separator />

              {/* Note */}
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This is a preview of how guests will see your event. 
                  To invite guests and manage RSVPs, go back and view as admin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
