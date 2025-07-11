import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  TrendingUp,
  MessageSquare,
  Settings,
  Edit,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Bot,
  CalendarDays,
  Users,
  Zap,
  ExternalLink
} from 'lucide-react'
import CalendarIntegration from './components/CalendarIntegration'
import geminiAI from './services/geminiAI'
import './App.css'

function App() {
  // State management
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [calendarEvents, setCalendarEvents] = useState([])
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Sales office customer journey',
      deadline: '2 weeks',
      estimatedHours: 8,
      priority: 'critical',
      status: 'active',
      description: 'Design and map the complete customer journey for the sales office experience',
      createdAt: new Date('2025-07-01')
    },
    {
      id: 2,
      title: 'August digital campaign',
      deadline: 'Aug 1-2',
      estimatedHours: 12,
      priority: 'critical',
      status: 'active',
      description: 'Launch comprehensive digital marketing campaign for August neighborhood showcase',
      createdAt: new Date('2025-07-05')
    },
    {
      id: 3,
      title: 'November event planning',
      deadline: 'Oct 15',
      estimatedHours: 15,
      priority: 'important',
      status: 'active',
      description: 'Plan and coordinate the November community engagement event',
      createdAt: new Date('2025-07-08')
    },
    {
      id: 4,
      title: 'Q3 marketing analysis',
      deadline: 'Sep 30',
      estimatedHours: 6,
      priority: 'strategic',
      status: 'active',
      description: 'Analyze Q3 marketing performance and prepare insights for Q4 planning',
      createdAt: new Date('2025-07-10')
    },
    {
      id: 5,
      title: 'Website enhancements',
      deadline: 'TBD',
      estimatedHours: 10,
      priority: 'maintenance',
      status: 'active',
      description: 'Implement user experience improvements and content updates',
      createdAt: new Date('2025-07-11')
    }
  ])

  // Calendar state
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [calendarView, setCalendarView] = useState('week') // week, month, day

  // Task management state
  const [showAddTask, setShowAddTask] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskFilter, setTaskFilter] = useState('all')
  const [taskSearch, setTaskSearch] = useState('')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    estimatedHours: 1,
    priority: 'important'
  })

  // AI Coaching state
  const [showCoachChat, setShowCoachChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'ai',
      message: "👋 Hello! I'm your AI productivity coach. I understand your role as Marketing Director at HAY and your current projects. How can I help you optimize your productivity today?",
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAIResponding, setIsAIResponding] = useState(false)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Handle calendar events update
  const handleCalendarEventsUpdate = (events) => {
    setCalendarEvents(events)
  }

  // Get AI connection status
  const getAIConnectionStatus = () => {
    const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY
    const hasGoogleCreds = import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_API_KEY
    
    if (hasGeminiKey && hasGoogleCreds) {
      return { status: 'Fully Connected', color: 'bg-green-100 text-green-800' }
    } else if (hasGeminiKey) {
      return { status: 'Gemini AI Connected', color: 'bg-blue-100 text-blue-800' }
    } else if (hasGoogleCreds) {
      return { status: 'Calendar Connected', color: 'bg-purple-100 text-purple-800' }
    } else {
      return { status: 'Offline Mode', color: 'bg-orange-100 text-orange-800' }
    }
  }

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'urgent': return 'bg-orange-100 text-orange-800'
      case 'important': return 'bg-blue-100 text-blue-800'
      case 'strategic': return 'bg-purple-100 text-purple-800'
      case 'maintenance': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = taskFilter === 'all' || task.status === taskFilter || task.priority === taskFilter
    const matchesSearch = task.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
                         task.description.toLowerCase().includes(taskSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Add task
  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task = {
        id: Date.now(),
        ...newTask,
        status: 'active',
        createdAt: new Date()
      }
      setTasks([...tasks, task])
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        estimatedHours: 1,
        priority: 'important'
      })
      setShowAddTask(false)
      
      // Send AI feedback
      sendAIMessage(`I added a new task: "${task.title}". Can you help me prioritize this with my other HAY projects?`)
    }
  }

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      estimatedHours: task.estimatedHours,
      priority: task.priority
    })
    setShowAddTask(true)
  }

  // Update task
  const handleUpdateTask = () => {
    if (editingTask && newTask.title.trim()) {
      setTasks(tasks.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...newTask }
          : task
      ))
      setEditingTask(null)
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        estimatedHours: 1,
        priority: 'important'
      })
      setShowAddTask(false)
    }
  }

  // Archive task
  const handleArchiveTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'archived' }
        : task
    ))
  }

  // Complete task
  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedAt: new Date() }
        : task
    ))
  }

  // Delete task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  // Send AI message
  const sendAIMessage = async (message) => {
    if (!message.trim()) return

    const userMessage = {
      type: 'user',
      message: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsAIResponding(true)

    try {
      const response = await geminiAI.sendMessage(message, {
        role: 'Marketing Director at HAY',
        projects: tasks.filter(t => t.status === 'active'),
        calendarEvents: calendarEvents
      })

      const aiMessage = {
        type: 'ai',
        message: response,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI response error:', error)
      const errorMessage = {
        type: 'ai',
        message: "I'm having trouble connecting right now. Based on your HAY projects, I recommend focusing on the August digital campaign (Critical, Due Aug 1-2) as your top priority today. Would you like me to help you break this down into actionable steps?",
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsAIResponding(false)
    }
  }

  // Handle chat submit
  const handleChatSubmit = (e) => {
    e.preventDefault()
    sendAIMessage(chatInput)
  }

  // Get week days for calendar
  const getWeekDays = () => {
    const start = new Date(currentWeek)
    start.setDate(start.getDate() - start.getDay()) // Start from Sunday
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Get events for a specific day
  const getEventsForDay = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // Get today's schedule from calendar events
  const getTodaysSchedule = () => {
    const today = new Date()
    const todaysEvents = getEventsForDay(today)
    
    // Combine with some default HAY schedule items
    const defaultSchedule = [
      {
        id: 'default-1',
        title: 'JET Task List Session',
        startTime: '14:00',
        endTime: '15:00',
        status: 'current',
        type: 'work'
      },
      {
        id: 'default-2',
        title: 'August Campaign Brief',
        startTime: '15:00',
        endTime: '16:00',
        status: 'upcoming',
        type: 'meeting'
      }
    ]

    return [...todaysEvents, ...defaultSchedule].sort((a, b) => {
      const timeA = a.startTime || a.start
      const timeB = b.startTime || b.start
      return timeA.localeCompare(timeB)
    })
  }

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    critical: tasks.filter(t => t.priority === 'critical' && t.status === 'active').length,
    totalHours: tasks.filter(t => t.status === 'active').reduce((sum, task) => sum + task.estimatedHours, 0)
  }

  const connectionStatus = getAIConnectionStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HAY</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Productivity Dashboard</h1>
                <p className="text-sm text-gray-500">Enhanced with AI Coaching & Calendar Integration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${connectionStatus.color}`}>
                {connectionStatus.status}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-lg font-bold text-blue-600">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Target },
              { id: 'calendar', label: 'Calendar', icon: Calendar },
              { id: 'tasks', label: 'Tasks', icon: CheckCircle },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{taskStats.active}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Critical Items</p>
                      <p className="text-2xl font-bold text-red-600">{taskStats.critical}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Calendar Events</p>
                      <p className="text-2xl font-bold text-purple-600">{calendarEvents.length}</p>
                    </div>
                    <CalendarDays className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Est. Hours</p>
                      <p className="text-2xl font-bold text-green-600">{taskStats.totalHours}h</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Google Calendar Integration */}
            <CalendarIntegration onEventsUpdate={handleCalendarEventsUpdate} />

            {/* Priority Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Priority Tasks</span>
                </CardTitle>
                <Button 
                  onClick={() => setShowAddTask(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Priority Task
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTasks.filter(task => task.status === 'active').slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {task.deadline}</span>
                          <span>⏱️ {task.estimatedHours}h</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTask(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchiveTask(task.id)}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentView('tasks')}
                    className="flex-1"
                  >
                    View All Tasks
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => sendAIMessage("Help me prioritize my tasks for today")}
                    className="flex-1"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Prioritize
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => sendAIMessage("Optimize my schedule for maximum productivity")}
                    className="flex-1"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                  <Button 
                    onClick={() => setShowCoachChat(true)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Coach Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Productivity Coach */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <span>AI Productivity Coach</span>
                  {import.meta.env.VITE_GEMINI_API_KEY && (
                    <Badge className="bg-green-100 text-green-800">
                      <Zap className="w-3 h-3 mr-1" />
                      Gemini AI
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Focus Reminder:</strong> You have {taskStats.critical} critical deadlines this week. 
                      Consider time-blocking your calendar for deep work sessions.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Progress Update:</strong> Great job completing the Lemonade agency meeting! 
                      Next up: JET task list preparation.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      variant="outline"
                      onClick={() => sendAIMessage("Help me prioritize my tasks for today")}
                      className="flex-1"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Prioritize
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => sendAIMessage("Optimize my schedule for maximum productivity")}
                      className="flex-1"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                    <Button 
                      onClick={() => setShowCoachChat(true)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Coach Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Today's Schedule</span>
                </CardTitle>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentView('calendar')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Calendar
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getTodaysSchedule().map((event, index) => (
                    <div key={event.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-600">
                          {event.startTime} - {event.endTime || 'Ongoing'}
                        </div>
                      </div>
                      <Badge className={
                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                        event.status === 'current' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {event.status || 'upcoming'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newWeek = new Date(currentWeek)
                      newWeek.setDate(newWeek.getDate() - 7)
                      setCurrentWeek(newWeek)
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentWeek(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newWeek = new Date(currentWeek)
                      newWeek.setDate(newWeek.getDate() + 7)
                      setCurrentWeek(newWeek)
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {currentWeek.toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Select value={calendarView} onValueChange={setCalendarView}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Google Calendar Integration Panel */}
            <CalendarIntegration onEventsUpdate={handleCalendarEventsUpdate} />

            {/* Calendar Grid */}
            <Card>
              <CardContent className="p-0">
                <div className="grid grid-cols-8 border-b">
                  <div className="p-4 text-sm font-medium text-gray-500 border-r">Time</div>
                  {getWeekDays().map((day, index) => (
                    <div key={index} className="p-4 text-center border-r last:border-r-0">
                      <div className="text-sm font-medium text-gray-900">
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-bold mt-1 ${
                        day.toDateString() === new Date().toDateString() 
                          ? 'text-blue-600' 
                          : 'text-gray-700'
                      }`}>
                        {day.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                <div className="max-h-96 overflow-y-auto">
                  {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                    <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
                      <div className="p-3 text-sm text-gray-500 border-r">
                        {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                      </div>
                      {getWeekDays().map((day, dayIndex) => {
                        const dayEvents = getEventsForDay(day).filter(event => {
                          const eventHour = new Date(event.start).getHours()
                          return eventHour === hour
                        })
                        
                        return (
                          <div key={dayIndex} className="p-2 border-r last:border-r-0 min-h-[60px]">
                            {dayEvents.map((event, eventIndex) => (
                              <div
                                key={eventIndex}
                                className="bg-blue-100 text-blue-800 text-xs p-2 rounded mb-1 cursor-pointer hover:bg-blue-200"
                                title={event.description}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                <div className="text-xs opacity-75">
                                  {event.startTime} - {event.endTime}
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === 'tasks' && (
          <div className="space-y-6">
            {/* Tasks Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
              <Button 
                onClick={() => setShowAddTask(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {/* Task Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search tasks..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={taskFilter} onValueChange={setTaskFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                      <SelectItem value="critical">Critical Priority</SelectItem>
                      <SelectItem value="urgent">Urgent Priority</SelectItem>
                      <SelectItem value="important">Important Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={
                            task.status === 'completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {task.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Due: {task.deadline}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{task.estimatedHours} hours</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span>Created: {task.createdAt.toLocaleDateString()}</span>
                          </span>
                          {task.completedAt && (
                            <span className="flex items-center space-x-1">
                              <CheckCircle className="w-4 h-4" />
                              <span>Completed: {task.completedAt.toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {task.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task)}
                              title="Edit task"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCompleteTask(task.id)}
                              title="Mark as completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleArchiveTask(task.id)}
                              title="Archive task"
                            >
                              <Archive className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete task"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-gray-600 mb-4">
                    {taskSearch || taskFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by adding your first task.'
                    }
                  </p>
                  <Button 
                    onClick={() => setShowAddTask(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Task Completion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {Math.round((taskStats.completed / taskStats.total) * 100)}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {taskStats.completed} of {taskStats.total} tasks completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Priority Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['critical', 'urgent', 'important', 'strategic', 'maintenance'].map(priority => {
                      const count = tasks.filter(t => t.priority === priority && t.status === 'active').length
                      return (
                        <div key={priority} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{priority}</span>
                          <Badge className={getPriorityColor(priority)}>{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workload Estimation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {taskStats.totalHours}h
                  </div>
                  <p className="text-sm text-gray-600">
                    Estimated remaining work
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    ~{Math.ceil(taskStats.totalHours / 8)} working days
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calendar Integration Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Calendar Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">This Week's Events</h4>
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {calendarEvents.length}
                    </div>
                    <p className="text-sm text-gray-600">
                      Events synced from Google Calendar
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Integration Health</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gemini AI</span>
                        <Badge className={import.meta.env.VITE_GEMINI_API_KEY ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {import.meta.env.VITE_GEMINI_API_KEY ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Google Calendar</span>
                        <Badge className={(import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_API_KEY) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {(import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_API_KEY) ? 'Configured' : 'Not Configured'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Insights */}
            <Card>
              <CardHeader>
                <CardTitle>HAY Productivity Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Marketing Focus Areas</h4>
                    <p className="text-sm text-blue-800">
                      Your current workload shows strong focus on customer journey optimization and digital campaigns. 
                      Consider balancing hard infrastructure projects with soft community engagement initiatives.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Efficiency Recommendations</h4>
                    <p className="text-sm text-green-800">
                      With {taskStats.totalHours} hours of estimated work, consider time-blocking your calendar 
                      and using the AI coach for task prioritization and schedule optimization.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">Integration Benefits</h4>
                    <p className="text-sm text-purple-800">
                      Calendar integration allows for better time management and meeting scheduling. 
                      AI coaching provides context-aware productivity advice based on your HAY projects.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Add/Edit Task Modal */}
      {showAddTask && (
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                  </label>
                  <Input
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    placeholder="e.g., Next week, Aug 15"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Hours
                  </label>
                  <Input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value) || 1})}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="important">Important</SelectItem>
                    <SelectItem value="strategic">Strategic</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={editingTask ? handleUpdateTask : handleAddTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newTask.title.trim()}
                >
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddTask(false)
                    setEditingTask(null)
                    setNewTask({
                      title: '',
                      description: '',
                      deadline: '',
                      estimatedHours: 1,
                      priority: 'important'
                    })
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Coach Chat Modal */}
      {showCoachChat && (
        <Dialog open={showCoachChat} onOpenChange={setShowCoachChat}>
          <DialogContent className="sm:max-w-2xl sm:max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>AI Productivity Coach</span>
                {import.meta.env.VITE_GEMINI_API_KEY && (
                  <Badge className="bg-green-100 text-green-800">
                    <Zap className="w-3 h-3 mr-1" />
                    Gemini AI
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col h-96">
              {/* Quick Actions */}
              <div className="flex space-x-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendAIMessage("Help me prioritize my tasks for today")}
                  className="text-xs"
                >
                  <Target className="w-3 h-3 mr-1" />
                  Prioritize Tasks
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendAIMessage("Optimize my schedule for maximum productivity")}
                  className="text-xs"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Optimize Schedule
                </Button>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900 border'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      <p className="text-xs opacity-75 mt-1">
                        {message.timestamp.toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isAIResponding && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about priorities, scheduling, task breakdown, or more..."
                  className="flex-1"
                  disabled={isAIResponding}
                />
                <Button 
                  type="submit" 
                  disabled={!chatInput.trim() || isAIResponding}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default App

