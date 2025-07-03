"use client";

import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { 
  TrashIcon, 
  EyeIcon, 
  PencilIcon,
  CalendarIcon,
  CodeBracketIcon 
} from "@heroicons/react/24/outline";
import { useState } from "react";
import CodeViewer from "@/components/code-viewer";

export default function ProjectsPage() {
  const { projects, deleteProject, language } = useApp();
  const t = useTranslation(language);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteProject(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedProjectData = selectedProject 
    ? projects.find(p => p.id === selectedProject)
    : null;

  if (selectedProjectData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6">
            <button
              onClick={() => setSelectedProject(null)}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← {t.myProjects}
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedProjectData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {selectedProjectData.prompt}
            </p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{t.createdAt}: {formatDate(selectedProjectData.createdAt)}</span>
              <span>{t.updatedAt}: {formatDate(selectedProjectData.updatedAt)}</span>
              <span>Model: {selectedProjectData.model}</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <CodeViewer code={selectedProjectData.code} showEditor />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.myProjects}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {projects.length === 0 ? t.noProjects : `${projects.length} projects`}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <CodeBracketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {t.noProjects}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t.createFirstProject}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.prompt}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedProject(project.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                      {t.view}
                    </button>
                    
                    <button
                      onClick={() => handleDelete(project.id)}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        deleteConfirm === project.id
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}