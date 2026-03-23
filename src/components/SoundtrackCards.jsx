import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import './SoundtrackCards.css';

const soundtracks = [
  {
    id: 'sunflower',
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    colorUrl: 'linear-gradient(180deg, rgba(237,143,3,0.4) 0%, rgba(20,20,20,1) 100%)',
    bgColor: '#0313edff',
    imageSrc: '/images_png/SUNFLOWER.png',
    audioSrc: '/audios/Sunflower.mp3',
    playlist: 'Spider-Man: Into the Spider-Verse',
    duration: '2:38',
  },
  {
    id: 'danger',
    title: "What's Up Danger",
    artist: 'Blackway & Black Caviar',
    colorUrl: 'linear-gradient(180deg, rgba(255,0,60,0.4) 0%, rgba(20,20,20,1) 100%)',
    bgColor: '#ff003c',
    imageSrc: '/images_png/WHATS_UP_DANGER.png',
    audioSrc: '/audios/WhatsUpDanger.mp3',
    playlist: 'Spider-Man: Into the Spider-Verse',
    duration: '3:42',
  },
  {
    id: 'dreaming',
    title: 'Am I Dreaming',
    artist: 'Metro Boomin, A$AP Rocky',
    colorUrl: 'linear-gradient(180deg, rgba(123,44,191,0.4) 0%, rgba(20,20,20,1) 100%)',
    bgColor: '#7b2cb1',
    imageSrc: '/images_png/AM_I_DREAMING.png',
    imageFit: 'contain',
    imagePosition: 'center center',
    imageZoom: 1.28,
    audioSrc: '/audios/AmIDreaming.mp3',
    playlist: 'Spider-Man: Across the Spider-Verse',
    duration: '4:16',
  }
];

const SoundtrackCard = ({ track, isActive, isPlaying, progress, currentTime, onTogglePlay, onSeek, onSkipForward, onSkipBackward }) => {
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

  return (
    <div
      className="soundtrack-card border-[3px] border-white/40 group overflow-hidden"
      style={{ background: track.colorUrl }}
    >
      <div className="p-5 md:p-6 flex flex-col h-full playback-card-inner">
        {/* Cover Art Stage */}
        <div className="w-full aspect-square rounded-[20px] shadow-2xl flex items-center justify-center relative overflow-hidden bg-black flex-shrink-0">
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
        <div className="flex flex-col items-center justify-center text-center px-2 mt-5 md:mt-7 track-info-section gap-1 w-full">
          <h3 className="text-[24px] md:text-[28px] leading-[1.2] font-black truncate w-full mb-1 tracking-tight">{track.title}</h3>
          <div className="flex items-center justify-center gap-2 max-w-full mb-2">
            <span className="bg-white/15 text-[10px] px-2 py-[2px] rounded-sm font-black border border-white/10 uppercase tracking-widest flex-shrink-0">E</span>
            <p className="artist-name text-sm font-semibold tracking-widest uppercase truncate">{track.artist}</p>
          </div>
        </div>

        {/* Progress System */}
        <div className="w-full px-2 mb-6 playback-section">
          <div
            className={`w-full bg-white/10 rounded-full h-[4px] relative overflow-hidden transition-all progress-bar-bg ${isActive ? 'cursor-pointer hover:h-[6px]' : 'cursor-default'}`}
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div className="h-full bg-white rounded-full relative pointer-events-none progress-bar-fill" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }} />
          </div>
          <div className="flex justify-between text-[11px] text-white/40 font-black mt-3 pointer-events-none tracking-[2px] uppercase">
            <span>{currentTime}</span>
            <span>{track.duration}</span>
          </div>
        </div>

        {/* Logic Controls */}
        <div className="flex justify-center items-center gap-10 md:gap-12 mt-auto mb-2">
          <SkipBack
            onClick={(e) => {
              if (!isActive) return;
              e.stopPropagation();
              onSkipBackward();
            }}
            size={30}
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
            className={`play-pause-btn w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all bg-white text-black shadow-xl ${isActive ? 'hover:scale-105 active:scale-95' : 'opacity-20 cursor-default'}`}
          >
            {isPlaying ? (
              <Pause size={28} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={28} fill="currentColor" strokeWidth={0} className="ml-1" />
            )}
          </button>
          <SkipForward
            onClick={(e) => {
              if (!isActive) return;
              e.stopPropagation();
              onSkipForward();
            }}
            size={30}
            fill="currentColor"
            strokeWidth={0}
            className={`skip-btn transition-all ${isActive ? 'text-white/40 hover:text-white cursor-pointer hover:scale-125 active:scale-90' : 'text-white/10 cursor-default'}`}
          />
        </div>
      </div>
    </div>
  );
};

