import { Sparkles, Edit3, LayoutDashboard, FileSpreadsheet, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Event, Guest } from '../App';

interface CreateEventChoiceProps {
  onChoiceAI: () => void;
  onChoiceManual: () => void;
  onViewDashboard: () => void;
  onImportComplete: (event: Event) => void;
}

export function CreateEventChoice({ onChoiceAI, onChoiceManual, onViewDashboard, onImportComplete }: CreateEventChoiceProps) {
  const [isImportOpen, setIsImportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const guests = parseCSV(text);
        
        // Create event with imported guests
        const newEvent: Event = {
          id: `evt_${Date.now()}`,
          title: 'Imported Event',
          description: 'Event created from imported guest list. Please update the details.',
          date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          time: '18:00',
          location: 'To Be Announced',
          category: 'social',
          capacity: guests.length,
          invitedGuests: guests,
          createdAt: new Date().toISOString(),
          status: 'draft'
        };

        toast.success(`Imported ${guests.length} guests successfully!`);
        onImportComplete(newEvent);
        setIsImportOpen(false);
      } catch (error) {
        toast.error('Failed to parse file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string): Guest[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const guests: Guest[] = [];
    
    // Skip header if exists
    const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        guests.push({
          id: `guest_${Date.now()}_${i}`,
          name: parts[0],
          email: parts[1],
          phone: parts[2] || undefined,
          status: 'pending'
        });
      }
    }
    
    return guests;
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Phone\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+0987654321';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="mb-3">Create Your Event</h1>
            <p className="text-muted-foreground text-lg">
              Choose how you'd like to create your event
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* AI Creation */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary" onClick={onChoiceAI}>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <CardTitle>AI-Powered Creation</CardTitle>
                <CardDescription>
                  Describe your event and let AI generate all the details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Quick and easy setup in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Auto-generates event details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Smart suggestions and templates</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" size="lg">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create with AI
                </Button>
              </CardContent>
            </Card>

            {/* Manual Creation */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary" onClick={onChoiceManual}>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary text-secondary-foreground mb-4">
                  <Edit3 className="w-6 h-6" />
                </div>
                <CardTitle>Manual Creation</CardTitle>
                <CardDescription>
                  Fill in event details manually with full control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Complete control over every detail</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Choose from event templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>Customize every aspect</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="secondary" size="lg">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Create Manually
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
              Or import from spreadsheet
            </span>
          </div>

          {/* Import Option */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Import Guest List
              </CardTitle>
              <CardDescription>
                Upload a CSV or Excel file to quickly add multiple guests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="lg">
                    <Upload className="w-4 h-4 mr-2" />
                    Import from Excel / Google Sheets
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Guest List</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with your guest list. The file should have columns for Name, Email, and Phone (optional).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm mb-4 text-muted-foreground">
                        Upload your CSV file or download our template
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex gap-2 justify-center">
                        <Button onClick={() => fileInputRef.current?.click()}>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                        <Button onClick={downloadTemplate} variant="outline">
                          Download Template
                        </Button>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-sm">
                      <p className="font-medium mb-2">CSV Format:</p>
                      <code className="text-xs">
                        Name,Email,Phone<br />
                        John Doe,john@example.com,+1234567890<br />
                        Jane Smith,jane@example.com,+0987654321
                      </code>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Supports CSV files exported from Excel or Google Sheets
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
