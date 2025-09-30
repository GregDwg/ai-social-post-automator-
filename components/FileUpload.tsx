
import React, { useState, useCallback } from 'react';
import { Article } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (data: Article[]) => void;
  setError: (error: string | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const data = JSON.parse(content);
            // Basic validation
            if (Array.isArray(data) && data.every(item => item.title && item.url)) {
              onFileUpload(data);
              setError(null);
            } else {
              throw new Error('Invalid JSON structure. Expected an array of objects with "title" and "url" properties.');
            }
          }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during parsing.';
            setError(`Failed to parse JSON file: ${errorMessage}`);
        }
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
      }
      reader.readAsText(file);
    } else {
      setError('Please upload a valid JSON file.');
    }
  };
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}
        >
            <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-5 text-lg font-semibold text-slate-700 dark:text-slate-200">
                    <span className="text-indigo-600 dark:text-indigo-400">Upload a file</span> or drag and drop
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">JSON file with your article list</p>
            </div>
        </div>
    </div>
  );
};

export default FileUpload;
