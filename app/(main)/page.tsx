"use client";

import CodeViewer from "@/components/code-viewer";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { CheckIcon } from "@heroicons/react/16/solid";
import { ArrowLongRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { ArrowUpOnSquareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import LoadingDots from "../../components/loading-dots";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function removeCodeFormatting(code: string): string {
  return code.replace(/```(?:typescript|javascript|tsx)?\n([\s\S]*?)```/g, '$1').trim();
}

export default function Home() {
  let [status, setStatus] = useState<
    "initial" | "creating" | "created" | "updating" | "updated"
  >("initial");
  let [prompt, setPrompt] = useState("");
  let models = [
    {
      label: "gemini-2.0-flash-exp",
      value: "gemini-2.0-flash-exp",
    },
    
    {
      label: "gemini-1.5-flash",
      value: "gemini-1.5-flash",
    }
  ];
  let [model, setModel] = useState(models[0].value);
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

  let loading = status === "creating" || status === "updating";

  // Suggestive prompts
  const suggestivePrompts = [
    "Build me a calculator app",
    "Create a to-do list web app",
    
    "Create a very detailed CV builder web app",
    
  ];

  async function createApp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (status !== "initial") {
      scrollTo({ delay: 0.5 });
    }

    setStatus("creating");
    setGeneratedCode("");

    let res = await fetch("/api/generateCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
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

    setMessages([{ role: "user", content: prompt }]);
    setInitialAppConfig({ model });
    setStatus("created");
  }

  async function handleDownload() {
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
    <main className="mt-12 flex w-full flex-1 flex-col items-center px-4 text-center sm:mt-1">
      <a
        className="mb-4 inline-flex h-7 shrink-0 items-center gap-[9px] rounded-[50px] border-[0.5px] border-solid border-[#E6E6E6] bg-[rgba(234,238,255,0.65)] dark:bg-[rgba(30,41,59,0.5)] dark:border-gray-700 px-7 py-5 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]"
        href="https://ai.google.dev/gemini-api/docs"
        target="_blank"
      >
        <span className="text-center">
          Powered by <span className="font-medium">Gemini API</span>
        </span>
      </a>
      <h1 className="my-6 max-w-3xl text-4xl font-bold text-gray-800 dark:text-white sm:text-6xl">
        Welcome to <span className="text-blue-600">CodeCraft</span>
        <br />Turn your <span className="text-blue-600">idea</span> into an <span className="text-blue-600">app</span>
      </h1>

      <form className="w-full max-w-xl" onSubmit={createApp}>
        <fieldset disabled={loading} className="disabled:opacity-75">
          <div className="relative mt-5">
            <div className="absolute -inset-2 rounded-[32px] bg-gray-300/50 dark:bg-gray-800/50" />
            <div className="relative flex rounded-3xl bg-white dark:bg-[#1E293B] shadow-sm">
              <div className="relative flex flex-grow items-stretch focus-within:z-10">
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  name="prompt"
                  className="w-full resize-none rounded-l-3xl bg-transparent px-6 py-5 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-gray-100 dark:placeholder-gray-400"
                  placeholder="Build me a calculator app..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-3xl px-3 py-2 text-sm font-semibold text-blue-500 hover:text-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 disabled:text-gray-900 dark:disabled:text-gray-400"
              >
                {status === "creating" ? (
                  <LoadingDots color="black" style="large" />
                ) : (
                  <ArrowLongRightIcon className="-ml-0.5 size-6" />
                )}
              </button>
            </div>
          </div>
          {/* Enhance Prompt button */}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={enhancing || !prompt.trim()}
              className="flex items-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-blue-600 px-6 py-2 text-base font-semibold text-white shadow-lg shadow-blue-400/30 transition hover:scale-105 hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed dark:shadow-indigo-900/30"
            >
              {enhancing ? (
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a9.001 9.001 0 0 1 2.625 10.33M7.138 19.513a9.001 9.001 0 0 1-2.625-10.33m2.625 10.33A8.963 8.963 0 0 0 12 21c1.657 0 3.216-.402 4.587-1.116m-10.074 0A8.963 8.963 0 0 1 3 12c0-1.657.402-3.216 1.116-4.587m0 0A8.963 8.963 0 0 1 12 3c1.657 0 3.216.402 4.587 1.116m0 0A8.963 8.963 0 0 0 21 12c0 1.657-.402 3.216-1.116 4.587" />
                </svg>
              )}
              Enhance Prompt
            </button>
          </div>
          {/* Suggestive prompts */}
          {prompt.trim() === "" && (
            <div className="mt-3 flex flex-wrap gap-3 justify-center">
              {suggestivePrompts.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="rounded-full bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 px-5 py-2 text-sm font-medium text-blue-700 shadow-md shadow-blue-200/50 transition hover:scale-105 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:from-blue-900 dark:via-blue-800 dark:to-indigo-900 dark:text-blue-100 dark:shadow-indigo-900/30"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-between gap-3 sm:justify-center">
              <p className="text-gray-500 dark:text-gray-400 sm:text-xs">Model:</p>
              <Select.Root
                name="model"
                disabled={loading}
                value={model}
                onValueChange={(value) => setModel(value)}
              >
                <Select.Trigger className="group flex w-60 max-w-xs items-center rounded-2xl border-[6px] border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E293B] px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500">
                  <Select.Value />
                  <Select.Icon className="ml-auto">
                    <ChevronDownIcon className="size-6 text-gray-300 group-focus-visible:text-gray-500 group-enabled:group-hover:text-gray-500 dark:text-gray-600 dark:group-focus-visible:text-gray-400 dark:group-enabled:group-hover:text-gray-400" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="overflow-hidden rounded-md bg-white dark:bg-[#1E293B] shadow-lg">
                    <Select.Viewport className="p-2">
                      {models.map((model) => (
                        <Select.Item
                          key={model.value}
                          value={model.value}
                          className="flex cursor-pointer items-center rounded-md px-3 py-2 text-sm data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800 data-[highlighted]:outline-none"
                        >
                          <Select.ItemText asChild>
                            <span className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                              <div className="size-2 rounded-full bg-green-500" />
                              {model.label}
                            </span>
                          </Select.ItemText>
                          <Select.ItemIndicator className="ml-auto">
                            <CheckIcon className="size-5 text-blue-600" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                    <Select.ScrollDownButton />
                    <Select.Arrow />
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </div>
        </fieldset>
      </form>

      <hr className="border-1 mb-20 h-px bg-gray-700 dark:bg-gray-700/30" />

      {status !== "initial" && (
        <motion.div
          initial={{ height: 0 }}
          animate={{
            height: "auto",
            overflow: "hidden",
            transitionEnd: { overflow: "visible" },
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          className="w-full pb-[25vh] pt-1"
          onAnimationComplete={() => scrollTo()}
          ref={ref}
        >
          <div className="relative mt-8 w-full overflow-hidden">
            <div className="isolate">
              <CodeViewer code={generatedCode} showEditor onTryFix={fixingError ? undefined : handleTryFix} />
            </div>
            {/* Download button */}
            {generatedCode && (
              <div className="flex flex-col items-center w-full mt-6 mb-4 gap-3">
                <button
                  onClick={handleDownload}
                  className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-pink-500 via-pink-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-pink-300/30 hover:scale-105 hover:shadow-pink-400/40 focus:outline-none focus:ring-2 focus:ring-pink-300/40 focus:ring-offset-2 transition-all duration-150"
                  style={{ boxShadow: '0 2px 12px 0 #f472b6' }}
                >
                  <ArrowDownTrayIcon className="h-4 w-4 text-white group-hover:animate-bounce" />
                  Download Code as ZIP
                </button>
                <button
                  onClick={handleDeploy}
                  disabled={deploying}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-green-500 via-green-400 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-green-300/30 hover:scale-105 hover:shadow-green-400/40 focus:outline-none focus:ring-2 focus:ring-green-300/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {deploying ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                  Deploy to Vercel
                </button>
                {deployUrl && (
                  <a href={deployUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-green-600 underline font-semibold">View Deployment</a>
                )}
              </div>
            )}
            {/* Follow-up prompt */}
            {generatedCode && (
              <form onSubmit={handleFollowup} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 mb-8 w-full max-w-2xl mx-auto">
                <input
                  type="text"
                  value={followupPrompt}
                  onChange={e => setFollowupPrompt(e.target.value)}
                  disabled={followupLoading}
                  placeholder="Describe a change or improvement..."
                  className="flex-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
                <button
                  type="submit"
                  disabled={followupLoading || !followupPrompt.trim()}
                  className="rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-300/30 transition hover:scale-105 hover:shadow-indigo-400/40 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {followupLoading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Send"
                  )}
                </button>
              </form>
            )}

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
                  <p className="animate-pulse text-3xl font-bold dark:text-gray-100">
                    {status === "creating"
                      ? "Building your app..."
                      : "Updating your app..."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </main>
  );
}

async function minDelay<T>(promise: Promise<T>, ms: number) {
  let delay = new Promise((resolve) => setTimeout(resolve, ms));
  let [p] = await Promise.all([promise, delay]);

  return p;
}
