"use client";

import * as shadcnComponents from "@/utils/shadcn";
import { Sandpack } from "@codesandbox/sandpack-react";
import {
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react/unstyled";
import { dracula as draculaTheme } from "@codesandbox/sandpack-themes";
import dedent from "dedent";
import "./code-viewer.css";
import React, { useState, useMemo } from "react";
import { RefreshCw, ExternalLink } from "lucide-react";

export default function CodeViewer({
  code,
  showEditor = false,
  onTryFix,
  onRetry,
  isRetrying = false,
}: {
  code: string;
  showEditor?: boolean;
  onTryFix?: (error: string) => void;
  onRetry?: () => void;
  isRetrying?: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [lastCode, setLastCode] = useState(code);
  const [isLoading, setIsLoading] = useState(false);

  // Use a memoized key to force remount when code changes
  const sandpackKey = useMemo(() => {
    return Date.now().toString();
  }, [code]);

  // Detect common infinite loop patterns
  const infiniteLoopPatterns = [
    /setState\s*\(/i,
    /useState\s*\(/i,
    /useEffect\s*\(\s*\(.*=>.*\)\s*=>.*\)\s*\)/i,
    /componentDidUpdate\s*\(/i,
    /componentWillUpdate\s*\(/i,
  ];
  const hasInfiniteLoop = infiniteLoopPatterns.some((re) => re.test(code));

  // Function to open preview in new tab
  const openInNewTab = () => {
    // Clean and prepare the code for standalone execution
    let cleanCode = code
      .replace(/^import.*$/gm, '') // Remove all import statements
      .replace(/^export\s+default\s+/gm, 'const App = ') // Replace export default with const App =
      .trim();

    // If the code doesn't have a proper App component declaration, wrap it
    if (!cleanCode.includes('const App =') && !cleanCode.includes('function App')) {
      cleanCode = `const App = () => {\n${cleanCode}\n};`;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeCraft Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        #root {
            width: 100%;
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef, useCallback, useMemo, useReducer, useContext, createContext } = React;
        const { createRoot } = ReactDOM;
        
        // Make all Lucide React icons available globally
        const LucideIcons = LucideReact;
        const {
            ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Plus, Minus, X, Check, Edit, Trash, Save, Search, Filter, Settings, User, Home, Menu, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Star, Heart, Share, Download, Upload, Play, Pause, Stop, Volume2, VolumeX, Calendar, Clock, Mail, Phone, MapPin, Globe, Camera, Image, Video, Music, File, Folder, Link, Lock, Unlock, Eye, EyeOff, Bell, BellOff, Bookmark, BookmarkCheck, Flag, Tag, Zap, Wifi, WifiOff, Battery, BatteryLow, Bluetooth, Cpu, HardDrive, Monitor, Smartphone, Tablet, Laptop, Server, Database, Cloud, CloudOff, Shield, ShieldCheck, AlertTriangle, AlertCircle, Info, HelpCircle, MessageCircle, MessageSquare, Send, Paperclip, Smile, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown, BarChart, PieChart, Activity, Target, Award, Gift, ShoppingCart, ShoppingBag, CreditCard, DollarSign, Percent, Calculator, Ruler, Scissors, Palette, Brush, Pen, PenTool, Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, List, Grid, Layers, Move, RotateCw, RotateCcw, ZoomIn, ZoomOut, Maximize, Minimize, Copy, Cut, Paste, Undo, Redo, RefreshCw, MoreHorizontal, MoreVertical, ExternalLink, Github, Twitter, Facebook, Instagram, Linkedin, Youtube, Twitch, Discord, Slack, Figma, Chrome, Firefox, Safari, Edge, Code, Terminal, Package, Npm, Yarn, Git, Branch, Merge, PullRequest, Issue, Commit, Tag as GitTag, Release, Workflow, Action, Build, Deploy, Test, Bug, Feature, Enhancement, Documentation, Security, Performance, Accessibility, Mobile, Desktop, Tablet as TabletIcon, Watch, Tv, Gamepad2, Headphones, Mic, MicOff, Speaker, Radio, Podcast, Rss, Bookmark as BookmarkIcon, History, Archive, Trash2, Delete, Remove, Add, Create, New, Open, Close, Minimize2, Maximize2, FullScreen, ExitFullScreen, Expand, Collapse, Sidebar, Layout, Grid3x3, Columns, Rows, Table, List as ListIcon, Card, Kanban, Timeline, Gantt, Chart, Graph, Analytics, Report, Dashboard, Widget, Component, Element, Block, Section, Header, Footer, Navigation, Breadcrumb, Pagination, Tab, Modal, Dialog, Popup, Tooltip, Dropdown, Select, Input, Textarea, Button, Checkbox, Radio, Switch, Slider, Progress, Loading, Spinner, Skeleton, Avatar, Badge, Chip, Tag as TagIcon, Label, Caption, Title, Heading, Paragraph, Text, Quote, Code2, Pre, Syntax, Highlight, Comment, Note, Warning, Error, Success, Info as InfoIcon, Question, Help, Support, Contact, About, Privacy, Terms, Legal, License, Copyright, Trademark, Patent, Brand, Logo, Icon, Image as ImageIcon, Photo, Picture, Gallery, Slideshow, Carousel, Slider as SliderIcon, Banner, Hero, Feature, Testimonial, Review, Rating, Score, Rank, Level, Progress as ProgressIcon, Status, State, Flag as FlagIcon, Marker, Pin, Location, Map, Direction, Route, Path, Journey, Trip, Travel, Transport, Car, Bus, Train, Plane, Ship, Bike, Walk, Run, Sport, Game, Toy, Gift as GiftIcon, Present, Surprise, Celebration, Party, Event, Meeting, Conference, Webinar, Workshop, Course, Lesson, Tutorial, Guide, Manual, Book, Library, Archive as ArchiveIcon, Collection, Album, Playlist, Track, Song, Artist, Band, Concert, Festival, Show, Movie, Film, Video as VideoIcon, Stream, Live, Record, Broadcast, Podcast as PodcastIcon, Radio as RadioIcon, News, Article, Blog, Post, Story, Content, Media, Social, Network, Community, Group, Team, Organization, Company, Business, Enterprise, Startup, Venture, Investment, Finance, Money, Currency, Payment, Transaction, Invoice, Receipt, Bill, Tax, Budget, Expense, Income, Profit, Loss, Revenue, Sales, Marketing, Advertising, Campaign, Promotion, Discount, Coupon, Offer, Deal, Price, Cost, Value, Worth, Quality, Quantity, Amount, Number, Count, Sum, Total, Average, Median, Mode, Range, Min, Max, Limit, Threshold, Boundary, Border, Edge, Corner, Center, Middle, Side, Top, Bottom, Left, Right, Front, Back, Inside, Outside, Above, Below, Before, After, First, Last, Previous, Next, Forward, Backward, Up, Down, North, South, East, West, Northeast, Northwest, Southeast, Southwest
        } = LucideReact;

        try {
            ${cleanCode}
            
            const root = createRoot(document.getElementById('root'));
            root.render(React.createElement(App));
        } catch (error) {
            console.error('Error rendering app:', error);
            document.getElementById('root').innerHTML = '<div style="padding: 20px; color: red; font-family: monospace;">Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Error boundary class
  class PreviewErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; errorMsg: string }> {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, errorMsg: "" };
    }
    static getDerivedStateFromError(error: Error) {
      return { hasError: true, errorMsg: error.message };
    }
    componentDidCatch(error: Error, errorInfo: any) {
      setError(error.message || "Unknown error");
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="mb-4 text-base sm:text-lg font-semibold text-red-600 dark:text-red-400 text-center">
              Preview failed to load
            </div>
            <div className="mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
              {this.state.errorMsg}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm">
              {onTryFix && (
                <button
                  className="flex-1 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-fuchsia-500 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-pink-300/30 hover:scale-105 hover:shadow-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:ring-offset-2 transition-all duration-150"
                  onClick={() => onTryFix(this.state.errorMsg)}
                >
                  Try Fix
                </button>
              )}
              {onRetry && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-300/30 hover:scale-105 hover:shadow-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-300/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onRetry}
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  Retry
                </button>
              )}
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  // Only update the preview if the code has actually changed
  React.useEffect(() => {
    if (code !== lastCode) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setLastCode(code);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [code, lastCode]);

  return (
    <div className="relative w-full">
      {/* Action Buttons - Always visible when code exists */}
      {code && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 flex gap-2">
          {/* Open in New Tab Button */}
          <button
            onClick={openInNewTab}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Open preview in new tab"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
              title="Regenerate code with improved accuracy"
            >
              {isRetrying ? (
                <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
              ) : (
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="hidden sm:inline">Retry</span>
            </button>
          )}
        </div>
      )}

      {showEditor ? (
        <Sandpack
          key={sandpackKey}
          options={{
            showNavigator: true,
            editorHeight: "70vh",
            showTabs: false,
            ...sharedOptions,
          }}
          files={{
            "App.tsx": code,
            ...sharedFiles,
          }}
          {...sharedProps}
        />
      ) : (
        <SandpackProvider
          key={sandpackKey}
          files={{
            "App.tsx": code,
            ...sharedFiles,
          }}
          className="flex h-full w-full grow flex-col justify-center"
          options={{ ...sharedOptions }}
          {...sharedProps}
        >
          <PreviewErrorBoundary>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
              </div>
            ) : (
              <SandpackPreview
                className="flex h-full w-full grow flex-col justify-center p-2 sm:p-4 md:pt-16 min-h-[400px] sm:min-h-[500px]"
                showOpenInCodeSandbox={false}
                showRefreshButton={false}
              />
            )}
          </PreviewErrorBoundary>
        </SandpackProvider>
      )}
    </div>
  );
}

let sharedProps = {
  template: "react-ts",
  theme: draculaTheme,
  customSetup: {
    dependencies: {
      "lucide-react": "latest",
      recharts: "2.9.0",
      "react-router-dom": "latest",
      "@radix-ui/react-accordion": "^1.2.0",
      "@radix-ui/react-alert-dialog": "^1.1.1",
      "@radix-ui/react-aspect-ratio": "^1.1.0",
      "@radix-ui/react-avatar": "^1.1.0",
      "@radix-ui/react-checkbox": "^1.1.1",
      "@radix-ui/react-collapsible": "^1.1.0",
      "@radix-ui/react-dialog": "^1.1.1",
      "@radix-ui/react-dropdown-menu": "^2.1.1",
      "@radix-ui/react-hover-card": "^1.1.1",
      "@radix-ui/react-label": "^2.1.0",
      "@radix-ui/react-menubar": "^1.1.1",
      "@radix-ui/react-navigation-menu": "^1.2.0",
      "@radix-ui/react-popover": "^1.1.1",
      "@radix-ui/react-progress": "^1.1.0",
      "@radix-ui/react-radio-group": "^1.2.0",
      "@radix-ui/react-select": "^2.1.1",
      "@radix-ui/react-separator": "^1.1.0",
      "@radix-ui/react-slider": "^1.2.0",
      "@radix-ui/react-slot": "^1.1.0",
      "@radix-ui/react-switch": "^1.1.0",
      "@radix-ui/react-tabs": "^1.1.0",
      "@radix-ui/react-toast": "^1.2.1",
      "@radix-ui/react-toggle": "^1.1.0",
      "@radix-ui/react-toggle-group": "^1.1.0",
      "@radix-ui/react-tooltip": "^1.1.2",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.1.1",
      "date-fns": "^3.6.0",
      "embla-carousel-react": "^8.1.8",
      "react-day-picker": "^8.10.1",
      "tailwind-merge": "^2.4.0",
      "tailwindcss-animate": "^1.0.7",
      vaul: "^0.9.1",
    },
  },
} as const;

let sharedOptions = {
  externalResources: [
    "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
  ],
};

let sharedFiles = {
  "/lib/utils.ts": shadcnComponents.utils,
  "/components/ui/accordion.tsx": shadcnComponents.accordian,
  "/components/ui/alert-dialog.tsx": shadcnComponents.alertDialog,
  "/components/ui/alert.tsx": shadcnComponents.alert,
  "/components/ui/avatar.tsx": shadcnComponents.avatar,
  "/components/ui/badge.tsx": shadcnComponents.badge,
  "/components/ui/breadcrumb.tsx": shadcnComponents.breadcrumb,
  "/components/ui/button.tsx": shadcnComponents.button,
  "/components/ui/calendar.tsx": shadcnComponents.calendar,
  "/components/ui/card.tsx": shadcnComponents.card,
  "/components/ui/carousel.tsx": shadcnComponents.carousel,
  "/components/ui/checkbox.tsx": shadcnComponents.checkbox,
  "/components/ui/collapsible.tsx": shadcnComponents.collapsible,
  "/components/ui/dialog.tsx": shadcnComponents.dialog,
  "/components/ui/drawer.tsx": shadcnComponents.drawer,
  "/components/ui/dropdown-menu.tsx": shadcnComponents.dropdownMenu,
  "/components/ui/input.tsx": shadcnComponents.input,
  "/components/ui/label.tsx": shadcnComponents.label,
  "/components/ui/menubar.tsx": shadcnComponents.menuBar,
  "/components/ui/navigation-menu.tsx": shadcnComponents.navigationMenu,
  "/components/ui/pagination.tsx": shadcnComponents.pagination,
  "/components/ui/popover.tsx": shadcnComponents.popover,
  "/components/ui/progress.tsx": shadcnComponents.progress,
  "/components/ui/radio-group.tsx": shadcnComponents.radioGroup,
  "/components/ui/select.tsx": shadcnComponents.select,
  "/components/ui/separator.tsx": shadcnComponents.separator,
  "/components/ui/skeleton.tsx": shadcnComponents.skeleton,
  "/components/ui/slider.tsx": shadcnComponents.slider,
  "/components/ui/switch.tsx": shadcnComponents.switchComponent,
  "/components/ui/table.tsx": shadcnComponents.table,
  "/components/ui/tabs.tsx": shadcnComponents.tabs,
  "/components/ui/textarea.tsx": shadcnComponents.textarea,
  "/components/ui/toast.tsx": shadcnComponents.toast,
  "/components/ui/toaster.tsx": shadcnComponents.toaster,
  "/components/ui/toggle-group.tsx": shadcnComponents.toggleGroup,
  "/components/ui/toggle.tsx": shadcnComponents.toggle,
  "/components/ui/tooltip.tsx": shadcnComponents.tooltip,
  "/components/ui/use-toast.tsx": shadcnComponents.useToast,
  "/public/index.html": dedent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `,
};