import { useCallback } from 'react';
import { VideoControlsContextType } from '../components/VideoPlayer/types';

export const useVideoControls = (
  videoState: any,
  onPlay?: () => void,
  onPause?: () => void
): VideoControlsContextType => {
  const {
    videoRef,
    containerRef,
    volumeSliderRef,
    setIsPaused,
    setIsEnded,
    setPlaybackSpeed,
    setTheaterMode
  } = videoState;

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play()
        .then(() => {
          setIsPaused(false);
          setIsEnded(false);
          onPlay?.();
        })
        .catch(console.error);
    } else {
      video.pause();
      setIsPaused(true);
      onPause?.();
    }
  }, [videoRef, setIsPaused, setIsEnded, onPlay, onPause]);

  const toggleFullScreenMode = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, [containerRef]);

  const toggleMiniPlayerMode = useCallback(() => {
    if (containerRef.current?.classList.contains("mini-player")) {
      document.exitPictureInPicture().catch(console.error);
      containerRef.current.classList.remove("mini-player");
    } else {
      videoRef.current?.requestPictureInPicture().catch(console.error);
      containerRef.current?.classList.add("mini-player");
    }
  }, [containerRef, videoRef]);

  const toggleTheaterMode = useCallback(() => {
    setTheaterMode((prev: boolean) => !prev);
  }, [setTheaterMode]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    
    // If unmuting and volume is 0, set it to a reasonable value
    if (!videoRef.current.muted && videoRef.current.volume === 0) {
      videoRef.current.volume = 0.5;
    }
  }, [videoRef]);

  const skip = useCallback((duration: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += duration;
    }
  }, [videoRef]);

  const changePlaybackSpeed = useCallback(() => {
    if (!videoRef.current) return;
    let newSpeed = videoRef.current.playbackRate + 0.25;
    if (newSpeed > 2) newSpeed = 0.25;
    videoRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(`${newSpeed}x`);
  }, [videoRef, setPlaybackSpeed]);

  const handleVolumeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  }, [videoRef]);

  return {
    togglePlay,
    toggleFullScreenMode,
    toggleMiniPlayerMode,
    toggleTheaterMode,
    toggleMute,
    skip,
    changePlaybackSpeed,
    handleVolumeInput
  };
}; 