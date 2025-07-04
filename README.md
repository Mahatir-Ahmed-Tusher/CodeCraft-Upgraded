# CodeCraft - AI-Powered Code Generation Platform

![CodeCraft Banner](https://github.com/user-attachments/assets/f19e68dc-3717-4343-8c56-a056bfa2f819)

A Next.js application that generates functional React applications from natural language prompts using multiple AI models. Check out the demo: https://codecraft-io.vercel.app/

## ✨ Features

- **Multi-Model AI Support**: Choose from Gemini, Llama, DeepSeek, and Mistral models
- **Real-time Code Generation**: Watch your app being built in real-time
- **Live Preview**: Instant preview with hot reloading
- **Open in New Tab**: Full-screen preview for better testing and debugging
- **Image Analysis**: Upload images to generate code based on visual designs
- **Prompt Enhancement**: AI-assisted prompt refinement for better results
- **Project Management**: Save, organize, and manage your generated projects
- **Multi-language Support**: English and Bengali language support
- **Dark/Light Mode**: Theme toggle for comfortable viewing
- **Responsive Design**: Works seamlessly on all device sizes
- **One-Click Deployment**: Direct deployment to Vercel
- **Download as ZIP**: Export your projects as complete React applications

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & APIs
- **Next.js API Routes** - Serverless API endpoints
- **Google Gemini AI** - Primary AI model for code generation
- **Groq (Llama)** - High-performance inference
- **OpenRouter (DeepSeek)** - Advanced reasoning model
- **Mistral AI** - Efficient general-purpose model
- **Together AI** - Image analysis capabilities

### Development & Preview
- **Sandpack** - In-browser code editor and preview
- **Babel Standalone** - Client-side code transformation
- **JSZip** - File compression for downloads
- **File Saver** - Client-side file downloads

## 🔑 Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI Model API Keys
GOOGLE_AI_API_KEY=your_google_ai_key_here
GROQ_API_KEY=your_groq_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
MISTRAL_API_KEY=your_mistral_key_here
TOGETHER_API_KEY=your_together_ai_key_here

# Deployment (Optional)
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation
```bash
git clone https://github.com/Mahatir-Ahmed-Tusher/CodeCraft-Upgraded.git
cd CodeCraft-Upgraded
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
CodeCraft-Upgraded/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main application routes
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── page.tsx              # Home page with code generation
│   ├── api/                      # API endpoints
│   │   ├── generateCode/         # Multi-model code generation
│   │   ├── enhancePrompt/        # AI prompt improvement
│   │   ├── analyzeImage/         # Image-to-code analysis
│   │   ├── deployToVercel/       # Vercel deployment
│   │   └── og/                   # Open Graph image generation
│   ├── help/                     # Help center pages
│   ├── projects/                 # Project management pages
│   ├── share/                    # Shared project pages
│   ├── globals.css               # Global styles and fonts
│   ├── layout.tsx                # Root HTML layout
│   └── robots.txt                # SEO robots file
├── components/                   # Reusable React components
│   ├── code-viewer.tsx           # Sandpack integration & preview
│   ├── AnimatedBackground.tsx    # Animated SVG background
│   ├── Header.tsx                # Navigation header
│   ├── Footer.tsx                # Footer with links
│   ├── Sidebar.tsx               # Settings and navigation sidebar
│   ├── ThemeProvider.tsx         # Dark/light theme context
│   ├── ThemeToggle.tsx           # Theme switch button
│   ├── loading-dots.tsx          # Loading animation
│   └── github-icon.tsx           # GitHub icon component
├── contexts/                     # React Context providers
│   └── AppContext.tsx            # Global app state management
├── hooks/                        # Custom React hooks
│   ├── use-scroll-to.ts          # Smooth scrolling utility
│   └── useDarkMode.tsx           # Dark mode hook
├── utils/                        # Utility functions
│   ├── shadcn.ts                 # ShadCN UI components
│   ├── shadcn-docs/              # Component documentation
│   ├── translations.ts           # Multi-language support
│   └── domain.ts                 # Domain configuration
├── public/                       # Static assets
│   ├── Aeonik/                   # Custom font files
│   ├── code.png                  # Logo and icons
│   ├── halo.png                  # Background images
│   └── favicon.ico               # Site favicon
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # Project documentation
```

## 🔧 Key Components

### Code Generation (`app/api/generateCode/route.ts`)
- Multi-provider AI integration (Gemini, Groq, OpenRouter, Mistral)
- Streaming responses for real-time code generation
- Error handling and fallback mechanisms
- Model-specific optimizations

### Code Viewer (`components/code-viewer.tsx`)
- Sandpack integration for live preview
- "Open in New Tab" functionality for full-screen testing
- Error boundary with auto-fix suggestions
- Retry mechanism for improved results

### App Context (`contexts/AppContext.tsx`)
- Global state management for projects, settings, and UI
- Local storage persistence
- Multi-language support
- Theme management

### Image Analysis (`app/api/analyzeImage/route.ts`)
- Together AI vision model integration
- Image-to-code generation
- UI/UX element recognition
- Design pattern analysis

## 🎯 Features Deep Dive

### Multi-Model AI Support
- **Gemini 2.0 Flash Exp**: Latest experimental model for complex applications
- **Gemini 1.5 Flash**: Fast and efficient for quick prototypes
- **Llama 3.3 70B**: High-performance open-source model via Groq
- **DeepSeek R1**: Advanced reasoning for problem-solving
- **Mistral Small**: Balanced performance for general use

### Open in New Tab Feature
- Creates standalone HTML with all dependencies
- Includes React, Babel, Tailwind CSS, and Lucide icons
- Proper code transformation for browser execution
- Memory-efficient blob URL management

### Project Management
- Auto-save generated projects
- Project history and versioning
- Search and filter capabilities
- Export as ZIP files

### Image-to-Code Generation
- Upload design mockups or screenshots
- AI analyzes UI elements and layout
- Generates corresponding React code
- Supports various image formats

## 🌐 Deployment

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMahatir-Ahmed-Tusher%2FCodeCraft-Upgraded)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Mahatir-Ahmed-Tusher/CodeCraft-Upgraded)

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `.next` folder to your hosting provider
3. Set environment variables in your hosting dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Add proper error handling
- Write descriptive commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Sandpack](https://sandpack.codesandbox.io/) - Code editor and preview
- [Google AI](https://ai.google.dev/) - Gemini models
- [Groq](https://groq.com/) - High-speed inference
- [OpenRouter](https://openrouter.ai/) - AI model routing
- [Mistral AI](https://mistral.ai/) - AI models
- [Together AI](https://together.ai/) - Image analysis

## 📞 Support

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/Mahatir-Ahmed-Tusher/CodeCraft-Upgraded/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Mahatir-Ahmed-Tusher/CodeCraft-Upgraded/discussions)

---

**Built with ❤️ by [Mahatir Ahmed Tusher](https://github.com/Mahatir-Ahmed-Tusher)**