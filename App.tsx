
import React, { useState } from 'react';
import { Article, SocialPlatform } from './types';
import FileUpload from './components/FileUpload';
import ArticleCard from './components/ArticleCard';
import { generateSocialPost } from './services/geminiService';
import { GithubIcon } from './components/icons/GithubIcon';
import { Logo } from './components/icons/Logo';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [generatingStates, setGeneratingStates] = useState<{ [key: string]: boolean }>({});
  const [generatedPosts, setGeneratedPosts] = useState<{ [key: string]: string | null }>({});
  const [error, setError] = useState<string | null>(null);

  const handleFileUploaded = (data: Article[]) => {
    // Use article URL as a unique key
    const uniqueArticles = Array.from(new Map(data.map(item => [item.url, item])).values());
    setArticles(uniqueArticles);
    setGeneratedPosts({});
    setGeneratingStates({});
    setError(null);
  };

  const handleGeneration = async (article: Article, platform: SocialPlatform) => {
    setGeneratingStates(prev => ({ ...prev, [article.url]: true }));
    setGeneratedPosts(prev => ({ ...prev, [article.url]: null }));
    setError(null);
    try {
      const postText = await generateSocialPost(article, platform);
      setGeneratedPosts(prev => ({ ...prev, [article.url]: postText }));
    } catch (err) {
      console.error('Error generating social post:', err);
      setError('Failed to generate social media post. Please check the console for details.');
    } finally {
      setGeneratingStates(prev => ({ ...prev, [article.url]: false }));
    }
  };

  const clearArticles = () => {
    setArticles([]);
    setGeneratedPosts({});
    setGeneratingStates({});
    setError(null);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center pb-8 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Social Post Automator</h1>
              <p className="text-slate-500 dark:text-slate-400">Generate social media posts for your blog articles instantly.</p>
            </div>
          </div>
          <a href="https://github.com/google-gemini-v2" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
            <GithubIcon className="w-6 h-6" />
          </a>
        </header>

        <main className="mt-8">
          {articles.length === 0 ? (
            <FileUpload onFileUpload={handleFileUploaded} setError={setError} />
          ) : (
             <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Your Articles</h2>
                <button
                  onClick={clearArticles}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-offset-slate-900 transition-all"
                >
                  Upload New File
                </button>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.url}
                    article={article}
                    isGenerating={generatingStates[article.url] || false}
                    generatedPost={generatedPosts[article.url] || null}
                    onGenerate={handleGeneration}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
