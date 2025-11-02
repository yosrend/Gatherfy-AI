export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  cover_image?: string;
  capacity?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'cancelled';
  settings: EventSettings;
}

export interface EventSettings {
  allow_guest_plus_one: boolean;
  require_approval: boolean;
  send_reminders: boolean;
  public_visibility: boolean;
  custom_fields?: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface Guest {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dietary_restrictions?: string;
  plus_one: boolean;
  plus_one_name?: string;
  status: 'pending' | 'confirmed' | 'declined';
  response_token: string;
  responded_at?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity?: number;
  settings: EventSettings;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  status?: 'draft' | 'published' | 'cancelled';
}

export interface CreateGuestDto {
  event_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  dietary_restrictions?: string;
}

export interface UpdateGuestDto extends Partial<CreateGuestDto> {
  status?: 'pending' | 'confirmed' | 'declined';
  plus_one?: boolean;
  plus_one_name?: string;
}

export interface EventStatistics {
  total_guests: number;
  confirmed_guests: number;
  declined_guests: number;
  pending_guests: number;
  plus_ones: number;
  capacity_percentage: number;
  rsvp_rate: number;
}

export interface UserDashboard {
  total_events: number;
  published_events: number;
  draft_events: number;
  total_guests: number;
  upcoming_events: Array<{
    id: string;
    title: string;
    date: string;
    guest_count: number;
  }>;
}