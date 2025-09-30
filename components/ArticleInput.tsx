
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
    <div className="max-w-2xl mx-auto bg-background-alt dark:bg-dark-background-alt p-8 rounded-xl shadow-sm">
        <form onSubmit={handleSubmit}>
            <div className="space-y-6">
                <div>
                    <label htmlFor="json-input" className="block text-sm font-medium text-body dark:text-dark-body mb-2">
                        Paste Article JSON
                    </label>
                    <textarea
                        id="json-input"
                        rows={5}
                        className="w-full p-3 bg-background dark:bg-dark-background border border-background-subtle dark:border-dark-border rounded-md focus:ring-brand focus:border-brand transition-colors text-body dark:text-dark-body"
                        placeholder='{ "title": "My Awesome AI Article", "url": "https://example.com/my-article", "summary": "A short summary..." }'
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        required
                        aria-required="true"
                    />
                </div>

                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-body dark:text-dark-body mb-2">
                        Upload Cover Image (Optional)
                    </label>
                    <div className="mt-1 flex items-center gap-4">
                        <div className="flex-shrink-0 h-24 w-48 bg-background-secondary dark:bg-dark-background rounded-md flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Image Preview" className="h-full w-full object-cover" />
                            ) : (
                                <ImageIcon className="h-10 w-10 text-body/50" aria-hidden="true" />
                            )}
                        </div>
                        <label htmlFor="image-upload" className="cursor-pointer bg-background dark:bg-dark-background-alt py-2 px-3 border border-background-subtle dark:border-dark-border rounded-md shadow-sm text-sm leading-4 font-medium text-body dark:text-dark-body hover:bg-background-secondary dark:hover:bg-dark-background focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand">
                            <span>{imageFile ? 'Change Image' : 'Select Image'}</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-background-subtle dark:border-dark-border pt-6">
                <button
                    type="submit"
                    className="w-full px-4 py-3 text-sm font-semibold text-white bg-brand rounded-lg hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand dark:focus:ring-offset-dark-background-alt transition-all"
                >
                    Process Article
                </button>
            </div>
        </form>
    </div>
  );
};

export default ArticleInput;