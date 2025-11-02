# API Documentation

## Overview

Gatherfy AI provides a comprehensive API for event management, guest handling, and user authentication. The API is built on top of Supabase and follows RESTful conventions.

## Base URL

```
https://your-project.supabase.co/rest/v1
```

## Authentication

### API Key Authentication

All API requests must include the API key in the headers:

```http
apikey: YOUR_SUPABASE_ANON_KEY
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

### User Authentication

For authenticated routes, use the user's JWT token:

```http
Authorization: Bearer USER_JWT_TOKEN
```

## Data Models

### Event

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 8601 format
  time: string; // HH:mm format
  location: string;
  category: string;
  cover_image?: string;
  capacity?: number;
  created_by: string; // User ID
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
  status: 'draft' | 'published' | 'cancelled';
  settings: EventSettings;
}
```

### Event Settings

```typescript
interface EventSettings {
  allow_guest_plus_one: boolean;
  require_approval: boolean;
  send_reminders: boolean;
  public_visibility: boolean;
  custom_fields?: CustomField[];
}
```

### Guest

```typescript
interface Guest {
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
  responded_at?: string; // ISO 8601 format
  created_at: string; // ISO 8601 format
}
```

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar_url?: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}
```

## Endpoints

### Authentication

#### Sign Up

```http
POST /auth/v1/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "data": {
    "name": "John Doe",
    "role": "user"
  }
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 3600
  }
}
```

#### Sign In

```http
POST /auth/v1/token?grant_type=password
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  }
}
```

#### Sign Out

```http
POST /auth/v1/logout
Authorization: Bearer USER_JWT_TOKEN
```

### Events

#### Get All Events

```http
GET /events?select=*
```

**Query Parameters:**
- `status` (optional): Filter by status (`draft`, `published`, `cancelled`)
- `created_by` (optional): Filter by creator ID
- `category` (optional): Filter by category
- `limit` (optional): Number of results to return
- `offset` (optional): Number of results to skip
- `order` (optional): Sort order (`created_at.desc`, `title.asc`, etc.)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "date": "2024-06-15",
    "time": "09:00",
    "location": "San Francisco Convention Center",
    "category": "Technology",
    "status": "published",
    "created_by": "user_uuid",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

#### Get Single Event

```http
GET /events/{id}?select=*,guests(*)
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Tech Conference 2024",
  "description": "Annual technology conference",
  "date": "2024-06-15",
  "time": "09:00",
  "location": "San Francisco Convention Center",
  "category": "Technology",
  "status": "published",
  "created_by": "user_uuid",
  "created_at": "2024-01-15T10:00:00Z",
  "guests": [
    {
      "id": "guest_uuid",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "confirmed"
    }
  ]
}
```

#### Create Event

```http
POST /events
Authorization: Bearer USER_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "date": "2024-06-15",
  "time": "18:00",
  "location": "Event Venue",
  "category": "Networking",
  "capacity": 100,
  "status": "draft",
  "settings": {
    "allow_guest_plus_one": true,
    "require_approval": false,
    "send_reminders": true,
    "public_visibility": false
  }
}
```

**Response:**
```json
{
  "id": "new_uuid",
  "title": "New Event",
  "description": "Event description",
  "date": "2024-06-15",
  "time": "18:00",
  "location": "Event Venue",
  "category": "Networking",
  "capacity": 100,
  "status": "draft",
  "created_by": "user_uuid",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Update Event

```http
PATCH /events/{id}
Authorization: Bearer USER_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Updated Event Title",
  "status": "published"
}
```

#### Delete Event

```http
DELETE /events/{id}
Authorization: Bearer USER_JWT_TOKEN
```

### Guests

#### Get Event Guests

```http
GET /guests?event_id=eq.{event_id}&select=*
```

**Query Parameters:**
- `status` (optional): Filter by RSVP status
- `search` (optional): Search by name or email

**Response:**
```json
[
  {
    "id": "guest_uuid",
    "event_id": "event_uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "pending",
    "created_at": "2024-01-15T10:00:00Z"
  }
]
```

#### Add Guest to Event

```http
POST /guests
Authorization: Bearer USER_JWT_TOKEN
```

**Request Body:**
```json
{
  "event_id": "event_uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "dietary_restrictions": "Vegetarian"
}
```

**Response:**
```json
{
  "id": "new_guest_uuid",
  "event_id": "event_uuid",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Tech Corp",
  "dietary_restrictions": "Vegetarian",
  "status": "pending",
  "response_token": "unique_token",
  "created_at": "2024-01-15T10:00:00Z"
}
```

#### Update Guest RSVP

```http
PATCH /guests/{id}
```

**Request Body:**
```json
{
  "status": "confirmed",
  "plus_one": true,
  "plus_one_name": "Guest Name",
  "dietary_restrictions": "Gluten-free"
}
```

#### Remove Guest

```http
DELETE /guests/{id}
Authorization: Bearer USER_JWT_TOKEN
```

### Bulk Operations

#### Bulk Import Guests

```http
POST /rpc/bulk_import_guests
Authorization: Bearer USER_JWT_TOKEN
```

**Request Body:**
```json
{
  "event_id": "event_uuid",
  "guests": [
    {
      "name": "Guest 1",
      "email": "guest1@example.com",
      "company": "Company A"
    },
    {
      "name": "Guest 2",
      "email": "guest2@example.com",
      "company": "Company B"
    }
  ]
}
```

**Response:**
```json
{
  "imported": 2,
  "failed": 0,
  "errors": []
}
```

#### Bulk Update Guest Status

```http
POST /rpc/bulk_update_guest_status
Authorization: Bearer USER_JWT_TOKEN
```

**Request Body:**
```json
{
  "guest_ids": ["uuid1", "uuid2", "uuid3"],
  "status": "confirmed"
}
```

### Analytics

#### Get Event Statistics

```http
GET /rpc/event_statistics
Authorization: Bearer USER_JWT_TOKEN
```

**Query Parameters:**
- `event_id` (required): Event UUID

**Response:**
```json
{
  "total_guests": 150,
  "confirmed_guests": 120,
  "declined_guests": 10,
  "pending_guests": 20,
  "plus_ones": 15,
  "capacity_percentage": 90,
  "rsvp_rate": 80
}
```

#### Get User Dashboard Data

```http
GET /rpc/user_dashboard
Authorization: Bearer USER_JWT_TOKEN
```

**Response:**
```json
{
  "total_events": 5,
  "published_events": 3,
  "draft_events": 2,
  "total_guests": 500,
  "upcoming_events": [
    {
      "id": "uuid",
      "title": "Event Title",
      "date": "2024-06-15",
      "guest_count": 50
    }
  ]
}
```

### Search

#### Search Events

```http
GET /events?or=(title.ilike.*{query}*,description.ilike.*{query}*)
```

**Query Parameters:**
- `query` (required): Search term
- `category` (optional): Filter by category
- `status` (optional): Filter by status

#### Search Guests

```http
GET /guests?or=(name.ilike.*{query}*,email.ilike.*{query}*,company.ilike.*{query}*)
```

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `PGRST116` | Resource not found |
| `PGRST301` | Relation does not exist |
| `PGRST302` | Column does not exist |
| `23505` | Unique constraint violation |
| `23503` | Foreign key constraint violation |
| `42501` | Insufficient privileges |
| `28P01` | Invalid authentication credentials |

### Rate Limiting

- **Anonymous requests**: 100 requests per hour
- **Authenticated requests**: 1000 requests per hour
- **Premium users**: 5000 requests per hour

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Configure Webhooks

Webhooks can be configured in the Supabase dashboard or via API.

### Event Types

- `guest.rsvp_updated`: When a guest updates their RSVP
- `event.created`: When a new event is created
- `event.published`: When an event is published
- `event.cancelled`: When an event is cancelled

### Webhook Payload Example

```json
{
  "type": "guest.rsvp_updated",
  "data": {
    "guest": {
      "id": "guest_uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "confirmed"
    },
    "event": {
      "id": "event_uuid",
      "title": "Event Title"
    }
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## SDKs

### JavaScript/TypeScript

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Example usage
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('status', 'published')
```

### Python

```bash
pip install supabase
```

```python
from supabase import create_client, Client

url: str = "your-supabase-url"
key: str = "your-supabase-key"
supabase: Client = create_client(url, key)

# Example usage
response = supabase.table('events').select("*").eq('status', 'published').execute()
```

## Best Practices

### 1. Authentication

- Always validate JWT tokens on the server-side
- Use row-level security (RLS) in Supabase
- Implement proper session management
- Use HTTPS for all API requests

### 2. Data Validation

- Validate input data before sending to API
- Use TypeScript interfaces for type safety
- Implement client-side and server-side validation

### 3. Error Handling

- Always check for errors in API responses
- Implement retry logic for network failures
- Provide meaningful error messages to users
- Log errors for debugging

### 4. Performance

- Use pagination for large datasets
- Implement caching for frequently accessed data
- Use select parameters to limit returned fields
- Optimize database queries

### 5. Security

- Never expose sensitive API keys
- Use environment variables for configuration
- Implement proper CORS settings
- Validate and sanitize all input data

## Support

For API support and questions:

- **Documentation**: [docs.gatherfy.ai](https://docs.gatherfy.ai)
- **API Reference**: [api.gatherfy.ai](https://api.gatherfy.ai)
- **Support Email**: api-support@gatherfy.ai
- **GitHub Issues**: [github.com/yosrend/Gatherfy-AI/issues]