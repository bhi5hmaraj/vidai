import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  file: File;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ file }) => {
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setPlayerUrl(objectUrl);
    } else {
      setPlayerUrl(null); // Clear URL if file is null (e.g., during upload of new file)
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      // Note: Setting playerUrl to null here directly in cleanup might cause issues
      // if the component re-renders before unmounting fully.
      // The primary setting of playerUrl to null should be based on the 'file' prop.
    };
  }, [file]); // Re-run when file changes

  if (!playerUrl) {
    return (
        <div className="w-full bg-black rounded-lg shadow-xl overflow-hidden aspect-video relative flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading video...</p>
        </div>
    );
  }

  return (
    <div className="w-full bg-black rounded-lg shadow-xl overflow-hidden aspect-video relative">
      <ReactPlayer
        url={playerUrl}
        playing={true} 
        controls={true}
        width="100%"
        height="100%"
        onError={(e: any) => {
            console.error('ReactPlayer Error:', e);
            // Optionally, you could set an error state here to display a message to the user
        }}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload', // Example: disable download button
              style: { // Ensure video element fills the ReactPlayer wrapper
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain', // Replicates previous 'object-contain'
              }
            },
          }
        }}
      />
    </div>
  );
};
