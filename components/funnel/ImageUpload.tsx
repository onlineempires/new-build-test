import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept?: string;
  className?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  placeholder = 'Upload an image or enter URL',
  accept = 'image/*',
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compression removed - sending original file directly to Bunny.net

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, GIF, WebP)');
      return;
    }

    setUploading(true);
    try {
      // Check file size (5MB limit for Bunny.net)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Please use a smaller image file (max 5MB).');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      // Use API v2 upload route (proxied by Next.js to backend)
      // Attach Authorization header (same token used by other API calls)
      const authTokens = JSON.parse(localStorage.getItem('authTokens') || '{}');
      const token = authTokens?.access_token as string | undefined;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/v2/upload/image', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onChange(data.url);
      } else {
        // Get detailed error message from server
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Upload failed (${response.status})`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="mb-3 block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="space-y-3">
          {/* Image Preview */}
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="h-32 w-full max-w-sm rounded-lg border border-gray-300 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="flex hidden h-32 w-full max-w-sm items-center justify-center rounded-lg border border-gray-300 bg-gray-100">
              <div className="text-center text-gray-500">
                <Image className="mx-auto mb-2 h-8 w-8" />
                <p className="text-sm">Image failed to load</p>
              </div>
            </div>
            <button
              onClick={removeImage}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* URL Input for manual entry */}
          <div>
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Or enter image URL directly"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Upload Area */}
          <div
            className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              disabled={uploading}
            />

            <div className="space-y-3">
              {uploading ? (
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
              ) : (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploading ? 'Uploading to CDN...' : 'Drop an image here, or click to browse'}
                </p>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, WebP • Max 5MB</p>
              </div>

              {!uploading && (
                <button
                  type="button"
                  className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </button>
              )}
            </div>
          </div>

          {/* URL Input Alternative */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">or enter URL</span>
            </div>
          </div>

          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
          />
        </div>
      )}
    </div>
  );
}
