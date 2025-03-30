import { useState } from 'react';
import VideoFile from './WhatsApp Video 2025-03-20 at 11.22.09_3a8028e9.mp4'
import { useVideoControlsContext, VideoPlayer, StandaloneVideoProvider } from '@psui/react-video'

function LoadingControls() {
  return (
    <div className="custom-controls loading">
      <button disabled>Play/Pause</button>
      <button disabled>Mute/Unmute</button>
      <button disabled>Rewind 10s</button>
      <button disabled>Forward 10s</button>
      <button disabled>Change Speed</button>
    </div>
  );
}

function VideoControls() {
  const { togglePlay, toggleMute, skip, changePlaybackSpeed } = useVideoControlsContext();
  
  return (
    <div className="custom-controls">
      <button onClick={togglePlay}>Play/Pause</button>
      <button onClick={toggleMute}>Mute/Unmute</button>
      <button onClick={() => skip(-10)}>Rewind 10s</button>
      <button onClick={() => skip(10)}>Forward 10s</button>
      <button onClick={changePlaybackSpeed}>Change Speed</button>
    </div>
  );
}

function App() {
  const [isPaused, setIsPaused] = useState(true);

  const handlePlay = () => {
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleEnded = () => {
    setIsPaused(true);
  };

  return (
    <div>
      <div style={{ height: "300px", width: "800px", position: "relative" }}>
        <VideoPlayer
          src={VideoFile}
          paused={isPaused}
          speed={1}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="custom-player"
        />
      </div>
      
      <StandaloneVideoProvider 
        videoPlayerSelector=".ps-video-container"
        fallback={<LoadingControls />}
        pollingInterval={200}
      >
        <VideoControls />
      </StandaloneVideoProvider>
    </div>
  );
}

export default App; 