// Google Calendar API Integration Service
// This service handles authentication and calendar operations

class GoogleCalendarService {
  constructor() {
    this.gapi = null;
    this.isSignedIn = false;
    this.currentUser = null;
    
    // Configuration - these will be set via environment variables
    this.CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.SCOPES = 'https://www.googleapis.com/auth/calendar';
  }

  // Initialize Google API
  async initialize() {
    try {
      if (!this.CLIENT_ID || !this.API_KEY) {
        console.warn('Google Calendar API credentials not configured');
        return false;
      }

      // Load Google API script
      await this.loadGoogleAPI();
      
      // Initialize gapi
      await this.gapi.load('auth2', () => {});
      await this.gapi.load('client', () => {});
      
      // Initialize the API client
      await this.gapi.client.init({
        apiKey: this.API_KEY,
        clientId: this.CLIENT_ID,
        discoveryDocs: [this.DISCOVERY_DOC],
        scope: this.SCOPES
      });

      // Listen for sign-in state changes
      const authInstance = this.gapi.auth2.getAuthInstance();
      this.isSignedIn = authInstance.isSignedIn.get();
      this.currentUser = authInstance.currentUser.get();

      authInstance.isSignedIn.listen((isSignedIn) => {
        this.isSignedIn = isSignedIn;
        this.currentUser = authInstance.currentUser.get();
      });

      console.log('Google Calendar API initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Google Calendar API:', error);
      return false;
    }
  }

  // Load Google API script dynamically
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Sign in to Google Calendar
  async signIn() {
    try {
      if (!this.gapi) {
        await this.initialize();
      }
      
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      this.isSignedIn = true;
      this.currentUser = authInstance.currentUser.get();
      return true;
    } catch (error) {
      console.error('Failed to sign in to Google Calendar:', error);
      return false;
    }
  }

  // Sign out from Google Calendar
  async signOut() {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      this.isSignedIn = false;
      this.currentUser = null;
      return true;
    } catch (error) {
      console.error('Failed to sign out from Google Calendar:', error);
      return false;
    }
  }

  // Get calendar events
  async getEvents(timeMin = null, timeMax = null, maxResults = 50) {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const now = new Date();
      const params = {
        calendarId: 'primary',
        timeMin: timeMin || now.toISOString(),
        timeMax: timeMax,
        showDeleted: false,
        singleEvents: true,
        maxResults: maxResults,
        orderBy: 'startTime'
      };

      const response = await this.gapi.client.calendar.events.list(params);
      return response.result.items || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      return [];
    }
  }

  // Get today's events
  async getTodaysEvents() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    return await this.getEvents(startOfDay.toISOString(), endOfDay.toISOString());
  }

  // Get this week's events
  async getWeekEvents() {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 7);
    
    return await this.getEvents(startOfWeek.toISOString(), endOfWeek.toISOString());
  }

  // Create a new calendar event
  async createEvent(eventData) {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        attendees: eventData.attendees || [],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw error;
    }
  }

  // Update an existing calendar event
  async updateEvent(eventId, eventData) {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const event = {
        summary: eventData.title,
        description: eventData.description || '',
        start: {
          dateTime: eventData.startTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: eventData.endTime,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const response = await this.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      throw error;
    }
  }

  // Delete a calendar event
  async deleteEvent(eventId) {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });

      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      throw error;
    }
  }

  // Get free/busy information
  async getFreeBusy(timeMin, timeMax, calendars = ['primary']) {
    try {
      if (!this.isSignedIn) {
        throw new Error('Not signed in to Google Calendar');
      }

      const response = await this.gapi.client.calendar.freebusy.query({
        resource: {
          timeMin: timeMin,
          timeMax: timeMax,
          items: calendars.map(id => ({ id }))
        }
      });

      return response.result;
    } catch (error) {
      console.error('Failed to get free/busy information:', error);
      return null;
    }
  }

  // Find optimal meeting time
  async findOptimalMeetingTime(duration = 60, workingHours = { start: 9, end: 17 }) {
    try {
      const today = new Date();
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      const freeBusy = await this.getFreeBusy(tomorrow.toISOString(), endOfWeek.toISOString());
      
      if (!freeBusy) return null;

      // Simple algorithm to find free slots
      const busyTimes = freeBusy.calendars.primary?.busy || [];
      const suggestions = [];

      for (let day = 1; day <= 7; day++) {
        const checkDate = new Date(today.getTime() + day * 24 * 60 * 60 * 1000);
        
        for (let hour = workingHours.start; hour <= workingHours.end - (duration / 60); hour++) {
          const startTime = new Date(checkDate);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
          
          // Check if this slot conflicts with busy times
          const isConflict = busyTimes.some(busy => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return (startTime < busyEnd && endTime > busyStart);
          });

          if (!isConflict) {
            suggestions.push({
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              day: checkDate.toLocaleDateString('en-US', { weekday: 'long' }),
              time: startTime.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
              })
            });
          }
        }
      }

      return suggestions.slice(0, 5); // Return top 5 suggestions
    } catch (error) {
      console.error('Failed to find optimal meeting time:', error);
      return [];
    }
  }

  // Get connection status
  getConnectionStatus() {
    if (!this.CLIENT_ID || !this.API_KEY) {
      return { connected: false, status: 'Not Configured', message: 'API credentials not set' };
    }
    
    if (!this.gapi) {
      return { connected: false, status: 'Not Initialized', message: 'Google API not loaded' };
    }
    
    if (!this.isSignedIn) {
      return { connected: false, status: 'Not Signed In', message: 'Please sign in to Google Calendar' };
    }
    
    return { 
      connected: true, 
      status: 'Connected', 
      message: 'Google Calendar connected',
      user: this.currentUser?.getBasicProfile()?.getName() || 'Unknown'
    };
  }

  // Format event for display
  formatEvent(event) {
    const start = event.start?.dateTime || event.start?.date;
    const end = event.end?.dateTime || event.end?.date;
    
    return {
      id: event.id,
      title: event.summary || 'Untitled Event',
      description: event.description || '',
      start: start,
      end: end,
      startTime: start ? new Date(start).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }) : '',
      endTime: end ? new Date(end).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }) : '',
      isAllDay: !event.start?.dateTime,
      location: event.location || '',
      attendees: event.attendees || [],
      status: event.status || 'confirmed',
      htmlLink: event.htmlLink
    };
  }
}

// Create and export a singleton instance
const googleCalendarService = new GoogleCalendarService();
export default googleCalendarService;

