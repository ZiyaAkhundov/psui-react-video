import React, { createContext, useContext } from 'react';
import { 
  VideoStateContextType, 
  VideoControlsContextType,
  TimeUpdateContextType,
  VideoEventsContextType,
  ScrubbingContextType
} from '../components/VideoPlayer/types';

// Create contexts
export const VideoStateContext = createContext<VideoStateContextType | null>(null);
export const VideoControlsContext = createContext<VideoControlsContextType | null>(null);
export const TimeUpdateContext = createContext<TimeUpdateContextType | null>(null);
export const VideoEventsContext = createContext<VideoEventsContextType | null>(null);
export const ScrubbingContext = createContext<ScrubbingContextType | null>(null);

// Create provider component
interface VideoProviderProps {
  children: React.ReactNode;
  videoState: VideoStateContextType;
  videoControls: VideoControlsContextType;
  timeUpdate: TimeUpdateContextType;
  videoEvents: VideoEventsContextType;
  scrubbing: ScrubbingContextType;
}

export const VideoProvider: React.FC<VideoProviderProps> = ({
  children,
  videoState,
  videoControls,
  timeUpdate,
  videoEvents,
  scrubbing
}) => {
  return (
    <VideoStateContext.Provider value={videoState}>
      <VideoControlsContext.Provider value={videoControls}>
        <TimeUpdateContext.Provider value={timeUpdate}>
          <VideoEventsContext.Provider value={videoEvents}>
            <ScrubbingContext.Provider value={scrubbing}>
              {children}
            </ScrubbingContext.Provider>
          </VideoEventsContext.Provider>
        </TimeUpdateContext.Provider>
      </VideoControlsContext.Provider>
    </VideoStateContext.Provider>
  );
};

// Create hooks to consume the context
export const useVideoState = () => {
  const context = useContext(VideoStateContext);
  if (!context) {
    throw new Error('useVideoState must be used within a VideoProvider');
  }
  return context;
};

export const useVideoControls = () => {
  const context = useContext(VideoControlsContext);
  if (!context) {
    throw new Error('useVideoControls must be used within a VideoProvider');
  }
  return context;
};

export const useTimeUpdate = () => {
  const context = useContext(TimeUpdateContext);
  if (!context) {
    throw new Error('useTimeUpdate must be used within a VideoProvider');
  }
  return context;
};

export const useVideoEvents = () => {
  const context = useContext(VideoEventsContext);
  if (!context) {
    throw new Error('useVideoEvents must be used within a VideoProvider');
  }
  return context;
};

export const useScrubbing = () => {
  const context = useContext(ScrubbingContext);
  if (!context) {
    throw new Error('useScrubbing must be used within a VideoProvider');
  }
  return context;
}; 