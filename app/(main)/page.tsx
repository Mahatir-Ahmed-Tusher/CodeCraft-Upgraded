"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowUpOnSquareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState, useRef } from "react";
import LoadingDots from "../../components/loading-dots";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { Sparkles, ArrowRight, RefreshCw, Paperclip, X, Image as ImageIcon, Smartphone } from 'lucide-react';
import Image from "next/image";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 50); // Adjust typing speed here (lower = faster)
    
    return () => clearInterval(typingEffect);
  }, [text]);
  
  return <span className={className}>{displayText}</span>;
}

export default function Home() {
  const { language, saveProject, projects } = useApp();
  const t = useTranslation(language);
  
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState("");
  
  // Updated models array with all providers
  let models = [
    {
      label: "Gemini 2.0 Flash",
      value: "gemini-2.0-flash-exp",
      provider: "Google"
    },
    {
      label: "Gemini 1.5 Flash",
      value: "gemini-1.5-flash",
      provider: "Google"
    },
    {
      label: "Llama 3.3 70B",
      value: "llama-3.3-70b-versatile",
      provider: "Groq"
    },
    {
      label: "DeepSeek R1",
      value: "deepseek/deepseek-r1-0528:free",
      provider: "OpenRouter"
    },
    {
      label: "Mistral Small",
      value: "mistral-small-latest",
      provider: "Mistral"
    }
  ];
  
  let [model, setModel] = useState(models[0]?.value || "gemini-2.0-flash-exp");
  let [modification, setModification] = useState("");
  let [generatedCode, setGeneratedCode] = useState("");
  let [initialAppConfig, setInitialAppConfig] = useState({
    model: "",
  });
  let [ref, scrollTo] = useScrollTo();
  let [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  let [enhancing, setEnhancing] = useState(false);
  let [followupPrompt, setFollowupPrompt] = useState("");
  let [followupLoading, setFollowupLoading] = useState(false);
  let [fixingError, setFixingError] = useState(false);
  let [deploying, setDeploying] = useState(false);
  let [deployUrl, setDeployUrl] = useState<string | null>(null);
  let [retrying, setRetrying] = useState(false);

  // APK conversion states
  let [convertingToApk, setConvertingToApk] = useState(false);
  let [apkResult, setApkResult] = useState<any>(null);
  let [showApkModal, setShowApkModal] = useState(false);

  // Image analysis states
  let [selectedImage, setSelectedImage] = useState<File | null>(null);
  let [imagePreview, setImagePreview] = useState<string | null>(null);
  let [analyzingImage, setAnalyzingImage] = useState(false);
  let fileInputRef = useRef<HTMLInputElement>(null);

  let loading = status === "creating" || status === "updating";

  // Enhanced suggestive prompts with detailed expansions
  const suggestivePrompts = language === "en" ? [
    {
      display: "CV Builder",
      fullPrompt: "Create a CV/resume builder web app where users can enter their personal details, work experience, education, and skills. Include a live preview and the ability to download the CV as a PDF with a professional layout."
    },
    {
      display: "Recipe Finder App",
      fullPrompt: "Build a recipe search app that allows users to search for recipes by ingredients. Fetch recipe data from an external API and display recipe details including image, ingredients list, and cooking instructions."
    },
    {
      display: "Habit Tracker",
      fullPrompt: "Create a habit tracking app where users can add new habits, mark them as complete each day, and visualize progress over time with a calendar or chart."
    },
    {
      display: "Portfolio Website",
      fullPrompt: "Build a personal portfolio website to showcase projects, skills, and contact information. Make it responsive and visually engaging with smooth transitions and dark/light mode toggle."
    },
    {
      display: "Weather App",
      fullPrompt: "Make a weather app that shows the current weather and 7-day forecast for any city. Use an external weather API and display temperature, conditions, and icons for each day."
    },
    {
      display: "AI Chat Interface",
      fullPrompt: "Create a simple AI chatbot interface that takes user input and responds using a dummy AI logic or an API. Include a neat chat-style layout with user and AI messages."
    }
  ] : [
    {
      display: "সিভি বিল্ডার",
      fullPrompt: "একটি সিভি/রেজুমে বিল্ডার অ্যাপ তৈরি করুন যেখানে ব্যবহারকারীরা তাদের ব্যক্তিগত তথ্য, কাজের অভিজ্ঞতা, শিক্ষা ও স্কিলস যোগ করতে পারবে। লাইভ প্রিভিউ ও পিডিএফ হিসেবে ডাউনলোডের সুবিধা রাখুন।"
    },
    {
      display: "রেসিপি খোঁজার অ্যাপ",
      fullPrompt: "একটি রেসিপি খোঁজার অ্যাপ তৈরি করুন যেখানে ব্যবহারকারীরা উপকরণের ভিত্তিতে রেসিপি সার্চ করতে পারবে। বাইরের API থেকে রেসিপির তথ্য নিয়ে দেখান রেসিপির নাম, ছবি, উপকরণ এবং রান্নার নির্দেশনা।"
    },
    {
      display: "হ্যাবিট ট্র্যাকার",
      fullPrompt: "একটি অ্যাপ তৈরি করুন যেখানে ব্যবহারকারীরা তাদের দৈনন্দিন অভ্যাস ট্র্যাক করতে পারবে। প্রতিদিন টিক দিতে পারবে এবং ক্যালেন্ডার বা চার্টে তাদের অগ্রগতি দেখতে পাবে।"
    },
    {
      display: "পোর্টফোলিও ওয়েবসাইট",
      fullPrompt: "একটি পার্সোনাল পোর্টফোলিও ওয়েবসাইট তৈরি করুন যেখানে প্রজেক্ট, স্কিলস এবং যোগাযোগের তথ্য থাকবে। এটি মোবাইল ফ্রেন্ডলি এবং দৃষ্টিনন্দন ডিজাইনে হোক, সাথে ডার্ক/লাইট মোড টগল থাকুক।"
    },
    {
      display: "আবহাওয়া অ্যাপ",
      fullPrompt: "একটি অ্যাপ তৈরি করুন যা যেকোনো শহরের বর্তমান আবহাওয়া ও ৭ দিনের পূর্বাভাস দেখাবে। আবহাওয়ার API ব্যবহার করে তাপমাত্রা, অবস্থা ও প্রতিদিনের জন্য আইকন দেখান।"
    },
    {
      display: "এআই চ্যাট ইন্টারফেস",
      fullPrompt: "একটি সাধারণ এআই চ্যাট ইন্টারফেস তৈরি করুন যেখানে ব্যবহারকারীর প্রশ্নের জবাব এআই দেবে। ব্যবহারকারী ও এআইয়ের বার্তা আলাদা করে চ্যাট স্টাইলের ডিজাইনে দেখান।"
    }
  ];
  

  // Auto-save project when code is generated
  useEffect(() => {
    if (generatedCode && prompt && status === "created") {
      const projectName = prompt.length > 50 ? prompt.substring(0, 50) + "..." : prompt;
      const newProject = {
        name: projectName,
        code: generatedCode,
        prompt: prompt,
        model: model,
      };
      
      // Only save if the project is different from the last one
      const lastProject = projects?.[0];
      if (!lastProject || 
          lastProject.code !== newProject.code || 
          lastProject.prompt !== newProject.prompt) {
        saveProject(newProject);
      }
    }
  }, [generatedCode, prompt, status, model, saveProject, projects]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Analyze image with Together AI
  const analyzeImage = async (imageData: string, userPrompt: string) => {
    try {
      const response = await fetch('/api/analyzeImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData,
          prompt: userPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  };

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");

    try {
      let finalPrompt = prompt;

      // If there's an image, analyze it first
      if (selectedImage && imagePreview) {
        setAnalyzingImage(true);
        try {
          const imageAnalysis = await analyzeImage(imagePreview, prompt);
          finalPrompt = `${prompt}\n\nBased on this image analysis: ${imageAnalysis}`;
        } catch (error) {
          console.error('Image analysis failed:', error);
          // Continue with original prompt if image analysis fails
        } finally {
          setAnalyzingImage(false);
        }
      }

      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: finalPrompt }],
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error: ${res.status} - ${errorText}`);
      }

      if (!res.body) {
        throw new Error("No response body");
      }

      const reader = res.body.getReader();
      let receivedData = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }

      setMessages([{ role: "user", content: finalPrompt }]);
      setInitialAppConfig({ model });
      setStatus("created");
      
      // Clear image after successful generation
      removeImage();
    } catch (error: any) {
      console.error("Error creating app:", error);
      setStatus("initial");
      setAnalyzingImage(false);
    }
  }

  async function handleDownload() {
    if (!generatedCode) return;
    
    const zip = new JSZip();
    // Add main code file
    zip.file("src/App.tsx", generatedCode);
    // Minimal package.json
    zip.file(
      "package.json",
      JSON.stringify(
        {
          name: "generated-app",
          version: "1.0.0",
          private: true,
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject",
          },
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "^5.0.0",
            typescript: "^4.0.0",
          },
        },
        null,
        2
      )
    );
    // Minimal tsconfig.json
    zip.file(
      "tsconfig.json",
      JSON.stringify(
        {
          compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "esnext",
            moduleResolution: "node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
          },
          include: ["src"],
        },
        null,
        2
      )
    );
    // Minimal public/index.html
    zip.file(
      "public/index.html",
      `<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Generated App</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>`
    );
    // Download
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "generated-app.zip");
  }

  async function handleConvertToApk() {
    if (!generatedCode) return;
    
    setConvertingToApk(true);
    setApkResult(null);
    
    try {
      const appName = prompt.length > 30 ? prompt.substring(0, 30).trim() + "..." : prompt.trim();
      const cleanAppName = appName.replace(/[^a-zA-Z0-9\s]/g, '').trim() || 'CodeCraft App';
      
      const response = await fetch('/api/convertToApk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: generatedCode,
          appName: cleanAppName,
          description: `${cleanAppName} - Generated by CodeCraft`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert to APK');
      }

      const result = await response.json();
      setApkResult(result);
      setShowApkModal(true);
    } catch (error: any) {
      console.error('Error converting to APK:', error);
      setApkResult({
        success: false,
        error: error.message,
        message: 'Failed to convert to APK. Please try again later.'
      });
      setShowApkModal(true);
    } finally {
      setConvertingToApk(false);
    }
  }

  const handleDownloadApkFiles = () => {
    if (!apkResult?.files) return;
    
    const zip = new JSZip();
    Object.entries(apkResult.files).forEach(([filename, content]) => {
      zip.file(filename, content as string);
    });
    
    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "pwa-app-files.zip");
    });
  };

  async function handleEnhancePrompt() {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/enhancePrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to enhance prompt");
      const data = await res.json();
      setPrompt(data.enhanced || prompt);
    } catch (e) {
      // Optionally show error
    } finally {
      setEnhancing(false);
    }
  }

  async function handleFollowup(e: React.FormEvent) {
    e.preventDefault();
    if (!followupPrompt.trim() || !generatedCode) return;
    setFollowupLoading(true);
    try {
      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: generatedCode },
            { role: "user", content: followupPrompt },
          ],
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let receivedData = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }
      setFollowupPrompt("");
    } catch (e) {
      // Optionally show error
    } finally {
      setFollowupLoading(false);
    }
  }

  async function handleTryFix(errorMsg: string) {
    if (!generatedCode) return;
    setFixingError(true);
    try {
      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: generatedCode },
            { role: "user", content: `The preview failed to load with this error: ${errorMsg}. Please fix the code so it works and runs correctly.` },
          ],
        }),
      });
      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      let receivedData = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }
    } catch (e) {
      // Optionally show error
    } finally {
      setFixingError(false);
    }
  }

  async function handleRetry() {
    if (!prompt.trim()) return;
    setRetrying(true);
    setGeneratedCode("");
    
    try {
      let res = await fetch("/api/generateCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [
            { 
              role: "user", 
              content: `${prompt}\n\nPlease regenerate this code with improved accuracy, better error handling, and more robust implementation. Focus on creating clean, functional code that works reliably.` 
            },
          ],
        }),
      });
      
      if (!res.ok) throw new Error(res.statusText);
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      let receivedData = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedData += new TextDecoder().decode(value);
        const cleanedData = removeCodeFormatting(receivedData);
        setGeneratedCode(cleanedData);
      }
    } catch (e) {
      console.error("Retry failed:", e);
    } finally {
      setRetrying(false);
    }
  }

  async function handleDeploy() {
    if (!generatedCode) return;
    setDeploying(true);
    setDeployUrl(null);
    try {
      // Prepare files for deployment
      const files = {
        "src/App.tsx": generatedCode,
        "package.json": JSON.stringify({
          name: "generated-app",
          version: "1.0.0",
          private: true,
          scripts: {
            start: "react-scripts start",
            build: "react-scripts build",
            test: "react-scripts test",
            eject: "react-scripts eject",
          },
          dependencies: {
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            "react-scripts": "^5.0.0",
            typescript: "^4.0.0",
          },
        }, null, 2),
        "tsconfig.json": JSON.stringify({
          compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            module: "esnext",
            moduleResolution: "node",
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: "react-jsx",
          },
          include: ["src"],
        }, null, 2),
        "public/index.html": `<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Generated App</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>`
      };
      const res = await fetch("/api/deployToVercel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDeployUrl(data.url ? `https://${data.url}` : null);
    } catch (e) {
      setDeployUrl(null);
      // Optionally show error
    } finally {
      setDeploying(false);
    }
  }

  useEffect(() => {
    let el = document.querySelector(".cm-scroller");
    if (el && loading) {
      let end = el.scrollHeight - el.clientHeight;
      el.scrollTo({ top: end });
    }
  }, [loading, generatedCode]);

  return (
    <main className="flex w-full flex-1 flex-col items-center px-2 sm:px-4 text-center overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header Section */}
        <div className="space-y-4 sm:space-y-6">
          <a
            className="inline-flex h-6 shrink-0 items-center gap-[6px] rounded-[50px] border-[0.5px] border-solid border-[#E6E6E6] bg-[rgba(234,238,255,0.65)] dark:bg-[rgba(30,41,59,0.5)] dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] mt-4 sm:mt-6"
          >
            <span className="text-[10px] sm:text-xs">
              ✨ AI-Powered • No-Code • Open Source
            </span>
          </a>
          
          <h1 className="text-xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 px-2">
            <span className="text-blue-500">
              <TypewriterText text="Where Ideas" />
            </span>{' '}
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              <TypewriterText text="Become Reality" />
            </span>
          </h1>
        </div>

        {/* Enhanced Prompt Box */}
        <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <form className="w-full" onSubmit={createApp}>
            <fieldset disabled={loading || analyzingImage} className="disabled:opacity-75">
              {/* Main Prompt Container */}
              <div className="relative w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative inline-block">
                      <Image 
                        src={imagePreview} 
                        alt="Selected" 
                        width={128}
                        height={128}
                        className="max-w-full max-h-32 rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {analyzingImage && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Analyzing image...
                      </div>
                    )}
                  </div>
                )}

                {/* Prompt Input Area */}
                <div className="relative">
                  <textarea
                    className="w-full p-4 sm:p-6 pr-16 sm:pr-20 bg-transparent border-none outline-none resize-none min-h-[120px] sm:min-h-[140px] text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Let AI cook..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  {/* Prompt Enhancer */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={enhancing}
                      className="p-2 rounded-full text-yellow-500 hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors disabled:opacity-50"
                      title="Enhance Prompt"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Attach Button */}
                  <div className="absolute bottom-3 sm:bottom-4 left-12 sm:left-16">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title="Attach Image"
                    >
                      <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!prompt.trim() || loading || analyzingImage}
                    className="absolute right-3 sm:right-4 bottom-3 sm:bottom-4 p-2 sm:p-2.5 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Submit"
                  >
                    {loading || analyzingImage ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sm:w-5 sm:h-5"
                      >
                        <path d="M22 2L11 13" />
                        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Bottom Section with Model Selection */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between">
                    {/* Model Selection */}
                    <div className="flex items-center gap-2">
                      <Select.Root
                        name="model"
                        disabled={loading || analyzingImage}
                        value={model}
                        onValueChange={(value) => setModel(value)}
                      >
                        <Select.Trigger className="group flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-xs sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                          <Select.Value />
                          <Select.Icon>
                            <ChevronDownIcon className="size-3 sm:size-4 text-gray-400" />
                          </Select.Icon>
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-[100]">
                            <Select.Viewport className="p-1">
                              {models.map((modelOption) => (
                                <Select.Item
                                  key={modelOption.value}
                                  value={modelOption.value}
                                  className="flex cursor-pointer items-center rounded-md px-3 py-2 text-xs sm:text-sm data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700 data-[highlighted]:outline-none"
                                >
                                  <Select.ItemText asChild>
                                    <span className="inline-flex items-center gap-2">
                                      <div className="size-2 rounded-full bg-green-500" />
                                      <div className="flex flex-col items-start">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          {modelOption.label}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {modelOption.provider}
                                        </span>
                                      </div>
                                    </span>
                                  </Select.ItemText>
                                  <Select.ItemIndicator className="ml-auto">
                                    <CheckIcon className="size-4 text-blue-600" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </div>

                    {/* Quality Setting */}
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <a href="/help" className="hover:underline">To Learn about the LLM models, go to Help Center</a>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </form>

          {/* Enhanced Suggestive Prompts */}
          <div className="flex flex-wrap gap-2 justify-center px-2">
            {suggestivePrompts.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPrompt(suggestion.fullPrompt)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
              >
                {suggestion.display}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <hr className="border-1 h-px bg-gray-700 dark:bg-gray-700/30 w-full max-w-4xl mx-auto" />

        {/* Code Generation Results */}
        {status !== "initial" && (
          <motion.div
            initial={{ height: 0 }}
            animate={{
              height: "auto",
              overflow: "hidden",
              transitionEnd: { overflow: "visible" },
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="w-full"
            onAnimationComplete={() => scrollTo()}
            ref={ref}
          >
            <div className="relative w-full overflow-hidden">
              <div className="isolate">
                <CodeViewer 
                  code={generatedCode} 
                  showEditor 
                  onTryFix={fixingError ? undefined : handleTryFix}
                  onRetry={retrying ? undefined : handleRetry}
                  isRetrying={retrying}
                />
              </div>
              
              {/* Action Buttons */}
              {generatedCode && (
                <div className="flex flex-col items-center w-full mt-4 sm:mt-6 mb-4 gap-2 sm:gap-3 px-2">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-lg">
                    <button
                      onClick={handleDownload}
                      className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-fuchsia-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-pink-300/30 hover:scale-105 hover:shadow-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:ring-offset-2 transition-all duration-150 flex-1"
                      style={{ boxShadow: '0 2px 12px 0 #f472b6' }}
                    >
                      <ArrowDownTrayIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white group-hover:animate-bounce" />
                      {t.download}
                    </button>
                    
                    <button
                      onClick={handleConvertToApk}
                      disabled={convertingToApk}
                      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-purple-500 via-purple-400 to-indigo-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-purple-300/30 hover:scale-105 hover:shadow-purple-400/40 focus:outline-none focus:ring-2 focus:ring-purple-300/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
                    >
                      {convertingToApk ? (
                        <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                      Convert to APK
                    </button>
                    
                    <button
                      onClick={handleDeploy}
                      disabled={deploying}
                      className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-500 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-green-300/30 hover:scale-105 hover:shadow-green-400/40 focus:outline-none focus:ring-2 focus:ring-green-300/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
                    >
                      {deploying ? (
                        <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3 w-3 sm:h-4 sm:w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                      {t.deploy}
                    </button>
                  </div>
                  {deployUrl && (
                    <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-green-600 underline font-semibold text-xs sm:text-sm">{t.viewDeployment}</a>
                  )}
                </div>
              )}
              
              {/* Enhanced Follow-up Prompt - More Prominent on Mobile */}
              {generatedCode && (
                <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 mb-6 sm:mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-gray-600 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        {language === "en" ? "Improve Your App" : "আপনার অ্যাপ উন্নত করুন"}
                      </h3>
                    </div>
                    <form onSubmit={handleFollowup} className="space-y-3">
                      <textarea
                        value={followupPrompt}
                        onChange={e => setFollowupPrompt(e.target.value)}
                        disabled={followupLoading}
                        placeholder={language === "en" ? "Describe a change or improvement..." : "একটি পরিবর্তন বা উন্নতি বর্ণনা করুন..."}
                        className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:text-gray-100 resize-none min-h-[80px]"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={followupLoading || !followupPrompt.trim()}
                          className="flex-1 rounded-xl bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-300/30 transition hover:scale-105 hover:shadow-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {followupLoading ? (
                            <span className="inline-block h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            t.send
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Loading Animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={status === "updating" ? { x: "100%" } : undefined}
                    animate={status === "updating" ? { x: "0%" } : undefined}
                    exit={{ x: "100%" }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.85,
                      delay: 0.5,
                    }}
                    className="absolute inset-x-0 bottom-0 top-1/2 flex items-center justify-center rounded-r border border-gray-400 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-gray-300 dark:from-[#1E293B] dark:to-gray-800 md:inset-y-0 md:left-1/2 md:right-0"
                  >
                    <p className="animate-pulse text-xl sm:text-3xl font-bold dark:text-gray-100 px-4 text-center">
                      {status === "creating"
                        ? t.building
                        : t.updating}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* APK Conversion Modal */}
      {showApkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                APK Conversion
              </h2>
              <button
                onClick={() => setShowApkModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4">
              {apkResult?.success ? (
                <>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{apkResult.message}</span>
                  </div>
                  
                  {apkResult.type === 'apk_ready' && apkResult.downloadUrl ? (
                    <a
                      href={apkResult.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download APK
                    </a>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {apkResult.message}
                      </p>
                      <button
                        onClick={handleDownloadApkFiles}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        Download PWA Files
                      </button>
                      {apkResult.instructions && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Instructions:
                          </h4>
                          <ol className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            {apkResult.instructions.map((instruction: string, index: number) => (
                              <li key={index}>{instruction}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">
                      {apkResult?.message || 'Failed to convert to APK'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {apkResult?.error || 'Please try again later or contact support.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms));
  let [p] = await Promise.all([promise, delay]);

  return p;
}