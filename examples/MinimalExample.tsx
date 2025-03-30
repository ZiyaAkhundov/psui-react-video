import React, { useState } from 'react';
import {
  VideoPlayer,
  ReactVideoProvider,
  useVideoControlsContext
} from '../src';

/**
 * Minimal example demonstrating React Video with context hooks
 */
export default function MinimalExample() {
  const [isPaused, setIsPaused] = useState(true);

  const handlePlay = () => setIsPaused(false);
  const handlePause = () => setIsPaused(true);

  return (
    <div>
      <h2>React Video with Context Hooks</h2>
      
      <ReactVideoProvider>
        {/* Video Player */}
        <div style={{ height: "300px", width: "100%", maxWidth: "800px" }}>
          <VideoPlayer
            src="https://example.com/video.mp4"
            paused={isPaused}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>
        
        {/* Simple custom control */}
        <PlayPauseButton />
      </ReactVideoProvider>
    </div>
  );
}

/**
 * Simple component showing the basic hook usage
 */
function PlayPauseButton() {
  // Access video controls through context
  const { togglePlay } = useVideoControlsContext();
  
  return (
    <button 
      onClick={togglePlay}
      style={{ 
        margin: '10px 0',
        padding: '8px 16px',
        background: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Play/Pause
    </button>
  );
} 