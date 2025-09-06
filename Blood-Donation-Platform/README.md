# BloodConnect - Blood Donation Platform

A comprehensive blood donation management platform built with Next.js, featuring AI-powered health assistance, emergency response systems, and donor management tools.

## 🩸 Features

### Core Functionality
- **Blood Inventory Management**: Real-time tracking of blood units by type
- **Donor Registration & Management**: Complete donor profile system
- **Emergency Response System**: Quick blood request and matching
- **Transport Coordination**: Logistics for blood delivery
- **AI Health Assistant**: Groq-powered chatbot for health guidance
- **Educational Quiz System**: Interactive blood donation knowledge tests

### AI-Powered Features
- **BloodBot**: Intelligent health assistant with medical knowledge
- **Smart Matching**: AI-driven donor-recipient matching
- **Emergency Alerts**: Automated notifications for urgent requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key for AI functionality

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd blooddonationplatform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   \`\`\`env
   GROQ_API_KEY=your_groq_api_key_here
   JWT_SECRET=your_jwt_secret_here
   PORT=3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

\`\`\`
blooddonationplatform/
├── app/
│   ├── api/
│   │   ├── chat/          # AI chatbot endpoints
│   │   └── quiz/          # Quiz system APIs
│   ├── globals.css        # Global styles with medical theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/
│   ├── ui/                # Reusable UI components
│   └── theme-provider.tsx # Theme management
├── hooks/                 # Custom React hooks
├── lib/
│   └── utils.ts          # Utility functions
└── scripts/              # Backend scripts and utilities
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Medical Red (`#b71c1c`) - Emergency and primary actions
- **Secondary**: Bright Yellow (`#ffeb3b`) - Alerts and notifications
- **Background**: Clean whites and light grays
- **Text**: High contrast dark grays for accessibility

### Typography
- **Primary Font**: Geist Sans - Modern, clean readability
- **Monospace**: Geist Mono - Code and data display

## 🤖 AI Features

### BloodBot Health Assistant
- **Powered by**: Groq AI with Llama models
- **Capabilities**: 
  - Blood donation guidance
  - Health tips and advice
  - Emergency response information
  - General medical knowledge
- **Features**:
  - Real-time chat interface
  - Context-aware responses
  - Medical terminology understanding
  - Multi-language support

### Usage Example
\`\`\`javascript
// The AI assistant is accessible via the floating chat button
// It provides intelligent responses to health-related queries
\`\`\`

## 📊 Key Components

### Dashboard
- Blood inventory overview
- Recent donations tracking
- Emergency alerts
- Quick action buttons

### Emergency System
- Urgent blood request forms
- Automatic donor matching
- Real-time response tracking
- Contact management

### Transport Module
- Delivery scheduling
- Route optimization
- Status tracking
- Driver coordination

### Quiz System
- Educational content
- Progress tracking
- Badge rewards
- Knowledge assessment

## 🔧 API Endpoints

### Chat API
\`\`\`
POST /api/chat
- Handles AI chatbot conversations
- Requires: { message: string, history?: Array }
- Returns: AI-generated health guidance
\`\`\`

### Quiz API
\`\`\`
GET /api/quiz/questions
- Fetches quiz questions by difficulty
- Query params: ?difficulty=easy|medium|hard

POST /api/quiz/submit
- Submits quiz answers for scoring
- Body: { answers: Array, difficulty: string }
\`\`\`

## 🛠️ Technologies Used

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 with custom medical theme
- **UI Components**: shadcn/ui component library
- **AI Integration**: Groq API with Llama models
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono
- **Analytics**: Vercel Analytics

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
\`\`\`env
GROQ_API_KEY=your_production_groq_key
JWT_SECRET=your_production_jwt_secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced AI matching algorithms
- [ ] Integration with hospital systems
- [ ] Real-time GPS tracking
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Blockchain integration for transparency

---

**BloodConnect** - Saving lives through technology and community. 🩸❤️
\`\`\`

```tsx file="" isHidden

