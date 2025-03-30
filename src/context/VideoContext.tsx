import React, { createContext, useContext, useRef, useState, ReactNode } from 'react';
import { 
  VideoStateContextType, 
  VideoControlsContextType,
  TimeUpdateContextType,
  VideoEventsContextType,
  ScrubbingContextType
} from '../components/VideoPlayer/types';

// Default context values
const createDefaultVideoState = (): VideoStateContextType => ({
  videoRef: { current: null },
  offscreenVideoRef: { current: null },
  containerRef: { current: null },
  timelineContainerRef: { current: null },
  loaderRef: { current: null },
  canvasRef: { current: null },
  volumeSliderRef: { current: null },
  isPaused: true,
  isEnded: false,
  currentTime: '0:00',
  totalTime: '0:00',
  percent: 0,
  playbackSpeed: '1x',
  theaterMode: false,
  thumbnailSrc: '',
  thumbnailPosition: 0,
  showThumbnail: false,
  setIsPaused: () => {},
  setIsEnded: () => {},
  setCurrentTime: () => {},
  setTotalTime: () => {},
  setPercent: () => {},
  setPlaybackSpeed: () => {},
  setTheaterMode: () => {},
  setThumbnailSrc: () => {},
  setThumbnailPosition: () => {},
  setShowThumbnail: () => {}
});

const createDefaultVideoControls = (): VideoControlsContextType => ({
  togglePlay: () => console.log('Video player not initialized yet'),
  toggleMute: () => console.log('Video player not initialized yet'),
  skip: () => console.log('Video player not initialized yet'),
  changePlaybackSpeed: () => console.log('Video player not initialized yet'),
  toggleFullScreenMode: () => console.log('Video player not initialized yet'),
  toggleTheaterMode: () => console.log('Video player not initialized yet'),
  toggleMiniPlayerMode: () => console.log('Video player not initialized yet'),
  handleVolumeInput: () => {}
});

const createDefaultTimeUpdate = (): TimeUpdateContextType => ({
  formatDuration: () => '0:00',
  handleTimeUpdate: () => {},
  handleLoadedData: () => {}
});

const createDefaultVideoEvents = (): VideoEventsContextType => ({
  handleProgress: () => {},
  showLoader: () => {},
  hideLoader: () => {},
  handleVolumeChange: () => {},
  handleVideoEnd: () => {}
});

const createDefaultScrubbing = (): ScrubbingContextType => ({
  handleTimelineUpdate: () => {},
  toggleScrubbing: () => {},
  handleDocumentMouseUp: () => {},
  handleDocumentMouseMove: () => {},
  handleKeyDown: () => {}
});

// Create contexts with default values
export const VideoStateContext = createContext<VideoStateContextType>(createDefaultVideoState());
export const VideoControlsContext = createContext<VideoControlsContextType>(createDefaultVideoControls());
export const TimeUpdateContext = createContext<TimeUpdateContextType>(createDefaultTimeUpdate());
export const VideoEventsContext = createContext<VideoEventsContextType>(createDefaultVideoEvents());
export const ScrubbingContext = createContext<ScrubbingContextType>(createDefaultScrubbing());

// Registration context type definition
type RegisterFunction = (
  state: VideoStateContextType,
  controls: VideoControlsContextType,
  update: TimeUpdateContextType,
  events: VideoEventsContextType,
  scrub: ScrubbingContextType
) => void;

export const RegistrationContext = createContext<RegisterFunction | null>(null);

// Video Provider Props
interface VideoProviderProps {
  children: React.ReactNode;
  videoState: VideoStateContextType;
  videoControls: VideoControlsContextType;
  timeUpdate: TimeUpdateContextType;
  videoEvents: VideoEventsContextType;
  scrubbing: ScrubbingContextType;
}

/**
 * VideoProvider - Internal component used by VideoPlayer to provide context
 */
export function VideoProvider({
  children,
  videoState,
  videoControls,
  timeUpdate,
  videoEvents,
  scrubbing
}: VideoProviderProps): JSX.Element {
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
}

// ReactVideoProvider Props
interface ReactVideoProviderProps {
  children: ReactNode;
}

/**
 * ReactVideoProvider - External provider component that manages video context
 * Wrap VideoPlayer and any components that need access to video context with this provider
 */
export function ReactVideoProvider({ children }: ReactVideoProviderProps): JSX.Element {
  // Context values with defaults
  const [contextValues, setContextValues] = useState({
    videoState: createDefaultVideoState(),
    videoControls: createDefaultVideoControls(),
    timeUpdate: createDefaultTimeUpdate(),
    videoEvents: createDefaultVideoEvents(),
    scrubbing: createDefaultScrubbing()
  });

  // Prevent infinite update loops
  const isUpdatingRef = useRef(false);

  // Registration function for VideoPlayer components
  const registerVideoPlayer = (
    state: VideoStateContextType,
    controls: VideoControlsContextType,
    update: TimeUpdateContextType,
    events: VideoEventsContextType,
    scrub: ScrubbingContextType
  ) => {
    if (isUpdatingRef.current) return;
    
    isUpdatingRef.current = true;
    setContextValues({
      videoState: state,
      videoControls: controls,
      timeUpdate: update,
      videoEvents: events,
      scrubbing: scrub
    });
    
    // Reset update flag after a delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 100);
  };

  return (
    <RegistrationContext.Provider value={registerVideoPlayer}>
      <VideoStateContext.Provider value={contextValues.videoState}>
        <VideoControlsContext.Provider value={contextValues.videoControls}>
          <TimeUpdateContext.Provider value={contextValues.timeUpdate}>
            <VideoEventsContext.Provider value={contextValues.videoEvents}>
              <ScrubbingContext.Provider value={contextValues.scrubbing}>
                {children}
              </ScrubbingContext.Provider>
            </VideoEventsContext.Provider>
          </TimeUpdateContext.Provider>
        </VideoControlsContext.Provider>
      </VideoStateContext.Provider>
    </RegistrationContext.Provider>
  );
}

// Hook to access video state
export const useVideoState = () => useContext(VideoStateContext);

// Hook to access video controls
export const useVideoControls = () => useContext(VideoControlsContext);

// Hook to access time update
export const useTimeUpdate = () => useContext(TimeUpdateContext);

// Hook to access video events
export const useVideoEvents = () => useContext(VideoEventsContext);

// Hook to access scrubbing functionality
export const useScrubbing = () => useContext(ScrubbingContext);

// Hook to access registration function (internal use)
export const useVideoPlayerRegistration = () => {
  const register = useContext(RegistrationContext);
  if (!register) {
    throw new Error(
      'useVideoPlayerRegistration must be used within a ReactVideoProvider'
    );
  }
  return register;
};