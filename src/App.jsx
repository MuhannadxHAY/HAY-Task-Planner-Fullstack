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
  Zap
} from 'lucide-react'
import './App.css'

function App() {
  // State management
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentTime, setCurrentTime] = useState(new Date())
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
      description: 'Launch comprehensive digital marketing campaign for August',
      createdAt: new Date('2025-07-05')
    },
    {
      id: 3,
      title: 'November event planning',
      deadline: 'ASAP',
      estimatedHours: 6,
      priority: 'urgent',
      status: 'active',
      description: 'Plan and coordinate the November community event',
      createdAt: new Date('2025-07-08')
    },
    {
      id: 4,
      title: 'Cinematic video production',
      deadline: 'End of month',
      estimatedHours: 10,
      priority: 'important',
      status: 'active',
      description: 'Produce high-quality cinematic video for HAY brand',
      createdAt: new Date('2025-07-03')
    },
    {
      id: 5,
      title: 'Focus groups preparation',
      deadline: 'July-August',
      estimatedHours: 4,
      priority: 'important',
      status: 'active',
      description: 'Prepare materials and logistics for focus group sessions',
      createdAt: new Date('2025-07-06')
    },
    {
      id: 6,
      title: 'Social media activation',
      deadline: 'Ongoing',
      estimatedHours: 2,
      priority: 'strategic',
      status: 'active',
      description: 'Continuous social media content creation and engagement',
      createdAt: new Date('2025-07-02')
    },
    {
      id: 7,
      title: 'Website enhancements',
      deadline: 'TBD',
      estimatedHours: 8,
      priority: 'maintenance',
      status: 'active',
      description: 'Improve website user experience and functionality',
      createdAt: new Date('2025-07-04')
    }
  ])

  // Calendar and coaching state
  const [calendarView, setCalendarView] = useState('week')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [coachingHistory, setCoachingHistory] = useState([
    {
      type: 'coach',
      message: '👋 Hello! I\'m your AI productivity coach. I understand your role as Marketing Director at HAY and your current projects. How can I help you optimize your productivity today?',
      timestamp: new Date()
    }
  ])
  const [coachingMessage, setCoachingMessage] = useState('')
  const [isGeminiConnected, setIsGeminiConnected] = useState(false)
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false)

  // Task management state
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [taskFilter, setTaskFilter] = useState({ status: 'all', priority: 'all' })
  const [searchTerm, setSearchTerm] = useState('')

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    priority: 'important',
    estimatedHours: 2,
    description: ''
  })

  // Calendar events
  const [calendarEvents] = useState([
    {
      id: 1,
      title: 'Lemonade Agency Meeting',
      start: '13:00',
      end: '14:00',
      date: '2025-07-11',
      status: 'completed',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'JET Task List Session',
      start: '14:00',
      end: '15:00',
      date: '2025-07-11',
      status: 'current',
      type: 'work'
    },
    {
      id: 3,
      title: 'August Campaign Brief',
      start: '15:00',
      end: '16:00',
      date: '2025-07-11',
      status: 'upcoming',
      type: 'meeting'
    }
  ])

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Priority colors
  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      urgent: 'bg-orange-100 text-orange-800 border-orange-200',
      important: 'bg-blue-100 text-blue-800 border-blue-200',
      strategic: 'bg-purple-100 text-purple-800 border-purple-200',
      maintenance: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[priority] || colors.important
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = taskFilter.status === 'all' || task.status === taskFilter.status
    const matchesPriority = taskFilter.priority === 'all' || task.priority === taskFilter.priority
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Add new task
  const addTask = () => {
    if (!newTask.title.trim()) return

    const task = {
      id: Date.now(),
      ...newTask,
      status: 'active',
      createdAt: new Date()
    }

    setTasks(prev => [...prev, task])
    setNewTask({ title: '', deadline: '', priority: 'important', estimatedHours: 2, description: '' })
    setShowAddTaskModal(false)

    // Add coaching response
    setCoachingHistory(prev => [...prev, {
      type: 'coach',
      message: `✅ Great! I've added "${task.title}" to your task list. Based on your current workload, I recommend prioritizing this ${task.priority} task ${task.priority === 'critical' ? 'immediately' : 'in your next planning session'}.`,
      timestamp: new Date()
    }])
  }

  // Edit task
  const editTask = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      deadline: task.deadline,
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      description: task.description
    })
    setShowAddTaskModal(true)
  }

  // Update task
  const updateTask = () => {
    if (!newTask.title.trim()) return

    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...newTask }
        : task
    ))

    setEditingTask(null)
    setNewTask({ title: '', deadline: '', priority: 'important', estimatedHours: 2, description: '' })
    setShowAddTaskModal(false)

    setCoachingHistory(prev => [...prev, {
      type: 'coach',
      message: `📝 Task updated successfully! The changes to "${newTask.title}" have been saved.`,
      timestamp: new Date()
    }])
  }

  // Archive task
  const archiveTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'archived' }
        : task
    ))

    setCoachingHistory(prev => [...prev, {
      type: 'coach',
      message: `📦 Task archived. Great job staying organized! This helps keep your active task list focused.`,
      timestamp: new Date()
    }])
  }

  // Complete task
  const completeTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', completedAt: new Date() }
        : task
    ))

    setCoachingHistory(prev => [...prev, {
      type: 'coach',
      message: `🎉 Excellent work! Task completed. You're making great progress on your HAY projects. Keep up the momentum!`,
      timestamp: new Date()
    }])
  }

  // Send coaching message
  const sendCoachingMessage = async () => {
    if (!coachingMessage.trim()) return

    // Add user message
    setCoachingHistory(prev => [...prev, {
      type: 'user',
      message: coachingMessage,
      timestamp: new Date()
    }])

    // Simulate AI response (in real implementation, this would call Gemini API)
    setTimeout(() => {
      let response = ''
      const msg = coachingMessage.toLowerCase()

      if (msg.includes('prioritize') || msg.includes('priority')) {
        response = `📋 **Task Prioritization for Today:**

Based on your HAY projects and deadlines:

1. **August digital campaign** (Critical, Due Aug 1-2) - Start immediately
2. **November event planning** (Urgent, Due ASAP) - Schedule 2-hour block today
3. **Sales office customer journey** (Critical, 2 weeks) - Begin research phase
4. **Focus groups preparation** (Important) - Can wait until next week

**Recommendation:** Block 3 hours this morning for the August campaign, then 2 hours this afternoon for November event planning.`
      } else if (msg.includes('schedule') || msg.includes('time') || msg.includes('calendar')) {
        response = `⏰ **Schedule Optimization:**

**Optimal time blocks for today:**
- **9:00-12:00 AM:** Deep work on August campaign (high energy)
- **1:00-2:00 PM:** Lemonade Agency Meeting (scheduled)
- **2:00-4:00 PM:** November event planning (post-lunch focus)
- **4:00-5:00 PM:** Email and admin tasks

**Pro tip:** Your most creative work happens in the morning - perfect for campaign development!`
      } else if (msg.includes('break') || msg.includes('breakdown')) {
        response = `🔧 **Task Breakdown Assistance:**

Let me help break down your complex projects:

**August Digital Campaign:**
1. Define target audience and messaging (2h)
2. Create content calendar and assets (4h)
3. Set up tracking and analytics (2h)
4. Launch and monitor performance (4h)

**Sales Office Journey:**
1. Research current customer touchpoints (3h)
2. Map pain points and opportunities (2h)
3. Design improved journey flow (3h)

Would you like me to break down any specific project further?`
      } else if (msg.includes('meeting') || msg.includes('schedule meeting')) {
        response = `📅 **Meeting Scheduling Suggestions:**

**Best times for meetings this week:**
- **Tuesday 10:00 AM:** Strategy sessions (high energy)
- **Wednesday 2:00 PM:** Client meetings (post-lunch alertness)
- **Thursday 11:00 AM:** Team collaborations (mid-week momentum)

**For HAY projects:**
- Creative sessions: Morning (9-11 AM)
- Stakeholder updates: Afternoon (2-4 PM)
- Planning meetings: Mid-morning (10-12 PM)

What type of meeting would you like to schedule?`
      } else {
        response = `I'm here to help you optimize your productivity as HAY's Marketing Director! I can assist with:

🎯 **Task prioritization** - "Help me prioritize my tasks"
⏰ **Schedule optimization** - "Optimize my workday"
🔧 **Project breakdown** - "Break down the August campaign"
📅 **Meeting scheduling** - "When should I schedule the team meeting?"
📊 **Progress tracking** - "How am I doing on my deadlines?"

What would you like help with today?`
      }

      setCoachingHistory(prev => [...prev, {
        type: 'coach',
        message: response,
        timestamp: new Date()
      }])

      setIsGeminiConnected(true)
    }, 1000)

    setCoachingMessage('')
  }

  // Generate week view for calendar
  const generateWeekView = () => {
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Time slots for calendar
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 8 // Start from 8 AM
    return `${hour.toString().padStart(2, '0')}:00`
  })

  const weekDays = generateWeekView()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">HAY</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Productivity Dashboard</h1>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isGeminiConnected ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <Bot className="w-3 h-3 mr-1" />
                    Gemini AI Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Offline Mode
                  </Badge>
                )}
                
                {isGoogleCalendarConnected ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    Calendar Synced
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-600 border-gray-200">
                    <Calendar className="w-3 h-3 mr-1" />
                    Calendar Offline
                  </Badge>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Current Time */}
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-lg font-semibold">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={currentView} onValueChange={setCurrentView}>
          {/* Dashboard View */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Priorities */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Today's Priorities
                    </CardTitle>
                    <Badge variant="outline">Top 3</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tasks.filter(t => t.status === 'active').slice(0, 3).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{task.title}</h3>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span>Due: {task.deadline}</span>
                            <span>{task.estimatedHours}h estimated</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => editTask(task)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={() => setShowAddTaskModal(true)} 
                      className="w-full"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Priority Task
                    </Button>
                  </CardContent>
                </Card>

                {/* All Projects Overview */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      All Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'active').length}</div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {tasks.filter(t => t.priority === 'critical' && t.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-500">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">Complete</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {tasks.filter(t => t.status === 'active').map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex-1">
                            <h4 className="font-medium">{task.title}</h4>
                            <div className="text-sm text-gray-500">{task.deadline}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Button size="sm" variant="ghost" onClick={() => completeTask(task.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => editTask(task)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => archiveTask(task.id)}>
                              <Archive className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      onClick={() => setCurrentView('tasks')} 
                      variant="outline" 
                      className="w-full mt-4"
                    >
                      View All Tasks
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* AI Productivity Coach */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2" />
                      AI Productivity Coach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Focus Reminder:</strong> You have 2 critical deadlines this week. Consider time-blocking your calendar for deep work sessions.</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm"><strong>Progress Update:</strong> Great job completing the Lemonade agency meeting! Next up: JET task list preparation.</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendCoachingMessage('prioritize my tasks')}
                        >
                          <Target className="w-4 h-4 mr-1" />
                          Prioritize
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => sendCoachingMessage('optimize my schedule')}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>

                      <Button 
                        onClick={() => setCurrentView('coaching')} 
                        className="w-full"
                        variant="outline"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Open Coach Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Schedule */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Today's Schedule
                    </CardTitle>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCurrentView('calendar')}
                    >
                      View Full Calendar
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {calendarEvents.map(event => (
                      <div key={event.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          event.status === 'completed' ? 'bg-green-500' :
                          event.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{event.start}</div>
                          <div className="text-sm text-gray-600">{event.title}</div>
                        </div>
                        <Badge variant="outline" className={
                          event.status === 'completed' ? 'text-green-600' :
                          event.status === 'current' ? 'text-blue-600' : 'text-gray-600'
                        }>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const newDate = new Date(selectedDate)
                      newDate.setDate(selectedDate.getDate() - 7)
                      setSelectedDate(newDate)
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const newDate = new Date(selectedDate)
                      newDate.setDate(selectedDate.getDate() + 7)
                      setSelectedDate(newDate)
                    }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <div className="flex">
                    <Button 
                      size="sm" 
                      variant={calendarView === 'day' ? 'default' : 'outline'}
                      onClick={() => setCalendarView('day')}
                    >
                      Day
                    </Button>
                    <Button 
                      size="sm" 
                      variant={calendarView === 'week' ? 'default' : 'outline'}
                      onClick={() => setCalendarView('week')}
                    >
                      Week
                    </Button>
                    <Button 
                      size="sm" 
                      variant={calendarView === 'month' ? 'default' : 'outline'}
                      onClick={() => setCalendarView('month')}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Google Calendar-style Week View */}
                <div className="border rounded-lg overflow-hidden">
                  {/* Header with days */}
                  <div className="grid grid-cols-8 border-b bg-gray-50">
                    <div className="p-3 text-sm font-medium text-gray-500">Time</div>
                    {weekDays.map((day, index) => (
                      <div key={index} className="p-3 text-center border-l">
                        <div className="text-sm text-gray-500">
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className={`text-lg font-semibold ${
                          day.toDateString() === new Date().toDateString() 
                            ? 'text-blue-600' 
                            : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="grid grid-cols-8 border-b">
                      <div className="p-3 text-sm text-gray-500 border-r bg-gray-50">
                        {time}
                      </div>
                      {weekDays.map((day, dayIndex) => (
                        <div key={dayIndex} className="p-2 border-l min-h-[60px] relative">
                          {/* Show events for today */}
                          {day.toDateString() === new Date().toDateString() && 
                           calendarEvents
                             .filter(event => event.start.startsWith(time.split(':')[0]))
                             .map(event => (
                               <div 
                                 key={event.id}
                                 className={`absolute inset-x-1 top-1 p-1 rounded text-xs ${
                                   event.type === 'meeting' 
                                     ? 'bg-blue-100 text-blue-800' 
                                     : 'bg-green-100 text-green-800'
                                 }`}
                               >
                                 {event.title}
                               </div>
                             ))
                          }
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks View */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Task Management</CardTitle>
                <Button onClick={() => setShowAddTaskModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={taskFilter.status} onValueChange={(value) => setTaskFilter(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={taskFilter.priority} onValueChange={(value) => setTaskFilter(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="important">Important</SelectItem>
                      <SelectItem value="strategic">Strategic</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{task.title}</h3>
                          <p className="text-gray-600 mt-1">{task.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Due: {task.deadline}</span>
                            <span>⏱️ {task.estimatedHours}h</span>
                            <span>Created: {task.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge variant="outline">
                            {task.status}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => completeTask(task.id)}>
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => editTask(task)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => archiveTask(task.id)}>
                            <Archive className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tasks.filter(t => t.status === 'completed').length} completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical Tasks</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {tasks.filter(t => t.priority === 'critical' && t.status === 'active').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Require immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Hours</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tasks.filter(t => t.status === 'active').reduce((sum, task) => sum + task.estimatedHours, 0)}h
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Remaining work
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Priority Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['critical', 'urgent', 'important', 'strategic', 'maintenance'].map(priority => {
                    const count = tasks.filter(t => t.priority === priority && t.status === 'active').length
                    const percentage = tasks.length > 0 ? (count / tasks.filter(t => t.status === 'active').length) * 100 : 0
                    
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(priority)}>
                            {priority}
                          </Badge>
                          <span className="text-sm">{count} tasks</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* AI Coaching Chat Modal */}
        <Dialog open={currentView === 'coaching'} onOpenChange={(open) => !open && setCurrentView('dashboard')}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2" />
                AI Productivity Coach
                {isGeminiConnected && (
                  <Badge variant="outline" className="ml-2 text-green-600 border-green-200">
                    <Zap className="w-3 h-3 mr-1" />
                    Gemini AI
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setCoachingMessage('Help me prioritize my tasks for today')
                    sendCoachingMessage()
                  }}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Prioritize Tasks
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setCoachingMessage('Optimize my schedule for maximum productivity')
                    sendCoachingMessage()
                  }}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Optimize Schedule
                </Button>
              </div>

              {/* Chat History */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                {coachingHistory.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.type === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={coachingMessage}
                  onChange={(e) => setCoachingMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendCoachingMessage()}
                  placeholder="Ask about priorities, scheduling, task breakdown, or meeting planning..."
                  className="flex-1"
                />
                <Button onClick={sendCoachingMessage}>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Task Modal */}
        <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Task Title</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  value={newTask.deadline}
                  onChange={(e) => setNewTask(prev => ({ ...prev, deadline: e.target.value }))}
                  placeholder="e.g., Next week, July 15, ASAP..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Priority Level</label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
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
              
              <div>
                <label className="text-sm font-medium">Estimated Hours</label>
                <Input
                  type="number"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                  placeholder="2"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowAddTaskModal(false)
                  setEditingTask(null)
                  setNewTask({ title: '', deadline: '', priority: 'important', estimatedHours: 2, description: '' })
                }}>
                  Cancel
                </Button>
                <Button onClick={editingTask ? updateTask : addTask}>
                  {editingTask ? 'Update Task' : 'Add Task'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

export default App

