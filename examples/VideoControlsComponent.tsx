import React from 'react';
import {
  useVideoControlsContext,
  useVideoStateContext
} from '../src';

// Custom Video Controls component that uses the video context hooks
export default function VideoControls() {
  // Simply use the context hooks - they will automatically have default values until real ones are available
  const videoControls = useVideoControlsContext();
  const videoState = useVideoStateContext();

  return (
    <div className="custom-controls" style={{ 
      padding: '10px', 
      background: 'rgba(0,0,0,0.7)', 
      borderRadius: '4px',
      margin: '10px 0',
      display: 'flex',
      gap: '10px'
    }}>
      <button onClick={videoControls.togglePlay}>
        {videoState.isPaused ? 'Play' : 'Pause'}
      </button>
      <button onClick={videoControls.toggleMute}>
        Mute/Unmute
      </button>
      <button onClick={() => videoControls.skip(-10)}>
        Rewind 10s
      </button>
      <button onClick={() => videoControls.skip(10)}>
        Forward 10s
      </button>
      <button onClick={videoControls.changePlaybackSpeed}>
        Change Speed
      </button>
      <div style={{ 
        flex: 1, 
        height: '10px', 
        background: '#333', 
        borderRadius: '5px',
        position: 'relative',
        alignSelf: 'center'
      }}>
        <div style={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${videoState.percent * 100}%`,
          background: 'red',
          borderRadius: '5px'
        }} />
      </div>
    </div>
  );
} 