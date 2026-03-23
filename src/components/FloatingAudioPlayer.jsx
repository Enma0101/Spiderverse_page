import React, { useContext, useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Music } from 'lucide-react';
import { AudioContext } from '../context/AudioContext';
import './FloatingAudioPlayer.css';

const SoundtrackCard = ({ track, isActive, isPlaying, progress, currentTime, onTogglePlay, onSeek, onSkipForward, onSkipBackward }) => {
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef(null);

  const handleProgressClick = (e) => {
    if (!isActive) return;
    e.stopPropagation();

    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onSeek(percentage);
  };

  const handleMouseDown = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    handleProgressClick(e);
  };

  useEffect(() => {
    if (!isDragging || !isActive) return;

    const handleMouseMove = (e) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      onSeek(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isActive, onSeek]);

  return (
    <div
      className="compact-soundtrack-card border-[3px] border-white/40 group overflow-hidden"
      style={{
        '--card-gradient': track.colorUrl,
        '--card-solid': track.bgColor,
        background: 'var(--compact-card-bg)'
      }}
    >
      <div className="p-3 md:p-4 flex flex-col h-full playback-card-inner">
        {/* Cover Art Stage */}
        <div className="w-full aspect-square rounded-[20px] shadow-2xl flex items-center justify-center relative overflow-hidden bg-black flex-shrink-0 mb-4">
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ transform: `scale(${track.imageZoom || 1})`, transformOrigin: 'center' }}
          >
            <img
              src={track.imageSrc}
              alt={`${track.title} Cover`}
              className={`w-full h-full ${track.imageFit === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500 pointer-events-none`}
              style={{ objectPosition: track.imagePosition || 'center' }}
            />
          </div>
          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] pointer-events-none rounded-[20px]"></div>
        </div>

        {/* Textual Hierarchy */}
        <div className="flex flex-col items-center justify-center text-center px-1 mt-8 track-info-section gap-1 w-full">
          <h3 className="text-[20px] md:text-[22px] leading-[1.2] font-black truncate w-full mb-1 tracking-tight">{track.title}</h3>
          <div className="flex items-center justify-center gap-2 max-w-full mb-1">
            <span className="bg-white/15 text-[9px] px-2 py-[2px] rounded-sm font-black border border-white/10 uppercase tracking-widest flex-shrink-0">E</span>
            <p className="artist-name text-xs font-semibold tracking-widest uppercase truncate">{track.artist}</p>
          </div>
        </div>

        {/* Progress System */}
        <div className="w-full px-1 mb-4 playback-section">
          <div
            className={`w-full bg-white/10 rounded-full h-[4px] relative progress-bar-bg ${isActive ? 'cursor-pointer hover:h-[6px]' : 'cursor-default'}`}
            ref={progressBarRef}
            onMouseDown={handleMouseDown}
          >
            <div 
              className="h-full bg-white rounded-full relative pointer-events-none progress-bar-fill" 
              style={{ 
                width: `${progress}%`, 
                transition: isDragging ? 'none' : 'width 0.1s linear' 
              }} 
            >
              {isActive && (
                <div className="progress-bar-knob absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-200 pointer-events-none" />
              )}
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/40 font-black mt-2 pointer-events-none tracking-[2px] uppercase">
            <span>{currentTime}</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Logic Controls */}
        <div className="flex justify-center items-center gap-6 mt-auto mb-1">
          <SkipBack
            onClick={(e) => {
              if (!isActive) return;
              e.stopPropagation();
              onSkipBackward();
            }}
            size={24}
            fill="currentColor"
            strokeWidth={0}
            className={`skip-btn transition-all ${isActive ? 'text-white/40 hover:text-white cursor-pointer hover:scale-125 active:scale-90' : 'text-white/10 cursor-default'}`}
          />
          <button
            onClick={(e) => {
              if (!isActive) return;
              e.stopPropagation();
              onTogglePlay();
            }}
            className={`play-pause-btn w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white text-black shadow-xl ${isActive ? 'hover:scale-105 active:scale-95' : 'opacity-20 cursor-default'}`}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={20} fill="currentColor" strokeWidth={0} className="ml-1" />
            )}
          </button>
          <SkipForward
            onClick={(e) => {
              if (!isActive) return;
              e.stopPropagation();
              onSkipForward();
            }}
            size={24}
            fill="currentColor"
            strokeWidth={0}
            className={`skip-btn transition-all ${isActive ? 'text-white/40 hover:text-white cursor-pointer hover:scale-125 active:scale-90' : 'text-white/10 cursor-default'}`}
          />
        </div>
      </div>
    </div>
  );
};

