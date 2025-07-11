import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI (API key should be set in environment variables)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || 'demo-mode');

// HAY-specific context for the AI coach
const HAY_CONTEXT = `
You are a productivity coach for a Marketing Director at HAY Soft Developments. 
HAY designs, builds and operates neighborhoods with both hard aspects (mortar and bricks) 
and soft elements (human-centric networking, communication and experience).

Current priority projects:
1. Sales office customer journey (Due: 2 weeks, Critical)
2. August digital campaign (Due: Aug 1-2, Critical) 
3. November event planning (Due: ASAP, Urgent)
4. Cinematic video production (Due: End of month, Important)
5. Focus groups preparation (Due: July-August, Important)
6. Social media activation (Ongoing, Strategic)
7. Website enhancements (TBD, Maintenance)

Your role is to:
- Help prioritize tasks based on deadlines and business impact
- Suggest optimal time-blocking and scheduling
- Break down complex projects into manageable steps
- Provide HAY-specific marketing insights
- Recommend productivity strategies for a marketing director
- Help with meeting scheduling and workday optimization

Always be concise, actionable, and specific to the user's role and current projects.
`;

export const generateCoachingResponse = async (userMessage, taskContext = []) => {
  try {
    // Check if API key is available
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return simulateAIResponse(userMessage, taskContext);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Build context with current tasks
    const taskContextString = taskContext.length > 0 
      ? `\n\nCurrent tasks: ${taskContext.map(task => 
          `${task.title} (${task.priority}, Due: ${task.deadline})`
        ).join(', ')}`
      : '';
    
    const prompt = `${HAY_CONTEXT}${taskContextString}\n\nUser question: ${userMessage}\n\nProvide a helpful, specific response:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI error:', error);
    return simulateAIResponse(userMessage, taskContext);
  }
};

// Fallback simulation for when API key is not available
const simulateAIResponse = (userMessage, taskContext = []) => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('prioritize') || msg.includes('priority')) {
    return `📋 **Task Prioritization for Today:**

Based on your HAY projects and deadlines:

1. **August digital campaign** (Critical, Due Aug 1-2) - Start immediately
2. **November event planning** (Urgent, Due ASAP) - Schedule 2-hour block today
3. **Sales office customer journey** (Critical, 2 weeks) - Begin research phase
4. **Focus groups preparation** (Important) - Can wait until next week

**Recommendation:** Block 3 hours this morning for the August campaign, then 2 hours this afternoon for November event planning.`;
  } else if (msg.includes('schedule') || msg.includes('time') || msg.includes('calendar')) {
    return `⏰ **Schedule Optimization:**

**Optimal time blocks for today:**
- **9:00-12:00 AM:** Deep work on August campaign (high energy)
- **1:00-2:00 PM:** Meetings and collaboration
- **2:00-4:00 PM:** November event planning (post-lunch focus)
- **4:00-5:00 PM:** Email and admin tasks

**Pro tip:** Your most creative work happens in the morning - perfect for campaign development!`;
  } else if (msg.includes('break') || msg.includes('breakdown')) {
    return `🔧 **Task Breakdown Assistance:**

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

Would you like me to break down any specific project further?`;
  } else if (msg.includes('meeting') || msg.includes('schedule meeting')) {
    return `📅 **Meeting Scheduling Suggestions:**

**Best times for meetings this week:**
- **Tuesday 10:00 AM:** Strategy sessions (high energy)
- **Wednesday 2:00 PM:** Client meetings (post-lunch alertness)
- **Thursday 11:00 AM:** Team collaborations (mid-week momentum)

**For HAY projects:**
- Creative sessions: Morning (9-11 AM)
- Stakeholder updates: Afternoon (2-4 PM)
- Planning meetings: Mid-morning (10-12 PM)

What type of meeting would you like to schedule?`;
  } else {
    return `I'm here to help you optimize your productivity as HAY's Marketing Director! I can assist with:

🎯 **Task prioritization** - "Help me prioritize my tasks"
⏰ **Schedule optimization** - "Optimize my workday"
🔧 **Project breakdown** - "Break down the August campaign"
📅 **Meeting scheduling** - "When should I schedule the team meeting?"
📊 **Progress tracking** - "How am I doing on my deadlines?"

What would you like help with today?`;
  }
};

export const prioritizeTasks = async (tasks) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return simulateTaskPrioritization(tasks);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const taskList = tasks.map(task => 
      `${task.title} (Priority: ${task.priority}, Due: ${task.deadline}, Estimated: ${task.estimatedHours}h)`
    ).join('\n');
    
    const prompt = `${HAY_CONTEXT}\n\nCurrent tasks:\n${taskList}\n\nBased on the deadlines, business impact, and HAY's priorities, suggest the optimal order to work on these tasks today. Provide a numbered list with brief reasoning for each.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Task prioritization error:', error);
    return simulateTaskPrioritization(tasks);
  }
};

