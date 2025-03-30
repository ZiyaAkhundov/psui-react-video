# React Video Master

A modern, responsive React video player component with customizable controls, thumbnail previews, and multiple viewing modes.

![React Video Master](./examples/video.png)

## Features

- 🎮 **Responsive Controls**: Play/pause, volume, timeline, fullscreen, and more
- 🎛️ **Playback Control**: Speed control, skip forward/backward
- 📱 **Multiple Viewing Modes**: Standard, theater, fullscreen, and picture-in-picture
- 👍 **Modern UI**: Clean, minimal interface with customizable styles
- 🖼️ **Video Thumbnails**: Preview thumbnails when hovering over the timeline
- ⌨️ **Keyboard Shortcuts**: Navigation and control via keyboard
- 🎯 **Timeline Scrubbing**: Intuitive timeline navigation
- 🔊 **Volume Controls**: Mute, volume slider with visual indicators
- 🔄 **Progress Tracking**: Visual display of video progress
- 📦 **TypeScript Support**: Full type definitions included
- 🪝 **Custom Hooks**: Access player state and controls in your application
- 🔌 **Callback Support**: Hooks for play, pause, end, and other events
- 🛠️ **React 18/19 Compatible**: Works with the latest React versions
- 🔄 **Context Provider**: Access video controls and state from anywhere in your app

## Installation

```bash
npm install react-video-master
# or
yarn add react-video-master
# or
pnpm add react-video-master
```

## Quick Start

```jsx
import React from 'react';
import { VideoPlayer } from 'react-video-master';
// if needed
import 'react-video-master/style.css';

function App() {
  return (
    <div className="app">
      <VideoPlayer 
        src="https://example.com/video.mp4"
        onPlay={() => console.log('Video started playing')}
        onPause={() => console.log('Video paused')}
        onEnded={() => console.log('Video ended')}
      />
    </div>
  );
}

export default App;
```

## Props

The `VideoPlayer` component accepts the following props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | *Required* | URL of the video source |
| `paused` | `boolean` | `true` | Initial paused state of the video |
| `speed` | `number` | `1` | Initial playback speed |
| `onPlay` | `() => void` | `undefined` | Callback triggered when video starts playing |
| `onPause` | `() => void` | `undefined` | Callback triggered when video is paused |
| `onEnded` | `() => void` | `undefined` | Callback triggered when video ends |
| `onTimeUpdate` | `(currentTime: number, duration: number) => void` | `undefined` | Callback triggered on time update |
| `onVolumeChange` | `(volume: number, muted: boolean) => void` | `undefined` | Callback triggered when volume changes |
| `className` | `string` | `''` | Additional CSS class to apply to the container |
| `children` | `ReactNode` | `undefined` | Children elements to render inside the player |

## Context Provider

The library includes a `ReactVideoProvider` that makes it easy to access the video's state and controls from anywhere in your application.

```jsx
import React from 'react';
import { VideoPlayer, ReactVideoProvider } from 'react-video-master';

function App() {
  return (
    <ReactVideoProvider>
      <div style={{ height: "300px", width: "100%" }}>
        <VideoPlayer src="https://example.com/video.mp4" />
      </div>
      <CustomControls />
    </ReactVideoProvider>
  );
}
```

## Hooks

The library exports several hooks that allow you to control the video player programmatically:

### useVideoStateContext

Access the video player's state from anywhere inside a `ReactVideoProvider`:

```jsx
import { useVideoStateContext } from 'react-video-master';

function VideoInfo() {
  const { isPaused, currentTime, totalTime, playbackSpeed } = useVideoStateContext();
  
  return (
    <div>
      <p>Status: {isPaused ? 'Paused' : 'Playing'}</p>
      <p>Current time: {currentTime}</p>
      <p>Total time: {totalTime}</p>
      <p>Playback speed: {playbackSpeed}</p>
    </div>
  );
}
```

### useVideoControlsContext

Control the video player programmatically from anywhere inside a `ReactVideoProvider`:

```jsx
import { useVideoControlsContext } from 'react-video-master';

function CustomControls() {
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
```

### Other Context Hooks

- `useTimeUpdate`: Access time update functionality
- `useVideoEventsContext`: Access video event handlers
- `useScrubbing`: Access timeline scrubbing functionality

## Keyboard Shortcuts

The player supports the following keyboard shortcuts:

