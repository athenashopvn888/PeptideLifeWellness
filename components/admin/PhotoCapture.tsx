'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PhotoCaptureProps {
  bucket: string;
  folder: string;
  onUploadComplete: (url: string) => void;
  label?: string;
  accept?: string;
}

export default function PhotoCapture({
  bucket,
  folder,
  onUploadComplete,
  label = 'Photo',
  accept = 'image/*',
}: PhotoCaptureProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /** Resize & compress to JPEG — max 1280px, 80% quality (~200-400KB) */
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 1280;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Compress image to standard size
      const compressed = await compressImage(file);

      // Preview from compressed blob
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(compressed);

      const supabase = createClient();
      const filePath = `${folder}/${Date.now()}.jpg`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, compressed, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onUploadComplete(urlData.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setPreview(null);
    }
    setUploading(false);
  };

  const clearPhoto = () => {
    setPreview(null);
    setError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-gray-700 max-w-[200px]">
          <img src={preview} alt="Preview" className="w-full h-auto" />
          <button
            onClick={clearPhoto}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/90 text-white text-[10px] py-1 text-center flex items-center justify-center gap-1">
            <CheckCircle size={10} />Uploaded
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          {/* Camera capture (mobile) */}
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.capture = 'environment';
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
            disabled={uploading}
            className="flex-1 flex flex-col items-center gap-1.5 py-4 bg-[#0a0f1c] border border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-teal-400 hover:border-teal-500/50 transition-colors"
          >
            {uploading ? (
              <Loader2 size={20} className="animate-spin text-teal-400" />
            ) : (
              <Camera size={20} />
            )}
            <span className="text-[10px] font-medium">{uploading ? 'Uploading…' : 'Take Photo'}</span>
          </button>

          {/* File upload */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex-1 flex flex-col items-center gap-1.5 py-4 bg-[#0a0f1c] border border-dashed border-gray-700 rounded-xl text-gray-500 hover:text-teal-400 hover:border-teal-500/50 transition-colors"
          >
            <Upload size={20} />
            <span className="text-[10px] font-medium">Browse File</span>
          </button>

          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-red-400 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
