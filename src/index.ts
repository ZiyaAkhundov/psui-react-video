import './react-video.css'
import { VideoPlayer } from './components/VideoPlayer'
import type { VideoPlayerProps } from './components/VideoPlayer/types'
import { ReactVideoProvider } from './context/VideoContext'

export { VideoPlayer, ReactVideoProvider }
export type { VideoPlayerProps }

// Export hooks
export { useVideoState } from './hooks/useVideoState'
export { useVideoControls } from './hooks/useVideoControls'
export { useVideoTimeUpdate } from './hooks/useVideoTimeUpdate'
export { useVideoEvents } from './hooks/useVideoEvents'
export { useVideoScrubbing } from './hooks/useVideoScrubbing'

// Export context hooks
export {
  useVideoState as useVideoStateContext,
  useVideoControls as useVideoControlsContext,
  useTimeUpdate,
  useVideoEvents as useVideoEventsContext,
  useScrubbing
} from './context/VideoContext'

// Export types
export type {
  VideoStateContextType,
  VideoControlsContextType,
  TimeUpdateContextType,
  VideoEventsContextType,
  ScrubbingContextType
} from './components/VideoPlayer/types' 