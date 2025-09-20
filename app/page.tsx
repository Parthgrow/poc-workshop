"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const generatePage = async () => {
    try {
      setLoading(true);
      setHtml("");

      const res = await fetch("/api/generate-landing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate page");
      }

      const data = await res.json();
      setHtml(data.html);
    } catch (error) {
      console.error("Error generating page:", error);
      alert("Failed to generate page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Landing Page Generator
            </h1>
            <p className="mt-2 text-gray-600">
              Describe your landing page and watch it come to life!
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              className="w-full h-40 p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your landing page (e.g. A modern startup page for AI workshops with hero section, features, and pricing)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              onClick={generatePage}
              disabled={loading || !prompt.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating..." : "Generate Landing Page"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-[800px]">
          {html ? (
            <iframe
              className="w-full h-full"
              srcDoc={html}
              sandbox="allow-same-origin allow-scripts"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg">Preview will appear here</p>
                <p className="text-sm mt-2">
                  Generated page will be shown in real-time
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
