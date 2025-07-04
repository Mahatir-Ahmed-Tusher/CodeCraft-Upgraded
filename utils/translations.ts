export type Language = "en" | "bn";

export const translations = {
  en: {
    // Header
    welcomeTitle: "Welcome to CodeCraft",
    subtitle: "Turn your idea into an app",
    
    // Form
    placeholder: "Build me a calculator app...",
    enhancePrompt: "Enhance Prompt",
    model: "Model:",
    
    // Sidebar
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    clearAllData: "Clear All Data",
    myProjects: "My Projects",
    helpCenter: "Help Center",
    
    // Theme
    lightTheme: "Light",
    darkTheme: "Dark",
    
    // Languages
    english: "English",
    bengali: "বাংলা",
    
    // Projects
    noProjects: "No projects yet",
    createFirstProject: "Create your first project by generating some code!",
    projectName: "Project Name",
    createdAt: "Created",
    updatedAt: "Updated",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    
    // Actions
    download: "Download Code as ZIP",
    deploy: "Deploy to Vercel",
    convertToApk: "Convert to APK",
    viewDeployment: "View Deployment",
    send: "Send",
    tryFix: "Try Fix",
    
    // Status
    building: "Building your app...",
    updating: "Updating your app...",
    
    // Help
    helpTitle: "CodeCraft Help Center",
    howToUse: "How to Use CodeCraft",
    modelGuide: "Model Selection Guide",
    tips: "Tips & Best Practices",
    
    // Buttons
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    
    // Messages
    confirmClearData: "Are you sure you want to clear all data? This action cannot be undone.",
    projectSaved: "Project saved successfully!",
    projectDeleted: "Project deleted successfully!",
  },
  bn: {
    // Header
    welcomeTitle: "CodeCraft এ স্বাগতম",
    subtitle: "আপনার আইডিয়াকে অ্যাপে রূপ দিন",
    
    // Form
    placeholder: "আমার জন্য একটি ক্যালকুলেটর অ্যাপ তৈরি করুন...",
    enhancePrompt: "প্রম্পট উন্নত করুন",
    model: "মডেল:",
    
    // Sidebar
    settings: "সেটিংস",
    language: "ভাষা",
    theme: "থিম",
    clearAllData: "সব ডেটা মুছুন",
    myProjects: "আমার প্রজেক্ট",
    helpCenter: "সহায়তা কেন্দ্র",
    
    // Theme
    lightTheme: "হালকা",
    darkTheme: "গাঢ়",
    
    // Languages
    english: "English",
    bengali: "বাংলা",
    
    // Projects
    noProjects: "এখনো কোন প্রজেক্ট নেই",
    createFirstProject: "কোড জেনারেট করে আপনার প্রথম প্রজেক্ট তৈরি করুন!",
    projectName: "প্রজেক্টের নাম",
    createdAt: "তৈরি হয়েছে",
    updatedAt: "আপডেট হয়েছে",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    view: "দেখুন",
    
    // Actions
    download: "ZIP হিসেবে কোড ডাউনলোড করুন",
    deploy: "Vercel এ ডিপ্লয় করুন",
    convertToApk: "APK এ রূপান্তর করুন",
    viewDeployment: "ডিপ্লয়মেন্ট দেখুন",
    send: "পাঠান",
    tryFix: "ঠিক করার চেষ্টা করুন",
    
    // Status
    building: "আপনার অ্যাপ তৈরি করা হচ্ছে...",
    updating: "আপনার অ্যাপ আপডেট করা হচ্ছে...",
    
    // Help
    helpTitle: "CodeCraft সহায়তা কেন্দ্র",
    howToUse: "CodeCraft কিভাবে ব্যবহার করবেন",
    modelGuide: "মডেল নির্বাচন গাইড",
    tips: "টিপস এবং সেরা অনুশীলন",
    
    // Buttons
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    confirm: "নিশ্চিত",
    
    // Messages
    confirmClearData: "আপনি কি নিশ্চিত যে সব ডেটা মুছে দিতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।",
    projectSaved: "প্রজেক্ট সফলভাবে সংরক্ষিত হয়েছে!",
    projectDeleted: "প্রজেক্ট সফলভাবে মুছে দেওয়া হয়েছে!",
  },
};

export function useTranslation(language: Language) {
  return translations[language];
}