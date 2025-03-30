import { useCallback } from 'react';
import { TimeUpdateContextType } from '../components/VideoPlayer/types';
import { formatDuration as formatDurationUtil } from '../utils/format';

export const useVideoTimeUpdate = (
  videoState: any,
  onTimeUpdate?: (currentTime: number, duration: number) => void
): TimeUpdateContextType => {
  const {
    videoRef,
    setCurrentTime,
    setTotalTime,
    setPercent
  } = videoState;

  const formatDuration = useCallback((time: number): string => {
    return formatDurationUtil(time);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    
    const currentTimeInSeconds = videoRef.current.currentTime;
    const durationInSeconds = videoRef.current.duration;
    
    setCurrentTime(formatDuration(currentTimeInSeconds));
    
    if (durationInSeconds) {
      const progressPercent = currentTimeInSeconds / durationInSeconds;
      setPercent(progressPercent);
      
      // Call the onTimeUpdate callback if provided
      onTimeUpdate?.(currentTimeInSeconds, durationInSeconds);
    }
  }, [videoRef, setCurrentTime, setPercent, formatDuration, onTimeUpdate]);

  const handleLoadedData = useCallback(() => {
    if (!videoRef.current) return;
    setTotalTime(formatDuration(videoRef.current.duration));
  }, [videoRef, setTotalTime, formatDuration]);

  return {
    formatDuration,
    handleTimeUpdate,
    handleLoadedData
  };
}; 