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
import React, { useState } from "react";

export default function CodeViewer({
  code,
  showEditor = false,
  onTryFix,
}: {
  code: string;
  showEditor?: boolean;
  onTryFix?: (error: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  // Detect common infinite loop patterns
  const infiniteLoopPatterns = [
    /setState\s*\(/i,
    /useState\s*\(/i,
    /useEffect\s*\(\s*\(.*=>.*\)\s*=>.*\)\s*\)/i, // useEffect(() => ...) without deps, no 's' flag
    /componentDidUpdate\s*\(/i,
    /componentWillUpdate\s*\(/i,
  ];
  const hasInfiniteLoop = infiniteLoopPatterns.some((re) => re.test(code));

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
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="mb-4 text-lg font-semibold text-red-600">Preview failed to load.</div>
            <div className="mb-4 text-sm text-gray-500">{this.state.errorMsg}</div>
            {onTryFix && (
              <button
                className="rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-pink-300/30 hover:scale-105 hover:shadow-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:ring-offset-2 transition-all duration-150"
                onClick={() => onTryFix(this.state.errorMsg)}
              >
                Try Fix
              </button>
            )}
          </div>
        );
      }
      return this.props.children;
    }
  }

  return (
    <div className="relative w-full">
      {hasInfiniteLoop && (
        <div className="mb-2 rounded bg-yellow-100 px-4 py-2 text-sm text-yellow-800 border border-yellow-300 shadow">
          <b>Warning:</b> The generated code may contain patterns that cause infinite loops or crashes (e.g., setState in render). If the preview fails, try using the <b>Try Fix</b> button below.
        </div>
      )}
      {showEditor ? (
        <Sandpack
          options={{
            showNavigator: true,
            editorHeight: "80vh",
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
          files={{
            "App.tsx": code,
            ...sharedFiles,
          }}
          className="flex h-full w-full grow flex-col justify-center"
          options={{ ...sharedOptions }}
          {...sharedProps}
        >
          <PreviewErrorBoundary>
            <SandpackPreview
              className="flex h-full w-full grow flex-col justify-center p-4 md:pt-16"
              showOpenInCodeSandbox={false}
              showRefreshButton={false}
            />
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
