"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("/api/workshops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create workshop");
      }

      const data = await res.json();
      console.log("base features : the value of the data is ", data);
      // setResult(data);
    } catch (error) {
      console.error("Error creating workshop:", error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : "Failed to create workshop"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Workshop Landing Page Builder
          </h1>
          <p className="text-xl text-gray-600">
            Describe your workshop idea and we&apos;ll create everything for you
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Create Your Workshop
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="prompt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Describe Your Workshop
              </label>
              <textarea
                id="prompt"
                name="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., I want to create a workshop about 'Master AI for Business' where participants will learn how to leverage artificial intelligence to transform their business operations, increase efficiency, and drive growth. The workshop will be held on February 15th at 2 PM and will include practical AI applications, implementation strategies, and real-world case studies."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Workshop..." : "Create Workshop"}
            </button>
          </form>

          {/* {result && (
            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Workshop Created Successfully!
              </h3>
              <p className="text-green-700 text-sm mb-4">
                Your workshop has been created and stored in the database.
              </p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Generated Workshop Details:
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Coach ID:</strong> {result.workshop.coachId}
                  </p>
                  <p>
                    <strong>Title:</strong> {result.workshop.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {result.workshop.description}
                  </p>
                  <p>
                    <strong>Date & Time:</strong>{" "}
                    {new Date(result.workshop.dateTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  AI Generated Marketing Content:
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Headline:</strong>{" "}
                    {result.workshop.aiGeneratedCopy.headline}
                  </p>
                  <p>
                    <strong>Subheadline:</strong>{" "}
                    {result.workshop.aiGeneratedCopy.subheadline}
                  </p>
                  <p>
                    <strong>CTA:</strong> {result.workshop.aiGeneratedCopy.cta}
                  </p>
                  <p>
                    <strong>Theme:</strong>{" "}
                    {result.workshop.aiGeneratedCopy.theme}
                  </p>
                </div>
              </div>

              <a
                href={result.landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Landing Page
              </a>
              <p className="text-xs text-gray-500 mt-2">
                Note: The landing page will show &quot;not published&quot; until
                you publish it.
              </p>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
