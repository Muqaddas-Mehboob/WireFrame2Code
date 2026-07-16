"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, CodeXml, X } from "lucide-react";
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

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
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
                className="hidden"
                id="imageSelect"
                onChange={onImageSelect}
                multiple={false}
              />
            </div>
          </div>
        ) : (
          <div className="p-5 border border-dashed rounded-md shadow-md flex justify-center">
            <X
              className="cursor-pointer"
              onClick={() => setPreviewImage(null)}
            />
            <Image
              src={previewImage}
              alt="Preview"
              width={400}
              height={400}
              className="w-full h-[300px] object-contain"
            />
          </div>
        )}

        <div className="p-7 border border-dashed rounded-lg shadow-md">
          <h2 className="font-bold text-lg">AI Models</h2>
          <Select>
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
            className="mt-3 h-[200px]"
            placeholder="Write about your webpage"
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-10">
        <Button className="font-semibold text-lg px-5 py-5 flex items-center gap-2">
          <CodeXml />
          Convert to Code
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
