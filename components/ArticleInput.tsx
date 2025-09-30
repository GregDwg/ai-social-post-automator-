
import React, { useState } from 'react';
import { Article } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface ArticleInputProps {
  onArticleSubmit: (data: Article) => void;
  setError: (error: string | null) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        if (base64String) {
          resolve(base64String);
        } else {
          reject(new Error("Could not convert file to base64."));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

const ArticleInput: React.FC<ArticleInputProps> = ({ onArticleSubmit, setError }) => {
    const [jsonInput, setJsonInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        let parsedData;
        try {
            if (!jsonInput.trim()) {
                throw new Error('JSON input cannot be empty.');
            }
            parsedData = JSON.parse(jsonInput);
            if (!parsedData.title || !parsedData.url) {
                throw new Error('Invalid JSON structure. "title" and "url" properties are required.');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during JSON parsing.';
            setError(`Failed to parse JSON: ${errorMessage}`);
            return;
        }

        let imageBase64: string | undefined = undefined;
        if (imageFile) {
            try {
                imageBase64 = await fileToBase64(imageFile);
            } catch (err) {
                setError("Failed to read the image file.");
                return;
            }
        }
        
        const newArticle: Article = {
            title: parsedData.title,
            url: parsedData.url,
            summary: parsedData.summary,
            imageBase64,
        };
        
        onArticleSubmit(newArticle);
    };


  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md">
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="json-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Paste Article JSON
                    </label>
                    <textarea
                        id="json-input"
                        rows={5}
                        className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder='{ "title": "My Awesome AI Article", "url": "https://example.com/my-article", "summary": "A short summary..." }'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        required
                        aria-required="true"
                    />
                </div>

                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Upload Cover Image (Optional)
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                        <div className="flex-shrink-0 h-24 w-48 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Image Preview" className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="h-10 w-10 text-slate-400" aria-hidden="true" />
                            )}
                        </div>
                        <label htmlFor="image-upload" className="cursor-pointer bg-white dark:bg-slate-700 py-2 px-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>{imageFile ? 'Change Image' : 'Select Image'}</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all"
                >
                    Process Article
                </button>
            </div>
        </form>
    </div>
  );
};

export default ArticleInput;
