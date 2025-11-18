'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause } from 'lucide-react'

interface VideoPlayerProps {
  src: string
  title: string
  category: string
  color: string
}

// Global store untuk track semua video players
const videoPlayers = new Set<HTMLVideoElement>()


export default function VideoPlayer({ src, title, category, color }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isInView, setIsInView] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(false)

  // Intersection Observer untuk lazy loading video
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect() // Stop observing setelah video terlihat
          }
        })
      },
      {
        rootMargin: '50px', // Mulai load 50px sebelum video terlihat
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Register video player
    videoPlayers.add(video)

    // Add event listener to pause other videos when this one plays
    const handlePlayEvent = () => {
      videoPlayers.forEach(v => {
        if (v !== video && !v.paused) {
          v.pause()
        }
      })
    }

    video.addEventListener('play', handlePlayEvent)

    // Cleanup on unmount
    return () => {
      video.removeEventListener('play', handlePlayEvent)
      videoPlayers.delete(video)
    }
  }, [isInView])

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(err => {
          console.error('Error playing video:', err)
          setIsPlaying(false)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    setIsLoading(false) // Stop loading when video starts playing
    
    // Update duration if not already set
    if (videoRef.current && duration === 0) {
      setDuration(videoRef.current.duration)
    }
  }
  
  const handlePause = () => setIsPlaying(false)
  
  const handleLoadedMetadata = () => {
    setIsLoading(false)
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      // Update duration if not set yet
      if (duration === 0 && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration)
      }
      
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleWaiting = () => {
    setIsLoading(true)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (video) {
      const newTime = (parseFloat(e.target.value) / 100) * video.duration
      video.currentTime = newTime
      setProgress(parseFloat(e.target.value))
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      ref={containerRef}
      className="relative rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300"
      style={{ width: '295px', height: '525px' }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative cursor-pointer h-full w-full" onClick={togglePlay}>
        {isInView ? (
          <video 
            ref={videoRef}
            className="w-full h-full object-cover"
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
            playsInline
          >
            <source src={src} type="video/mp4" />
          </video>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-sm">Loading...</div>
          </div>
        )}
        
        {/* Play Button Overlay - Hidden saat video playing */}
        {!isPlaying && isInView && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-xl">
              <Play className="w-8 h-8 text-blue-800 ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Loading Spinner - Only show when video is actually buffering */}
        {isLoading && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
          </div>
        )}

        {/* Duration Badge - Show when not playing and loaded */}
        {!isPlaying && !isLoading && duration > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none">
            {formatTime(duration)}
          </div>
        )}
      </div>

      {/* Custom Controls Overlay */}
      {isPlaying && showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 transition-opacity duration-300 z-20">
          {/* Progress Bar with Slider */}
          <div className="mb-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              onClick={(e) => e.stopPropagation()}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
              }}
            />
          </div>

          {/* Time and Controls */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="hover:text-blue-400 transition-colors p-1"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" fill="currentColor" />
                ) : (
                  <Play className="w-4 h-4" fill="currentColor" />
                )}
              </button>
              <span className="font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Info Section - At bottom when paused, moves to top when playing */}
      <div 
        className={`absolute left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-all duration-300 pointer-events-none z-10 ${
          isPlaying ? 'top-0 from-transparent via-black/70 to-black/90 bg-gradient-to-b pb-20' : 'bottom-0'
        }`}
      >
        <div className={`p-4 ${isPlaying ? 'pt-3 pb-4' : 'pb-3'}`}>
          <span className={`inline-block px-3 py-1 text-xs font-semibold text-white ${color} rounded-full mb-2`}>
            {category}
          </span>
          <p className="text-white font-semibold text-sm">{title}</p>
        </div>
      </div>

      {/* Time Indicator - Show when playing and controls hidden */}
      {isPlaying && !showControls && duration > 0 && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded pointer-events-none font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  )
}
