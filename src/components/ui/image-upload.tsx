'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  folder?: string;
  label?: string;
  description?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  folder = 'team-members',
  label = 'Image',
  description = 'Upload an image or provide a URL'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.imageUrl, result.publicId);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleRemove = () => {
    setUrlInput('');
    if (onRemove) {
      onRemove();
    } else {
      onChange('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode('upload')}
            disabled={disabled}
          >
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
          <Button
            type="button"
            variant={uploadMode === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMode('url')}
            disabled={disabled}
          >
            <ImageIcon className="w-4 h-4 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Current Image Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Upload Mode */}
      {uploadMode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={disabled || isUploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </>
            )}
          </Button>
        </div>
      )}

      {/* URL Mode */}
      {uploadMode === 'url' && (
        <div className="flex gap-2">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={disabled}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled || !urlInput.trim()}
          >
            Set URL
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Supported formats: JPEG, PNG, GIF, WebP (max 10MB)
      </p>
    </div>
  );
}
