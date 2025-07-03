"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Language = "en" | "bn";
export type Theme = "light" | "dark";

export interface Project {
  id: string;
  name: string;
  code: string;
  prompt: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Projects
  projects: Project[];
  saveProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  
  // Data management
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("codecraft-language") as Language;
    const savedTheme = localStorage.getItem("codecraft-theme") as Theme;
    const savedProjects = localStorage.getItem("codecraft-projects");
    const savedSidebarState = localStorage.getItem("codecraft-sidebar-open");

    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }

    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    }

    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (error) {
        console.error("Failed to parse saved projects:", error);
      }
    }

    if (savedSidebarState) {
      setSidebarOpen(savedSidebarState === "true");
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("codecraft-language", lang);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    localStorage.setItem("codecraft-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem("codecraft-sidebar-open", String(newState));
  };

  const saveProject = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Only update if the project is different from the last one
    if (projects.length === 0 || 
        projects[0].code !== newProject.code || 
        projects[0].prompt !== newProject.prompt) {
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem("codecraft-projects", JSON.stringify(updatedProjects));
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === id
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    );
    setProjects(updatedProjects);
    localStorage.setItem("codecraft-projects", JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("codecraft-projects", JSON.stringify(updatedProjects));
  };

  const getProject = (id: string) => {
    return projects.find(project => project.id === id);
  };

  const clearAllData = () => {
    // Clear all CodeCraft related localStorage data
    const keys = Object.keys(localStorage).filter(key => key.startsWith("codecraft-"));
    keys.forEach(key => localStorage.removeItem(key));
    
    // Reset state to defaults
    setLanguageState("en");
    setThemeState("light");
    setSidebarOpen(false);
    setProjects([]);
    
    // Reset theme class
    document.documentElement.classList.remove("dark");
    
    // Reload page to ensure clean state
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        projects,
        saveProject,
        updateProject,
        deleteProject,
        getProject,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}