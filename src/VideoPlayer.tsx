import React, { useState, useRef, useEffect, useCallback } from "react";
import PlayIcon from "./icons/Play.Icon";
import ReplayIcon from "./icons/Replay.Icon";
import PauseIcon from "./icons/Pause.Icon";
import VolumeHighIcon from "./icons/VolumeHigh.Icon";
import VolumeLowIcon from "./icons/VolumeLow.Icon";
import VolumeMutedIcon from "./icons/VolumeMuted.Icon";
import MiniPlayerIcon from "./icons/MiniPlayer.Icon";
import TallIcon from "./icons/Tall.Icon";
import WideIcon from "./icons/Wide.Icon";
import FullScreenOpenIcon from "./icons/FullScreenOpen.Icon";
import FullScreenCloseIcon from "./icons/FullScreenClose.Icon";
import './react-video.css'

export interface VideoPlayerProps {
  src: string
  paused?: boolean
  speed?: number
}

const THUMBNAIL_WIDTH = 112;

export const VideoPlayer = ({ src, paused = true, speed = 1 }: VideoPlayerProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [playbackSpeed, setPlaybackSpeed] = useState(`1x`);
  const [isPaused, setIsPaused] = useState(true);
  const [theaterMode, setTheaterMode] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState("");
  const [thumbnailPosition, setThumbnailPosition] = useState(0);
  const [showThumbnail, setShowThumbnail] = useState(false);

  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const offscreenVideoRef = useRef<HTMLVideoElement | null>(null);
  const volumeSliderRef = useRef<HTMLInputElement | null>(null);
  const loaderRef = useRef<SVGSVGElement | null>(null);
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScrubbingRef = useRef(false);
  const wasPausedRef = useRef(false);

  const formatDuration = (time: number): string => {
    const formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    return hours > 0
      ? `${hours}:${formatter.format(minutes)}:${formatter.format(seconds)}`
      : `${minutes}:${formatter.format(seconds)}`;
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
      setIsEnded(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  }, []);

  const toggleFullScreenMode = useCallback(() => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  const toggleMiniPlayerMode = useCallback(() => {
    if (videoContainerRef.current?.classList.contains("mini-player")) {
      document.exitPictureInPicture().catch(console.error);
      videoContainerRef.current.classList.remove("mini-player");
    } else {
      videoRef.current?.requestPictureInPicture().catch(console.error);
      videoContainerRef.current?.classList.add("mini-player");
    }
  }, []);

  const toggleTheaterMode = useCallback(() => {
    setTheaterMode((prev) => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    if (videoRef.current.muted) {
      videoRef.current.volume = 0.5;
    }
  }, []);

  const skip = useCallback((duration: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += duration;
    }
  }, []);

  const changePlaybackSpeed = useCallback(() => {
    if (!videoRef.current) return;
    let newSpeed = videoRef.current.playbackRate + 0.25;
    if (newSpeed > 2) newSpeed = 0.25;
    videoRef.current.playbackRate = newSpeed;
    setPlaybackSpeed(`${newSpeed}x`);
  }, []);

  const handleVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  const handleVolumeChange = useCallback(() => {
    if (!videoRef.current || !volumeSliderRef.current || !videoContainerRef.current) return;
    volumeSliderRef.current.value = videoRef.current.volume.toString();
    let volumeLevel = "";
    if (videoRef.current.muted || videoRef.current.volume === 0) {
      volumeSliderRef.current.value = "0";
      volumeLevel = "muted";
    } else if (videoRef.current.volume >= 0.5) {
      volumeLevel = "high";
    } else {
      volumeLevel = "low";
    }
    videoContainerRef.current.dataset.volumeLevel = volumeLevel;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(formatDuration(videoRef.current.currentTime));
    if (videoRef.current.duration) {
      setPercent(videoRef.current.currentTime / videoRef.current.duration);
    }
  }, []);

  const handleLoadedData = useCallback(() => {
    if (!videoRef.current) return;
    setTotalTime(formatDuration(videoRef.current.duration));
  }, []);

  const showLoader = useCallback(() => {
    if (loaderRef.current) loaderRef.current.style.display = "block";
  }, []);

  const hideLoader = useCallback(() => {
    if (loaderRef.current) loaderRef.current.style.display = "none";
  }, []);

  const handleProgress = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.readyState < 4) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  const handleTimelineUpdate = useCallback((e: MouseEvent) => {
    if (!timelineContainerRef.current || !videoRef.current || !canvasRef.current || !offscreenVideoRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const computedPercent = Math.min(Math.max(0, e.clientX - rect.x), rect.width) / rect.width;
    const previewTime = computedPercent * videoRef.current.duration;
    timelineContainerRef.current.style.setProperty(
      "--preview-position",
      computedPercent.toString()
    );

    let rawPosition = e.clientX - rect.left;
    const halfThumb = THUMBNAIL_WIDTH / 2;
    const clampedPosition = Math.min(
      Math.max(rawPosition, halfThumb),
      rect.width - halfThumb
    );
    setThumbnailPosition(clampedPosition);
    setShowThumbnail(true);

    const offscreenVideo = offscreenVideoRef.current;
    offscreenVideo.currentTime = previewTime;
    offscreenVideo.onseeked = () => {
      const context = canvasRef.current?.getContext("2d");
      if (context && canvasRef.current) {
        context.drawImage(offscreenVideo, 0, 0, canvasRef.current.width, canvasRef.current.height);
        setThumbnailSrc(canvasRef.current.toDataURL());
      }
    };
  }, []);

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
  }, [handleTimelineUpdate]);

  const handleDocumentMouseUp = useCallback((e: MouseEvent) => {
    if (isScrubbingRef.current) toggleScrubbing(e);
    setShowThumbnail(false);
  }, [toggleScrubbing]);

  const handleDocumentMouseMove = useCallback((e: MouseEvent) => {
    if (isScrubbingRef.current) handleTimelineUpdate(e);
  }, [handleTimelineUpdate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName.toLowerCase() === "input") return;
    switch (e.key.toLowerCase()) {
      case " ":
      case "k": togglePlay(); break;
      case "f": toggleFullScreenMode(); break;
      case "t": toggleTheaterMode(); break;
      case "i": toggleMiniPlayerMode(); break;
      case "m": toggleMute(); break;
      case "arrowleft":
      case "j": skip(-5); break;
      case "arrowright":
      case "l": skip(5); break;
    }
  }, [togglePlay, toggleFullScreenMode, toggleTheaterMode, toggleMiniPlayerMode, toggleMute, skip]);

  const handleVideoEnd = useCallback(() => {
    setIsEnded(true);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (paused) {
        videoRef.current.pause();
        setIsPaused(true)
      } else {
        videoRef.current.play();
        setIsPaused(false)
      }
    }
  }, [paused]);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(`${speed}x`);
    }
  }, [speed]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!videoContainerRef.current || !videoRef.current || !canvasRef.current) return;

      const container = videoContainerRef.current;
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
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const timelineContainer = timelineContainerRef.current;
    if (video) {
      video.addEventListener("volumechange", handleVolumeChange);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("waiting", showLoader);
      video.addEventListener("canplay", hideLoader);
      video.addEventListener("progress", handleProgress);
      video.addEventListener("ended", handleVideoEnd);
    }
    if (timelineContainer) {
      timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
      timelineContainer.addEventListener("mouseleave", () => setShowThumbnail(false));
      timelineContainer.addEventListener("mousedown", toggleScrubbing);
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
      if (timelineContainer) {
        timelineContainer.removeEventListener("mousemove", handleTimelineUpdate);
        timelineContainer.removeEventListener("mouseleave", () => setShowThumbnail(false));
        timelineContainer.removeEventListener("mousedown", toggleScrubbing);
      }
      document.removeEventListener("mouseup", handleDocumentMouseUp);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleVolumeChange, handleTimeUpdate, handleLoadedData, showLoader, hideLoader, handleProgress, handleTimelineUpdate, toggleScrubbing, handleDocumentMouseUp, handleDocumentMouseMove, handleKeyDown, handleVideoEnd]);
 
  return (
    <div ref={videoContainerRef} className={`ps-video-container ${isPaused ? "paused" : ""} ${theaterMode ? "theater" : ""}`} data-volume-level="high">
      <div className="ps-video-controls-container">
        <div className="ps-timeline-container" ref={timelineContainerRef} style={{ "--progress-position": percent } as React.CSSProperties}>
          {showThumbnail && (
            <div className="thumbnail-container" style={{ left: `${thumbnailPosition}px` }}>
              <img className="thumbnail-img" alt="thumbnail" src={thumbnailSrc} />
            </div>
          )}
          <div className="ps-timeline">
            <div className="thumb-indicator"></div>
          </div>
        </div>
        <div className="controls">
          <button className="play-pause-btn" onClick={togglePlay}>
            {isPaused ? <PauseIcon /> : isEnded ? <ReplayIcon /> : <PlayIcon />}
          </button>
          <div className="ps-volume-container">
            <button className="mute-btn" onClick={toggleMute}>
              <VolumeHighIcon />
              <VolumeLowIcon />
              <VolumeMutedIcon />
            </button>
            <input ref={volumeSliderRef} onChange={handleVolumeInput} className="ps-volume-slider" type="range" min="0" max="1" step="any" />
          </div>
          <div className="ps-duration-container">
            <div className="current-time">{currentTime || "0:00"}</div>/
            <div className="total-time">{totalTime || "0:00"}</div>
          </div>
          <button className="speed-btn wide-btn" onClick={changePlaybackSpeed}>{playbackSpeed || "1x"}</button>
          <button className="mini-player-btn" onClick={toggleMiniPlayerMode}><MiniPlayerIcon /></button>
          <button className="theater-btn" onClick={toggleTheaterMode}><TallIcon /><WideIcon /></button>
          <button className="full-screen-btn" onClick={toggleFullScreenMode}><FullScreenOpenIcon /><FullScreenCloseIcon /></button>
        </div>
      </div>
      <video ref={videoRef} src={src} onClick={togglePlay} onEnded={handleVideoEnd} crossOrigin="anonymous"></video>
      <video ref={offscreenVideoRef} src={src} style={{ display: "none" }} crossOrigin="anonymous"></video>
      <svg ref={loaderRef} className="loader" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
      <canvas ref={canvasRef} style={{ display: "none" }} ></canvas>
    </div>
  );
};