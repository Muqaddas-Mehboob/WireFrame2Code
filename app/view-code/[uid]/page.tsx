"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ViewCodePage() {
  const params = useParams();
  const recordId = params.uid as string;

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecordInfo = async () => {
    try {
      setLoading(true);
      console.log("Fetching record for ID:", recordId);

      const response = await fetch(`/api/wireframe-2-code?recordId=${recordId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch record");
      }

      const data = await response.json();
      console.log("Record data:", data);

      setRecord(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("Error fetching record info:", err);
      setError("Could not load this record. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateCode = async () => {
    if (!recordId) return;

    try {
      setGenerating(true);
      setError(null);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      const data = await response.json();
      console.log("Generated code:", data);

      // update local record state with the newly generated code
      setRecord((prev: any) => ({
        ...prev,
        generatedCode: data.generatedCode,
        status: "completed",
      }));
    } catch (err) {
      console.error("Error generating code:", err);
      setError("Failed to generate code. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!recordId) return;

    const init = async () => {
      const data = await fetchRecordInfo();

      // if this record hasn't been generated yet, trigger generation automatically
      if (data && !data.generatedCode) {
        await generateCode();
      }
    };

    init();
  }, [recordId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!record) return <p>No record found.</p>;

  return (
    <div>
      {generating && <p>Generating code...</p>}
      {record.generatedCode ? (
        <pre>{record.generatedCode}</pre>
      ) : (
        !generating && (
          <button onClick={generateCode} className="px-4 py-2 bg-blue-600 text-white rounded">
            Generate Code
          </button>
        )
      )}
    </div>
  );
}

export default ViewCodePage;