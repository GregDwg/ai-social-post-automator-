
import React, { useState } from 'react';
import { Article, SocialPlatform } from '../types';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ArticleCardProps {
  article: Article;
  isGenerating: boolean;
  generatedPost: string | null;
  onGenerate: (article: Article, platform: SocialPlatform) => void;
}

const SocialButton: React.FC<{ platform: SocialPlatform, selected: boolean, onClick: () => void, disabled: boolean }> = ({ platform, selected, onClick, disabled }) => {
    const icons: { [key in SocialPlatform]: React.ReactNode } = {
        [SocialPlatform.Twitter]: <TwitterIcon className="w-5 h-5" />,
        [SocialPlatform.LinkedIn]: <LinkedInIcon className="w-5 h-5" />,
        [SocialPlatform.Facebook]: <FacebookIcon className="w-5 h-5" />,
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex-1 p-2.5 flex justify-center items-center gap-2 rounded-md transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800
                ${selected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {icons[platform]}
            {platform}
        </button>
    );
};

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isGenerating, generatedPost, onGenerate }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>(SocialPlatform.Twitter);
  const [copied, setCopied] = useState(false);
  const imageUrl = article.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(article.title)}/1200/630`;

  const handleGenerateClick = () => {
    onGenerate(article, selectedPlatform);
  };
  
  const handleCopy = () => {
    if (generatedPost) {
        navigator.clipboard.writeText(generatedPost);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-slate-700/50">
      <img className="h-48 w-full object-cover" src={imageUrl} alt={article.title} />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate" title={article.title}>
          {article.title}
        </h3>
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all">
          {article.url}
        </a>
        <div className="mt-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Select a platform:</p>
            <div className="flex gap-2">
                {(Object.values(SocialPlatform)).map(platform => (
                    <SocialButton 
                        key={platform}
                        platform={platform}
                        selected={selectedPlatform === platform}
                        onClick={() => setSelectedPlatform(platform)}
                        disabled={isGenerating}
                    />
                ))}
            </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all flex items-center justify-center"
          >
            {isGenerating ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
                </>
            ) : 'Generate Post'}
          </button>
        </div>

        {generatedPost && !isGenerating && (
            <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-fade-in">
                <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Generated Post:</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{generatedPost}</p>
                 <button onClick={handleCopy} className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                    {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