const SoundtrackCards = () => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");
  const audioRef = useRef(new Audio());

  // Fix: Initialize audio source for the starting active slide
  useEffect(() => {
    const audio = audioRef.current;

    // Set initial source
    if (!audio.src || audio.src === "") {
      audio.src = soundtracks[activeSlide].audioSrc;
      audio.load();
    }

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60);
        setCurrentTimeFormatted(`${m}:${s < 10 ? '0' : ''}${s}`);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTimeFormatted("0:00");
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleTogglePlay = (index, forcePlay = false) => {
    const audio = audioRef.current;
    if (activeSlide === index) {
      if (isPlaying && !forcePlay) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Validation: ensured source is set
        if (!audio.src || !audio.src.includes(soundtracks[index].audioSrc)) {
          audio.src = soundtracks[index].audioSrc;
          audio.load();
        }

        // Handle play promise to avoid interruptions error
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
        }
      }
    } else {
      audio.pause();
      audio.src = soundtracks[index].audioSrc;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setActiveSlide(index);
          setIsPlaying(true);
          setProgress(0);
          setCurrentTimeFormatted("0:00");
        }).catch(error => {
          console.error("Audio switch failed:", error);
          setActiveSlide(index);
          setIsPlaying(false);
        });
      }
    }
  };

  const handleSeek = (percentage) => {
    if (audioRef.current.duration) {
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration;
    }
  };

  const next = () => activeSlide < soundtracks.length - 1 && handleSlideChange(activeSlide + 1);
  const prev = () => activeSlide > 0 && handleSlideChange(activeSlide - 1);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
    const audio = audioRef.current;
    audio.pause();
    // Preload next audio
    audio.src = soundtracks[index].audioSrc;
    audio.load();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeFormatted("0:00");
  };

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
        transform: "translateX(-320px) translateZ(-500px) rotateY(35deg)",
        zIndex: 9
      };
    else if (activeSlide + 1 === index)
      return {
        opacity: 1,
        transform: "translateX(320px) translateZ(-500px) rotateY(-35deg)",
        zIndex: 9
      };
    else if (activeSlide - 2 === index)
      return {
        opacity: 0.5,
        transform: "translateX(-580px) translateZ(-800px) rotateY(35deg)",
        zIndex: 8
      };
    else if (activeSlide + 2 === index)
      return {
        opacity: 0.5,
        transform: "translateX(580px) translateZ(-800px) rotateY(-35deg)",
        zIndex: 8
      };
    else if (index < activeSlide - 2)
      return {
        opacity: 0,
        transform: "translateX(-800px) translateZ(-1000px) rotateY(35deg)",
        zIndex: 7,
        pointerEvents: 'none'
      };
    else if (index > activeSlide + 2)
      return {
        opacity: 0,
        transform: "translateX(800px) translateZ(-1000px) rotateY(-35deg)",
        zIndex: 7,
        pointerEvents: 'none'
      };
    return { opacity: 0 };
  };

  return (
    <section className="soundtrack-section transition-colors duration-500">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center mb-16" data-aos="fade-up">
          <h2 className="section-title brutalist-text text-center text-4xl md:text-5xl mb-4 tracking-tighter uppercase font-black">
            Spider-Verse <span style={{ color: 'var(--accent-primary)' }}>Sonic</span> Archive
          </h2>
          <div className="w-full flex justify-center">
            <p className="lead uppercase tracking-[4px] text-xs md:text-sm font-bold text-center m-0">
              Inmersive Dimension Playlist
            </p>
          </div>
        </div>

        <div className="slideC">
          {soundtracks.map((track, i) => (
            <React.Fragment key={track.id}>
              <div
                className="slide-wrapper"
                style={{
                  boxShadow: `0 30px 60px ${track.bgColor}30`,
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
                  onTogglePlay={(force) => handleTogglePlay(i, force)}
                  onSeek={handleSeek}
                  onSkipForward={() => { audioRef.current.currentTime += 15; }}
                  onSkipBackward={() => { audioRef.current.currentTime -= 15; }}
                />
              </div>
              <div
                className="reflection"
                style={{
                  background: `linear-gradient(to bottom, ${track.bgColor}20, transparent)`,
                  ...getStyles(i)
                }}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="carousel-btns">
          <button className="carousel-btn border-white/20 text-white bg-white/10" onClick={prev}>
            <ChevronLeft size={32} />
          </button>
          <button className="carousel-btn border-white/20 text-white bg-white/10" onClick={next}>
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SoundtrackCards;
