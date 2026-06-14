"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: "square" | "wide";
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = "Upload Image",
  aspectRatio = "square",
  className,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Upload failed");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative rounded-xl border-2 border-dashed border-neutral-200 overflow-hidden cursor-pointer hover:border-brand-green-400 transition-colors bg-neutral-50",
          aspectRatio === "square" ? "aspect-square w-32" : "aspect-video w-full",
          uploading && "pointer-events-none opacity-70"
        )}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={clear}
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </>
        ) : uploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-brand-green-600" />
            <span className="text-xs text-neutral-500">Uploading…</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-green-100 flex items-center justify-center">
              <Upload className="h-4 w-4 text-brand-green-600" />
            </div>
            <span className="text-xs text-neutral-500 text-center px-2">{label}</span>
          </div>
        )}
      </div>

      {!value && (
        <p className="text-xs text-neutral-400">JPEG, PNG, WebP · max 5 MB</p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInput}
      />
    </div>
  );
}
