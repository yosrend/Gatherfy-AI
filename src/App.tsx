import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { EventGenerator } from './components/EventGenerator';
import { ManualEventCreator } from './components/ManualEventCreator';
import { EventPreview } from './components/EventPreview';
import { GuestEventView } from './components/GuestEventView';
import { Dashboard } from './components/Dashboard';
import { EventEditor } from './components/EventEditor';
import { EventDetail } from './components/EventDetail';
import { GuestRSVP } from './components/GuestRSVP';
import { Toaster } from './components/ui/sonner';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Event, Guest } from './types';

type View = 'landing' | 'login' | 'ai-generator' | 'manual-creator' | 'preview' | 'guest-view' | 'dashboard' | 'editor' | 'detail' | 'rsvp';
type UserRole = 'admin' | 'user' | null;

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [guestToken, setGuestToken] = useState<string | null>(null);

  const handleLogin = (email: string, role: 'admin' | 'user') => {
    setUserEmail(email);
    setUserRole(role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserEmail(null);
    setUserRole(null);
    setCurrentView('landing');
  };

  const handleEventCreated = (event: Event) => {
    setEvents([...events, event]);
    setSelectedEventId(event.id);
    setCurrentView('preview');
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleEventDeleted = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setCurrentView('dashboard');
  };

  const handleEditEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('editor');
  };

  const handleViewEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('detail');
  };

  const handleGuestResponse = (eventId: string, guestId: string, status: 'confirmed' | 'declined') => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          invitedGuests: event.invitedGuests.map(guest =>
            guest.id === guestId
              ? { ...guest, status, respondedAt: new Date().toISOString() }
              : guest
          )
        };
      }
      return event;
    }));
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleViewAsAdmin = () => {
    setCurrentView('detail');
  };

  const handleViewAsGuest = () => {
    setCurrentView('guest-view');
  };

  const handleBackToPreview = () => {
    setCurrentView('preview');
  };

  const selectedEvent = events.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {currentView === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentView('login')}
          onEventGenerated={handleEventCreated}
          onLogin={handleLogin}
        />
      )}

      {currentView === 'login' && (
        <Login onLogin={handleLogin} />
      )}

      {currentView === 'ai-generator' && (
        <EventGenerator
          onEventCreated={handleEventCreated}
          onViewDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'manual-creator' && (
        <ManualEventCreator
          onEventCreated={handleEventCreated}
          onBack={() => setCurrentView('dashboard')}
        />
      )}

      {currentView === 'preview' && selectedEvent && (
        <EventPreview
          event={selectedEvent}
          onViewAsAdmin={handleViewAsAdmin}
          onViewAsGuest={handleViewAsGuest}
          onUpdateEvent={handleEventUpdated}
        />
      )}

      {currentView === 'guest-view' && selectedEvent && (
        <GuestEventView
          event={selectedEvent}
          onBack={handleBackToPreview}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          events={events}
          onEditEvent={handleEditEvent}
          onViewEvent={handleViewEvent}
          onDeleteEvent={handleEventDeleted}
          onEventUpdated={handleEventUpdated}
          onChoiceAI={() => setCurrentView('ai-generator')}
          onChoiceManual={() => setCurrentView('manual-creator')}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'editor' && selectedEvent && (
        <EventEditor
          event={selectedEvent}
          onSave={(updatedEvent) => {
            handleEventUpdated(updatedEvent);
            setCurrentView('detail');
          }}
          onCancel={() => setCurrentView('detail')}
        />
      )}

      {currentView === 'detail' && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onEdit={() => handleEditEvent(selectedEvent.id)}
          onBack={handleBackToDashboard}
          onEventUpdated={handleEventUpdated}
        />
      )}

      {currentView === 'rsvp' && selectedEvent && guestToken && (
        <GuestRSVP
          event={selectedEvent}
          guestToken={guestToken}
          onResponse={handleGuestResponse}
        />
      )}
    </div>
  );
}
