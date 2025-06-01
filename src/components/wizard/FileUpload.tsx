
import React, { useState, useCallback } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { UploadedFile } from '@/types/booking';

interface FileUploadProps {
  service: string;
  files: UploadedFile[];
  onUpdate: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ service, files, onUpdate }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState<string[]>([]);

  const isTshirtService = service === 'tshirt-printing';

  const checkImageTransparency = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const imageData = ctx?.getImageData(0, 0, img.width, img.height);
        if (!imageData) {
          resolve(false);
          return;
        }
        
        // Check for transparency in alpha channel
        for (let i = 3; i < imageData.data.length; i += 4) {
          if (imageData.data[i] < 255) {
            resolve(true);
            return;
          }
        }
        resolve(false);
      };
      
      img.onerror = () => resolve(false);
      img.src = URL.createObjectURL(file);
    });
  };

  const processFile = async (file: File): Promise<UploadedFile> => {
    const fileId = Date.now().toString() + Math.random().toString(36);
    
    // Create URL for the file
    const url = URL.createObjectURL(file);
    
    let isTransparent = false;
    if (isTshirtService && file.type.startsWith('image/')) {
      isTransparent = await checkImageTransparency(file);
    }
    
    return {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      url: url,
      isTransparent: isTransparent
    };
  };

  const handleFiles = async (fileList: File[]) => {
    const validFiles = fileList.filter(file => {
      if (isTshirtService) {
        return file.type === 'image/png';
      }
      return file.type.startsWith('image/') || file.type.startsWith('video/') || file.type === 'application/pdf';
    });

    if (validFiles.length === 0) {
      alert(isTshirtService 
        ? 'Please upload PNG files only for t-shirt printing.'
        : 'Please upload valid image, video, or PDF files.'
      );
      return;
    }

    const fileIds = validFiles.map(f => f.name + Date.now());
    setUploading(prev => [...prev, ...fileIds]);

    try {
      const newFiles = await Promise.all(
        validFiles.map(async (file, index) => {
          // Simulate upload progress
          await new Promise(resolve => setTimeout(resolve, 1000 + (index * 500)));
          return processFile(file);
        })
      );

      onUpdate([...files, ...newFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setUploading([]);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    onUpdate(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Files</h2>
        <p className="text-gray-600">
          {isTshirtService 
            ? 'Upload your design files (PNG with transparent background required)'
            : 'Upload any relevant files for your project'
          }
        </p>
      </div>

      {isTshirtService && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">T-shirt Design Requirements</h3>
              <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                <li>• PNG format only</li>
                <li>• Transparent background required</li>
                <li>• High resolution (300 DPI preferred)</li>
                <li>• Maximum file size: 50MB</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Card 
        className={`border-2 border-dashed transition-all duration-200 ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-gray-500 mb-4">
            {isTshirtService 
              ? 'PNG files with transparent background'
              : 'Images, videos, PDFs up to 50MB each'
            }
          </p>
          <input
            type="file"
            multiple
            accept={isTshirtService ? '.png' : 'image/*,video/*,.pdf'}
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </CardContent>
      </Card>

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((fileId, index) => (
            <div key={fileId} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading file {index + 1}...</span>
                <span className="text-sm text-gray-500">Processing</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Uploaded Files</h3>
          {files.map((file) => (
            <Card key={file.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                        {isTshirtService && file.type.startsWith('image/') && (
                          <span className={`ml-2 ${file.isTransparent ? 'text-green-600' : 'text-red-600'}`}>
                            {file.isTransparent ? '✓ Transparent' : '⚠ No transparency'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isTshirtService && files.some(f => f.type.startsWith('image/') && !f.isTransparent) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Transparency Warning</h3>
              <p className="text-red-700 text-sm mt-1">
                Some uploaded images don't have transparent backgrounds. This may affect print quality.
                Please ensure your PNG files have transparent backgrounds for best results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
