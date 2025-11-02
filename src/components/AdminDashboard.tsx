import { useState } from 'react';
import { Users, Calendar, TrendingUp, Activity, Eye, Edit, Trash2, CheckCircle, XCircle, Shield, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Event } from '../App';
import { toast } from 'sonner';

interface AdminDashboardProps {
  events: Event[];
  onViewEvent: (eventId: string) => void;
  onEditEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({ events, onViewEvent, onEditEvent, onDeleteEvent, onLogout }: AdminDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Calculate statistics
  const stats = {
    totalEvents: events.length,
    publishedEvents: events.filter(e => e.status === 'published').length,
    draftEvents: events.filter(e => e.status === 'draft').length,
    cancelledEvents: events.filter(e => e.status === 'cancelled').length,
    totalGuests: events.reduce((sum, e) => sum + e.invitedGuests.length, 0),
    confirmedGuests: events.reduce((sum, e) => sum + e.invitedGuests.filter(g => g.status === 'confirmed').length, 0),
    pendingGuests: events.reduce((sum, e) => sum + e.invitedGuests.filter(g => g.status === 'pending').length, 0),
    declinedGuests: events.reduce((sum, e) => sum + e.invitedGuests.filter(g => g.status === 'declined').length, 0),
  };

  const confirmationRate = stats.totalGuests > 0 
    ? Math.round((stats.confirmedGuests / stats.totalGuests) * 100) 
    : 0;

  const handleDelete = (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      onDeleteEvent(eventId);
      toast.success('Event deleted successfully');
    }
  };

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-foreground">Admin Dashboard</h2>
                <p className="text-sm text-muted-foreground">System-wide event management</p>
              </div>
            </div>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">All Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Events</CardDescription>
                  <CardTitle className="text-3xl">{stats.totalEvents}</CardTitle>
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
                  <CardTitle className="text-3xl">{stats.publishedEvents}</CardTitle>
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
                  <CardDescription>Confirmation Rate</CardDescription>
                  <CardTitle className="text-3xl">{confirmationRate}%</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    RSVP rate
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
                <CardDescription>Latest events across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Confirmed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.slice(0, 10).map(event => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(event.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(event.status)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {event.invitedGuests.length}
                        </TableCell>
                        <TableCell className="text-sm">
                          {event.invitedGuests.filter(g => g.status === 'confirmed').length}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Events</CardTitle>
                <CardDescription>Complete list of events in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map(event => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(event.date).toLocaleDateString()}<br />
                          <span className="text-muted-foreground">{event.time}</span>
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate">
                          {event.location}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(event.status)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              {event.invitedGuests.filter(g => g.status === 'confirmed').length}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Users className="w-3 h-3" />
                              {event.invitedGuests.length} total
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Status Distribution</CardTitle>
                  <CardDescription>Breakdown of events by status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Published</span>
                    <span className="font-medium">{stats.publishedEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Draft</span>
                    <span className="font-medium">{stats.draftEvents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cancelled</span>
                    <span className="font-medium">{stats.cancelledEvents}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>RSVP Statistics</CardTitle>
                  <CardDescription>Guest response breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Confirmed</span>
                    <span className="font-medium">{stats.confirmedGuests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="font-medium">{stats.pendingGuests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-destructive">Declined</span>
                    <span className="font-medium">{stats.declinedGuests}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Events grouped by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['business', 'celebration', 'networking', 'entertainment', 'social'].map(category => {
                    const count = events.filter(e => e.category === category).length;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{category}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
