import { supabase } from '../lib/supabase'
import { Event, CreateEventDto, UpdateEventDto, Guest, CreateGuestDto, UpdateGuestDto, EventStatistics, UserDashboard } from '../types'

// Event services
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function fetchEvent(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*, guests(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createEvent(eventData: CreateEventDto): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(id: string, eventData: UpdateEventDto): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function searchEvents(query: string, filters?: {
  category?: string;
  status?: string;
}): Promise<Event[]> {
  let queryBuilder = supabase
    .from('events')
    .select('*')
    .or(`title.ilike.*${query}*,description.ilike.*${query}*`)

  if (filters?.category) {
    queryBuilder = queryBuilder.eq('category', filters.category)
  }

  if (filters?.status) {
    queryBuilder = queryBuilder.eq('status', filters.status)
  }

  const { data, error } = await queryBuilder

  if (error) throw error
  return data || []
}

// Guest services
export async function fetchEventGuests(eventId: string): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function addGuest(guestData: CreateGuestDto): Promise<Guest> {
  const { data, error } = await supabase
    .from('guests')
    .insert({
      ...guestData,
      response_token: generateResponseToken(),
      status: 'pending'
    })
    .single()

  if (error) throw error
  return data
}

export async function updateGuest(id: string, guestData: UpdateGuestDto): Promise<Guest> {
  const { data, error } = await supabase
    .from('guests')
    .update({
      ...guestData,
      responded_at: new Date().toISOString()
    })
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function removeGuest(id: string): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function bulkImportGuests(eventId: string, guests: CreateGuestDto[]): Promise<{
  imported: number;
  failed: number;
  errors: string[];
}> {
  const guestsWithToken = guests.map(guest => ({
    ...guest,
    event_id: eventId,
    response_token: generateResponseToken(),
    status: 'pending' as const
  }))

  const { data, error } = await supabase
    .from('guests')
    .insert(guestsWithToken)
    .select()

  if (error) {
    return {
      imported: 0,
      failed: guests.length,
      errors: [error.message]
    }
  }

  return {
    imported: data?.length || 0,
    failed: 0,
    errors: []
  }
}

export async function bulkUpdateGuestStatus(guestIds: string[], status: 'confirmed' | 'declined'): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .update({
      status,
      responded_at: new Date().toISOString()
    })
    .in('id', guestIds)

  if (error) throw error
}

export async function searchGuests(query: string, eventId?: string): Promise<Guest[]> {
  let queryBuilder = supabase
    .from('guests')
    .select('*')
    .or(`name.ilike.*${query}*,email.ilike.*${query}*,company.ilike.*${query}*`)

  if (eventId) {
    queryBuilder = queryBuilder.eq('event_id', eventId)
  }

  const { data, error } = await queryBuilder

  if (error) throw error
  return data || []
}

export async function getGuestByToken(token: string): Promise<Guest | null> {
  const { data, error } = await supabase
    .from('guests')
    .select('*, events(*)')
    .eq('response_token', token)
    .single()

  if (error) throw error
  return data
}

// Analytics services
export async function getEventStatistics(eventId: string): Promise<EventStatistics> {
  const { data, error } = await supabase
    .rpc('event_statistics', { event_id: eventId })

  if (error) throw error
  return data || {
    total_guests: 0,
    confirmed_guests: 0,
    declined_guests: 0,
    pending_guests: 0,
    plus_ones: 0,
    capacity_percentage: 0,
    rsvp_rate: 0
  }
}

export async function getUserDashboard(): Promise<UserDashboard> {
  const { data, error } = await supabase
    .rpc('user_dashboard')

  if (error) throw error
  return data || {
    total_events: 0,
    published_events: 0,
    draft_events: 0,
    total_guests: 0,
    upcoming_events: []
  }
}

// Utility functions
function generateResponseToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}