const simulateTaskPrioritization = (tasks) => {
  const criticalTasks = tasks.filter(t => t.priority === 'critical');
  const urgentTasks = tasks.filter(t => t.priority === 'urgent');
  
  return `📋 **Recommended Task Order:**

1. **${criticalTasks[0]?.title || 'August digital campaign'}** - Critical deadline approaching
2. **${urgentTasks[0]?.title || 'November event planning'}** - Urgent, needs immediate attention
3. **${criticalTasks[1]?.title || 'Sales office customer journey'}** - Critical but longer timeline
4. **Focus groups preparation** - Important but flexible timing

**Focus on the top 2 tasks today for maximum impact!**`;
};

export const suggestTimeBlocking = async (tasks, calendarEvents = []) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return simulateTimeBlocking(tasks, calendarEvents);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const taskList = tasks.map(task => 
      `${task.title} (${task.estimatedHours}h, ${task.priority})`
    ).join('\n');
    
    const eventList = calendarEvents.map(event => 
      `${event.title} (${event.start} - ${event.end})`
    ).join('\n');
    
    const prompt = `${HAY_CONTEXT}\n\nTasks to schedule:\n${taskList}\n\nExisting calendar events:\n${eventList}\n\nSuggest an optimal time-blocking schedule for today, considering energy levels, meeting times, and task complexity. Provide specific time slots.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Time blocking error:', error);
    return simulateTimeBlocking(tasks, calendarEvents);
  }
};

const simulateTimeBlocking = (tasks, calendarEvents) => {
  return `⏰ **Optimized Schedule for Today:**

**Morning (High Energy):**
- 9:00-11:00 AM: August campaign development (2h)
- 11:00-11:15 AM: Break

**Mid-Morning:**
- 11:15 AM-12:30 PM: November event planning (1.25h)
- 12:30-1:30 PM: Lunch break

**Afternoon:**
- 1:30-2:30 PM: Scheduled meetings
- 2:30-4:00 PM: Sales office journey research (1.5h)
- 4:00-5:00 PM: Email and admin tasks

**Total focused work: 4.75 hours**`;
};

export const breakdownTask = async (taskTitle, taskDescription = '') => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return simulateTaskBreakdown(taskTitle, taskDescription);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${HAY_CONTEXT}\n\nTask to break down: ${taskTitle}\nDescription: ${taskDescription}\n\nBreak this task into 3-5 specific, actionable subtasks that a Marketing Director at HAY could complete. Make them concrete and measurable.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Task breakdown error:', error);
    return simulateTaskBreakdown(taskTitle, taskDescription);
  }
};

const simulateTaskBreakdown = (taskTitle, taskDescription) => {
  return `🔧 **Breaking down: ${taskTitle}**

**Actionable subtasks:**
1. **Research and analysis** (2h) - Gather requirements and competitive insights
2. **Strategy development** (2h) - Define approach and key messaging
3. **Content creation** (3h) - Develop materials and assets
4. **Implementation planning** (1h) - Create timeline and resource allocation
5. **Review and refinement** (1h) - Quality check and stakeholder feedback

**Total estimated time: 9 hours**
**Recommended: Spread across 3-4 days for optimal quality**`;
};

export const suggestMeetingTime = async (meetingPurpose, duration, attendees = []) => {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return simulateMeetingSuggestion(meetingPurpose, duration, attendees);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${HAY_CONTEXT}\n\nMeeting purpose: ${meetingPurpose}\nDuration: ${duration}\nAttendees: ${attendees.join(', ')}\n\nSuggest the optimal time of day for this meeting, considering productivity patterns, meeting effectiveness, and HAY's business context. Also suggest agenda items.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Meeting suggestion error:', error);
    return simulateMeetingSuggestion(meetingPurpose, duration, attendees);
  }
};

const simulateMeetingSuggestion = (meetingPurpose, duration, attendees) => {
  return `📅 **Meeting Optimization:**

**Recommended time:** Tuesday or Wednesday, 10:00-11:00 AM
**Why:** High energy, mid-week momentum, good for decision-making

**Suggested agenda:**
1. **Opening** (5 min) - Purpose and objectives
2. **Main discussion** (40 min) - Core topics and decisions
3. **Action items** (10 min) - Next steps and ownership
4. **Wrap-up** (5 min) - Summary and follow-up

**Pro tip:** Send agenda 24h in advance for better preparation!`;
};

export default {
  generateCoachingResponse,
  prioritizeTasks,
  suggestTimeBlocking,
  breakdownTask,
  suggestMeetingTime
};

