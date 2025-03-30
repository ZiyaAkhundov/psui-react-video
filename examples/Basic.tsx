import React, { useState } from 'react';
import { VideoPlayer } from '../src';
import '../src/react-video.css';

const BasicExample = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlay = () => {
    console.log('Video started playing');
    setIsPaused(false);
  };

  const handlePause = () => {
    console.log('Video paused');
    setIsPaused(true);
  };

  const handleEnded = () => {
    console.log('Video playback ended');
    setIsPaused(true);
  };

  const handleTimeUpdate = (current: number, total: number) => {
    setCurrentTime(current);
    setDuration(total);
  };

  const handleVolumeChange = (newVolume: number, muted: boolean) => {
    setVolume(newVolume);
    setIsMuted(muted);
  };

  return (
    <div className="example-container">
      <h1>React Video Player - Basic Example</h1>
      
      <div className="player-wrapper">
        <VideoPlayer
          src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
          paused={isPaused}
          speed={1}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          onVolumeChange={handleVolumeChange}
          className="custom-player"
        />
      </div>
      
      <div className="player-info">
        <h2>Player State</h2>
        <p><strong>Status:</strong> {isPaused ? 'Paused' : 'Playing'}</p>
        <p><strong>Current Time:</strong> {currentTime.toFixed(2)} seconds</p>
        <p><strong>Duration:</strong> {duration.toFixed(2)} seconds</p>
        <p><strong>Volume:</strong> {(volume * 100).toFixed(0)}%</p>
        <p><strong>Muted:</strong> {isMuted ? 'Yes' : 'No'}</p>
      </div>
      
      <div className="instructions">
        <h2>Instructions</h2>
        <p>This example demonstrates the basic functionality of the React Video Player.</p>
        <p>Try using the following keyboard shortcuts:</p>
        <ul>
          <li><strong>Space</strong> or <strong>K</strong>: Play/Pause</li>
          <li><strong>M</strong>: Mute/Unmute</li>
          <li><strong>F</strong>: Toggle Fullscreen</li>
          <li><strong>T</strong>: Toggle Theater Mode</li>
          <li><strong>I</strong>: Toggle Picture-in-Picture</li>
          <li><strong>←</strong> or <strong>J</strong>: Rewind 5 seconds</li>
          <li><strong>→</strong> or <strong>L</strong>: Forward 5 seconds</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicExample; 