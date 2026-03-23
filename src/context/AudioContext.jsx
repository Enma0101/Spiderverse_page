import React, { createContext, useState, useEffect, useRef } from 'react';

export const AudioContext = createContext(null);

export const soundtracks = [
  {
    id: 'sunflower',
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    colorUrl: 'linear-gradient(180deg, rgba(237,143,3,0.4) 0%, rgba(20,20,20,1) 100%)',
    bgColor: '#ed8f03',
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

export const AudioProvider = ({ children }) => {
  const [activeSlide, setActiveSlide] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState("0:00");
  const audioRef = useRef(null);

  // Initialize audio object once
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
    }
    const audio = audioRef.current;

    // Set initial source if none exists
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
        if (!audio.src || !audio.src.includes(soundtracks[index].audioSrc)) {
          audio.src = soundtracks[index].audioSrc;
          audio.load();
        }

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
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (percentage / 100) * audioRef.current.duration;
    }
  };

  const next = () => activeSlide < soundtracks.length - 1 && handleSlideChange(activeSlide + 1);
  const prev = () => activeSlide > 0 && handleSlideChange(activeSlide - 1);

  const handleSlideChange = (index) => {
    setActiveSlide(index);
    const audio = audioRef.current;
    
    const wasPlaying = isPlaying;
    audio.pause();
    
    audio.src = soundtracks[index].audioSrc;
    audio.load();
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeFormatted("0:00");
    
    if (wasPlaying) {
        handleTogglePlay(index, true);
    }
  };

  const skipForward = () => {
      if (audioRef.current) audioRef.current.currentTime += 15;
  };

  const skipBackward = () => {
      if (audioRef.current) audioRef.current.currentTime -= 15;
  };

  const value = {
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
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
