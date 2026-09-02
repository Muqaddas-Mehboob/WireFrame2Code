"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

function ViewCodePage() {
  const params = useParams();
  // NOTE: this key must match your dynamic route folder name exactly.
  // If the folder is app/.../view-code/[id]/page.tsx, use params.id.
  // If it's [uid], use params.uid. Check your folder name and adjust.
  const recordId = params.uid as string;

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep the latest record in a ref so the polling interval's closure
  // always sees the current status instead of the stale value from
  // when the interval was created (the original bug — it would poll
  // forever even after status became "completed").
  const recordRef = useRef<any>(null);
  useEffect(() => {
    recordRef.current = record;
  }, [record]);

  const fetchRecordInfo = async () => {
    try {
      console.log("[ViewCode] Fetching record for ID:", recordId);

      const response = await fetch(
        `/api/wireframe-2-code?recordId=${recordId}`,
      );
      const data = await response.json();

      if (!response.ok) {
        console.error("[ViewCode] Fetch failed:", response.status, data);
        throw new Error(data?.error || "Failed to fetch record");
      }

      console.log("[ViewCode] Record data:", data);
      setRecord(data);
      setError(null);
      return data;
    } catch (err) {
      console.error("[ViewCode] Error fetching record info:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not load this record. Please try again.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!recordId) return;

    fetchRecordInfo();

    const interval = setInterval(() => {
      if (recordRef.current?.status !== "completed") {
        fetchRecordInfo();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  if (loading && !record) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p>Loading record...</p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-20">{error}</p>;
  }

  if (!record) {
    return <p className="text-center mt-20">No record found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Generated Code</h1>

      {record.status !== "completed" ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin" size={20} />
          <p>Code is still being generated. This page will update automatically...</p>
        </div>
      ) : record.generatedCode ? (
        <pre className="bg-gray-950 text-green-400 text-sm p-5 rounded-md overflow-x-auto whitespace-pre-wrap">
          <code>{record.generatedCode}</code>
        </pre>
      ) : (
        <p className="text-muted-foreground">
          No code was generated for this record.
        </p>
      )}
    </div>
  );
}

export default ViewCodePage;