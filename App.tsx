
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { VideoUpload } from './components/VideoUpload';
import { VideoPlayer } from './components/VideoPlayer';
import { ChatHistory } from './components/ChatHistory';
import { ChatInput } from './components/ChatInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProgressBar } from './components/ProgressBar';
import { ModelSelector, ModelOption } from './components/ModelSelector';
import { uploadVideo, UploadedVideoFile as GeminiUploadedVideoFile } from './services/geminiService';
import { generateVideoChatMessage } from './services/geminiService';
import { ChatMessage as AppChatMessage } from './types';

const App: React.FC = () => {
  const [uploadedLocalFile, setUploadedLocalFile] = useState<File | null>(null);
  const [geminiVideoFile, setGeminiVideoFile] = useState<GeminiUploadedVideoFile | null>(null);
  const [chatMessages, setChatMessages] = useState<AppChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // For AI responses
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false); // For video upload & processing
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<ModelOption>('gemini-2.5-flash-preview-04-17');

  const handleModelChange = (model: ModelOption) => {
    setSelectedModel(model);
  };

  const handleVideoUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setError(null); 
    setChatMessages([]);
    setGeminiVideoFile(null);
    setUploadedLocalFile(null); 

    setUploadedLocalFile(file); 

    try {
      const uploadedFileInfo = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      setGeminiVideoFile(uploadedFileInfo);
      setUploadProgress(100); 

      const summaryPrompt = "Please summarize this video in detail, highlighting key events, objects, and any spoken content if applicable.";
      // Use the currently selected model for the initial summary
      await handleSendMessage(summaryPrompt, uploadedFileInfo, selectedModel, true); 

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error during video upload/processing.';
      setError(`Upload failed: ${errorMessage}`);
      setUploadedLocalFile(null); 
      setGeminiVideoFile(null);
      setUploadProgress(0); 
    } finally {
      setIsUploading(false);
    }
  }, [selectedModel]); // Added selectedModel to dependency array

  const handleSendMessage = useCallback(async (
    prompt: string, 
    currentVideoFile?: GeminiUploadedVideoFile | null, 
    modelToUse?: ModelOption,
    initialSummary: boolean = false
  ) => {
    const videoToUse = currentVideoFile || geminiVideoFile;
    const currentModel = modelToUse || selectedModel;
    if (!videoToUse || !prompt.trim()) return;

    if (!initialSummary) {
        const newUserMessage: AppChatMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        text: prompt,
        timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, newUserMessage]);
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseText = await generateVideoChatMessage(videoToUse, prompt, currentModel);
      const newAiMessage: AppChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newAiMessage]);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error fetching AI response.';
      setError(`AI Error: ${errorMessage}`);
      const errorAiMessage: AppChatMessage = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: `Sorry, I couldn't process that: ${errorMessage}`,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [geminiVideoFile, selectedModel]); // Added selectedModel to dependency array

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col space-y-4">
          <VideoUpload onVideoUpload={handleVideoUpload} disabled={isUploading || isLoading} />
          {isUploading && (
            <div className="flex flex-col items-center justify-center p-4 bg-gray-800 rounded-lg">
              <ProgressBar progress={uploadProgress} />
              <div className="flex items-center mt-2">
                <LoadingSpinner />
                <span className="ml-2 text-sm">
                  {uploadProgress < 100 ? `Processing video: ${uploadProgress.toFixed(0)}%` : 'Finalizing...'}
                </span>
              </div>
            </div>
          )}
          {uploadedLocalFile && !isUploading && geminiVideoFile && (
            <VideoPlayer file={uploadedLocalFile} />
          )}
           {error && !isUploading && ( 
            <div className="bg-red-700 text-white p-3 rounded-md text-sm">
              <p>{error}</p>
            </div>
          )}
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-sky-400 mb-2">About VidAI</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              VidAI (pronounced <span className="italic">'Vid-A-I'</span>) cleverly combines 'Video' and 'AI' to highlight its core function: advanced AI-powered video understanding. 
              The name also subtly alludes to the Tamil word <span className="font-semibold">'vidai' (விடை)</span>, meaning 'answer' or 'solution', reflecting the app's ability to provide insightful answers derived from your video content.
            </p>
          </div>
          <ModelSelector 
            currentModel={selectedModel} 
            onModelChange={handleModelChange}
            disabled={isUploading || isLoading}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col bg-gray-800 rounded-lg shadow-xl h-[65vh] lg:h-[calc(100vh-195px)]">
          <div className="p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-semibold text-sky-400">Chat with Video</h2>
          </div>
          <ChatHistory messages={chatMessages} />
          {isLoading && !isUploading && ( 
            <div className="p-4 flex justify-center items-center flex-shrink-0">
              <LoadingSpinner /> 
              <span className="ml-2">AI is thinking...</span>
            </div>
          )}
           {error && !isLoading && !isUploading && ( 
            <div className="bg-red-700 text-white p-3 rounded-md text-sm mx-4 mb-2 flex-shrink-0">
              <p>{error}</p>
            </div>
          )}
          <ChatInput onSendMessage={(msg) => handleSendMessage(msg, geminiVideoFile, selectedModel)} disabled={!geminiVideoFile || isLoading || isUploading} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
