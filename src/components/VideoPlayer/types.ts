import { RefObject, Dispatch, SetStateAction, ReactNode } from "react";

export interface VideoPlayerProps {
  src: string;
  paused?: boolean;
  speed?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  className?: string;
  children?: ReactNode;
}

export interface VideoStateContextType {
  videoRef: RefObject<HTMLVideoElement>;
  offscreenVideoRef: RefObject<HTMLVideoElement>;
  containerRef: RefObject<HTMLDivElement>;
  timelineContainerRef: RefObject<HTMLDivElement>;
  loaderRef: RefObject<SVGSVGElement>;
  canvasRef: RefObject<HTMLCanvasElement>;
  volumeSliderRef: RefObject<HTMLInputElement>;
  isPaused: boolean;
  isEnded: boolean;
  currentTime: string;
  totalTime: string;
  percent: number;
  playbackSpeed: string;
  theaterMode: boolean;
  thumbnailSrc: string;
  thumbnailPosition: number;
  showThumbnail: boolean;
  
  // State setters
  setIsPaused: Dispatch<SetStateAction<boolean>>;
  setIsEnded: Dispatch<SetStateAction<boolean>>;
  setCurrentTime: Dispatch<SetStateAction<string>>;
  setTotalTime: Dispatch<SetStateAction<string>>;
  setPercent: Dispatch<SetStateAction<number>>;
  setPlaybackSpeed: Dispatch<SetStateAction<string>>;
  setTheaterMode: Dispatch<SetStateAction<boolean>>;
  setThumbnailSrc: Dispatch<SetStateAction<string>>;
  setThumbnailPosition: Dispatch<SetStateAction<number>>;
  setShowThumbnail: Dispatch<SetStateAction<boolean>>;
}

export interface VideoControlsContextType {
  togglePlay: () => void;
  toggleMute: () => void;
  toggleFullScreenMode: () => void;
  toggleTheaterMode: () => void;
  toggleMiniPlayerMode: () => void;
  changePlaybackSpeed: () => void;
  skip: (duration: number) => void;
  handleVolumeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TimeUpdateContextType {
  formatDuration: (time: number) => string;
  handleTimeUpdate: () => void;
  handleLoadedData: () => void;
}

export interface VideoEventsContextType {
  handleProgress: () => void;
  showLoader: () => void;
  hideLoader: () => void;
  handleVolumeChange: () => void;
  handleVideoEnd: () => void;
}

export interface ScrubbingContextType {
  handleTimelineUpdate: (e: MouseEvent) => void;
  toggleScrubbing: (e: MouseEvent) => void;
  handleDocumentMouseUp: (e: MouseEvent) => void;
  handleDocumentMouseMove: (e: MouseEvent) => void;
  handleKeyDown: (e: KeyboardEvent) => void;
} 