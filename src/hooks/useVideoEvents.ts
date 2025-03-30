import { useCallback } from 'react';
import { VideoEventsContextType } from '../components/VideoPlayer/types';

export const useVideoEvents = (
  videoState: any,
  onEnded?: () => void,
  onVolumeChange?: (volume: number, muted: boolean) => void
): VideoEventsContextType => {
  const {
    videoRef,
    loaderRef,
    volumeSliderRef,
    containerRef,
    setIsEnded
  } = videoState;

  const showLoader = useCallback(() => {
    if (loaderRef.current) {
      loaderRef.current.style.display = "block";
    }
  }, [loaderRef]);

  const hideLoader = useCallback(() => {
    if (loaderRef.current) {
      loaderRef.current.style.display = "none";
    }
  }, [loaderRef]);

  const handleProgress = useCallback(() => {
    if (!videoRef.current) return;
    
    if (videoRef.current.readyState < 4) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [videoRef, showLoader, hideLoader]);

  const handleVolumeChange = useCallback(() => {
    if (!videoRef.current || !volumeSliderRef.current || !containerRef.current) return;
    
    const video = videoRef.current;
    const volumeSlider = volumeSliderRef.current;
    const container = containerRef.current;
    
    // Update the volume slider value
    volumeSlider.value = video.volume.toString();
    
    // Determine the volume level for UI representation
    let volumeLevel = "";
    if (video.muted || video.volume === 0) {
      volumeSlider.value = "0";
      volumeLevel = "muted";
    } else if (video.volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }
    
    // Update the dataset attribute to reflect the volume level
    container.dataset.volumeLevel = volumeLevel;
    
    // Call the callback if provided
    onVolumeChange?.(video.volume, video.muted);
  }, [videoRef, volumeSliderRef, containerRef, onVolumeChange]);

  const handleVideoEnd = useCallback(() => {
    setIsEnded(true);
    onEnded?.();
  }, [setIsEnded, onEnded]);

  return {
    showLoader,
    hideLoader,
    handleProgress,
    handleVolumeChange,
    handleVideoEnd
  };
}; 