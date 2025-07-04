"use client";
import { useState } from "react";

export default function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <footer className="mb-2 sm:mb-3 mt-3 sm:mt-5 flex h-12 sm:h-16 w-full flex-col items-center justify-between space-y-2 sm:space-y-3 px-2 sm:px-3 pt-2 sm:pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div>
        <div className="font-medium">
          <a
            href="https://gitorbit-ai.vercel.app/"
            className="font-semibold text-blue-600 underline-offset-4 transition hover:text-gray-700 hover:underline text-xs sm:text-sm"
            target="_blank"
          >
            Try our GitOrbit
          </a>
        </div>
      </div>

      <div className="flex items-center space-x-4 sm:space-x-6 pb-2 sm:pb-4 sm:pb-0 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setShowPrivacy(true)}
          className="text-gray-600 hover:text-blue-600 transition"
        >
          Privacy Policy
        </button>
        <button
          onClick={() => setShowFAQ(true)}
          className="text-gray-600 hover:text-blue-600 transition"
        >
          FAQ
        </button>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 sm:p-6 shadow-lg">
            <h2 className="mb-2 text-base sm:text-lg font-semibold text-gray-800">Privacy Policy</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              We value your privacy. CodeCraft does not collect personal data without consent.
              Any data processed through code generation remains secure and is not stored
              permanently. Third-party services like GitHub OAuth follow their respective policies.
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowPrivacy(false)}
                className="rounded-md bg-blue-600 px-3 sm:px-4 py-1 sm:py-1.5 text-white hover:bg-blue-700 transition text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-4 sm:p-6 shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="mb-2 text-base sm:text-lg font-semibold text-gray-800">Frequently Asked Questions</h2>
            <ul className="list-disc pl-4 sm:pl-5 text-xs sm:text-sm text-gray-600 space-y-2">
              <li>
                <strong>What is CodeCraft?</strong> <br />
                CodeCraft is an AI-powered code generation platform built for developers to convert natural language into working code.
              </li>
              <li>
                <strong>Is it free to use?</strong> <br />
                Yes, basic usage is free. Premium features may be introduced in the future.
              </li>
              <li>
                <strong>Which model does CodeCraft use?</strong> <br />
                Currently, CodeCraft supports multiple AI models including Gemini, Llama, DeepSeek, and Mistral.
              </li>
            </ul>
            <div className="mt-4 text-right">
              <button
                onClick={() => setShowFAQ(false)}
                className="rounded-md bg-blue-600 px-3 sm:px-4 py-1 sm:py-1.5 text-white hover:bg-blue-700 transition text-xs sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}