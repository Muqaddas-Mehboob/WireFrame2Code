"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, CodeXml, X, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function ImageUpload() {
  const AIModelList = [
    { name: "Google Gemini", value: "google-gemini", icon: "/gemini.jpg" },
    { name: "Llama By Meta", value: "llama-meta", icon: "/meta.jpg" },
    { name: "Deepseek", value: "deepseek", icon: "/deepseek.jpg" },
  ];

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [model, setModel] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedUrl(data.secure_url);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);

    uploadToCloudinary(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    setUploadedUrl(null);
  };

  const saveRecord = async (imageUrl: string) => {
    const res = await fetch("/api/wireframe-2-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl,
        userDescription: description,
        aiModel: model,
      }),
    });

    if (!res.ok) throw new Error("Failed to save record");

    const record = await res.json();
    return record; // includes record.id, needed for the generate-code step
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

    setError(null);

    try {
      setSubmitting(true);

      const record = await saveRecord(uploadedUrl!);

      console.log("Record saved:", record);

      // next: call /api/generate with record.id to trigger AI code generation
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving your request. Please try again.");
    } finally {
      setSubmitting(false);
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
                {AIModelList.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex items-center gap-4">
                      <Image
                        src={model.icon}
                        alt={model.name}
                        width={25}
                        height={25}
                        className="rounded-sm"
                      />
                      <h2>{model.name}</h2>
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
          disabled={uploading || submitting}
          onClick={handleConvertToCode}
        >
          {submitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <CodeXml />
          )}
          {submitting ? "Processing..." : "Convert to Code"}
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;