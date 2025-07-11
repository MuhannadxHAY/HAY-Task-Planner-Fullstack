# HAY Productivity Dashboard - Enhanced

A comprehensive productivity dashboard designed specifically for HAY Soft Developments Marketing Director, featuring Google Calendar-style interface, AI-powered coaching with Gemini AI, and advanced task management.

## 🎯 Features

### ✅ **Google Calendar-Style Interface**
- Professional week view with hourly time slots (8 AM - 8 PM)
- Day/Week/Month view switching
- Color-coded events and meetings
- Navigation controls (Previous/Next week, Today button)

### ✅ **Advanced Task Management**
- Create, edit, archive, and complete tasks
- Priority levels: Critical, Urgent, Important, Strategic, Maintenance
- Task filtering by status and priority
- Search functionality across tasks
- Estimated hours tracking
- Task completion analytics

### ✅ **AI Productivity Coaching (Gemini AI)**
- Context-aware responses based on HAY projects
- Task prioritization assistance
- Schedule optimization suggestions
- Project breakdown guidance
- Meeting scheduling recommendations
- HAY-specific business insights

### ✅ **Real-time Analytics**
- Task completion rates
- Priority breakdown visualization
- Workload estimation
- Progress tracking

### ✅ **Professional Design**
- HAY branding and color scheme
- Responsive design for all devices
- Modern UI with shadcn/ui components
- Intuitive navigation and user experience

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Google Gemini AI API key (optional, works in demo mode)
- Google Calendar API credentials (optional)

### Installation

1. **Clone or download the project**
2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

4. **Start development server:**
   ```bash
   pnpm run dev
   ```

5. **Open in browser:** http://localhost:5173

## 🔧 Configuration

### Gemini AI Setup (Optional)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a free API key
3. Add to `.env` file as `VITE_GEMINI_API_KEY`
4. Restart the development server

**Without API key:** Dashboard works in demo mode with simulated AI responses.

### Google Calendar Integration (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add credentials to `.env` file
6. Configure OAuth consent screen

## 📱 Usage

### Dashboard Views

#### **Dashboard Tab**
- Overview of today's priorities
- Quick access to top 3 critical tasks
- AI coaching panel with smart suggestions
- Today's schedule summary
- Project statistics

#### **Calendar Tab**
- Google Calendar-style week view
- Time slot visualization (8 AM - 8 PM)
- Event display with color coding
- Week navigation controls
- Day/Week/Month view options

#### **Tasks Tab**
- Complete task management interface
- Add, edit, archive, complete tasks
- Advanced filtering and search
- Priority and status management
- Bulk operations

#### **Analytics Tab**
- Task completion metrics
- Priority distribution charts
- Workload analysis
- Progress tracking

### AI Coaching Features

#### **Quick Actions**
- **Prioritize Tasks:** Get AI-powered task prioritization
- **Optimize Schedule:** Receive time-blocking suggestions
- **Break Down Projects:** Get step-by-step project guidance

#### **Chat Commands**
- "Help me prioritize my tasks for today"
- "Optimize my workday for maximum productivity"
- "Break down the August campaign project"
- "When should I schedule the team meeting?"
- "How am I doing on my deadlines?"

#### **HAY-Specific Insights**
The AI coach understands HAY's business context:
- Neighborhood development projects
- Marketing campaign strategies
- Community engagement approaches
- Hard and soft element balance

## 🎨 Customization

### HAY Branding
The dashboard is pre-configured with HAY's branding:
- Company colors and styling
- HAY-specific project templates
- Marketing director role context
- Neighborhood development focus

### Task Categories
Pre-configured priority levels:
- **Critical:** Immediate attention required
- **Urgent:** Time-sensitive tasks
- **Important:** High business impact
- **Strategic:** Long-term planning
- **Maintenance:** Routine operations

## 🔐 Security

### API Key Management
- Environment variables for secure key storage
- No API keys exposed in frontend code
- Graceful fallback when keys unavailable

### Data Privacy
- All data stored locally in browser
- No external data transmission (except API calls)
- User data remains private and secure

## 📊 Performance

### Optimizations
- Lazy loading for large task lists
- Efficient state management
- Responsive design for all devices
- Fast initial load times

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Development

### Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **UI Components:** shadcn/ui, Lucide icons
- **AI Integration:** Google Gemini AI
- **Calendar:** Google Calendar API
- **State Management:** React hooks
- **Styling:** Tailwind CSS with custom HAY theme

### Project Structure
```
src/
├── components/ui/     # shadcn/ui components
├── services/          # API services (Gemini AI, Calendar)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── assets/           # Static assets
├── App.jsx           # Main application component
└── main.jsx          # Application entry point
```

### Available Scripts
- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel auto-detects React/Vite configuration
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Other Platforms
- **Netlify:** Drag and drop `dist` folder
- **GitHub Pages:** Use `gh-pages` package
- **Firebase Hosting:** Use Firebase CLI

### Environment Variables for Production
```env
VITE_GEMINI_API_KEY=your_production_gemini_key
VITE_GOOGLE_CLIENT_ID=your_production_google_client_id
```

## 📋 Roadmap

### Upcoming Features
- [ ] Real-time Google Calendar synchronization
- [ ] Team collaboration features
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Slack integration
- [ ] Email notifications
- [ ] Custom dashboard themes

### HAY-Specific Enhancements
- [ ] Neighborhood project templates
- [ ] Community engagement tracking
- [ ] Marketing campaign analytics
- [ ] Stakeholder communication tools

## 🤝 Support

### Getting Help
1. Check the integration guides in the project
2. Review the troubleshooting section
3. Test API connections in demo mode first
4. Verify environment variables are set correctly

### Common Issues
- **AI not responding:** Check Gemini API key
- **Calendar not loading:** Verify Google Calendar credentials
- **Tasks not saving:** Check browser local storage
- **Styling issues:** Clear browser cache

## 📄 License

This project is designed specifically for HAY Soft Developments internal use.

## 🎯 HAY-Specific Context

This dashboard is tailored for HAY's unique business model:
- **Hard Elements:** Construction, infrastructure, physical development
- **Soft Elements:** Community building, human connections, experiences
- **Marketing Focus:** Neighborhood development, community engagement
- **Target Audience:** Families, professionals, community builders

The AI coach understands this context and provides relevant advice for marketing strategies, community engagement, and project management specific to HAY's neighborhood development approach.

