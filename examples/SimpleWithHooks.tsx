import React, { useState } from 'react';
import {
  VideoPlayer,
  ReactVideoProvider,
  useVideoControlsContext,
  useVideoStateContext
} from '../src';
// Replace with your actual video path
import Video from './video.png';

/**
 * Custom controls component using context hooks
 */
function CustomControls() {
  // Access video context through hooks
  const controls = useVideoControlsContext();
  const state = useVideoStateContext();

  return (
    <div style={{ 
      padding: '10px', 
      background: 'rgba(0,0,0,0.5)', 
      borderRadius: '4px',
      display: 'flex',
      gap: '10px',
      margin: '10px 0'
    }}>
      <button onClick={controls.togglePlay}>
        {state.isPaused ? 'Play' : 'Pause'}
      </button>
      <button onClick={controls.toggleMute}>Mute/Unmute</button>
      <button onClick={() => controls.skip(-10)}>Rewind 10s</button>
      <button onClick={() => controls.skip(10)}>Forward 10s</button>
      
      {/* Simple progress bar */}
      <div style={{ 
        flex: 1, 
        height: '10px', 
        background: '#333', 
        borderRadius: '5px',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute',
          height: '100%',
          width: `${state.percent * 100}%`,
          background: '#f00',
          borderRadius: '5px'
        }} />
      </div>
    </div>
  );
}

/**
 * Example demonstrating how to use VideoPlayer with custom controls
 */
export default function SimpleVideoExample() {
  const [isPaused, setIsPaused] = useState(true);
  
  const handlePlay = () => setIsPaused(false);
  const handlePause = () => setIsPaused(true);
  const handleEnded = () => setIsPaused(true);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Simple Video with Custom Controls</h1>
      
      {/* ReactVideoProvider gives context access to all child components */}
      <ReactVideoProvider>
        {/* Video player container */}
        <div style={{ height: '400px', width: '100%', position: 'relative' }}>
          <VideoPlayer
            src={Video}
            paused={isPaused}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            className="my-video"
          />
        </div>
        
        {/* Custom controls that access context */}
        <CustomControls />
      </ReactVideoProvider>
      
      <div style={{ marginTop: '20px' }}>
        <h2>How It Works</h2>
        <p>
          1. Wrap your VideoPlayer and custom components in ReactVideoProvider<br />
          2. Use the context hooks in any child component<br />
          3. That's it! No need to worry about context initialization or registration
        </p>
      </div>
    </div>
  );
} 