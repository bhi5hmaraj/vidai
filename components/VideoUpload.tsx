
import React, { useCallback, useRef } from 'react';

interface VideoUploadProps {
  onVideoUpload: (file: File) => void;
  disabled?: boolean;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);


export const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onVideoUpload(file);
    }
  }, [onVideoUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`p-6 bg-gray-800 rounded-lg shadow-lg border-2 border-dashed border-gray-600 hover:border-sky-500 transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={!disabled ? handleClick : undefined}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="video/mp4,video/mpeg,video/mov,video/avi,video/x-flv,video/mpg,video/webm,video/wmv,video/3gpp"
        className="hidden"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-2">
        <UploadIcon className="w-12 h-12 text-gray-400 group-hover:text-sky-400" />
        <p className="text-gray-300">
          <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">MP4, MOV, AVI, WEBM, etc. (Max 2GB recommended)</p>
      </div>
    </div>
  );
};
