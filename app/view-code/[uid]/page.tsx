"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ViewCodePage() {
  const params = useParams();
  const recordId = params.uid as string; // <-- fixed: folder is [uid], so params.uid

  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recordId) return;

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
      } catch (err) {
        console.error("Error fetching record info:", err);
        setError("Could not load this record. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecordInfo();
  }, [recordId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!record) return <p>No record found.</p>;

  return (
    <div>
      <pre>{record.generatedCode}</pre>
      <div>View Code</div>
    </div>
  );
}

export default ViewCodePage;