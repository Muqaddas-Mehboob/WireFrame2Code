// // "use client";

// // import { useParams } from "next/navigation";
// // import { useEffect, useState } from "react";

// // function ViewCodePage() {
// //   const params = useParams();
// //   const recordId = params.uid as string;

// //   const [record, setRecord] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [generating, setGenerating] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchRecordInfo = async () => {
// //     try {
// //       setLoading(true);
// //       console.log("Fetching record for ID:", recordId);

// //       const response = await fetch(`/api/wireframe-2-code?recordId=${recordId}`);

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch record");
// //       }

// //       const data = await response.json();
// //       console.log("Record data:", data);

// //       setRecord(data);
// //       setError(null);
// //       return data;
// //     } catch (err) {
// //       console.error("Error fetching record info:", err);
// //       setError("Could not load this record. Please try again.");
// //       return null;
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const generateCode = async () => {
// //     if (!recordId) return;

// //     try {
// //       setGenerating(true);
// //       setError(null);

// //       const response = await fetch("/api/generate", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ recordId }),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to generate code");
// //       }

// //       const data = await response.json();
// //       console.log("Generated code:", data);

// //       // update local record state with the newly generated code
// //       setRecord((prev: any) => ({
// //         ...prev,
// //         generatedCode: data.generatedCode,
// //         status: "completed",
// //       }));
// //     } catch (err) {
// //       console.error("Error generating code:", err);
// //       setError("Failed to generate code. Please try again.");
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (!recordId) return;

// //     const init = async () => {
// //       const data = await fetchRecordInfo();

// //       // if this record hasn't been generated yet, trigger generation automatically
// //       if (data && !data.generatedCode) {
// //         await generateCode();
// //       }
// //     };

// //     init();
// //   }, [recordId]);

// //   if (loading) return <p>Loading...</p>;
// //   if (error) return <p className="text-red-500">{error}</p>;
// //   if (!record) return <p>No record found.</p>;

// //   return (
// //     <div>
// //       {generating && <p>Generating code...</p>}
// //       {record.generatedCode ? (
// //         <pre>{record.generatedCode}</pre>
// //       ) : (
// //         !generating && (
// //           <button onClick={generateCode} className="px-4 py-2 bg-blue-600 text-white rounded">
// //             Generate Code
// //           </button>
// //         )
// //       )}
// //     </div>
// //   );
// // }

// // export default ViewCodePage;

// "use client";

// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Loader2 } from "lucide-react";

// function ViewCodePage() {
//   const params = useParams();
//   const recordId = params.uid as string;

//   const [record, setRecord] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchRecordInfo = async () => {
//     try {
//       setLoading(true);
//       console.log("[ViewCode] Fetching record for ID:", recordId);

//       const response = await fetch(`/api/wireframe-2-code?recordId=${recordId}`);
//       const data = await response.json();

//       if (!response.ok) {
//         console.error("[ViewCode] Fetch failed:", response.status, data);
//         throw new Error(data?.error || "Failed to fetch record");
//       }

//       console.log("[ViewCode] Record data:", data);
//       setRecord(data);
//       setError(null);
//     } catch (err) {
//       console.error("[ViewCode] Error fetching record info:", err);
//       setError(
//         err instanceof Error ? err.message : "Could not load this record. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Poll every 2 seconds if the code isn't ready yet — covers the rare case
//   // where the user lands here before ImageUpload.tsx has finished the PATCH call.
//   useEffect(() => {
//     if (!recordId) return;

//     fetchRecordInfo();

//     const interval = setInterval(() => {
//       if (record?.status !== "completed") {
//         fetchRecordInfo();
//       } else {
//         clearInterval(interval);
//       }
//     }, 2000);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [recordId]);

//   if (loading && !record) {
//     return (
//       <div className="flex flex-col items-center justify-center mt-20 gap-3">
//         <Loader2 className="animate-spin" size={32} />
//         <p>Loading record...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <p className="text-red-500 text-center mt-20">{error}</p>;
//   }

//   if (!record) {
//     return <p className="text-center mt-20">No record found.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 px-4">
//       <h1 className="text-2xl font-bold mb-4">Generated Code</h1>

//       {record.status !== "completed" ? (
//         <div className="flex items-center gap-2 text-muted-foreground">
//           <Loader2 className="animate-spin" size={20} />
//           <p>Code is still being generated. This page will update automatically...</p>
//         </div>
//       ) : record.generatedCode ? (
//         <pre className="bg-gray-950 text-green-400 text-sm p-5 rounded-md overflow-x-auto whitespace-pre-wrap">
//           <code>{record.generatedCode}</code>
//         </pre>
//       ) : (
//         <p className="text-muted-foreground">
//           No code was generated for this record.
//         </p>
//       )}
//     </div>
//   );
// }

// export default ViewCodePage;

"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, CodeXml, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

declare global {
  interface Window {
    puter: any;
  }
}

function ImageUpload() {
  const router = useRouter();

  const AIModelList = [
    {
      name: "Gemini 3.1 Flash Lite",
      value: "gemini-3.1-flash-lite",
      icon: "/gemini.jpg",
    },
    {
      name: "Claude Sonnet 4.5",
      value: "claude-sonnet-4-5",
      icon: "/meta.jpg",
    },
    { name: "GPT-5.6 Luna", value: "gpt-5.6-luna", icon: "/deepseek.jpg" },
  ];

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  const uploadToCloudinary = async (file: File, id: string) => {
    setUploading(true);
    try {
      console.log("[Upload] Starting Cloudinary upload for id:", id);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );
      formData.append("public_id", id);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("[Upload] Cloudinary error response:", data);
        throw new Error(data?.error?.message || "Upload failed");
      }

      console.log("[Upload] Success. secure_url:", data.secure_url);
      setUploadedUrl(data.secure_url);
      setError(null);
    } catch (err) {
      console.error("[Upload] Failed:", err);
      setError(
        err instanceof Error ? err.message : "Image upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("[Select] No file selected");
      return;
    }

    const id = crypto.randomUUID();
    console.log("[Select] Generated record id:", id);
    setRecordId(id);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    uploadToCloudinary(file, id);
  };

  const clearImage = () => {
    setPreviewImage(null);
    setUploadedUrl(null);
    setRecordId(null);
  };

  const saveRecord = async (imageUrl: string, id: string) => {
    console.log("[SaveRecord] Saving with id:", id);

    const res = await fetch("/api/wireframe-2-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        imageUrl,
        userDescription: description,
        aiModel: model,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[SaveRecord] Failed:", res.status, data);
      throw new Error(data?.error || "Failed to save record");
    }

    console.log("[SaveRecord] Success:", data);
    return data;
  };

  const waitForPuter = (timeoutMs = 8000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
        if (typeof window !== "undefined" && window.puter) {
          console.log("[Puter] window.puter is ready");
          resolve();
        } else if (Date.now() - start > timeoutMs) {
          reject(
            new Error(
              "Puter.js failed to load. Please refresh the page and try again."
            )
          );
        } else {
          setTimeout(check, 200);
        }
      };
      check();
    });
  };

  const extractContent = (response: any): string => {
    if (typeof response === "string") return response;
    if (response?.message?.content) return response.message.content;
    if (response?.text) return response.text;
    console.warn("[Puter] Unrecognized response shape:", response);
    return JSON.stringify(response);
  };

  const generateWireframeCode = async (
    imageUrl: string,
    desc: string,
    selectedModel: string,
  ) => {
    await waitForPuter();

    const primaryModel = selectedModel || "gemini-3.1-flash-lite";
    const polishModel =
      primaryModel === "claude-sonnet-4-5"
        ? "gemini-3.1-flash-lite"
        : "claude-sonnet-4-5";

    console.log("[Puter] Stage 1: sending image + prompt...");
    const structurePrompt = `You are an expert frontend developer. Analyze this wireframe image and convert it into clean React + Tailwind CSS code. Focus on accurate layout, spacing, and component structure. Context: "${desc}". Return ONLY code, no explanations.`;

    let structureResponse;
    try {
      structureResponse = await window.puter.ai.chat(structurePrompt, imageUrl, {
        model: primaryModel,
      });
    } catch (err: any) {
      console.error(
        "[Puter] Stage 1 failed:",
        err?.message || err?.error || JSON.stringify(err, Object.getOwnPropertyNames(err || {})),
      );
      throw new Error(
        `AI failed to analyze the image: ${err?.message || err?.error?.message || "unknown error"}`,
      );
    }

    console.log("[Puter] Stage 1 raw response:", structureResponse);
    const structureCode = extractContent(structureResponse);
    console.log("[Puter] Stage 1 extracted code length:", structureCode?.length);

    console.log("[Puter] Stage 2: polishing code...");
    const polishPrompt = `Take this React + Tailwind code and enhance it into a high-fidelity, production-ready design. Add proper spacing, modern color palette, hover states, shadows, and polished typography while keeping the same layout structure:\n\n${structureCode}`;

    let polishedResponse;
    try {
      polishedResponse = await window.puter.ai.chat(polishPrompt, {
        model: polishModel,
      });
    } catch (err: any) {
      console.error(
        "[Puter] Stage 2 failed:",
        err?.message || err?.error || JSON.stringify(err, Object.getOwnPropertyNames(err || {})),
      );
      console.warn("[Puter] Falling back to stage 1 output");
      return structureCode;
    }

    console.log("[Puter] Stage 2 raw response:", polishedResponse);
    const finalCode = extractContent(polishedResponse);
    console.log("[Puter] Final code length:", finalCode?.length);

    return finalCode;
  };

  const handleConvertToCode = async () => {
    const missingFields: string[] = [];

    if (!uploadedUrl) missingFields.push("image");
    if (!model) missingFields.push("AI model");
    if (!description.trim()) missingFields.push("description");

    if (missingFields.length > 0) {
      const fieldList =
        missingFields.length === 1
          ? missingFields[0]
          : missingFields.slice(0, -1).join(", ") +
            " and " +
            missingFields[missingFields.length - 1];

      setError(`Please provide the following: ${fieldList}.`);
      return;
    }

    if (!recordId) {
      setError("Something went wrong — image ID missing. Please re-upload.");
      return;
    }

    setError(null);
    let success = false;

    try {
      setLoading(true);

      console.log("[Convert] Step 1: saving record...");
      await saveRecord(uploadedUrl!, recordId);

      console.log("[Convert] Step 2: generating code via Puter...");
      const code = await generateWireframeCode(
        uploadedUrl!,
        description,
        model || "gemini-3.1-flash-lite",
      );

      if (!code || code.trim().length === 0) {
        throw new Error("AI returned empty code. Please try again.");
      }

      console.log("[Convert] Step 3: saving generated code...");
      const patchRes = await fetch("/api/wireframe-2-code", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: recordId,
          generatedCode: code,
          status: "completed",
        }),
      });

      const patchData = await patchRes.json();

      if (!patchRes.ok) {
        console.error("[Convert] PATCH failed:", patchRes.status, patchData);
        throw new Error(patchData?.error || "Failed to save generated code");
      }

      console.log("[Convert] All steps completed successfully");
      success = true;
    } catch (err) {
      console.error("[Convert] Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your code. Please try again."
      );
    } finally {
      setLoading(false);
    }

    if (success && recordId) {
      router.push(`/view-code/${recordId}`);
    }
  };

  return (
    <div className="mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {!previewImage ? (
          <div className="p-7 border border-dashed rounded-md shadow-md">
            <CloudUpload className="mx-auto mb-4 text-primary" size={50} />
            <h2 className="text-lg font-semibold text-center">Upload Image</h2>
            <p className="text-center text-muted-foreground mt-3">
              Select a wireframe image to upload
            </p>
            <div className="p-5 border border-dashed rounded-md mt-5 flex flex-col items-center justify-center gap-3">
              <label htmlFor="imageSelect" className="cursor-pointer">
                <h2 className="p-2 bg-blue-100 text-primary rounded-md px-5 font-bold text-md">
                  Select Image
                </h2>
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="imageSelect"
                onChange={onImageSelect}
                multiple={false}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 border border-dashed rounded-md shadow-md flex flex-col items-center relative">
            <X
              className="cursor-pointer absolute top-3 right-3"
              onClick={clearImage}
            />
            <Image
              src={previewImage}
              alt="Preview"
              width={400}
              height={400}
              className="w-full h-[300px] object-contain"
            />
            {uploading && (
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Loader2 className="animate-spin" size={16} />
                Uploading...
              </div>
            )}
            {uploadedUrl && !uploading && (
              <p className="text-xs text-green-600 mt-2">Uploaded ✓</p>
            )}
          </div>
        )}

        <div className="p-7 border border-dashed rounded-lg shadow-md">
          <h2 className="font-bold text-lg">AI Models</h2>
          <Select onValueChange={(value) => setModel(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {AIModelList.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={m.icon}
                        alt={m.name}
                        width={25}
                        height={25}
                        className="rounded-sm"
                      />
                      <h2>{m.name}</h2>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <h2 className="font-bold text-lg mt-7">
            Enter description about your Webpage
          </h2>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e?.target.value)}
            className="mt-3 h-[200px]"
            placeholder="Write about your webpage"
          />
        </div>
      </div>

      {error && (
        <p className="text-center text-red-500 text-sm mt-4">{error}</p>
      )}

      <div className="flex items-center justify-center mt-10">
        <Button
          className="font-semibold text-lg px-5 py-5 flex items-center gap-2"
          disabled={uploading || loading}
          onClick={handleConvertToCode}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <CodeXml />
          )}
          {loading ? "Processing..." : "Convert to Code"}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;