| Key | Action |
|-----|--------|
| `Space` or `K` | Play/Pause |
| `M` | Mute/Unmute |
| `F` | Toggle Fullscreen |
| `T` | Toggle Theater Mode |
| `I` | Toggle Picture-in-Picture |
| `Arrow Left` or `J` | Rewind 5 seconds |
| `Arrow Right` or `L` | Forward 5 seconds |

## Player Modes

### Theater Mode

Theater mode expands the video to take up more screen width while maintaining its position in the page:

```jsx
<VideoPlayer src="https://example.com/video.mp4" />
// User can toggle theater mode with the theater button or 'T' key
```

### Fullscreen Mode

Fullscreen mode expands the video to cover the entire screen:

```jsx
<VideoPlayer src="https://example.com/video.mp4" />
// User can toggle fullscreen mode with the fullscreen button or 'F' key
```

### Picture-in-Picture Mode

Picture-in-Picture mode allows the video to be played in a small floating window:

```jsx
<VideoPlayer src="https://example.com/video.mp4" />
// User can toggle PiP mode with the mini-player button or 'I' key
```

## Customization

### Styling

The component comes with a default styling that you can customize by overriding CSS variables or classes:

```css
/* Override the primary color */
.ps-video-container {
  --primary-color: #ff0000;
}

/* Customize the timeline */
.ps-timeline::after {
  background-color: var(--primary-color);
}
```

## Advanced Usage

### Minimal Example with ReactVideoProvider

This is the simplest way to use the context provider and hooks:

```jsx
import React from 'react';
import { VideoPlayer, ReactVideoProvider, useVideoControlsContext } from 'react-video-master';

// Simple custom control component
function PlayPauseButton() {
  // Access controls through context
  const { togglePlay } = useVideoControlsContext();
  
  return (
    <button onClick={togglePlay}>Play/Pause</button>
  );
}

// Main component
function App() {
  return (
    <ReactVideoProvider>
      <div style={{ height: "300px", width: "100%" }}>
        <VideoPlayer src="https://example.com/video.mp4" />
      </div>
      <PlayPauseButton />
    </ReactVideoProvider>
  );
}
```

### Complete Example with State Management

For more complex scenarios with state management:

```jsx
import React, { useState } from 'react';
import { VideoPlayer, ReactVideoProvider, useVideoControlsContext, useVideoStateContext } from 'react-video-master';

function CustomControls() {
  // Access context through hooks
  const controls = useVideoControlsContext();
  const state = useVideoStateContext();

  return (
    <div className="custom-controls">
      <button onClick={controls.togglePlay}>
        {state.isPaused ? 'Play' : 'Pause'}
      </button>
      <button onClick={controls.toggleMute}>Mute/Unmute</button>
      <button onClick={() => controls.skip(-10)}>Rewind 10s</button>
      <button onClick={() => controls.skip(10)}>Forward 10s</button>
      <button onClick={controls.changePlaybackSpeed}>Change Speed</button>
      
      {/* Progress bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${state.percent * 100}%` }} />
      </div>
    </div>
  );
}

function VideoApp() {
  const [isPaused, setIsPaused] = useState(true);

  const handlePlay = () => setIsPaused(false);
  const handlePause = () => setIsPaused(true);
  const handleEnded = () => setIsPaused(true);

  return (
    <ReactVideoProvider>
      <div style={{ height: "300px", width: "800px", position: "relative" }}>
        <VideoPlayer
          src="https://example.com/video.mp4"
          paused={isPaused}
          speed={1}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          className="custom-player"
        />
      </div>
      <CustomControls />
    </ReactVideoProvider>
  );
}
```

### Using with Multiple Players

```jsx
import React from 'react';
import { VideoPlayer, ReactVideoProvider } from 'react-video-master';

function MultiplePlayersApp() {
  return (
    <div className="multi-player-app">
      {/* Each ReactVideoProvider creates its own context */}
      <ReactVideoProvider>
        <VideoPlayer src="https://example.com/video1.mp4" />
        <PlayerControls id="player1" />
      </ReactVideoProvider>
      
      <ReactVideoProvider>
        <VideoPlayer src="https://example.com/video2.mp4" />
        <PlayerControls id="player2" />
      </ReactVideoProvider>
    </div>
  );
}

function PlayerControls({ id }) {
  const controls = useVideoControlsContext();
  
  return (
    <div className="player-controls">
      <span>{id}</span>
      <button onClick={controls.togglePlay}>Play/Pause</button>
      <button onClick={controls.toggleMute}>Mute/Unmute</button>
    </div>
  );
}

export default MultiplePlayersApp;
```

## Browser Support

React Video Player works in all modern browsers that support HTML5 video:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) © Ziya Akhundov
