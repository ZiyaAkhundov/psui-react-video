import { useCallback, useRef } from 'react';
import { ScrubbingContextType } from '../components/VideoPlayer/types';

const THUMBNAIL_WIDTH = 112;

export const useVideoScrubbing = (
  videoState: any,
  videoControls: any
): ScrubbingContextType => {
  const {
    videoRef,
    canvasRef,
    timelineContainerRef,
    offscreenVideoRef,
    setPercent,
    setThumbnailPosition,
    setShowThumbnail,
    setThumbnailSrc
  } = videoState;

  const { togglePlay, skip, toggleMute, toggleFullScreenMode, toggleTheaterMode, toggleMiniPlayerMode } = videoControls;

  // Reference to track if we're currently scrubbing
  const isScrubbingRef = useRef(false);
  // Reference to remember if video was paused before scrubbing
  const wasPausedRef = useRef(false);

  const handleTimelineUpdate = useCallback((e: MouseEvent) => {
    if (!timelineContainerRef.current || !videoRef.current || !canvasRef.current || !offscreenVideoRef.current) return;
    
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const computedPercent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    const previewTime = computedPercent * videoRef.current.duration;
    
    // Update the preview position CSS variable
    timelineContainerRef.current.style.setProperty(
      "--preview-position",
      computedPercent.toString()
    );

    // Calculate thumbnail position
    let rawPosition = e.clientX - rect.left;
    const halfThumb = THUMBNAIL_WIDTH / 2;
    const clampedPosition = Math.min(
      Math.max(rawPosition, halfThumb),
      rect.width - halfThumb
    );
    
    setThumbnailPosition(clampedPosition);
    setShowThumbnail(true);

    // Generate thumbnail from video frame
    const offscreenVideo = offscreenVideoRef.current;
    offscreenVideo.currentTime = previewTime;
    
    offscreenVideo.onseeked = () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
        context.drawImage(offscreenVideo, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setThumbnailSrc(canvasRef.current.toDataURL());
      }
    };
  }, [timelineContainerRef, videoRef, canvasRef, offscreenVideoRef, setThumbnailPosition, setShowThumbnail, setThumbnailSrc]);

  const toggleScrubbing = useCallback((e: MouseEvent) => {
    if (!timelineContainerRef.current || !videoRef.current) return;
    
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const computedPercent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    setPercent(computedPercent);
    
    const isButtonPressed = (e.buttons & 1) === 1;
    isScrubbingRef.current = isButtonPressed;
    
    if (isScrubbingRef.current) {
      wasPausedRef.current = videoRef.current.paused;
      videoRef.current.pause();
    } else {
      videoRef.current.currentTime = computedPercent * videoRef.current.duration;
      if (!wasPausedRef.current) videoRef.current.play();
    }
    
    handleTimelineUpdate(e);
  }, [timelineContainerRef, videoRef, setPercent, handleTimelineUpdate]);

  const handleDocumentMouseUp = useCallback((e: MouseEvent) => {
    if (isScrubbingRef.current) toggleScrubbing(e);
    setShowThumbnail(false);
  }, [toggleScrubbing, setShowThumbnail]);

  const handleDocumentMouseMove = useCallback((e: MouseEvent) => {
    if (isScrubbingRef.current) handleTimelineUpdate(e);
  }, [isScrubbingRef, handleTimelineUpdate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if we're in an input element
    if ((e.target as HTMLElement).tagName.toLowerCase() === "input") return;
    
    switch (e.key.toLowerCase()) {
      case " ":
      case "k": 
        togglePlay(); 
        break;
      case "f": 
        toggleFullScreenMode(); 
        break;
      case "t": 
        toggleTheaterMode(); 
        break;
      case "i": 
        toggleMiniPlayerMode(); 
        break;
      case "m": 
        toggleMute(); 
        break;
      case "arrowleft":
      case "j": 
        skip(-5); 
        break;
      case "arrowright":
      case "l": 
        skip(5); 
        break;
    }
  }, [togglePlay, toggleFullScreenMode, toggleTheaterMode, toggleMiniPlayerMode, toggleMute, skip]);

  return {
    handleTimelineUpdate,
    toggleScrubbing,
    handleDocumentMouseUp,
    handleDocumentMouseMove,
    handleKeyDown
  };
}; 