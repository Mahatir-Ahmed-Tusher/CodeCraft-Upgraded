"use client";

import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { 
  BookOpenIcon, 
  CpuChipIcon, 
  LightBulbIcon,
  CodeBracketIcon,
  SparklesIcon,
  ClockIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export default function HelpPage() {
  const { language } = useApp();
  const t = useTranslation(language);

  const modelInfo = [
    {
      name: "gemini-2.0-flash-exp",
      icon: <SparklesIcon className="h-6 w-6" />,
      description: language === "en" 
        ? "Latest experimental model with enhanced capabilities for complex code generation and deeper context understanding."
        : "জটিল কোড জেনারেশন এবং গভীর প্রসঙ্গ বোঝার জন্য উন্নত ক্ষমতা সহ সর্বশেষ পরীক্ষামূলক মডেল।",
      bestFor: language === "en"
        ? "Complex applications, advanced features, detailed requirements"
        : "জটিল অ্যাপ্লিকেশন, উন্নত বৈশিষ্ট্য, বিস্তারিত প্রয়োজনীয়তা"
    },
    {
      name: "gemini-1.5-flash",
      icon: <BoltIcon className="h-6 w-6" />,
      description: language === "en"
        ? "Fast and efficient model optimized for quick code generation and simple to moderate complexity tasks."
        : "দ্রুত কোড জেনারেশন এবং সাধারণ থেকে মাঝারি জটিলতার কাজের জন্য অপ্টিমাইজ করা দ্রুত এবং দক্ষ মডেল।",
      bestFor: language === "en"
        ? "Quick prototypes, simple apps, fast iterations"
        : "দ্রুত প্রোটোটাইপ, সাধারণ অ্যাপ, দ্রুত পুনরাবৃত্তি"
    }
  ];

  const tips = language === "en" ? [
    {
      title: "Be Specific in Your Prompts",
      description: "Include details about functionality, styling preferences, and any specific libraries you want to use.",
      icon: <CodeBracketIcon className="h-6 w-6" />
    },
    {
      title: "Use the Enhance Prompt Feature",
      description: "Let AI improve your prompt for better results by clicking the 'Enhance Prompt' button.",
      icon: <SparklesIcon className="h-6 w-6" />
    },
    {
      title: "Iterate and Refine",
      description: "Use the follow-up input to make changes and improvements to your generated code.",
      icon: <ClockIcon className="h-6 w-6" />
    },
    {
      title: "Save Your Projects",
      description: "All your projects are automatically saved in your browser for easy access later.",
      icon: <BookOpenIcon className="h-6 w-6" />
    }
  ] : [
    {
      title: "আপনার প্রম্পটে সুনির্দিষ্ট হন",
      description: "কার্যকারিতা, স্টাইলিং পছন্দ এবং আপনি যে নির্দিষ্ট লাইব্রেরি ব্যবহার করতে চান সে সম্পর্কে বিস্তারিত অন্তর্ভুক্ত করুন।",
      icon: <CodeBracketIcon className="h-6 w-6" />
    },
    {
      title: "প্রম্পট উন্নত করার বৈশিষ্ট্য ব্যবহার করুন",
      description: "'প্রম্পট উন্নত করুন' বোতামে ক্লিক করে আরও ভাল ফলাফলের জন্য AI কে আপনার প্রম্পট উন্নত করতে দিন।",
      icon: <SparklesIcon className="h-6 w-6" />
    },
    {
      title: "পুনরাবৃত্তি এবং পরিমার্জনা করুন",
      description: "আপনার জেনারেট করা কোডে পরিবর্তন এবং উন্নতি করতে ফলো-আপ ইনপুট ব্যবহার করুন।",
      icon: <ClockIcon className="h-6 w-6" />
    },
    {
      title: "আপনার প্রজেক্ট সংরক্ষণ করুন",
      description: "আপনার সমস্ত প্রজেক্ট স্বয়ংক্রিয়ভাবে আপনার ব্রাউজারে সংরক্ষিত হয় পরবর্তীতে সহজ অ্যাক্সেসের জন্য।",
      icon: <BookOpenIcon className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.helpTitle}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === "en" 
              ? "Learn how to get the most out of CodeCraft"
              : "CodeCraft থেকে সর্বোচ্চ ফলাফল পেতে শিখুন"
            }
          </p>
        </div>

        {/* How to Use */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpenIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.howToUse}
            </h2>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "en" ? "1. Enter Your Idea" : "১. আপনার আইডিয়া লিখুন"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {language === "en" 
                    ? "Describe what you want to build in the text area. Be as specific as possible."
                    : "টেক্সট এরিয়ায় আপনি যা তৈরি করতে চান তা বর্ণনা করুন। যতটা সম্ভব সুনির্দিষ্ট হন।"
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "en" ? "2. Choose Your Model" : "২. আপনার মডেল বেছে নিন"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {language === "en" 
                    ? "Select the appropriate Gemini model based on your project complexity."
                    : "আপনার প্রজেক্টের জটিলতার উপর ভিত্তি করে উপযুক্ত Gemini মডেল নির্বাচন করুন।"
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "en" ? "3. Generate & Preview" : "৩. জেনারেট এবং প্রিভিউ করুন"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {language === "en" 
                    ? "Watch as your code is generated in real-time with a live preview."
                    : "লাইভ প্রিভিউ সহ রিয়েল-টাইমে আপনার কোড জেনারেট হতে দেখুন।"
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {language === "en" ? "4. Download or Deploy" : "৪. ডাউনলোড বা ডিপ্লয় করুন"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {language === "en" 
                    ? "Download your code as a ZIP file or deploy directly to Vercel."
                    : "আপনার কোড ZIP ফাইল হিসেবে ডাউনলোড করুন বা সরাসরি Vercel এ ডিপ্লয় করুন।"
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Model Guide */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CpuChipIcon className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.modelGuide}
            </h2>
          </div>
          
          <div className="space-y-4">
            {modelInfo.map((model, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="text-blue-600 dark:text-blue-400">
                    {model.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {model.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {model.description}
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language === "en" ? "Best for: " : "সেরা জন্য: "}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {model.bestFor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips & Best Practices */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <LightBulbIcon className="h-6 w-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.tips}
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="text-yellow-600 dark:text-yellow-400">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}