const FloatingAudioPlayer = ({ isOpen, onToggle }) => {
  const {
    soundtracks,
    activeSlide,
    isPlaying,
    progress,
    currentTimeFormatted,
    handleTogglePlay,
    handleSeek,
    next,
    prev,
    handleSlideChange,
    skipForward,
    skipBackward
  } = useContext(AudioContext);

  const getStyles = (index) => {
    if (activeSlide === index)
      return {
        opacity: 1,
        transform: "translateX(0px) translateZ(0px) rotateY(0deg)",
        zIndex: 10
      };
    else if (activeSlide - 1 === index)
      return {
        opacity: 1,
        transform: "translateX(-200px) translateZ(-300px) rotateY(35deg)",
        zIndex: 9
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform: "translateX(200px) translateZ(-300px) rotateY(-35deg)",
        zIndex: 9
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 0.5,
        transform: "translateX(-320px) translateZ(-500px) rotateY(35deg)",
        zIndex: 8
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 0.5,
        transform: "translateX(320px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 8
      };
    else if (index < activeSlide - 2)
      return {
        opacity: 0,
        transform: "translateX(-500px) translateZ(-700px) rotateY(35deg)",
        zIndex: 7,
        pointerEvents: 'none'
      };
    else if (index > activeSlide + 2)
      return {
        opacity: 0,
        transform: "translateX(500px) translateZ(-700px) rotateY(-35deg)",
        zIndex: 7,
        pointerEvents: 'none'
      };
    return { opacity: 0 };
  };

  return (
    <div className={`floating-audio-container ${isOpen ? 'open' : 'closed'}`}>
      <button
        className={`floating-audio-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={onToggle}
        title="Reproductor de Música"
      >
        <Music size={24} className={isPlaying ? 'animate-pulse' : ''} />
      </button>

      {isOpen && (
        <div className="floating-player-card">
          <div className="floating-player-header">
            <h4 className="section-title brutalist-text m-0 text-base tracking-tighter uppercase floating-player-title">
              Spider-Verse <span style={{ color: 'var(--accent-primary)' }}>Sonic</span> Archive
            </h4>

          </div>

          <div className="compact-slideC">
            {soundtracks.map((track, i) => (
              <React.Fragment key={track.id}>
                <div
                  className="compact-slide-wrapper"
                  style={{
                    boxShadow: `var(--compact-slide-shadow, 0 20px 40px ${track.bgColor}30)`,
                    ...getStyles(i)
                  }}
                  onClick={() => i !== activeSlide && handleSlideChange(i)}
                >
                  <SoundtrackCard
                    track={track}
                    isActive={activeSlide === i}
                    isPlaying={activeSlide === i && isPlaying}
                    progress={activeSlide === i ? progress : 0}
                    currentTime={activeSlide === i ? currentTimeFormatted : "0:00"}
                    onTogglePlay={() => handleTogglePlay(i)}
                    onSeek={handleSeek}
                    onSkipForward={skipForward}
                    onSkipBackward={skipBackward}
                  />
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="compact-carousel-btns">
            <button className="compact-carousel-btn" onClick={prev} disabled={activeSlide === 0}>
              <ChevronLeft size={24} />
            </button>
            <button className="compact-carousel-btn" onClick={next} disabled={activeSlide === soundtracks.length - 1}>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingAudioPlayer;
