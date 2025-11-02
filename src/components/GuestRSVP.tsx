import { useState } from 'react';
import { CheckCircle, XCircle, Calendar, MapPin, Clock, PartyPopper } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Event } from '../App';

interface GuestRSVPProps {
  event: Event;
  guestToken: string;
  onResponse: (eventId: string, guestId: string, status: 'confirmed' | 'declined') => void;
}

export function GuestRSVP({ event, guestToken, onResponse }: GuestRSVPProps) {
  const [hasResponded, setHasResponded] = useState(false);
  const [response, setResponse] = useState<'confirmed' | 'declined' | null>(null);

  const guest = event.invitedGuests.find(g => g.id === guestToken);

  if (!guest) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center">Invalid Invitation</CardTitle>
            <CardDescription className="text-center">
              This invitation link is not valid.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleResponse = (status: 'confirmed' | 'declined') => {
    onResponse(event.id, guest.id, status);
    setResponse(status);
    setHasResponded(true);
  };

  if (hasResponded) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {response === 'confirmed' ? (
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <PartyPopper className="w-8 h-8 text-green-600 dark:text-green-100" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardTitle className="text-center">
              {response === 'confirmed' ? "You're All Set! 🎉" : "Response Recorded"}
            </CardTitle>
            <CardDescription className="text-center">
              {response === 'confirmed' 
                ? `Thanks for confirming, ${guest.name}! We're excited to see you at the event.`
                : `Sorry you can't make it, ${guest.name}. We'll miss you!`
              }
            </CardDescription>
          </CardHeader>
          {response === 'confirmed' && (
            <CardContent>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>{event.title}</strong><br />
                  <span className="text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </span>
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">You're Invited! 🎉</CardTitle>
          <CardDescription>Hi {guest.name}, you're invited to:</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {event.coverImage && (
            <div className="rounded-lg overflow-hidden border">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <h2 className="mb-4">{event.title}</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-3 text-sm">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>

          <Separator />

          <div>
            <p className="text-center mb-4 text-muted-foreground">Will you be attending?</p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleResponse('confirmed')}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Yes, I'll Attend
              </Button>
              <Button
                onClick={() => handleResponse('declined')}
                variant="outline"
                size="lg"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Can't Make It
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
