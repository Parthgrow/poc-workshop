import { kv } from "@vercel/kv";
import { notFound } from "next/navigation";

interface WorkshopData {
  id: string;
  prompt: string;
  aiGeneratedCopy: {
    headline: string;
    subheadline: string;
    cta: string;
    theme: string;
  };
  createdAt: string;
  status: string;
}

interface WorkshopPageProps {
  params: {
    slug: string;
  };
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = params;

  try {
    console.log("Fetching workshop with slug:", slug);

    // Fetch workshop data from KV using the slug as the key
    const workshopData = (await kv.get(
      `workshop:${slug}`
    )) as WorkshopData | null;

    console.log("the value of workshop data is ", workshopData);

    if (!workshopData) {
      console.log("No workshop data found for slug:", slug);
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {workshopData.aiGeneratedCopy.headline}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {workshopData.aiGeneratedCopy.subheadline}
              </p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors">
                {workshopData.aiGeneratedCopy.cta}
              </button>
            </div>
          </div>
        </div>

        {/* Workshop Details */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Workshop Details
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Original Description:
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {workshopData.prompt}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Workshop Information:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Workshop ID:</strong> {workshopData.id}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{workshopData.status}</span>
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(workshopData.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Theme:</strong>{" "}
                      <span className="capitalize">
                        {workshopData.aiGeneratedCopy.theme}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    AI Generated Content:
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Headline:</strong>{" "}
                      {workshopData.aiGeneratedCopy.headline}
                    </p>
                    <p>
                      <strong>Subheadline:</strong>{" "}
                      {workshopData.aiGeneratedCopy.subheadline}
                    </p>
                    <p>
                      <strong>Call to Action:</strong>{" "}
                      {workshopData.aiGeneratedCopy.cta}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Register for Workshop
              </button>
              <button className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Share Workshop
              </button>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Edit Workshop
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-8 text-center text-gray-600">
            <p>Workshop created with AI assistance • ID: {workshopData.id}</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching workshop data:", error);
    console.error("Error details:", error);
    notFound();
  }
}
