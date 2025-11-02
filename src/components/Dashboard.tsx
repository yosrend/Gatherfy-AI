import { useState } from 'react';
import { Plus, Calendar, MapPin, Users, TrendingUp, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Sparkles, LayoutDashboard, CalendarDays, UserCog, Settings, LogOut, Download, Edit3, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Event } from '../App';
import { toast } from 'sonner';
import { GuestImporter } from './GuestImporter';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './ui/sidebar';

interface DashboardProps {
  events: Event[];
  onEditEvent: (eventId: string) => void;
  onViewEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onEventUpdated: (event: Event) => void;
  onChoiceAI: () => void;
  onChoiceManual: () => void;
  onLogout?: () => void;
}

export function Dashboard({ events, onEditEvent, onViewEvent, onDeleteEvent, onEventUpdated, onChoiceAI, onChoiceManual, onLogout }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [activeView, setActiveView] = useState('dashboard');

  const filteredEvents = events.filter(event => {
    if (selectedTab === 'all') return true;
    return event.status === selectedTab;
  });

  const stats = {
    total: events.length,
    published: events.filter(e => e.status === 'published').length,
    draft: events.filter(e => e.status === 'draft').length,
    totalGuests: events.reduce((sum, e) => sum + e.invitedGuests.length, 0),
    confirmed: events.reduce((sum, e) => sum + e.invitedGuests.filter(g => g.status === 'confirmed').length, 0),
  };

  const allGuests = events.flatMap(event => 
    event.invitedGuests.map(guest => ({
      ...guest,
      eventTitle: event.title,
      eventId: event.id,
      eventDate: event.date,
    }))
  );

  const handleDelete = (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      onDeleteEvent(eventId);
      toast.success('Event deleted successfully');
    }
  };

  const handleGuestImport = (eventId: string, guests: Array<{ name: string; email?: string; phone?: string }>) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const newGuests = guests.map(guest => ({
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone,
      status: 'pending' as const,
    }));

    const updatedEvent = {
      ...event,
      invitedGuests: [...event.invitedGuests, ...newGuests],
    };

    onEventUpdated(updatedEvent);
  };

  const handleExportGuests = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Event', 'Event Date'],
      ...allGuests.map(guest => [
        guest.name,
        guest.email || '',
        guest.phone || '',
        guest.status,
        guest.eventTitle,
        new Date(guest.eventDate).toLocaleDateString(),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Guests exported successfully');
  };

  const getStatusBadge = (status: Event['status']) => {
    const styles = {
      draft: 'bg-secondary text-secondary-foreground',
      published: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
      cancelled: 'bg-destructive/10 text-destructive'
    };
    return <Badge variant="outline" className={styles[status]}>{status}</Badge>;
  };

  const getGuestStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-secondary text-secondary-foreground',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100',
      declined: 'bg-destructive/10 text-destructive'
    };
    return <Badge variant="outline" className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'events', label: 'Events', icon: CalendarDays },
    { id: 'guests', label: 'Guests', icon: UserCog },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <>
            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* AI Creation Card */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary group"
                  onClick={onChoiceAI}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2">Create with AI</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Describe your event and let AI generate all the details instantly
                        </p>
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Zap className="w-4 h-4" />
                          <span>Fast & Smart</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manual Creation Card */}
                <Card 
                  className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary group"
                  onClick={onChoiceManual}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-secondary-foreground group-hover:scale-110 transition-transform">
                        <Edit3 className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2">Create Manually</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Fill in event details with templates and full control over every aspect
                        </p>
                        <div className="flex items-center gap-2 text-sm text-secondary-foreground">
                          <CheckCircle className="w-4 h-4" />
                          <span>Complete Control</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Events</CardDescription>
                  <CardTitle className="text-3xl">{stats.total}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    All time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Published</CardDescription>
                  <CardTitle className="text-3xl">{stats.published}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Live events
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Drafts</CardDescription>
                  <CardTitle className="text-3xl">{stats.draft}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Unpublished
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Guests</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalGuests}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Invited
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Confirmed</CardDescription>
                  <CardTitle className="text-3xl">{stats.confirmed}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Attending
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Your latest events at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                {events.slice(0, 3).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-muted-foreground" />
                      </div>
                    </div>
                    <h3 className="mb-2">No events yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Use the Quick Actions above to create your first event
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {events.slice(0, 3).map(event => {
                      const confirmedCount = event.invitedGuests.filter(g => g.status === 'confirmed').length;
                      
                      return (
                        <Card key={event.id} className="hover:bg-accent/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="truncate">{event.title}</h4>
                                  {getStatusBadge(event.status)}
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {confirmedCount}/{event.invitedGuests.length} confirmed
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() => onViewEvent(event.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );

      case 'events':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Events</CardTitle>
              <CardDescription>View and manage all your events</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({events.length})</TabsTrigger>
                  <TabsTrigger value="published">Published ({stats.published})</TabsTrigger>
                  <TabsTrigger value="draft">Drafts ({stats.draft})</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="mt-6">
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <Calendar className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </div>
                      <h3 className="mb-2">No events yet</h3>
                      <p className="text-muted-foreground mb-6">
                        {selectedTab === 'all' 
                          ? 'Use the Dashboard Quick Actions to create your first event'
                          : `No ${selectedTab} events found`
                        }
                      </p>
                      {selectedTab === 'all' && (
                        <div className="flex gap-2 justify-center">
                          <Button onClick={onChoiceAI}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Create with AI
                          </Button>
                          <Button onClick={onChoiceManual} variant="secondary">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Create Manually
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map(event => {
                        const confirmedCount = event.invitedGuests.filter(g => g.status === 'confirmed').length;
                        const declinedCount = event.invitedGuests.filter(g => g.status === 'declined').length;
                        const pendingCount = event.invitedGuests.filter(g => g.status === 'pending').length;

                        return (
                          <Card key={event.id} className="hover:bg-accent/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                {event.coverImage && (
                                  <img
                                    src={event.coverImage}
                                    alt={event.title}
                                    className="w-24 h-24 rounded-md object-cover border"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h3 className="truncate">{event.title}</h3>
                                        {getStatusBadge(event.status)}
                                      </div>
                                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {event.description}
                                      </p>
                                      
                                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="w-4 h-4" />
                                          {new Date(event.date).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                          })}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Clock className="w-4 h-4" />
                                          {event.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="w-4 h-4" />
                                          {event.location}
                                        </div>
                                      </div>

                                      {event.invitedGuests.length > 0 && (
                                        <div className="flex gap-4 text-xs">
                                          <span className="text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-3 h-3 inline mr-1" />
                                            {confirmedCount} confirmed
                                          </span>
                                          <span className="text-destructive">
                                            <XCircle className="w-3 h-3 inline mr-1" />
                                            {declinedCount} declined
                                          </span>
                                          <span className="text-muted-foreground">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            {pendingCount} pending
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => onViewEvent(event.id)}
                                        variant="ghost"
                                        size="icon"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        onClick={() => onEditEvent(event.id)}
                                        variant="ghost"
                                        size="icon"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        onClick={() => handleDelete(event.id, event.title)}
                                        variant="ghost"
                                        size="icon"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        );

      case 'guests':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Guest Management</CardTitle>
                  <CardDescription>View and manage all guests across your events</CardDescription>
                </div>
                <div className="flex gap-2">
                  <GuestImporter events={events} onImport={handleGuestImport} />
                  {allGuests.length > 0 && (
                    <Button variant="outline" onClick={handleExportGuests}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {allGuests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2">No guests yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create an event first, then add guests or import them from a CSV file
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={onChoiceAI}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create with AI
                    </Button>
                    <Button onClick={onChoiceManual} variant="secondary">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Create Manually
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {allGuests.map((guest, index) => (
                    <Card key={index} className="hover:bg-accent/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="truncate">{guest.name}</h4>
                              {getGuestStatusBadge(guest.status)}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {guest.eventTitle}
                              </div>
                              {guest.email && (
                                <div className="flex items-center gap-1 truncate">
                                  {guest.email}
                                </div>
                              )}
                              {guest.phone && (
                                <div className="flex items-center gap-1">
                                  {guest.phone}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => onViewEvent(guest.eventId)}
                            variant="ghost"
                            size="sm"
                          >
                            View Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="mb-2">Account Settings</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account information and preferences
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <UserCog className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Notification Preferences
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="mb-2">Event Templates</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create and manage your event templates
                </p>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm">Event Manager</h2>
                <p className="text-xs text-muted-foreground">AI-Powered Events</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        isActive={activeView === item.id}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogout}>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <header className="border-b bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h2 className="text-foreground">
                    {menuItems.find(item => item.id === activeView)?.label || 'Dashboard'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {activeView === 'dashboard' && 'Overview of your events and analytics'}
                    {activeView === 'events' && 'Manage all your events'}
                    {activeView === 'guests' && 'View and manage your guests'}
                    {activeView === 'settings' && 'Configure your preferences'}
                  </p>
                </div>
              </div>
              <Button onClick={onCreateNew}>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          </header>

          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
