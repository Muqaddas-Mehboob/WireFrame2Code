"use client";

import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

function ImageUpload() {
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
            <CloudUpload className="mx-auto mb-4" size={50} />

            <h2 className="text-lg font-semibold text-center">
              Upload Image
            </h2>

            <p className="text-center text-muted-foreground mt-3">
              Select a wireframe image to upload
            </p>

            <div className="p-5 border border-dashed rounded-md mt-5 flex flex-col items-center justify-center gap-3">
              <label htmlFor="imageSelect" className="cursor-pointer">
                <h2 className="p-2 bg-primary text-white rounded-md px-5">
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
            <X className="cursor-pointer"
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
          <h2 className="font-bold text-lg">Enter description about your Webpage</h2>
          <Textarea className="mt-3 h-[200px]" placeholder="Write about your webpage" />
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;