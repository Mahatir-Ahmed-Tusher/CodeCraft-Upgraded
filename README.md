# CodeCraft - AI-Powered Code Generator

![CodeCraft Banner](public/halo.png)

A Next.js application that generates code from natural language prompts using AI.

## ✨ Features

- **AI-Powered Code Generation**: Convert natural language to functional code
- **Multi-Language Support**: Generate code in various programming languages
- **Prompt Enhancement**: AI-assisted prompt refinement
- **Dark/Light Mode**: Theme toggle for comfortable viewing
- **Responsive Design**: Works on all device sizes
- **One-Click Deployment**: Direct deployment to Vercel/Netlify
- **API Integration**: Built-in API endpoints for code generation

## 🛠 Tech Stack

- **Frontend**: 
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - ShadCN UI Components
- **Backend**:
  - Next.js API Routes
  - OpenAI API (or alternative AI provider)
- **Deployment**:
  - Vercel/Netlify ready
- **Other**:
  - Lucide Icons
  - React Hook Forms

## 🔑 API Keys Setup

1. Create a `.env.local` file in root directory
2. Add your API keys:
```env
OPENAI_API_KEY=your_api_key_here
# OR for alternative providers:
ANTHROPIC_API_KEY=your_key_here
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation
```bash
git clone https://github.com/your-username/CodeCraft-Upgraded.git
cd CodeCraft-Upgraded
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Building for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
CodeCraft-Upgraded/
├── app/
│   ├── (main)/               # Main app pages
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── api/                  # API routes
│   │   ├── generateCode/     # Code generation endpoint
│   │   ├── enhancePrompt/    # Prompt improvement
│   │   └── deployToVercel/   # Deployment endpoint
├── components/               # Reusable components
│   ├── Header.tsx            # Navigation header
│   ├── ThemeToggle.tsx       # Dark mode switch
│   └── ...                   # Other components
├── contexts/                 # React contexts
├── hooks/                    # Custom hooks
├── public/                   # Static assets
├── styles/                   # Global styles
├── utils/                    # Utility functions
├── next.config.mjs           # Next.js config
├── tailwind.config.ts        # Tailwind config
└── package.json              # Dependencies
```

## 🌐 Deployment

### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2FCodeCraft-Upgraded)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/CodeCraft-Upgraded)

## 🤝 Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
MIT - See [LICENSE](LICENSE) for details
