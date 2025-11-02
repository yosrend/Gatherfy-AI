import { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { Event } from '../App';

interface GuestImporterProps {
  events: Event[];
  onImport: (eventId: string, guests: Array<{ name: string; email?: string; phone?: string }>) => void;
}

interface CsvRow {
  [key: string]: string;
}

export function GuestImporter({ events, onImport }: GuestImporterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      toast.error('CSV file is empty');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const rows: CsvRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: CsvRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    setHeaders(headers);
    setCsvData(rows);
    
    // Auto-detect column mappings
    const autoMapping = {
      name: headers.find(h => /name/i.test(h)) || '',
      email: headers.find(h => /email|e-mail/i.test(h)) || '',
      phone: headers.find(h => /phone|mobile|tel/i.test(h)) || '',
    };
    setColumnMapping(autoMapping);
    
    setStep('map');
    toast.success(`Loaded ${rows.length} rows from CSV`);
  };

  const handleImport = () => {
    if (!selectedEventId) {
      toast.error('Please select an event');
      return;
    }

    if (!columnMapping.name) {
      toast.error('Please map the Name column');
      return;
    }

    const guests = csvData.map(row => ({
      name: row[columnMapping.name] || 'Unnamed Guest',
      email: columnMapping.email ? row[columnMapping.email] : undefined,
      phone: columnMapping.phone ? row[columnMapping.phone] : undefined,
    })).filter(guest => guest.name && guest.name !== 'Unnamed Guest');

    if (guests.length === 0) {
      toast.error('No valid guests found in the CSV');
      return;
    }

    onImport(selectedEventId, guests);
    toast.success(`Successfully imported ${guests.length} guests`);
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep('upload');
    setCsvData([]);
    setHeaders([]);
    setColumnMapping({ name: '', email: '', phone: '' });
    setSelectedEventId('');
  };

  const downloadTemplate = () => {
    const template = 'Name,Email,Phone\nJohn Doe,john@example.com,+1234567890\nJane Smith,jane@example.com,+0987654321\n';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  const previewGuests = csvData.slice(0, 5).map(row => ({
    name: row[columnMapping.name] || '',
    email: columnMapping.email ? row[columnMapping.email] : '',
    phone: columnMapping.phone ? row[columnMapping.phone] : '',
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="w-4 h-4 mr-2" />
          Import Guests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Guests from CSV/Excel</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import guests into your event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file with guest information. The file should include columns for Name, Email, and Phone (optional).
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Select Event</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event to import guests to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map(event => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <p>Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">CSV or Excel files (.csv)</p>
                    </div>
                  </Label>
                  <input
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Map Columns */}
          {step === 'map' && (
            <>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {csvData.length} rows loaded. Map your CSV columns to guest fields.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Name Column (Required)</Label>
                  <Select value={columnMapping.name} onValueChange={(value) => setColumnMapping({ ...columnMapping, name: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select name column..." />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map(header => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Email Column (Optional)</Label>
                  <Select value={columnMapping.email} onValueChange={(value) => setColumnMapping({ ...columnMapping, email: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {headers.map(header => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Phone Column (Optional)</Label>
                  <Select value={columnMapping.phone} onValueChange={(value) => setColumnMapping({ ...columnMapping, phone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select phone column..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {headers.map(header => (
                        <SelectItem key={header} value={header}>
                          {header}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preview */}
                {columnMapping.name && (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h4 className="mb-3">Preview (first 5 rows)</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewGuests.map((guest, index) => (
                          <TableRow key={index}>
                            <TableCell>{guest.name || <span className="text-muted-foreground">-</span>}</TableCell>
                            <TableCell>{guest.email || <span className="text-muted-foreground">-</span>}</TableCell>
                            <TableCell>{guest.phone || <span className="text-muted-foreground">-</span>}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  Back
                </Button>
                <Button onClick={handleImport} disabled={!columnMapping.name || !selectedEventId}>
                  Import {csvData.length} Guests
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
