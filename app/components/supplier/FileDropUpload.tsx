"use client";

import React, { useState, useRef } from "react";
import { createClient } from "../../lib/supabase/client";

interface FileDropUploadProps {
  label: string;
  onUploadComplete: (url: string) => void;
}

export default function FileDropUpload({ label, onUploadComplete }: FileDropUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setFileName(file.name);

    try {
      // 1. Generate a unique path: e.g., verified_docs/timestamp-filename.pdf
      const fileExt = file.name.split(".").pop();
      const cleanFileName = `${Date.now()}.${fileExt}`;
      const filePath = `verified_docs/${cleanFileName}`;

      // 2. Upload the file to our Supabase Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from("supplier-verification-docs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get public URL to store inside our database schema
      const { data } = supabase.storage
        .from("supplier-verification-docs")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        onUploadComplete(data.publicUrl);
      }
    } catch (err) {
      console.error("Storage upload error:", err);
      alert("Failed to upload document. Please try again.");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">{label}</label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[140px] ${
          dragActive ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300 bg-white"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-500 mt-2">Uploading: {fileName}</p>
          </div>
        ) : fileName ? (
          <div className="text-center">
            <span className="text-xl">📄</span>
            <p className="text-sm font-medium text-slate-800 mt-1 truncate max-w-[240px]">{fileName}</p>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">✓ Uploaded Successfully</p>
          </div>
        ) : (
          <div>
            <span className="text-2xl text-slate-400">📤</span>
            <p className="text-sm font-medium text-slate-700 mt-2">Drag and drop file here, or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, or JPG (Max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}