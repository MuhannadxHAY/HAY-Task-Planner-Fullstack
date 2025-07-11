import { useState, useEffect } from 'react';
import googleCalendarService from '../services/googleCalendar';

const CalendarIntegration = ({ onEventsUpdate }) => {
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, status: 'Checking...', message: '' });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    duration: 60
  });

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = async () => {
    setLoading(true);
    try {
      await googleCalendarService.initialize();
      updateConnectionStatus();
      
      if (googleCalendarService.isSignedIn) {
        await loadEvents();
      }
    } catch (error) {
      console.error('Failed to initialize calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConnectionStatus = () => {
    const status = googleCalendarService.getConnectionStatus();
    setConnectionStatus(status);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const success = await googleCalendarService.signIn();
      if (success) {
        updateConnectionStatus();
        await loadEvents();
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await googleCalendarService.signOut();
      updateConnectionStatus();
      setEvents([]);
      if (onEventsUpdate) onEventsUpdate([]);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const weekEvents = await googleCalendarService.getWeekEvents();
      const formattedEvents = weekEvents.map(event => googleCalendarService.formatEvent(event));
      setEvents(formattedEvents);
      if (onEventsUpdate) onEventsUpdate(formattedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
      const endDateTime = newEvent.endDate && newEvent.endTime 
        ? new Date(`${newEvent.endDate}T${newEvent.endTime}`)
        : new Date(startDateTime.getTime() + newEvent.duration * 60 * 1000);

      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString()
      };

      await googleCalendarService.createEvent(eventData);
      await loadEvents();
      setShowCreateEvent(false);
      setNewEvent({
        title: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        duration: 60
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOptimalMeetingTimes = async () => {
    setLoading(true);
    try {
      const suggestions = await googleCalendarService.findOptimalMeetingTime(60);
      if (suggestions && suggestions.length > 0) {
        alert(`Optimal meeting times:\n${suggestions.map(s => `${s.day} at ${s.time}`).join('\n')}`);
      } else {
        alert('No optimal meeting times found in the next week.');
      }
    } catch (error) {
      console.error('Failed to find optimal meeting times:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <h3 className="text-lg font-semibold text-gray-900">Google Calendar Integration</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            connectionStatus.connected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {connectionStatus.status}
          </div>
          
          {connectionStatus.connected ? (
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={loading || !googleCalendarService.CLIENT_ID}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Calendar'}
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-4">
        {connectionStatus.message}
        {connectionStatus.user && (
          <span className="ml-2 font-medium">({connectionStatus.user})</span>
        )}
      </div>

      {connectionStatus.connected && (
        <div className="space-y-4">
          <div className="flex space-x-3">
            <button
              onClick={loadEvents}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh Events'}
            </button>
            
            <button
              onClick={() => setShowCreateEvent(true)}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              Create Event
            </button>
            
            <button
              onClick={getOptimalMeetingTimes}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              Find Meeting Times
            </button>
          </div>

          {events.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">This Week's Events ({events.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events.map((event, index) => (
                  <div key={event.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        {event.isAllDay ? 'All day' : `${event.startTime} - ${event.endTime}`}
                      </div>
                      {event.description && (
                        <div className="text-sm text-gray-500 mt-1">{event.description}</div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      event.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!connectionStatus.connected && !googleCalendarService.CLIENT_ID && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Setup Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>To enable Google Calendar integration, you need to:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Set up Google Cloud Console project</li>
                  <li>Enable Calendar API</li>
                  <li>Create OAuth credentials</li>
                  <li>Add environment variables to your deployment</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Calendar Event</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <select
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowCreateEvent(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarIntegration;

