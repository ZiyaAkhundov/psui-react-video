import { useState, useRef, RefObject } from 'react';
import { VideoStateContextType } from '../components/VideoPlayer/types';

export const useVideoState = (initialPaused = true, initialSpeed = 1): VideoStateContextType => {
  // State
  const [isPaused, setIsPaused] = useState(initialPaused);
  const [isEnded, setIsEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [playbackSpeed, setPlaybackSpeed] = useState(`${initialSpeed}x`);
  const [theaterMode, setTheaterMode] = useState(false);
  const [percent, setPercent] = useState(0);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  const [thumbnailPosition, setThumbnailPosition] = useState(0);
  const [showThumbnail, setShowThumbnail] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const offscreenVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const volumeSliderRef = useRef<HTMLInputElement>(null);

  return {
    // State
    isPaused,
    isEnded,
    currentTime,
    totalTime,
    playbackSpeed,
    theaterMode,
    percent,
    thumbnailSrc,
    thumbnailPosition,
    showThumbnail,

    // Setters (exposing these through context for use in other hooks)
    setIsPaused,
    setIsEnded,
    setCurrentTime,
    setTotalTime,
    setPlaybackSpeed,
    setTheaterMode,
    setPercent,
    setThumbnailSrc,
    setThumbnailPosition,
    setShowThumbnail,

    // Refs
    videoRef,
    offscreenVideoRef,
    containerRef,
    timelineContainerRef,
    loaderRef,
    canvasRef,
    volumeSliderRef,
  };
}; 