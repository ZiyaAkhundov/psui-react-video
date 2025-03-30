/**
 * Formats a time in seconds to a string in the format of "M:SS" or "H:MM:SS" if hours > 0
 */
export const formatDuration = (time: number): string => {
  const formatter = new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 });
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  
  return hours > 0
    ? `${hours}:${formatter.format(minutes)}:${formatter.format(seconds)}`
    : `${minutes}:${formatter.format(seconds)}`;
}; 