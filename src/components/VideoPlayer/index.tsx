import React, { useEffect } from 'react';
import { VideoPlayerProps } from './types';
import { VideoProvider } from '../../context/VideoContext';
import { useVideoState } from '../../hooks/useVideoState';
import { useVideoControls } from '../../hooks/useVideoControls';
import { useVideoTimeUpdate } from '../../hooks/useVideoTimeUpdate';
import { useVideoEvents } from '../../hooks/useVideoEvents';
import { useVideoScrubbing } from '../../hooks/useVideoScrubbing';
import * as Icons from '../Icons';
import '../../react-video.css';

/**
 * VideoPlayer - A React component for playing and controlling video playback
 */
const VideoPlayer = ({
  src,
  paused = true,
  speed = 1,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onVolumeChange,
  className
}: VideoPlayerProps): JSX.Element => {
  // Initialize all video hooks
  const videoState = useVideoState(paused, speed);
  const videoControls = useVideoControls(videoState, onPlay, onPause);
  const timeUpdate = useVideoTimeUpdate(videoState, onTimeUpdate);
  const videoEvents = useVideoEvents(videoState, onEnded, onVolumeChange);
  const scrubbing = useVideoScrubbing(videoState, videoControls);

  const {
    videoRef,
    offscreenVideoRef,
    containerRef,
    loaderRef,
    canvasRef,
    timelineContainerRef,
    isPaused,
    isEnded,
    theaterMode,
    setIsPaused,
    setShowThumbnail
  } = videoState;

  const { togglePlay } = videoControls;
  const { handleTimeUpdate, handleLoadedData } = timeUpdate;
  const { handleProgress, showLoader, hideLoader, handleVolumeChange, handleVideoEnd } = videoEvents;
  const { handleTimelineUpdate, toggleScrubbing, handleDocumentMouseUp, handleDocumentMouseMove, handleKeyDown } = scrubbing;

  // Effect to handle initial paused state
  useEffect(() => {
    if (videoRef.current) {
      if (paused) {
        videoRef.current.pause();
        setIsPaused(true);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPaused(false);
      }
    }
  }, [paused, videoRef, setIsPaused]);

  // Effect to handle playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [speed, videoRef]);

  // Effect to set initial volume and update volume display
  useEffect(() => {
    if (videoRef.current && containerRef.current) {
      // Set default volume if not already set
      if (videoRef.current.volume === 1) {
        videoRef.current.volume = 0.7; // Set to 70% volume by default
      }
      // Set initial volume level indicator
      const volumeLevel = videoRef.current.muted || videoRef.current.volume === 0 
        ? "muted" 
        : videoRef.current.volume >= 0.5 
          ? "high" 
          : "low";
      
      containerRef.current.dataset.volumeLevel = volumeLevel;
    }
  }, [videoRef, containerRef]);

  // Effect to handle canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current || !videoRef.current || !canvasRef.current) return;

      const container = containerRef.current;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      const videoAspectRatio = video.videoWidth / video.videoHeight;

      let newWidth = containerWidth;
      let newHeight = newWidth / videoAspectRatio;

      if (newHeight > containerHeight) {
        newHeight = containerHeight;
        newWidth = newHeight * videoAspectRatio;
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
    };

    videoRef.current?.addEventListener("loadedmetadata", updateCanvasSize);
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      videoRef.current?.removeEventListener("loadedmetadata", updateCanvasSize);
    };
  }, [containerRef, videoRef, canvasRef]);

  // Effect to set up event listeners
  useEffect(() => {
    const video = videoRef.current;
    const timeline = timelineContainerRef.current;
    
    if (video) {
      video.addEventListener("volumechange", handleVolumeChange);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("waiting", showLoader);
      video.addEventListener("canplay", hideLoader);
      video.addEventListener("progress", handleProgress);
      video.addEventListener("ended", handleVideoEnd);
    }
    
    if (timeline) {
      timeline.addEventListener("mousemove", handleTimelineUpdate);
      timeline.addEventListener("mouseleave", () => setShowThumbnail(false));
      timeline.addEventListener("mousedown", toggleScrubbing);
    }
    
    document.addEventListener("mouseup", handleDocumentMouseUp);
    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (video) {
        video.removeEventListener("volumechange", handleVolumeChange);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("waiting", showLoader);
        video.removeEventListener("canplay", hideLoader);
        video.removeEventListener("progress", handleProgress);
        video.removeEventListener("ended", handleVideoEnd);
      }
      
      if (timeline) {
        timeline.removeEventListener("mousemove", handleTimelineUpdate);
        timeline.removeEventListener("mouseleave", () => setShowThumbnail(false));
        timeline.removeEventListener("mousedown", toggleScrubbing);
      }
      
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    videoRef, 
    timelineContainerRef, 
    handleVolumeChange, 
    handleTimeUpdate, 
    handleLoadedData, 
    showLoader, 
    hideLoader, 
    handleProgress, 
    handleVideoEnd, 
    handleTimelineUpdate, 
    toggleScrubbing, 
    handleDocumentMouseUp, 
    handleDocumentMouseMove, 
    handleKeyDown,
    setShowThumbnail
  ]);

  return (
    <VideoProvider
      videoState={videoState}
      videoControls={videoControls}
      timeUpdate={timeUpdate}
      videoEvents={videoEvents}
      scrubbing={scrubbing}
    >
      <div
        ref={containerRef}
        className={`ps-video-container ${isPaused ? "paused" : ""} ${theaterMode ? "theater" : ""} ${className || ""}`}
        data-volume-level="high"
      >
        <div className="ps-video-controls-container">
          <div className="ps-timeline-container" ref={timelineContainerRef} style={{ "--progress-position": videoState.percent } as React.CSSProperties}>
            {videoState.showThumbnail && (
              <div className="thumbnail-container" style={{ left: `${videoState.thumbnailPosition}px` }}>
                <img className="thumbnail-img" alt="thumbnail" src={videoState.thumbnailSrc} />
              </div>
            )}
            <div className="ps-timeline">
              <div className="thumb-indicator"></div>
            </div>
          </div>
          
          <div className="controls">
            <button className="play-pause-btn" onClick={videoControls.togglePlay}>
              {videoState.isPaused ? <Icons.PlayIcon /> : videoState.isEnded ? <Icons.ReplayIcon /> : <Icons.PauseIcon />}
            </button>
            
            <div className="ps-volume-container">
              <button className="mute-btn" onClick={videoControls.toggleMute}>
                <Icons.VolumeHighIcon />
                <Icons.VolumeLowIcon />
                <Icons.VolumeMutedIcon />
              </button>
              <input 
                ref={videoState.volumeSliderRef} 
                onChange={videoControls.handleVolumeInput} 
                className="ps-volume-slider" 
                type="range" 
                min="0" 
                max="1" 
                step="any" 
              />
            </div>
            
            <div className="ps-duration-container">
              <div className="current-time">{videoState.currentTime || "0:00"}</div>/
              <div className="total-time">{videoState.totalTime || "0:00"}</div>
            </div>
            
            <button className="speed-btn wide-btn" onClick={videoControls.changePlaybackSpeed}>
              {videoState.playbackSpeed || "1x"}
            </button>
            
            <button className="mini-player-btn" onClick={videoControls.toggleMiniPlayerMode}>
              <Icons.MiniPlayerIcon />
            </button>
            
            <button className="theater-btn" onClick={videoControls.toggleTheaterMode}>
              {theaterMode ? <Icons.TallIcon /> : <Icons.WideIcon />}
            </button>
            
            <button className="full-screen-btn" onClick={videoControls.toggleFullScreenMode}>
              <Icons.FullScreenCloseIcon /> 
              <Icons.FullScreenOpenIcon />
            </button>
          </div>
        </div>
        
        <video
          ref={videoRef}
          src={src}
          onClick={togglePlay}
          onEnded={handleVideoEnd}
          crossOrigin="anonymous"
        />
        
        <video
          ref={offscreenVideoRef}
          src={src}
          style={{ display: "none" }}
          crossOrigin="anonymous"
        />
        
        <svg ref={loaderRef} className="loader" viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
        
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </VideoProvider>
  );
}; 

export { VideoPlayer }; 